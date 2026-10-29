// Business details shown in the footer and legal pages. Payment gateway
// (PayStation) verification checks these, so keep them in sync with the
// trade license.
export const company = {
  brand: "Brikvent",
  parent: "Webbriks",
  parentUrl: "https://webbriks.com",
  email: "brikvent@gmail.com",
  // Webbriks Bangladesh office, from webbriks.com.
  phone: "+880 1977-201923",
  phoneHref: "tel:+8801977201923",
  whatsappHref: "https://wa.me/8801977201923",
  address: {
    en: "House 35, 3rd Floor, Road 4, Nikunjo 2, Khilkhet, Dhaka, Bangladesh",
    bn: "বাসা ৩৫, ৩য় তলা, রোড ৪, নিকুঞ্জ ২, খিলক্ষেত, ঢাকা, বাংলাদেশ",
  },
  tradeLicense: "TRAD/DNCC/022419/2026",
  // Webbriks profiles until Brikvent has its own pages.
  socials: [
    { name: "Facebook", href: "https://facebook.com/webbriks" },
    { name: "Instagram", href: "https://www.instagram.com/webbriks/" },
    { name: "LinkedIn", href: "https://linkedin.com/company/webbriks" },
  ],
  // Date shown as "Last updated" on the policy pages.
  policiesUpdated: "2026-10-28",
} as const;
