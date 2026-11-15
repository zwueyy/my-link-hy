"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LinkItem } from "@/types";

// Firestore Collection Path: users/anonymous/links
const COLLECTION_PATH = ["users", "anonymous", "links"] as const;

export function useLinks() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Firestore에서 링크 목록 불러오기 (경로: users/anonymous/links, createdAt 기준 최신순 정렬)
  const fetchLinks = useCallback(async (isInitial = false) => {
    if (isInitial) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setError(null);

    try {
      const linksCol = collection(
        db,
        COLLECTION_PATH[0],
        COLLECTION_PATH[1],
        COLLECTION_PATH[2]
      );
      const q = query(linksCol, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const items: LinkItem[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();

        // createdAt이 string, Timestamp, Date, number 등 다양한 형태일 경우 안전하게 ISO string으로 변환
        let createdAtStr = new Date().toISOString();
        if (typeof data.createdAt === "string") {
          createdAtStr = data.createdAt;
        } else if (
          data.createdAt?.toDate &&
          typeof data.createdAt.toDate === "function"
        ) {
          createdAtStr = data.createdAt.toDate().toISOString();
        } else if (data.createdAt instanceof Date) {
          createdAtStr = data.createdAt.toISOString();
        } else if (typeof data.createdAt === "number") {
          createdAtStr = new Date(data.createdAt).toISOString();
        }

        return {
          id: docSnap.id,
          title: data.title ?? "",
          url: data.url ?? "",
          description: data.description || undefined,
          category: data.category || "project",
          icon: data.icon || "globe",
          badge: data.badge || undefined,
          isPublic: data.isPublic ?? true,
          clickCount: data.clickCount ?? 0,
          featured: data.featured ?? false,
          createdAt: createdAtStr,
        };
      });

      setLinks(items);
    } catch (err: any) {
      console.error("Firestore 링크 불러오기 실패:", err);
      setError(err?.message || "링크를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // 페이지 로드 시 Firestore에서 링크 1회 로드
  useEffect(() => {
    fetchLinks(true);
  }, [fetchLinks]);

  // 새 링크 추가 시 Firestore에 저장 후 목록 갱신 (로딩/업데이트 상태 반영)
  const addLink = useCallback(
    async (
      newLink: Omit<LinkItem, "id" | "createdAt" | "clickCount"> & {
        clickCount?: number;
      }
    ): Promise<string> => {
      setIsUpdating(true);
      setError(null);

      try {
        const linksCol = collection(
          db,
          COLLECTION_PATH[0],
          COLLECTION_PATH[1],
          COLLECTION_PATH[2]
        );

        const docData: Record<string, any> = {
          title: newLink.title.trim(),
          url: newLink.url.trim(),
          category: newLink.category || "project",
          icon: newLink.icon || "globe",
          isPublic: newLink.isPublic ?? true,
          clickCount: newLink.clickCount ?? 0,
          createdAt: new Date().toISOString(),
        };

        if (newLink.description?.trim()) {
          docData.description = newLink.description.trim();
        }
        if (newLink.badge?.trim()) {
          docData.badge = newLink.badge.trim();
        }
        if (typeof newLink.featured === "boolean") {
          docData.featured = newLink.featured;
        }

        const docRef = await addDoc(linksCol, docData);

        // 링크 추가 후 최신 목록으로 즉시 갱신
        await fetchLinks(false);

        return docRef.id;
      } catch (err: any) {
        console.error("Firestore 링크 추가 실패:", err);
        setError(err?.message || "링크를 추가하는데 실패했습니다.");
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchLinks]
  );

  // 링크 삭제 시 Firestore에서 삭제 후 목록 갱신
  const removeLink = useCallback(
    async (id: string) => {
      setIsUpdating(true);
      setError(null);
      try {
        const docRef = doc(
          db,
          COLLECTION_PATH[0],
          COLLECTION_PATH[1],
          COLLECTION_PATH[2],
          id
        );
        await deleteDoc(docRef);
        await fetchLinks(false);
      } catch (err: any) {
        console.error("Firestore 링크 삭제 실패:", err);
        setError(err?.message || "링크를 삭제하는데 실패했습니다.");
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchLinks]
  );

  // 링크 수정 시 Firestore updateDoc 후 목록 갱신
  const updateLink = useCallback(
    async (
      id: string,
      updates: {
        title?: string;
        url?: string;
        description?: string;
        category?: string;
        badge?: string;
        featured?: boolean;
        isPublic?: boolean;
      }
    ) => {
      setIsUpdating(true);
      setError(null);

      try {
        const docRef = doc(
          db,
          COLLECTION_PATH[0],
          COLLECTION_PATH[1],
          COLLECTION_PATH[2],
          id
        );

        const dataToUpdate: Record<string, any> = {};
        if (updates.title !== undefined) {
          dataToUpdate.title = updates.title.trim();
        }
        if (updates.url !== undefined) {
          dataToUpdate.url = updates.url.trim();
        }
        if (updates.description !== undefined) {
          dataToUpdate.description = updates.description.trim();
        }
        if (updates.category !== undefined) {
          dataToUpdate.category = updates.category;
        }
        if (updates.badge !== undefined) {
          dataToUpdate.badge = updates.badge.trim();
        }
        if (typeof updates.featured === "boolean") {
          dataToUpdate.featured = updates.featured;
        }
        if (typeof updates.isPublic === "boolean") {
          dataToUpdate.isPublic = updates.isPublic;
        }

        await updateDoc(docRef, dataToUpdate);
        await fetchLinks(false);
      } catch (err: any) {
        console.error("Firestore 링크 수정 실패:", err);
        setError(err?.message || "링크를 수정하는데 실패했습니다.");
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchLinks]
  );

  // 링크 클릭 수 증가 (낙관적 UI 업데이트 + Firestore 비동기 업데이트)
  const incrementClick = useCallback(async (id: string) => {
    // UI에 즉시 반영
    setLinks((prev) =>
      prev.map((link) =>
        link.id === id
          ? { ...link, clickCount: (link.clickCount || 0) + 1 }
          : link
      )
    );

    try {
      const docRef = doc(
        db,
        COLLECTION_PATH[0],
        COLLECTION_PATH[1],
        COLLECTION_PATH[2],
        id
      );
      await updateDoc(docRef, {
        clickCount: increment(1),
      });
    } catch (err) {
      console.error("Firestore 클릭 수 증가 실패:", err);
    }
  }, []);

  return {
    links,
    isLoading,
    isUpdating,
    isRefreshing,
    isPending: isLoading || isUpdating || isRefreshing,
    error,
    refetch: () => fetchLinks(false),
    fetchLinks,
    addLink,
    updateLink,
    removeLink,
    incrementClick,
  };
}
