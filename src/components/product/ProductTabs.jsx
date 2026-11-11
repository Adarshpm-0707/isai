import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import StarRow from './StarRow';

const TABS = [
  { key: 'description', label: 'Description' },
  { key: 'details', label: 'Product Details' },
  { key: 'reviews', label: 'Reviews' },
];

export default function ProductTabs({
  product,
  activeTab,
  setActiveTab,
  reviewCount,
  avgRating,
  reviews = [],
  user,
  userRating,
  setUserRating,
  userComment,
  setUserComment,
  submittingReview,
  handleSubmitReview,
}) {
  return (
    <section className="mt-14 sm:mt-20">
      <div
        className="flex border-b border-[#2C1C16] overflow-x-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        {TABS.map(({ key, label }) => {
          const tabLabel = key === 'reviews' ? `Reviews (${reviewCount})` : label;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`relative shrink-0 px-5 py-3 text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer ${
                activeTab === key
                  ? 'text-[#DFC18A]'
                  : 'text-[#8E7B6F] hover:text-[#C7B5A7]'
              }`}
            >
              {tabLabel}
              {activeTab === key && (
                <motion.div
                  layoutId="tabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C86A27]"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'description' && (
            <motion.div
              key="desc"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl text-[#C7B5A7] text-sm leading-relaxed font-light"
            >
              <p>
                {product.description ||
                  'An authentic handloom saree woven with pure silk and traditional zari by master artisans. Every thread tells a story of centuries-old craftsmanship, blended with timeless designs that celebrate the heritage of Indian weaving traditions. Comes with Silk Mark purity assurance.'}
              </p>
            </motion.div>
          )}

          {activeTab === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-2xl"
            >
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ['Category', product.category || 'Saree'],
                    ['Fabric', product.fabric || 'Pure Silk'],
                    ['Weave', product.weave || 'Handloom'],
                    ['Length', '5.5m + 0.8m Blouse Piece'],
                    ['Care', product.care || 'Dry Clean Only'],
                    [
                      'SKU',
                      product.sku ||
                        product.slug ||
                        (product.id ? product.id.slice(0, 8) : 'N/A'),
                    ],
                  ].map(([label, value]) => (
                    <tr key={label} className="border-b border-[#1E130F]">
                      <td className="py-3 pr-6 text-[#8E7B6F] uppercase tracking-wider text-[11px] font-semibold w-36 shrink-0">
                        {label}
                      </td>
                      <td className="py-3 text-[#FDF8F4] text-sm">{value || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-8 max-w-3xl"
            >
              {/* Average Rating Card */}
              <div className="flex items-center gap-6 p-5 rounded-2xl bg-[#1A100C] border border-[#2A1B15]">
                <div className="text-center shrink-0">
                  <div
                    className="text-5xl font-bold text-[#DFC18A]"
                    style={{ fontFamily: 'serif' }}
                  >
                    {avgRating}
                  </div>
                  <StarRow value={Math.round(Number(avgRating) || 5)} />
                  <div className="text-xs text-[#8E7B6F] mt-1">{reviewCount} reviews</div>
                </div>
                <div className="flex-1 space-y-1.5 min-w-0">
                  {[5, 4, 3, 2, 1].map((s) => {
                    const count = reviews.filter((r) => Math.round(r.rating) === s).length;
                    const pct =
                      reviews.length > 0
                        ? Math.round((count / reviews.length) * 100)
                        : s === 5
                        ? 100
                        : 0;
                    return (
                      <div key={s} className="flex items-center gap-2">
                        <span className="text-[11px] text-[#8E7B6F] w-3">{s}</span>
                        <Star className="w-3 h-3 text-[#DFC18A] fill-[#DFC18A] shrink-0" />
                        <div className="flex-1 h-1.5 rounded-full bg-[#2A1B15] overflow-hidden">
                          <div
                            className="h-full bg-[#DFC18A] rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-[#8E7B6F] w-6 text-right">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review List */}
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((r, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-[#1A100C] border border-[#2A1B15]"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#DFC18A]/20 flex items-center justify-center text-[#DFC18A] text-sm font-bold shrink-0">
                          {String(r.profiles?.name || 'C')[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[#FDF8F4]">
                            {r.profiles?.name || 'Customer'}
                          </div>
                          <StarRow value={Math.round(Number(r.rating) || 5)} />
                        </div>
                      </div>
                      {r.comment && (
                        <p className="text-sm text-[#C7B5A7] leading-relaxed mt-1">
                          {r.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#8E7B6F] italic">
                  No reviews yet. Be the first to share your experience!
                </p>
              )}

              {/* Write Review Form */}
              {user && (
                <form
                  onSubmit={handleSubmitReview}
                  className="space-y-4 p-5 rounded-2xl bg-[#1A100C] border border-[#2A1B15]"
                >
                  <h4 className="text-sm font-semibold text-[#DFC18A] uppercase tracking-wider">
                    Write a Review
                  </h4>
                  <div>
                    <label className="text-xs text-[#8E7B6F] block mb-1.5">
                      Your Rating
                    </label>
                    <StarRow value={userRating} onChange={setUserRating} size="lg" />
                  </div>
                  <div>
                    <label className="text-xs text-[#8E7B6F] block mb-1.5">
                      Your Comment
                    </label>
                    <textarea
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      rows={3}
                      placeholder="Share your experience with this saree..."
                      className="w-full bg-[#160E0B] border border-[#35221B] rounded-xl px-4 py-3 text-sm text-[#FDF8F4] placeholder:text-[#8E7B6F] focus:outline-none focus:border-[#DFC18A]/60 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview || !userComment.trim()}
                    className="px-5 py-2.5 rounded-xl bg-[#C86A27] hover:bg-[#DB7B32] text-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-40 cursor-pointer"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
