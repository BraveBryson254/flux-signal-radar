export const company = {
  name: "Flux Signal Radar",
  tagline: "Professional Trading Intelligence Platform",
  description:
    "A live confluence signal scanner and trading ecosystem combining Smart Money Concepts, ICT, and Wyckoff methodology with education, competitions, and community.",
  mission:
    "Our mission is to build Africa's most trusted trading ecosystem — where traders don't just receive signals, but develop the knowledge, discipline, and confidence to trade independently. Through education, technology, AI, and community, we aim to empower the next generation of consistently profitable traders.",
};

export interface Leader {
  name: string;
  role: string;
  bio: string;
  initials: string;
}

export const leadership: Leader[] = [
  {
    name: "Bryson Brave",
    role: "Founder & Chief Executive Officer",
    bio: "Software Engineer, Algorithmic Trader, Trading Systems Architect",
    initials: "BB",
  },
  {
    name: "Marrion Brave",
    role: "Co-Founder & Chief Operations Officer",
    bio: "Operations, Community Development, Business Strategy",
    initials: "MB",
  },
];

export const contact = {
  support: "support@fluxsignalradar.com",
  business: "business@fluxsignalradar.com",
  partnerships: "partnerships@fluxsignalradar.com",
  phone: "+254 (0) XXX XXX XXX",
  website: "fluxsignalradar.com",
};

export const location = {
  label: "Head Office",
  city: "Nairobi, Kenya",
  coverage: "Serving traders across Kenya, Africa, and international markets.",
  hours: "Mon–Fri, 8:00–18:00 EAT",
};

export const platformLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Academy", href: "/academy" },
  { label: "Library", href: "/library" },
  { label: "Signals", href: "/feed" },
  { label: "Competitions", href: "/competitions" },
  { label: "Community", href: "/community" },
  { label: "Pricing", href: "/pricing" },
  { label: "Support", href: "/support" },
];

export const legalLinks = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms & Conditions", href: "/legal/terms" },
  { label: "Risk Disclosure", href: "/legal/risk-disclosure" },
  { label: "Cookie Policy", href: "/legal/cookies" },
  { label: "Refund Policy", href: "/legal/refunds" },
  { label: "Disclaimer", href: "/legal/disclaimer" },
];

export interface SocialLink {
  label: string;
  href: string;
  icon: string; // lucide icon name, generic fallback where no brand icon exists
}

export const socialLinks: SocialLink[] = [
  { label: "Facebook", href: "#", icon: "Facebook" },
  { label: "Instagram", href: "#", icon: "Instagram" },
  { label: "X", href: "#", icon: "AtSign" },
  { label: "LinkedIn", href: "#", icon: "Linkedin" },
  { label: "TikTok", href: "#", icon: "Music2" },
  { label: "YouTube", href: "#", icon: "Youtube" },
  { label: "Telegram", href: "#", icon: "Send" },
  { label: "WhatsApp", href: "#", icon: "MessageCircle" },
];

export interface PlatformStat {
  label: string;
  value: number;
  suffix?: string;
}

export const platformStats: PlatformStat[] = [
  { label: "Active traders", value: 214 },
  { label: "Signals delivered", value: 3840 },
  { label: "Courses", value: 12 },
  { label: "Competitions run", value: 9 },
  { label: "Community members", value: 612 },
  { label: "Countries served", value: 6 },
];

export const trustIndicators = [
  { label: "SSL Secured", icon: "ShieldCheck" },
  { label: "Professional Trading Platform", icon: "BadgeCheck" },
  { label: "Built in Kenya", icon: "MapPin" },
  { label: "Serving Africa", icon: "Globe2" },
  { label: "Educational First", icon: "GraduationCap" },
  { label: "Secure Authentication", icon: "Lock" },
];
