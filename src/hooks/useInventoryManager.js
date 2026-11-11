import { useState, useEffect, useMemo, useCallback } from 'react';
import { productService } from '../services/productService';
import { adminLogService } from '../services/adminLogService';
import { getProductFinancials, exportInventoryToCSV } from '../utils/inventoryHelpers';

export function useInventoryManager() {
  const [products, setProducts] = useState(() => productService.getLocalProducts());
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('value_desc');
  const [stockEdits, setStockEdits] = useState({});
  const [costEdits, setCostEdits] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [savingAll, setSavingAll] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const showNotification = useCallback((message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  }, []);

  const fetchProducts = useCallback(async () => {
    const local = productService.getLocalProducts();
    if (local.length > 0) setProducts(local);
    setLoading(true);
    try {
      const res = await productService.getProducts({ limit: 500 });
      if (res && Array.isArray(res.products)) {
        setProducts(res.products);
      }
    } catch (err) {
      console.warn('Failed to refresh inventory products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();

    const handleUpdate = (e) => {
      if (Array.isArray(e.detail)) setProducts(e.detail);
    };
    window.addEventListener('isai:products_updated', handleUpdate);
    return () => window.removeEventListener('isai:products_updated', handleUpdate);
  }, [fetchProducts]);

  const handleStockChange = (id, newStock) => {
    const val = Math.max(0, parseInt(newStock, 10) || 0);
    setStockEdits((prev) => ({ ...prev, [id]: val }));
  };

  const handleAdjustDelta = (id, currentVal, delta) => {
    const activeVal = stockEdits[id] !== undefined ? stockEdits[id] : currentVal;
    const nextVal = Math.max(0, activeVal + delta);
    setStockEdits((prev) => ({ ...prev, [id]: nextVal }));
  };

  const handleCostChange = (id, newCost) => {
    const val = Math.max(0, parseFloat(newCost) || 0);
    setCostEdits((prev) => ({ ...prev, [id]: val }));
  };

  const handleDiscardRowEdits = (id) => {
    setStockEdits((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setCostEdits((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleSaveProduct = async (product) => {
    const fin = getProductFinancials(product, stockEdits[product.id], costEdits[product.id]);
    const currentStock = Number(product.stock) || 0;
    const baseFin = getProductFinancials(product, undefined, undefined);
    const currentCost = baseFin.costPrice;

    const targetStock = fin.stock;
    const targetCost = fin.costPrice;

    if (targetStock === currentStock && targetCost === currentCost) {
      return;
    }

    setSavingId(product.id);
    try {
      await productService.updateProduct(product.id, {
        stock: targetStock,
        cost: targetCost,
      });

      await adminLogService.logAction(
        'UPDATE_INVENTORY_STOCK_AND_COST',
        'products',
        product.id,
        {
          old_stock: currentStock,
          new_stock: targetStock,
          old_cost: currentCost,
          new_cost: targetCost,
          product_name: product.name,
        }
      );

      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, stock: targetStock, cost: targetCost } : p
        )
      );

      handleDiscardRowEdits(product.id);
      showNotification(
        `Saved "${product.name}": Stock ${targetStock} units, Cost ₹${targetCost.toLocaleString('en-IN')}`
      );
    } catch (err) {
      showNotification(err.message || 'Failed to update inventory', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const handleSaveAll = async () => {
    const modifiedIds = Array.from(
      new Set([...Object.keys(stockEdits), ...Object.keys(costEdits)])
    );

    if (modifiedIds.length === 0) return;

    setSavingAll(true);
    try {
      let savedCount = 0;
      for (const id of modifiedIds) {
        const prod = products.find((p) => p.id === id);
        if (!prod) continue;

        const fin = getProductFinancials(prod, stockEdits[id], costEdits[id]);
        await productService.updateProduct(id, {
          stock: fin.stock,
          cost: fin.costPrice,
        });

        await adminLogService.logAction('BULK_UPDATE_INVENTORY', 'products', id, {
          stock: fin.stock,
          cost: fin.costPrice,
          product_name: prod.name,
        });
        savedCount++;
      }

      setProducts(productService.getLocalProducts());
      setStockEdits({});
      setCostEdits({});
      showNotification(`Successfully updated ${savedCount} saree inventory records.`);
    } catch (err) {
      showNotification(err.message || 'Error updating inventory records', 'error');
    } finally {
      setSavingAll(false);
    }
  };

  const handleExportCsv = () => exportInventoryToCSV(products, stockEdits, costEdits);

  const aggregates = useMemo(() => {
    const allFinancials = products.map((p) =>
      getProductFinancials(p, stockEdits[p.id], costEdits[p.id])
    );

    const totalUnits = allFinancials.reduce((acc, f) => acc + f.stock, 0);
    const totalCostAmount = allFinancials.reduce((acc, f) => acc + f.lineCost, 0);
    const totalSellingAmount = allFinancials.reduce((acc, f) => acc + f.lineSelling, 0);
    const totalDiscountAmount = allFinancials.reduce((acc, f) => acc + f.lineDiscount, 0);
    const totalPotentialProfit = allFinancials.reduce((acc, f) => acc + f.lineProfit, 0);

    const overallMarginPercent =
      totalSellingAmount > 0
        ? ((totalPotentialProfit / totalSellingAmount) * 100).toFixed(1)
        : '0.0';

    const outOfStockCount = allFinancials.filter((f) => f.stock <= 0).length;
    const lowStockCount = allFinancials.filter((f) => f.stock > 0 && f.stock <= 5).length;
    const inStockCount = allFinancials.filter((f) => f.stock > 5).length;
    const highMarginCount = allFinancials.filter(
      (f) => parseFloat(f.marginPercent) >= 45
    ).length;

    const totalModifiedCount = Array.from(
      new Set([...Object.keys(stockEdits), ...Object.keys(costEdits)])
    ).length;

    return {
      totalUnits,
      totalCostAmount,
      totalSellingAmount,
      totalDiscountAmount,
      totalPotentialProfit,
      overallMarginPercent,
      outOfStockCount,
      lowStockCount,
      inStockCount,
      highMarginCount,
      totalModifiedCount,
    };
  }, [products, stockEdits, costEdits]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((p) => {
        const nameMatch = (p.name || '').toLowerCase().includes(q);
        const catMatch = (p.category || '').toLowerCase().includes(q);
        const idMatch = String(p.id || '').toLowerCase().includes(q);
        return nameMatch || catMatch || idMatch;
      });
    }

    if (stockFilter !== 'all') {
      list = list.filter((p) => {
        const fin = getProductFinancials(p, stockEdits[p.id], costEdits[p.id]);
        if (stockFilter === 'out') return fin.stock <= 0;
        if (stockFilter === 'low') return fin.stock > 0 && fin.stock <= 5;
        if (stockFilter === 'in') return fin.stock > 5;
        if (stockFilter === 'high_margin') return parseFloat(fin.marginPercent) >= 45;
        return true;
      });
    }

    list.sort((a, b) => {
      const finA = getProductFinancials(a, stockEdits[a.id], costEdits[a.id]);
      const finB = getProductFinancials(b, stockEdits[b.id], costEdits[b.id]);

      if (sortBy === 'value_desc') return finB.lineSelling - finA.lineSelling;
      if (sortBy === 'stock_desc') return finB.stock - finA.stock;
      if (sortBy === 'stock_asc') return finA.stock - finB.stock;
      if (sortBy === 'profit_desc') return finB.lineProfit - finA.lineProfit;
      if (sortBy === 'margin_desc')
        return parseFloat(finB.marginPercent) - parseFloat(finA.marginPercent);
      if (sortBy === 'name_asc') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });

    return list;
  }, [products, search, stockFilter, sortBy, stockEdits, costEdits]);

  return {
    products,
    loading,
    search,
    setSearch,
    stockFilter,
    setStockFilter,
    sortBy,
    setSortBy,
    stockEdits,
    costEdits,
    savingId,
    savingAll,
    feedback,
    aggregates,
    filteredProducts,
    handleStockChange,
    handleAdjustDelta,
    handleCostChange,
    handleDiscardRowEdits,
    handleSaveProduct,
    handleSaveAll,
    handleExportCsv,
    fetchProducts,
  };
}
