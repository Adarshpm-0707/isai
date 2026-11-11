import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categoryService } from '../services/categoryService';
import { productService } from '../services/productService';
import { adminLogService } from '../services/adminLogService';

export default function useAddEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [cost, setCost] = useState('');
  const [stock, setStock] = useState('');

  // Category state
  const [categoriesList, setCategoriesList] = useState([]);
  const [category, setCategory] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [images, setImages] = useState(['', '', '']);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  // Load existing categories from DB/persistent store
  const loadCategories = useCallback(async () => {
    try {
      const data = await categoryService.getCategories();
      if (Array.isArray(data)) {
        setCategoriesList(data);
        if (data.length > 0) {
          if (!isEdit && !category) {
            setCategory(data[0].name);
            setCategoryId(data[0].id);
          }
        } else {
          setIsCreatingNewCategory(true);
        }
      }
    } catch (err) {
      console.warn('Could not load categories:', err);
      setIsCreatingNewCategory(true);
    }
  }, [isEdit, category]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (isEdit) {
      const loadProduct = async () => {
        setFetching(true);
        setError(null);
        try {
          const data = await productService.getProductById(id);
          if (data) {
            setName(data.name || '');
            setDescription(data.description || '');
            setPrice(data.price || '');
            setDiscountPrice(data.discount_price || '');
            setCost(data.cost || '');
            setStock(data.stock || 0);
            setCategory(data.category || '');
            setCategoryId(data.category_id || null);
            const dbImages = data.images || [];
            setImages([dbImages[0] || '', dbImages[1] || '', dbImages[2] || '']);
          }
        } catch (err) {
          console.error('Failed to load product:', err);
          setError('Failed to fetch product details: ' + err.message);
        } finally {
          setFetching(false);
        }
      };

      loadProduct();
    }
  }, [id, isEdit]);

  const handleCategorySelectChange = useCallback(
    (e) => {
      const val = e.target.value;
      if (val === '__NEW_CATEGORY__') {
        setIsCreatingNewCategory(true);
        setCategory('');
        setCategoryId(null);
      } else {
        setIsCreatingNewCategory(false);
        setCategory(val);
        const matched = categoriesList.find((c) => c.name.toLowerCase() === val.toLowerCase());
        setCategoryId(matched ? matched.id : null);
      }
    },
    [categoriesList]
  );

  const handleImageChange = useCallback((index, value) => {
    setImages((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  }, []);

  const handleFileUpload = useCallback(
    async (index, file) => {
      if (!file) return;
      setUploadingIndex(index);
      setError(null);
      try {
        const publicUrl = await productService.uploadProductImage(file);
        handleImageChange(index, publicUrl);
      } catch (err) {
        console.error('File upload error:', err);
        setError(err.message || 'File upload failed');
      } finally {
        setUploadingIndex(null);
      }
    },
    [handleImageChange]
  );

  const handleSubmit = useCallback(
    async (e) => {
      if (e?.preventDefault) e.preventDefault();
      setLoading(true);
      setError(null);

      let targetCategory = category.trim();
      let targetCategoryId = categoryId;

      if (isCreatingNewCategory) {
        targetCategory = newCategoryName.trim();
        if (!targetCategory) {
          setError('Please enter a name for the new category');
          setLoading(false);
          return;
        }

        const existing = categoriesList.find(
          (c) => c.name.toLowerCase() === targetCategory.toLowerCase()
        );

        if (existing) {
          targetCategoryId = existing.id;
          targetCategory = existing.name;
        } else {
          try {
            const newCat = await categoryService.createCategory({
              name: targetCategory,
            });
            if (newCat) {
              targetCategoryId = newCat.id;
              targetCategory = newCat.name;
            }
          } catch (catErr) {
            console.warn('Notice saving new category record:', catErr);
          }
        }
      }

      if (!targetCategory) {
        setError('Please select or specify a category');
        setLoading(false);
        return;
      }

      const cleanedImages = images.map((img) => img.trim()).filter(Boolean);
      const productPayload = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price) || 0,
        discount_price: discountPrice ? parseFloat(discountPrice) : null,
        cost: cost ? parseFloat(cost) : 0,
        stock: parseInt(stock) || 0,
        category: targetCategory,
        category_id: targetCategoryId || null,
        images: cleanedImages.length > 0 ? cleanedImages : null,
      };

      try {
        if (isEdit) {
          await productService.updateProduct(id, productPayload);
          adminLogService.logAction('UPDATE_PRODUCT', 'products', id, productPayload).catch(() => {});
        } else {
          const res = await productService.createProduct(productPayload);
          adminLogService.logAction('CREATE_PRODUCT', 'products', res.id, productPayload).catch(() => {});
        }
        navigate('/admin/products');
      } catch (err) {
        console.error('Form submit failed:', err);
        setError('Save notice: ' + err.message);
      } finally {
        setLoading(false);
      }
    },
    [
      category,
      categoryId,
      isCreatingNewCategory,
      newCategoryName,
      categoriesList,
      images,
      name,
      description,
      price,
      discountPrice,
      cost,
      stock,
      isEdit,
      id,
      navigate,
    ]
  );

  return {
    isEdit,
    loading,
    fetching,
    error,
    name,
    setName,
    description,
    setDescription,
    price,
    setPrice,
    discountPrice,
    setDiscountPrice,
    cost,
    setCost,
    stock,
    setStock,
    categoriesList,
    category,
    isCreatingNewCategory,
    setIsCreatingNewCategory,
    newCategoryName,
    setNewCategoryName,
    images,
    uploadingIndex,
    handleCategorySelectChange,
    handleImageChange,
    handleFileUpload,
    handleSubmit,
    navigate,
  };
}

