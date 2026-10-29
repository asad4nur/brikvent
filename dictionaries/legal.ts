import type { Locale } from "@/lib/i18n";

// Company and policy pages. Draft wording: have it reviewed before launch.
// {email}, {phone}, {address}, {license}, {parent} are filled from lib/company.ts.

export const legalSlugs = [
  "about",
  "terms",
  "refund-policy",
  "privacy-policy",
  "delivery-policy",
] as const;
export type LegalSlug = (typeof legalSlugs)[number];

export type LegalDoc = {
  title: string;
  description: string;
  intro: string;
  sections: { heading: string; paragraphs?: string[]; list?: string[] }[];
};

const en: Record<LegalSlug, LegalDoc> = {
  about: {
    title: "About Us",
    description: "Who we are and why we built Brikvent.",
    intro:
      "Brikvent is an all-in-one commerce platform for Bangladeshi businesses, built and operated by {parent}. It brings the online store, point of sale, social media orders, courier booking and accounts together on one shared inventory.",
    sections: [
      {
        heading: "Our story",
        paragraphs: [
          "Working with shops across Bangladesh, our team at {parent} kept seeing the same problems: orders lost in Messenger and WhatsApp, stock sold twice because the shop and the Facebook page never agreed, fake cash-on-delivery orders, and accounts kept in notebooks.",
          "Global tools were built for card payments and English-speaking shoppers, so sellers here stitched together a website builder, a POS app, courier panels and spreadsheets. Brikvent replaces that patchwork with one system made for how Bangladesh sells.",
        ],
      },
      {
        heading: "What we do",
        list: [
          "Online store with your own domain, themes, offers and local payments",
          "Point of sale for the shop counter, with barcode, bKash and thermal receipts",
          "One inventory shared by every outlet, warehouse and sales channel",
          "Order management with COD confirmation calls, fraud checks and courier booking",
          "Unified inbox for Messenger, WhatsApp and Instagram",
          "Accounts, expenses, dues and reports in taka",
        ],
      },
      {
        heading: "Company information",
        list: [
          "Brand: Brikvent, a product of {parent}",
          "Office: {address}",
          "Phone: {phone}",
          "Email: {email}",
          "Trade License No.: {license}",
        ],
      },
    ],
  },

  terms: {
    title: "Terms & Conditions",
    description: "The terms that apply when you use Brikvent.",
    intro:
      "These Terms & Conditions govern your use of Brikvent, operated by {parent} (\"we\", \"us\"). By creating an account, starting a trial or paying for a plan, you agree to these terms.",
    sections: [
      {
        heading: "1. The service",
        paragraphs: [
          "Brikvent is a subscription software service (SaaS) that provides an online store, point of sale, inventory, order, messaging, marketing and accounting tools. Features available to you depend on your plan, as shown on our pricing page.",
        ],
      },
      {
        heading: "2. Your account",
        list: [
          "You must give accurate business and contact information and keep it up to date.",
          "You are responsible for everything done through your account and your staff users, and for keeping login details secure.",
          "You must be at least 18 years old and able to enter a binding contract under the laws of Bangladesh.",
        ],
      },
      {
        heading: "3. Plans, prices and billing",
        list: [
          "All prices are in Bangladeshi Taka (BDT) and are shown on our pricing page before you pay.",
          "Plans are billed monthly or yearly in advance and renew automatically until cancelled.",
          "If your monthly orders go above your plan's free order quota, the extra orders are charged at the per-order rate of your plan and added to that month's bill.",
          "Calling and SMS features use prepaid credits that you buy separately.",
          "Payments are processed by our payment partner PayStation. We do not store your card or mobile wallet details.",
          "If a payment fails, we may limit your account until the due amount is paid.",
        ],
      },
      {
        heading: "4. Acceptable use",
        paragraphs: ["You agree not to use Brikvent to:"],
        list: [
          "sell illegal, counterfeit or prohibited goods or services under Bangladeshi law;",
          "send spam or unsolicited SMS, calls or messages;",
          "upload content that infringes others' rights or is harmful, fraudulent or misleading;",
          "attempt to break, overload or gain unauthorised access to the service.",
        ],
      },
      {
        heading: "5. Your store and your customers",
        paragraphs: [
          "You are the seller of record for everything sold through your store. You are responsible for your product information, prices, taxes, delivery, returns and dealings with your customers. Your customer data belongs to you; we process it only to provide the service, as described in our Privacy Policy.",
        ],
      },
      {
        heading: "6. Third-party services",
        paragraphs: [
          "Brikvent connects to third-party services such as payment gateways, couriers, SMS providers and Meta platforms. Their own terms apply, and we are not responsible for their availability or actions.",
        ],
      },
      {
        heading: "7. Cancellation and termination",
        paragraphs: [
          "You can cancel your plan at any time; it stays active until the end of the paid period. Refunds follow our Return & Refund Policy. We may suspend or close accounts that break these terms, after notice where reasonable.",
        ],
      },
      {
        heading: "8. Availability and liability",
        paragraphs: [
          "We work to keep Brikvent available and secure but cannot promise uninterrupted service. To the extent permitted by law, our total liability for any claim is limited to the amount you paid us in the three months before the claim, and we are not liable for indirect losses such as lost profits.",
        ],
      },
      {
        heading: "9. Changes and governing law",
        paragraphs: [
          "We may update these terms and will notify you of material changes by email or in the dashboard. These terms are governed by the laws of Bangladesh, and disputes fall under the courts of Dhaka.",
        ],
      },
      {
        heading: "10. Contact",
        paragraphs: ["Questions about these terms: {email}, {phone}, {address}. Trade License No. {license}."],
      },
    ],
  },

  "refund-policy": {
    title: "Return & Refund Policy",
    description: "When and how you can get a refund for Brikvent plans.",
    intro:
      "Brikvent is a digital subscription service, so there is no physical product to return. This policy explains when we refund subscription payments.",
    sections: [
      {
        heading: "Try before you pay",
        paragraphs: [
          "Starter, Growth and Business plans include a 14-day free trial, so you can check that Brikvent fits your business before paying anything.",
        ],
      },
      {
        heading: "When you can get a refund",
        list: [
          "Yearly plans: request a refund within 7 days of your first yearly payment and we will refund the full amount.",
          "Duplicate or wrong charges: if you were charged twice or charged the wrong amount, we refund the difference in full.",
          "Service failure: if a paid feature was unavailable for a long period because of a fault on our side, we will credit or refund the affected period.",
        ],
      },
      {
        heading: "When refunds are not given",
        list: [
          "Monthly plan payments once the billing month has started. You can cancel at any time to stop the next renewal.",
          "Charges for extra orders above your free quota that have already been processed.",
          "Prepaid calling and SMS credits that have been used. Unused credits do not expire and stay in your account.",
          "Accounts closed for breaking our Terms & Conditions.",
        ],
      },
      {
        heading: "How to request a refund",
        paragraphs: [
          "Email {email} or call {phone} with your store name, payment date and transaction ID. We reply within 3 working days.",
          "Approved refunds are sent to the original payment method (card, bKash, Nagad or other) within 7 to 10 working days, depending on your bank or wallet provider.",
        ],
      },
    ],
  },

  "privacy-policy": {
    title: "Privacy Policy",
    description: "How Brikvent collects, uses and protects information.",
    intro:
      "This policy explains what information {parent} collects when you use Brikvent, how we use it and the choices you have.",
    sections: [
      {
        heading: "Information we collect",
        list: [
          "Account details: your name, business name, phone number, email and address.",
          "Business data you add: products, stock, orders, customers, suppliers and accounts.",
          "Payment information: plan and transaction records. Card and wallet details are handled by PayStation and are not stored by us.",
          "Usage data: device, browser, pages visited and actions in the dashboard, used to keep the service secure and improve it.",
        ],
      },
      {
        heading: "How we use it",
        list: [
          "to provide, maintain and support the service;",
          "to process payments and send invoices and service notices;",
          "to prevent fraud and protect accounts;",
          "to improve Brikvent, using aggregated data that does not identify you.",
        ],
      },
      {
        heading: "Your customers' data",
        paragraphs: [
          "Data about your store's customers belongs to you. We store and process it only to run your store, orders, calls, SMS and deliveries on your instructions, and we never sell it.",
        ],
      },
      {
        heading: "Sharing",
        paragraphs: [
          "We share information only with service providers needed to run Brikvent, such as hosting, payment gateways, couriers and SMS providers, and only as far as needed for that task, or when required by Bangladeshi law.",
        ],
      },
      {
        heading: "Security and retention",
        paragraphs: [
          "Data is sent over encrypted connections, access is limited to authorised staff and each business's data is kept separate. We keep data while your account is active and delete it within 90 days after you close your account, unless the law requires us to keep it longer.",
        ],
      },
      {
        heading: "Cookies",
        paragraphs: [
          "We use essential cookies to keep you signed in and analytics cookies to understand how the website is used. You can block cookies in your browser, but some features may stop working.",
        ],
      },
      {
        heading: "Your choices",
        paragraphs: [
          "You can view, correct or export your data from the dashboard, or ask us to delete it by emailing {email}.",
        ],
      },
    ],
  },

  "delivery-policy": {
    title: "Delivery Policy",
    description: "How and when your Brikvent service is delivered.",
    intro:
      "Brikvent is software delivered online. Nothing is shipped physically: your service is delivered as access to your Brikvent account.",
    sections: [
      {
        heading: "Account and trial",
        paragraphs: [
          "Your account and free trial are ready immediately after you sign up. Login details are sent to the email and phone number you register with.",
        ],
      },
      {
        heading: "Paid plans",
        list: [
          "Your plan is activated right after the payment is confirmed, usually within a few minutes.",
          "If the payment gateway confirms late, activation can take up to 24 hours. Contact us if your plan is not active after that.",
          "An invoice for every payment is available in your dashboard and sent by email.",
        ],
      },
      {
        heading: "Setup services",
        list: [
          "Custom domains: connecting your own domain can take up to 48 hours while DNS updates.",
          "Calling and SMS credits are added to your account as soon as the top-up payment is confirmed.",
          "Enterprise onboarding is scheduled with you after the demo call.",
        ],
      },
      {
        heading: "Your own deliveries",
        paragraphs: [
          "Brikvent helps you book couriers for your store's orders, but delivery of your products to your customers is handled by you and your chosen courier under their terms.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: ["For delivery or activation issues: {email} or {phone}."],
      },
    ],
  },
};

const bn: Record<LegalSlug, LegalDoc> = {
  about: {
    title: "আমাদের সম্পর্কে",
    description: "আমরা কারা আর কেন Brikvent বানিয়েছি।",
    intro:
      "Brikvent বাংলাদেশি ব্যবসার জন্য একটি অল-ইন-ওয়ান কমার্স প্ল্যাটফর্ম, যা তৈরি ও পরিচালনা করে {parent}। অনলাইন স্টোর, পয়েন্ট অফ সেল, সোশ্যাল মিডিয়ার অর্ডার, কুরিয়ার বুকিং আর হিসাব, সবকিছু এক জায়গায়, একটাই ইনভেন্টরিতে।",
    sections: [
      {
        heading: "আমাদের গল্প",
        paragraphs: [
          "বাংলাদেশের নানা দোকানের সাথে কাজ করতে গিয়ে {parent} এর টিম বারবার একই সমস্যা দেখেছে: মেসেঞ্জার আর হোয়াটসঅ্যাপে অর্ডার হারিয়ে যাওয়া, দোকান আর ফেসবুক পেজের স্টক না মেলায় একই জিনিস দুইবার বিক্রি, ভুয়া ক্যাশ অন ডেলিভারি অর্ডার, আর খাতায় হিসাব রাখা।",
          "বিদেশি টুলগুলো বানানো কার্ড পেমেন্ট আর ইংরেজিভাষী ক্রেতাদের জন্য, তাই এখানকার সেলাররা ওয়েবসাইট বিল্ডার, POS অ্যাপ, কুরিয়ার প্যানেল আর এক্সেল জোড়াতালি দিয়ে চালান। Brikvent এই জোড়াতালির জায়গায় বাংলাদেশের বিক্রির ধরন মাথায় রেখে বানানো একটাই সিস্টেম।",
        ],
      },
      {
        heading: "আমরা যা করি",
        list: [
          "নিজের ডোমেইন, থিম, অফার আর লোকাল পেমেন্ট সহ অনলাইন স্টোর",
          "দোকানের কাউন্টারের জন্য বারকোড, বিকাশ আর থার্মাল রিসিট সহ POS",
          "সব আউটলেট, গোডাউন আর বিক্রির চ্যানেলে একটাই ইনভেন্টরি",
          "COD কনফার্মেশন কল, ফ্রড চেক আর কুরিয়ার বুকিং সহ অর্ডার ম্যানেজমেন্ট",
          "মেসেঞ্জার, হোয়াটসঅ্যাপ আর ইনস্টাগ্রামের জন্য ইউনিফাইড ইনবক্স",
          "টাকায় হিসাব, খরচ, বাকি আর রিপোর্ট",
        ],
      },
      {
        heading: "প্রতিষ্ঠানের তথ্য",
        list: [
          "ব্র্যান্ড: Brikvent, {parent} এর একটি প্রোডাক্ট",
          "অফিস: {address}",
          "ফোন: {phone}",
          "ইমেইল: {email}",
          "ট্রেড লাইসেন্স নম্বর: {license}",
        ],
      },
    ],
  },

  terms: {
    title: "শর্তাবলি",
    description: "Brikvent ব্যবহারের ক্ষেত্রে প্রযোজ্য শর্তসমূহ।",
    intro:
      "এই শর্তাবলি {parent} (\"আমরা\") পরিচালিত Brikvent ব্যবহারের ক্ষেত্রে প্রযোজ্য। অ্যাকাউন্ট খুলে, ট্রায়াল শুরু করে বা কোনো প্ল্যানের মূল্য পরিশোধ করে আপনি এই শর্তগুলোতে সম্মত হচ্ছেন।",
    sections: [
      {
        heading: "১. সেবা",
        paragraphs: [
          "Brikvent একটি সাবস্ক্রিপশন ভিত্তিক সফটওয়্যার সেবা (SaaS), যাতে অনলাইন স্টোর, POS, ইনভেন্টরি, অর্ডার, মেসেজিং, মার্কেটিং আর হিসাবের টুল রয়েছে। আপনি কোন ফিচার পাবেন তা আপনার প্ল্যানের উপর নির্ভর করে, যা আমাদের প্রাইসিং পেজে দেখানো আছে।",
        ],
      },
      {
        heading: "২. আপনার অ্যাকাউন্ট",
        list: [
          "ব্যবসা আর যোগাযোগের সঠিক তথ্য দিতে হবে এবং তা হালনাগাদ রাখতে হবে।",
          "আপনার অ্যাকাউন্ট ও স্টাফ ইউজারদের মাধ্যমে করা সব কাজ এবং লগইন তথ্যের নিরাপত্তার দায়িত্ব আপনার।",
          "আপনার বয়স কমপক্ষে ১৮ বছর হতে হবে এবং বাংলাদেশের আইন অনুযায়ী চুক্তি করার যোগ্য হতে হবে।",
        ],
      },
      {
        heading: "৩. প্ল্যান, দাম ও বিলিং",
        list: [
          "সব দাম বাংলাদেশি টাকায় (BDT), যা পেমেন্টের আগেই প্রাইসিং পেজে দেখানো থাকে।",
          "প্ল্যানের বিল মাসিক বা বার্ষিক অগ্রিম নেওয়া হয় এবং বাতিল না করা পর্যন্ত নিজে থেকে নবায়ন হয়।",
          "মাসে প্ল্যানের ফ্রি অর্ডার কোটার বেশি অর্ডার হলে বাড়তি অর্ডারগুলো আপনার প্ল্যানের প্রতি-অর্ডার রেটে সেই মাসের বিলে যোগ হবে।",
          "কল আর SMS ফিচার আলাদাভাবে কেনা প্রিপেইড ক্রেডিট দিয়ে চলে।",
          "পেমেন্ট প্রসেস করে আমাদের পেমেন্ট পার্টনার PayStation। আমরা আপনার কার্ড বা মোবাইল ওয়ালেটের তথ্য সংরক্ষণ করি না।",
          "পেমেন্ট ব্যর্থ হলে বকেয়া পরিশোধ না হওয়া পর্যন্ত আমরা অ্যাকাউন্ট সীমিত করতে পারি।",
        ],
      },
      {
        heading: "৪. গ্রহণযোগ্য ব্যবহার",
        paragraphs: ["Brikvent ব্যবহার করে আপনি নিচের কাজগুলো করবেন না:"],
        list: [
          "বাংলাদেশের আইনে অবৈধ, নকল বা নিষিদ্ধ পণ্য বা সেবা বিক্রি;",
          "স্প্যাম বা অনাকাঙ্ক্ষিত SMS, কল বা মেসেজ পাঠানো;",
          "অন্যের অধিকার লঙ্ঘন করে এমন বা ক্ষতিকর, প্রতারণামূলক বা বিভ্রান্তিকর কনটেন্ট আপলোড;",
          "সেবাটি নষ্ট, অতিরিক্ত চাপ সৃষ্টি বা অননুমোদিত প্রবেশের চেষ্টা।",
        ],
      },
      {
        heading: "৫. আপনার স্টোর ও কাস্টমার",
        paragraphs: [
          "আপনার স্টোরে বিক্রি হওয়া সবকিছুর বিক্রেতা আপনি। প্রোডাক্টের তথ্য, দাম, কর, ডেলিভারি, রিটার্ন আর কাস্টমারের সাথে লেনদেনের দায়িত্ব আপনার। আপনার কাস্টমারের তথ্য আপনারই; আমরা শুধু সেবা দেওয়ার জন্য তা প্রসেস করি, যা আমাদের প্রাইভেসি পলিসিতে বলা আছে।",
        ],
      },
      {
        heading: "৬. তৃতীয় পক্ষের সেবা",
        paragraphs: [
          "Brikvent পেমেন্ট গেটওয়ে, কুরিয়ার, SMS প্রোভাইডার আর Meta প্ল্যাটফর্মের মতো তৃতীয় পক্ষের সেবার সাথে যুক্ত হয়। তাদের নিজস্ব শর্ত প্রযোজ্য, এবং তাদের সেবা বা কাজের জন্য আমরা দায়ী নই।",
        ],
      },
      {
        heading: "৭. বাতিল ও সমাপ্তি",
        paragraphs: [
          "আপনি যেকোনো সময় প্ল্যান বাতিল করতে পারেন; পরিশোধিত মেয়াদের শেষ পর্যন্ত তা চালু থাকবে। রিফান্ড আমাদের রিটার্ন ও রিফান্ড পলিসি অনুযায়ী হবে। এই শর্ত ভঙ্গ করলে যুক্তিসঙ্গত ক্ষেত্রে নোটিশ দিয়ে আমরা অ্যাকাউন্ট স্থগিত বা বন্ধ করতে পারি।",
        ],
      },
      {
        heading: "৮. সেবার প্রাপ্যতা ও দায়",
        paragraphs: [
          "আমরা Brikvent সবসময় সচল ও নিরাপদ রাখার চেষ্টা করি, তবে নিরবচ্ছিন্ন সেবার নিশ্চয়তা দিতে পারি না। আইনের অনুমতি সাপেক্ষে, যেকোনো দাবির ক্ষেত্রে আমাদের সর্বোচ্চ দায় দাবির আগের তিন মাসে আপনার পরিশোধিত অর্থের সমান, এবং লাভ হারানোর মতো পরোক্ষ ক্ষতির জন্য আমরা দায়ী নই।",
        ],
      },
      {
        heading: "৯. পরিবর্তন ও প্রযোজ্য আইন",
        paragraphs: [
          "আমরা এই শর্তাবলি হালনাগাদ করতে পারি এবং গুরুত্বপূর্ণ পরিবর্তন ইমেইল বা ড্যাশবোর্ডে জানাব। এই শর্তাবলি বাংলাদেশের আইন দ্বারা পরিচালিত, এবং বিরোধ ঢাকার আদালতের এখতিয়ারভুক্ত।",
        ],
      },
      {
        heading: "১০. যোগাযোগ",
        paragraphs: ["শর্তাবলি নিয়ে প্রশ্ন থাকলে: {email}, {phone}, {address}। ট্রেড লাইসেন্স নম্বর {license}।"],
      },
    ],
  },

  "refund-policy": {
    title: "রিটার্ন ও রিফান্ড পলিসি",
    description: "Brikvent প্ল্যানের রিফান্ড কখন ও কীভাবে পাবেন।",
    intro:
      "Brikvent একটি ডিজিটাল সাবস্ক্রিপশন সেবা, তাই ফেরত দেওয়ার মতো কোনো ফিজিক্যাল পণ্য নেই। সাবস্ক্রিপশনের টাকা কখন ফেরত দেওয়া হয় তা এই পলিসিতে বলা হলো।",
    sections: [
      {
        heading: "টাকা দেওয়ার আগে ব্যবহার করে দেখুন",
        paragraphs: [
          "Starter, Growth আর Business প্ল্যানে ১৪ দিনের ফ্রি ট্রায়াল আছে, যাতে কোনো টাকা দেওয়ার আগেই দেখে নিতে পারেন Brikvent আপনার ব্যবসার সাথে মানায় কিনা।",
        ],
      },
      {
        heading: "যখন রিফান্ড পাবেন",
        list: [
          "বার্ষিক প্ল্যান: প্রথম বার্ষিক পেমেন্টের ৭ দিনের মধ্যে আবেদন করলে পুরো টাকা ফেরত দেওয়া হবে।",
          "ডুপ্লিকেট বা ভুল চার্জ: দুইবার বা ভুল পরিমাণ টাকা কাটা হলে বাড়তি অংশ পুরোটা ফেরত দেওয়া হবে।",
          "সেবার ত্রুটি: আমাদের দিকের সমস্যার কারণে কোনো পেইড ফিচার দীর্ঘ সময় বন্ধ থাকলে সেই সময়ের জন্য ক্রেডিট বা রিফান্ড দেওয়া হবে।",
        ],
      },
      {
        heading: "যখন রিফান্ড দেওয়া হয় না",
        list: [
          "বিলিং মাস শুরু হয়ে গেলে মাসিক প্ল্যানের পেমেন্ট। পরের নবায়ন বন্ধ করতে যেকোনো সময় বাতিল করতে পারেন।",
          "ফ্রি কোটার বেশি অর্ডারের যে চার্জ ইতিমধ্যে প্রসেস হয়েছে।",
          "ব্যবহার হয়ে যাওয়া কল ও SMS ক্রেডিট। অব্যবহৃত ক্রেডিটের মেয়াদ শেষ হয় না, অ্যাকাউন্টেই থেকে যায়।",
          "শর্তাবলি ভঙ্গের কারণে বন্ধ করা অ্যাকাউন্ট।",
        ],
      },
      {
        heading: "রিফান্ডের আবেদন যেভাবে করবেন",
        paragraphs: [
          "আপনার স্টোরের নাম, পেমেন্টের তারিখ আর ট্রানজেকশন আইডি সহ {email} এ ইমেইল করুন বা {phone} নম্বরে কল করুন। আমরা ৩ কার্যদিবসের মধ্যে উত্তর দিই।",
          "অনুমোদিত রিফান্ড মূল পেমেন্ট মাধ্যমে (কার্ড, বিকাশ, নগদ বা অন্য) ৭ থেকে ১০ কার্যদিবসের মধ্যে পাঠানো হয়, আপনার ব্যাংক বা ওয়ালেট প্রোভাইডারের উপর নির্ভর করে।",
        ],
      },
    ],
  },

  "privacy-policy": {
    title: "প্রাইভেসি পলিসি",
    description: "Brikvent কীভাবে তথ্য সংগ্রহ, ব্যবহার ও সুরক্ষা করে।",
    intro:
      "Brikvent ব্যবহার করলে {parent} কী তথ্য সংগ্রহ করে, কীভাবে ব্যবহার করে এবং আপনার কী কী পছন্দের সুযোগ আছে, তা এই পলিসিতে বলা হলো।",
    sections: [
      {
        heading: "আমরা যে তথ্য সংগ্রহ করি",
        list: [
          "অ্যাকাউন্টের তথ্য: আপনার নাম, ব্যবসার নাম, ফোন নম্বর, ইমেইল আর ঠিকানা।",
          "আপনার যোগ করা ব্যবসার তথ্য: প্রোডাক্ট, স্টক, অর্ডার, কাস্টমার, সাপ্লায়ার আর হিসাব।",
          "পেমেন্টের তথ্য: প্ল্যান আর লেনদেনের রেকর্ড। কার্ড ও ওয়ালেটের তথ্য PayStation সামলায়, আমরা সংরক্ষণ করি না।",
          "ব্যবহারের তথ্য: ডিভাইস, ব্রাউজার, দেখা পেজ আর ড্যাশবোর্ডের কাজ, যা সেবা নিরাপদ রাখতে আর উন্নত করতে ব্যবহার হয়।",
        ],
      },
      {
        heading: "আমরা যেভাবে ব্যবহার করি",
        list: [
          "সেবা দেওয়া, চালু রাখা আর সাপোর্ট দেওয়ার জন্য;",
          "পেমেন্ট প্রসেস করা এবং ইনভয়েস ও সেবা সংক্রান্ত নোটিশ পাঠানোর জন্য;",
          "প্রতারণা ঠেকানো আর অ্যাকাউন্ট সুরক্ষার জন্য;",
          "এমন সমষ্টিগত তথ্য দিয়ে Brikvent উন্নত করার জন্য, যা আপনাকে শনাক্ত করে না।",
        ],
      },
      {
        heading: "আপনার কাস্টমারদের তথ্য",
        paragraphs: [
          "আপনার স্টোরের কাস্টমারদের তথ্য আপনারই। আমরা শুধু আপনার নির্দেশে স্টোর, অর্ডার, কল, SMS আর ডেলিভারি চালানোর জন্য তা সংরক্ষণ ও প্রসেস করি, এবং কখনো বিক্রি করি না।",
        ],
      },
      {
        heading: "তথ্য শেয়ার করা",
        paragraphs: [
          "Brikvent চালানোর জন্য প্রয়োজনীয় সেবাদাতা যেমন হোস্টিং, পেমেন্ট গেটওয়ে, কুরিয়ার আর SMS প্রোভাইডারের সাথে, শুধু ততটুকুই তথ্য শেয়ার করা হয় যতটুকু ওই কাজে লাগে, অথবা বাংলাদেশের আইন অনুযায়ী প্রয়োজন হলে।",
        ],
      },
      {
        heading: "নিরাপত্তা ও সংরক্ষণ",
        paragraphs: [
          "তথ্য এনক্রিপ্টেড সংযোগে পাঠানো হয়, শুধু অনুমোদিত কর্মীরা প্রবেশ করতে পারেন, আর প্রতিটা ব্যবসার তথ্য আলাদা রাখা হয়। অ্যাকাউন্ট চালু থাকা পর্যন্ত তথ্য রাখা হয় এবং অ্যাকাউন্ট বন্ধ করার ৯০ দিনের মধ্যে মুছে ফেলা হয়, যদি না আইন অনুযায়ী বেশি দিন রাখতে হয়।",
        ],
      },
      {
        heading: "কুকিজ",
        paragraphs: [
          "লগইন রাখার জন্য প্রয়োজনীয় কুকিজ আর ওয়েবসাইট কীভাবে ব্যবহার হচ্ছে বোঝার জন্য অ্যানালিটিক্স কুকিজ ব্যবহার করা হয়। ব্রাউজারে কুকিজ বন্ধ করতে পারেন, তবে কিছু ফিচার কাজ নাও করতে পারে।",
        ],
      },
      {
        heading: "আপনার পছন্দ",
        paragraphs: [
          "ড্যাশবোর্ড থেকে আপনার তথ্য দেখতে, সংশোধন করতে বা এক্সপোর্ট করতে পারেন, অথবা {email} এ ইমেইল করে মুছে ফেলার অনুরোধ করতে পারেন।",
        ],
      },
    ],
  },

  "delivery-policy": {
    title: "ডেলিভারি পলিসি",
    description: "আপনার Brikvent সেবা কীভাবে ও কখন পৌঁছায়।",
    intro:
      "Brikvent অনলাইনে দেওয়া একটি সফটওয়্যার সেবা। কোনো কিছু ফিজিক্যালি পাঠানো হয় না; আপনার Brikvent অ্যাকাউন্টে প্রবেশাধিকারই হলো সেবার ডেলিভারি।",
    sections: [
      {
        heading: "অ্যাকাউন্ট ও ট্রায়াল",
        paragraphs: [
          "সাইন আপ করার সাথে সাথেই আপনার অ্যাকাউন্ট আর ফ্রি ট্রায়াল চালু হয়ে যায়। লগইনের তথ্য আপনার দেওয়া ইমেইল আর ফোন নম্বরে পাঠানো হয়।",
        ],
      },
      {
        heading: "পেইড প্ল্যান",
        list: [
          "পেমেন্ট কনফার্ম হওয়ার সাথে সাথে, সাধারণত কয়েক মিনিটের মধ্যে, আপনার প্ল্যান চালু হয়।",
          "পেমেন্ট গেটওয়ে দেরিতে কনফার্ম করলে চালু হতে সর্বোচ্চ ২৪ ঘণ্টা লাগতে পারে। এরপরও চালু না হলে আমাদের সাথে যোগাযোগ করুন।",
          "প্রতিটা পেমেন্টের ইনভয়েস ড্যাশবোর্ডে পাওয়া যায় এবং ইমেইলে পাঠানো হয়।",
        ],
      },
      {
        heading: "সেটআপ সেবা",
        list: [
          "নিজের ডোমেইন: DNS আপডেট হতে কানেক্ট করতে সর্বোচ্চ ৪৮ ঘণ্টা লাগতে পারে।",
          "টপ-আপ পেমেন্ট কনফার্ম হলেই কল ও SMS ক্রেডিট অ্যাকাউন্টে যোগ হয়।",
          "Enterprise অনবোর্ডিং ডেমো কলের পর আপনার সাথে সময় ঠিক করে করা হয়।",
        ],
      },
      {
        heading: "আপনার নিজের ডেলিভারি",
        paragraphs: [
          "Brikvent আপনার স্টোরের অর্ডারের জন্য কুরিয়ার বুক করতে সাহায্য করে, তবে আপনার কাস্টমারের কাছে পণ্য পৌঁছানোর দায়িত্ব আপনার ও আপনার বেছে নেওয়া কুরিয়ারের, তাদের শর্ত অনুযায়ী।",
        ],
      },
      {
        heading: "যোগাযোগ",
        paragraphs: ["ডেলিভারি বা প্ল্যান চালু হওয়া নিয়ে সমস্যা হলে: {email} অথবা {phone}।"],
      },
    ],
  },
};

const docs: Record<Locale, Record<LegalSlug, LegalDoc>> = { en, bn };

export const isLegalSlug = (value: string): value is LegalSlug =>
  (legalSlugs as readonly string[]).includes(value);

export const getLegalDoc = (locale: Locale, slug: LegalSlug) => docs[locale][slug];
