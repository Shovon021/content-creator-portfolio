import React from 'react';

/**
 * FaqSection — visible FAQ section for SEO/GEO.
 * Same 10 questions as the FAQPage JSON-LD in index.html, so search engines
 * and AI assistants can quote answers straight from the page. Content uses
 * ONLY verified facts from the live portfolio page. No invented claims.
 */
const faqs = [
  {
    q: 'Rukaiya Binta Hossain Ekra কে?',
    a: 'Rukaiya Binta Hossain Ekra, যিনি Dear Ekra নামে পরিচিত, বাংলাদেশের একজন কনটেন্ট ক্রিয়েটর ও ব্র্যান্ড প্রমোটার। তাঁর নাম Ruqaiya Binte Hossain Ekra বানানেও খোঁজা হয়। তিনি 20+ ব্র্যান্ডের সঙ্গে কাজ করেছেন এবং Facebook ও Instagram-এ তাঁর 19K+ ফলোয়ার আছে।'
  },
  {
    q: 'Dear Ekra কী ধরনের কাজ করেন?',
    a: 'Dear Ekra বাংলাদেশে ব্র্যান্ড প্রমোশন ও কনটেন্ট ক্রিয়েশন করেন — বিউটি ও স্কিনকেয়ার রিভিউ (যেমন Japan Bazar, HER Studio & Salon), ফুড রিভিউ ও গ্র্যান্ড ওপেনিং প্রমোশন (যেমন Artistyan Cafe, Sultan\'s Dine, Igloo), ফ্যাশন স্টাইলিং ও ব্র্যান্ড প্রোডাক্ট রিভিউ (যেমন Ayesha\'s De Gallery), ডেস্টিনেশন ও রিসোর্ট মার্কেটিং (যেমন Da Birulia, Sreemangal-এর রিসোর্ট), ক্যাম্পাস লাইফ ভ্লগ (EWU) এবং প্রফেশনাল ভিডিও এডিটিং। ঢাকা-ভিত্তিক শুট ও এডিট করে Facebook ও Instagram-এ প্রকাশ করা হয়।'
  },
  {
    q: 'Dear Ekra-র সঙ্গে ক্যাম্পেইন শুরু করব কীভাবে?',
    a: '৩ ধাপে: ১) কথা বলুন — WhatsApp বা Facebook-এ জানান আপনি কী ভিডিও চান, ২) ঠিক করে নিন — আইডিয়া, বাজেট আর পেমেন্টের নিয়ম একসাথে ঠিক হয়, ৩) শুট ও প্রকাশ — আপনার জায়গায় গিয়ে শুট ও এডিট করা হয়, আপনার বা Dear Ekra-র পেজে প্রকাশ করা হয়। যোগাযোগ: WhatsApp +880 1911-133259, ইমেইল rukaiyabintahossain@gmail.com।'
  },
  {
    q: 'Dear Ekra কি শুধু নিজে পরীক্ষা করা পণ্য প্রমোট করেন?',
    a: 'হ্যাঁ, তাঁর কাজের নীতি হলো Personally Tested, Clear Expectations এবং Authentic Delivery — তিনি শুধু নিজে গিয়ে দেখা, পরীক্ষা করা জায়গা, খাবার ও পণ্য প্রমোট করেন এবং অতিরঞ্জিত দাবি করেন না।'
  },
  {
    q: 'Dear Ekra-র সঙ্গে ব্র্যান্ড প্রমোশন বুক করব কীভাবে?',
    a: 'WhatsApp (+880 1911-133259) বা Facebook Page Dear Ekra-তে মেসেজ করে জানান আপনি কী ধরনের ভিডিও চান — যেমন প্রোডাক্ট রিভিউ, ক্যাফে/রেস্টুরেন্ট প্রমোশন, গ্র্যান্ড ওপেনিং, ফ্যাশন শোকেস বা রিসোর্ট/ট্রাভেল কনটেন্ট। এরপর আইডিয়া, ডেলিভারেবল আর প্যাকেজের বাজেট আগেই ঠিক করে নেওয়া হয়, তারপর আপনার জায়গায় শুট ও এডিট করে ভিডিও প্রকাশ করা হয়। ইমেইল: rukaiyabintahossain@gmail.com।'
  },
  {
    q: 'বাজেট বা প্যাকেজ কীভাবে ঠিক হয়?',
    a: 'বাজেট আগেই আলোচনা করে ঠিক করা হয় — ক্যাম্পেইনের আইডিয়া, কী কী ভিডিও/ডেলিভারেবল লাগবে আর পেমেন্টের নিয়ম (Clear Expectations নীতি অনুযায়ী) শুটের আগেই পরিষ্কার করে নেওয়া হয়, যাতে পরে কোনো বিভ্রান্তি না থাকে।'
  },
  {
    q: 'শুট কোথায় হয়? ঢাকার বাইরে কি শুট করেন?',
    a: 'Dear Ekra ঢাকা-ভিত্তিক কনটেন্ট ক্রিয়েটর। শুট সাধারণত ক্লায়েন্টের জায়গায় গিয়ে করা হয় (on-location shoot) — ক্যাফে, রেস্টুরেন্ট, শপ, স্যালন বা রিসোর্টে। ঢাকার বাইরের শুট (যেমন রিসোর্ট বা ট্রাভেল কনটেন্ট) ক্যাম্পেইন অনুযায়ী আলোচনা করে ঠিক করা হয়।'
  },
  {
    q: 'ভিডিও এডিটিং কি ক্যাম্পেইনের মধ্যেই থাকে?',
    a: 'হ্যাঁ — Dear Ekra-র কাজের মধ্যে প্রফেশনাল ভিডিও এডিটিং আছে। ঢাকায় অন-লোকেশন শুটের পর প্রফেশনাল এডিট করে তৈরি রিল Facebook ও Instagram-এ প্রকাশের উপযোগী করে দেওয়া হয় — Dear Ekra-র পেজে বা ক্লায়েন্টের পেজে, যেভাবে আগেই ঠিক করা থাকে। কনটেন্ট ক্রিয়েশন ও ভিডিও এডিটিং একসঙ্গেই ক্যাম্পেইনের অংশ, আলাদা করে এডিটর খুঁজতে হয় না।'
  },
  {
    q: 'Dear Ekra কোন কোন ব্র্যান্ডের সঙ্গে কাজ করেছেন?',
    a: 'Dear Ekra 20+ ব্র্যান্ড ও লোকাল ব্যবসার সঙ্গে কাজ করেছেন। পোর্টফোলিওতে থাকা উদাহরণের মধ্যে আছে Sultan\'s Dine, Japan Bazar, Igloo Ice Cream, Artistyan Cafe, HER Studio & Salon, Ayesha\'s De Gallery, Tehani Premium Tea এবং আরও অনেকে — পুরো তালিকা ও ভিডিও পোর্টফোলিওর গ্যালারিতে দেখা যাবে।'
  },
  {
    q: 'Dear Ekra-কে কোথায় ফলো করা যাবে?',
    a: 'Facebook Page Dear Ekra (facebook.com/3kraneha), Instagram-এ dear.ekra এবং YouTube-এ @rukaiyabintahossain4183। সব কাজের পোর্টফোলিও: https://mydearekra.pages.dev/ — Rukaiya Binta Hossain Ekra (Dear Ekra), বাংলাদেশের কনটেন্ট ক্রিয়েটর ও ব্র্যান্ড প্রমোটার।'
  }
];

export default function FaqSection() {
  return (
    <section
      id="faq"
      className="cv-auto relative w-full bg-white text-zinc-900 py-12 sm:py-16 lg:py-24 border-b border-zinc-200/80"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5 font-mono">
            FAQ • সাধারণ প্রশ্ন
          </p>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tight leading-tight">
            Frequently Asked{' '}
            <span className="font-serif italic font-normal text-zinc-500">
              Questions
            </span>
          </h2>

          <div className="mt-6 sm:mt-8 space-y-6">
            {faqs.map((item) => (
              <div key={item.q}>
                <h3 className="font-display text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
                  {item.q}
                </h3>
                <p className="mt-1.5 text-base leading-relaxed text-zinc-600">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
