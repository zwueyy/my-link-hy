"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import PublicLinkButton from "@/components/link/PublicLinkButton";
import { db } from "@/lib/firebase";
import type { LinkItem } from "@/types";

interface PublicProfile {
  username: string;
  displayName?: string;
  name?: string;
  bio?: string;
  avatarUrl?: string;
  role?: string;
}

interface Loaded {
  userId: string;
  profile: PublicProfile;
  links: LinkItem[];
}

// GitHub Pages는 정적 호스팅이라 /u/?username=xxx 형태로 클라이언트에서 조회한다.
async function load(username: string): Promise<Loaded | null> {
  const snap = await getDocs(
    query(collection(db, "users"), where("profile.username", "==", username), limit(1))
  );
  if (snap.empty) return null;
  const userDoc = snap.docs[0];
  const linksSnap = await getDocs(collection(db, "users", userDoc.id, "links"));
  const links = linksSnap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as LinkItem)
    .filter((l) => l.isPublic !== false)
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
  return {
    userId: userDoc.id,
    profile: (userDoc.data().profile ?? {}) as PublicProfile,
    links,
  };
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-gray-600">존재하지 않는 사용자입니다.</p>
      <Link href="/" className="rounded-lg bg-black px-5 py-2 text-white">
        홈으로 돌아가기
      </Link>
    </div>
  );
}

function UserProfile() {
  const username = useSearchParams().get("username") ?? "";
  const [state, setState] = useState<"loading" | "notfound" | "ready">("loading");
  const [data, setData] = useState<Loaded | null>(null);

  useEffect(() => {
    if (!username) {
      setState("notfound");
      return;
    }
    let cancelled = false;
    load(username)
      .then((r) => {
        if (cancelled) return;
        setData(r);
        setState(r ? "ready" : "notfound");
      })
      .catch(() => !cancelled && setState("notfound"));
    return () => {
      cancelled = true;
    };
  }, [username]);

  if (state === "loading") {
    return <p className="py-24 text-center text-sm text-gray-500">불러오는 중...</p>;
  }
  if (state === "notfound" || !data) return <NotFound />;

  const { userId, profile, links } = data;
  const displayName = profile.displayName ?? profile.name ?? profile.username;

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center px-4 py-12">
      <section className="flex flex-col items-center text-center">
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt={displayName}
            className="h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 text-3xl font-bold text-gray-600">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <h1 className="mt-4 text-2xl font-bold">{displayName}</h1>
        <p className="text-sm text-gray-500">@{profile.username}</p>
        {profile.role && <p className="mt-1 text-sm">{profile.role}</p>}
        {profile.bio && (
          <p className="mt-3 whitespace-pre-line text-sm text-gray-700">{profile.bio}</p>
        )}
      </section>

      <ul className="mt-8 flex w-full flex-col gap-3">
        {links.length === 0 && (
          <li className="text-center text-sm text-gray-500">아직 등록된 링크가 없습니다.</li>
        )}
        {links.map((link) => (
          <li key={link.id}>
            <PublicLinkButton
              userId={userId}
              linkId={link.id}
              url={link.url}
              title={link.title}
              description={link.description}
              initialClickCount={link.clickCount ?? 0}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function UserPage() {
  return (
    <Suspense fallback={null}>
      <UserProfile />
    </Suspense>
  );
}
