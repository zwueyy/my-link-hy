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
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  bio?: string;
  avatarUrl?: string;
  links: LinkItem[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}
