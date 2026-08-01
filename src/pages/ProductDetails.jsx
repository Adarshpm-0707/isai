import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useProducts, { MOCK_PRODUCTS } from '../hooks/useProducts';
import useCart from '../hooks/useCart';
import ImageGallery from '../components/reusable/ImageGallery';
import QtySelector from '../components/reusable/QtySelector';
import PriceTag from '../components/reusable/PriceTag';
import Badge from '../components/reusable/Badge';
import ProductCard from '../components/reusable/ProductCard';
import SectionHeading from '../components/reusable/SectionHeading';
import Button from '../components/reusable/Button';
import { getProductImageList } from '../utils/productHelpers';
import { ShoppingBag, ArrowLeft, RefreshCw, ShieldCheck } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { fetchProductById, fetchProducts, products } = useProducts();

  // Instantly resolve from local memory — zero loading delay
  const [product, setProduct] = useState(() =>
    MOCK_PRODUCTS.find(p => p.id === id || String(p.id) === String(id)) || null
  );
  const [qty, setQty] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Instant local lookup first
    const local = MOCK_PRODUCTS.find(p => p.id === id || String(p.id) === String(id));
    if (local && isMounted) setProduct(local);

    // Background sync with DB (non-blocking)
    fetchProductById(id).then(data => {
      if (isMounted && data) setProduct(data);
    }).catch(() => {});

    return () => { isMounted = false; };
  }, [id]);

  useEffect(() => {
    if (product?.category) {
      fetchProducts({ category: product.category });
    }
  }, [product?.category]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, qty);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 3000);
  };

  const relatedItems = products
    .filter(p => String(p.id) !== String(id))
    .slice(0, 3);

  // No product found at all
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6 min-h-[60vh]">
        <h2 className="font-playfair text-3xl font-bold text-[#2B1409] uppercase">Saree Not Found</h2>
        <p className="text-[#5C2F14]">This product does not exist or has been archived.</p>
        <Link to="/products" className="inline-flex items-center text-[#2B1409] font-bold uppercase text-xs tracking-wider border-b-2 border-[#D8A55A] pb-1 transition-colors hover:text-[#5C2F14]">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-20 text-[#F6D18A] bg-transparent">

      {/* Back button */}
      <div>
        <Link to="/products" className="inline-flex items-center text-[#F6D18A] hover:text-[#D8A55A] font-sans font-bold uppercase text-xs tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Collection
        </Link>
      </div>

      {/* Main product showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Left: Gallery */}
        <div>
          <ImageGallery images={getProductImageList(product)} />
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col justify-between space-y-8 p-6 sm:p-8 bg-[#F6D18A]/10 border border-[#F6D18A]/30 rounded-lg shadow-xl">
          <div className="space-y-6">
            <div className="space-y-2">
              {product.category && <Badge text={product.category} variant="gold" />}
              <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-[#F6D18A] tracking-wide uppercase leading-tight">
                {product.name}
              </h1>
            </div>

            <PriceTag price={product.price} size="lg" />

            <div className="h-[1px] bg-[#F6D18A]/30" />

            <p className="font-sans text-sm text-[#D8A55A] leading-relaxed font-medium">
              {product.description}
            </p>

            <div className="space-y-2 text-xs font-sans text-[#D8A55A] font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#F6D18A] flex-shrink-0" />
                <span>100% Certified Authentic Silk Mark product.</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#F6D18A] flex-shrink-0" />
                <span>Easy 7-day exchange and returns.</span>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-[#D8A55A]/30">
            {product.stock > 0 ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="space-y-1">
                  <span className="block font-sans text-[10px] uppercase font-bold text-[#5C2F14] tracking-wider">
                    Quantity
                  </span>
                  <QtySelector qty={qty} onChange={setQty} stock={product.stock} />
                </div>

                <div className="flex-grow flex flex-col justify-end pt-2 sm:pt-0">
                  <Button
                    onClick={handleAddToCart}
                    variant="primary"
                    size="lg"
                    className="w-full justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-[#F6D18A]/10 border border-[#F6D18A]/30 text-[#F6D18A] p-4 text-center font-bold font-sans uppercase text-xs tracking-wider rounded-sm">
                Sold Out — Archive only
              </div>
            )}

            {addedMessage && (
              <div className="bg-[#F6D18A]/20 border border-[#F6D18A] text-[#F6D18A] p-3 text-center font-sans text-xs rounded-sm shadow-md font-bold">
                Saree added to your Shopping Bag successfully!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedItems.length > 0 && (
        <section className="pt-16 border-t border-[#F6D18A]/30">
          <SectionHeading
            title="Pairs Excellently With"
            subtitle="Explore other heirloom masterpieces in this style"
          />
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {relatedItems.map(item => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
