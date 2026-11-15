import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

type PageProps = { params: Promise<{ username: string }> };

// 2. profile.username 이 일치하는 사용자 검색
async function findUserByUsername(username: string) {
  const snap = await getDocs(
    query(
      collection(db, "users"),
      where("profile.username", "==", username),
      limit(1)
    )
  );
  if (snap.empty) return null;
  const userDoc = snap.docs[0];
  return {
    userId: userDoc.id,
    profile: (userDoc.data().profile ?? {}) as PublicProfile,
  };
}

// 3. users/{userId}/links 조회
async function fetchLinks(userId: string): Promise<LinkItem[]> {
  const snap = await getDocs(collection(db, "users", userId, "links"));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as LinkItem)
    .filter((l) => l.isPublic !== false)
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  return { title: `@${decodeURIComponent(username)}` };
}

export default async function UserPage({ params }: PageProps) {
  // 1. URL에서 username 추출
  const { username: raw } = await params;
  const username = decodeURIComponent(raw);

  const found = await findUserByUsername(username);
  // 5. 못 찾으면 404 (src/app/[username]/not-found.tsx)
  if (!found) notFound();

  const { userId, profile } = found;
  const links = await fetchLinks(userId);
  const displayName = profile.displayName ?? profile.name ?? profile.username;

  // 4. 프로필 + 링크 리스트 표시
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center px-4 py-12">
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
          <p className="mt-3 whitespace-pre-line text-sm text-gray-700">
            {profile.bio}
          </p>
        )}
      </section>

      <ul className="mt-8 flex w-full flex-col gap-3">
        {links.length === 0 && (
          <li className="text-center text-sm text-gray-500">
            아직 등록된 링크가 없습니다.
          </li>
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
    </main>
  );
}
