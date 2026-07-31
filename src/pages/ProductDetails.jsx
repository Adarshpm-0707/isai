import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import useCart from '../hooks/useCart';
import ImageGallery from '../components/reusable/ImageGallery';
import QtySelector from '../components/reusable/QtySelector';
import PriceTag from '../components/reusable/PriceTag';
import Badge from '../components/reusable/Badge';
import Loader from '../components/reusable/Loader';
import ProductCard from '../components/reusable/ProductCard';
import SectionHeading from '../components/reusable/SectionHeading';
import Button from '../components/reusable/Button';
import { ShoppingBag, ArrowLeft, RefreshCw, ShieldCheck } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { fetchProductById, fetchProducts, products } = useProducts();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const getProduct = async () => {
      setLoading(true);
      try {
        const data = await fetchProductById(id);
        if (isMounted) {
          setProduct(data);
          setQty(1);
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    getProduct();
    return () => { isMounted = false; };
  }, [id]);

  useEffect(() => {
    if (product?.category) {
      fetchProducts({ category: product.category });
    }
  }, [product, fetchProducts]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, qty);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 3000);
  };

  const relatedItems = products
    .filter((p) => String(p.id) !== String(id))
    .slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#120404]">
        <Loader message="Loading Saree Details..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6 bg-[#120404] text-[#efcf8b] min-h-[60vh]">
        <h2 className="font-playfair text-3xl font-bold text-[#efcf8b] uppercase">Saree Not Found</h2>
        <p className="text-[#efcf8b]/70">The product you are trying to view does not exist or has been archived.</p>
        <Link to="/products" className="inline-flex items-center text-[#f45d04] hover:text-[#efcf8b] font-sans font-bold uppercase text-xs tracking-wider border-b-2 border-[#f45d04] pb-1 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-20 bg-[#120404] text-[#efcf8b]">
      
      {/* Back button */}
      <div>
        <Link to="/products" className="inline-flex items-center text-[#efcf8b] hover:text-[#f45d04] font-sans font-semibold uppercase text-xs tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Collection
        </Link>
      </div>

      {/* Main product showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Left: Gallery */}
        <div>
          <ImageGallery images={product.images || [product.image]} />
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              {product.category && <Badge text={product.category} variant="gold" />}
              <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-[#efcf8b] tracking-wide uppercase">
                {product.name}
              </h1>
            </div>

            <PriceTag price={product.price} size="lg" />

            <div className="h-[1px] bg-white/10" />

            <p className="font-sans text-sm text-[#efcf8b]/80 leading-relaxed font-light">
              {product.description}
            </p>

            <div className="space-y-2 text-xs font-sans text-[#efcf8b]/70">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#f45d04]" />
                <span>100% Certified Authentic Silk Mark product.</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#f45d04]" />
                <span>Easy 7-day exchange and returns.</span>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-white/10">
            {product.stock > 0 ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="space-y-1">
                  <span className="block font-sans text-[10px] uppercase font-bold text-[#efcf8b]/70 tracking-wider">
                    Quantity
                  </span>
                  <QtySelector qty={qty} onChange={setQty} stock={product.stock} />
                </div>

                <div className="flex-grow flex flex-col justify-end pt-2 sm:pt-0">
                  <Button
                    onClick={handleAddToCart}
                    variant="primary"
                    size="lg"
                    className="w-full justify-center gap-2 bg-[#f45d04] text-[#efcf8b] hover:bg-[#c44900] border-none rounded-full shadow-lg"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-[#1a0806] border border-red-500/40 text-red-400 p-4 text-center font-semibold font-sans uppercase text-xs tracking-wider rounded-sm">
                Sold Out — Archive only
              </div>
            )}

            {addedMessage && (
              <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 p-3 text-center font-sans text-xs rounded-sm">
                Saree added to your Shopping Bag successfully!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedItems.length > 0 && (
        <section className="pt-16 border-t border-white/10">
          <SectionHeading
            title="Pairs Excellently With"
            subtitle="Explore other heirloom masterpieces in this style"
          />

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {relatedItems.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
