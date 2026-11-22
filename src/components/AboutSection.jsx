import React from 'react';

/**
 * AboutSection — visible About section for SEO/GEO.
 * Content uses ONLY verified lines from the live portfolio page (hero,
 * services intro, principles intro). No invented bio. Styled in the site's
 * existing language: display headings, serif italic accents, zinc palette.
 */
export default function AboutSection() {
  return (
    <section
      id="about"
      className="cv-auto relative w-full bg-white text-zinc-900 py-12 sm:py-16 lg:py-24 border-b border-zinc-200/80"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5 font-mono">
            ABOUT • পরিচয়
          </p>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tight leading-tight">
            About{' '}
            <span className="font-serif italic font-normal text-zinc-500">
              Dear Ekra
            </span>
          </h2>

          <div className="mt-4 sm:mt-5 space-y-4 text-base sm:text-lg leading-relaxed text-zinc-600">
            <p>
              Rukaiya Binta Hossain Ekra, known as Dear Ekra, is a content
              creator and brand promoter in Bangladesh. Based in Dhaka, she
              creates brand promotion campaigns, product reviews, food and
              cafe reviews, fashion showcases, resort and destination
              marketing, and professionally edited reels for brands across
              Bangladesh — see her{' '}
              <a href="#gallery" className="underline underline-offset-4">
                campaigns and reels
              </a>{' '}
              and{' '}
              <a href="#services" className="underline underline-offset-4">
                services
              </a>
              .
            </p>
            <p>
              Every collaboration starts with honest experience and ends with
              a story your audience remembers.
            </p>
            <p className="font-serif italic text-zinc-900">
              “Years of Tasting, Travelling &amp; Styling, So You Don’t Have
              To Guess.”
            </p>
            <p>
              Trusted by 20+ brands &amp; loved by 19K+ followers on Facebook
              &amp; Instagram.
            </p>
            <p lang="bn">
              রুকাইয়া বিনতে হোসেন ইকরা (Rukaiya Binta Hossain Ekra), যিনি Dear
              Ekra নামে পরিচিত, বাংলাদেশের একজন কনটেন্ট ক্রিয়েটর ও ব্র্যান্ড
              প্রমোটার। ঢাকা-ভিত্তিক ব্র্যান্ড প্রমোশন, প্রোডাক্ট রিভিউ ও ভিডিও
              কনটেন্টের মাধ্যমে তিনি ২০+ ব্র্যান্ডের সঙ্গে কাজ করেছেন।
            </p>
            <p lang="bn">
              তাঁর কাজের মধ্যে আছে বিউটি ও স্কিনকেয়ার রিভিউ, ফুড রিভিউ ও ক্যাফে
              প্রমোশন, ফ্যাশন ও ব্র্যান্ড রিভিউ, ডেস্টিনেশন ও রিসোর্ট মার্কেটিং,
              ক্যাম্পাস লাইফ ভ্লগ এবং প্রফেশনাল ভিডিও এডিটিং। Facebook ও
              Instagram-এ তাঁর ১৯K+ ফলোয়ার, ৫৯৩+ প্রকাশিত রিল এবং ১২.৮M+ মোট
              ভিডিও ভিউ আছে।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
