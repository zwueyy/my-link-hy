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
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LinkItem } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { INITIAL_LINKS } from "@/constants";

export function useLinks(customUid?: string) {
  const { user, loading: authLoading } = useAuth();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 현재 활성화된 Firestore 대상 UID:
  // 1) 파라미터로 전달된 customUid가 있는 경우 해당 UID 조회
  // 2) 로그인한 사용자일 경우 본인의 user.uid
  // 3) 비로그인 방문자일 경우 'anonymous'
  const activeUid = customUid || user?.uid || "anonymous";

  // 수정 권한: 본인 계정이거나 데모(익명 체험) 모드일 때 true, 타인의 프로필 페이지 방문 시에는 false
  const canEdit = Boolean(
    (user && (!customUid || customUid === user.uid)) ||
    activeUid === "anonymous"
  );

  // Firestore에서 링크 목록 불러오기 (경로: users/{activeUid}/links)
  const fetchLinks = useCallback(
    async (isInitial = false) => {
      if (isInitial) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);

      try {
        const linksCol = collection(db, "users", activeUid, "links");
        const q = query(linksCol, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
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
        } else {
          // 비로그인 방문자 모드에서 Firestore 컬렉션이 비어있으면 초기 데모 링크 fallback 제공 (조회-누구나)
          if (activeUid === "anonymous") {
            setLinks(INITIAL_LINKS);
          } else {
            setLinks([]);
          }
        }
      } catch (err: any) {
        console.error("Firestore 링크 불러오기 실패:", err);
        setError(err?.message || "링크를 불러오는데 실패했습니다.");
        if (activeUid === "anonymous") {
          setLinks(INITIAL_LINKS);
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [activeUid]
  );

  // 인증 상태 확인 완료 및 activeUid 변경 시 목록 불러오기
  useEffect(() => {
    if (authLoading) return;
    fetchLinks(true);
  }, [authLoading, activeUid, fetchLinks]);

  // 새 링크 추가 (권한: 로그인 필수, 경로: users/{user.uid}/links)
  const addLink = useCallback(
    async (
      newLink: Omit<LinkItem, "id" | "createdAt" | "clickCount"> & {
        clickCount?: number;
      }
    ): Promise<string> => {
      if (!user) {
        if (activeUid === "anonymous" || customUid === "anonymous") {
          const mockId = `demo-${Date.now()}`;
          const newDoc: LinkItem = {
            id: mockId,
            title: newLink.title.trim(),
            url: newLink.url.trim(),
            description: newLink.description?.trim(),
            category: newLink.category || "project",
            icon: newLink.icon || "globe",
            badge: newLink.badge?.trim(),
            isPublic: newLink.isPublic ?? true,
            clickCount: newLink.clickCount ?? 0,
            featured: newLink.featured ?? false,
            createdAt: new Date().toISOString(),
          };
          setLinks((prev) => [newDoc, ...prev]);
          return mockId;
        }
        throw new Error("링크를 추가하려면 먼저 로그인이 필요합니다.");
      }

      setIsUpdating(true);
      setError(null);

      try {
        const linksCol = collection(db, "users", user.uid, "links");

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
    [user, fetchLinks]
  );

  // 링크 삭제 (권한: 로그인 필수, 경로: users/{user.uid}/links/{id})
  const removeLink = useCallback(
    async (id: string) => {
      if (!user) {
        if (activeUid === "anonymous" || customUid === "anonymous") {
          setLinks((prev) => prev.filter((item) => item.id !== id));
          return;
        }
        throw new Error("링크를 삭제하려면 먼저 로그인이 필요합니다.");
      }

      setIsUpdating(true);
      setError(null);
      try {
        const docRef = doc(db, "users", user.uid, "links", id);
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
    [user, fetchLinks]
  );

  // 링크 수정 (권한: 로그인 필수, 경로: users/{user.uid}/links/{id})
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
      if (!user) {
        if (activeUid === "anonymous" || customUid === "anonymous") {
          setLinks((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, ...updates } : item
            )
          );
          return;
        }
        throw new Error("링크를 수정하려면 먼저 로그인이 필요합니다.");
      }

      setIsUpdating(true);
      setError(null);

      try {
        const docRef = doc(db, "users", user.uid, "links", id);

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
    [user, fetchLinks]
  );

  // 초기 샘플 링크 8종 등록 헬퍼
  const importSampleLinks = useCallback(async () => {
    if (!user) {
      throw new Error("로그인 후 샘플 링크를 가져올 수 있습니다.");
    }

    setIsUpdating(true);
    try {
      const batch = writeBatch(db);
      for (const sample of INITIAL_LINKS) {
        const newDocRef = doc(collection(db, "users", user.uid, "links"));
        const { id, ...rest } = sample;
        batch.set(newDocRef, {
          ...rest,
          createdAt: new Date().toISOString(),
        });
      }
      await batch.commit();
      await fetchLinks(false);
    } catch (err: any) {
      console.error("샘플 링크 등록 실패:", err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [user, fetchLinks]);

  // 링크 클릭 수 증가: 로그인 불필요(방문자 포함), Firestore increment()로 서버에서 원자적 처리(동시 클릭 안전)
  const incrementClick = useCallback(
    async (id: string) => {
      const patch = (delta: number) =>
        setLinks((prev) =>
          prev.map((link) =>
            link.id === id
              ? { ...link, clickCount: Math.max(0, (link.clickCount || 0) + delta) }
              : link
          )
        );

      patch(1); // 낙관적 UI 업데이트
      try {
        const docRef = doc(db, "users", activeUid, "links", id);
        await updateDoc(docRef, { clickCount: increment(1) });
      } catch (err) {
        patch(-1); // 실패 시 롤백
        console.error("클릭 카운트 저장 실패:", err);
      }
    },
    [activeUid]
  );

  return {
    links,
    isLoading: isLoading || authLoading,
    isUpdating,
    isRefreshing,
    isPending: isLoading || authLoading || isUpdating || isRefreshing,
    canEdit,
    activeUid,
    user,
    error,
    refetch: () => fetchLinks(false),
    fetchLinks,
    addLink,
    updateLink,
    removeLink,
    incrementClick,
    importSampleLinks,
  };
}
