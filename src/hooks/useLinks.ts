import { useState } from "react";
import { LinkItem } from "@/types";
import { INITIAL_LINKS } from "@/constants";

export function useLinks() {
  const [links, setLinks] = useState<LinkItem[]>(INITIAL_LINKS);

  const addLink = (newLink: Omit<LinkItem, "id" | "createdAt">) => {
    const link: LinkItem = {
      ...newLink,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      clickCount: 0,
    };
    setLinks((prev) => [link, ...prev]);
  };

  const removeLink = (id: string) => {
    setLinks((prev) => prev.filter((link) => link.id !== id));
  };

  return {
    links,
    addLink,
    removeLink,
  };
}
