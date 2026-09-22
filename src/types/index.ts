export interface LinkItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  category?: string;
  icon?: string;
  isPublic: boolean;
  createdAt: string;
  clickCount?: number;
  badge?: string; // e.g., "⭐️ 대표", "🔥 인기", "NEW"
  featured?: boolean;
}

export interface SocialLink {
  platform: "github" | "linkedin" | "twitter" | "instagram" | "email" | "blog";
  url: string;
  label: string;
}

export interface ProfileStat {
  label: string;
  value: string;
  iconName?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  role: string;
  bio: string;
  location?: string;
  email?: string;
  statusText?: string;
  isAvailableForWork?: boolean;
  avatarUrl?: string;
  tags: string[];
  socials: SocialLink[];
  stats: ProfileStat[];
  links: LinkItem[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}
