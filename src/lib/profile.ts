import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "@/lib/firebase";

export interface ProfileData {
  username: string;
  displayName: string;
  bio: string;
}

// 프로필은 users/{userId} 문서의 `profile` 필드에 저장 (공개 페이지 /[username] 이 이 필드를 조회)
export async function getProfile(userId: string): Promise<ProfileData | null> {
  const snap = await getDoc(doc(db, "users", userId));
  const p = snap.exists() ? snap.data().profile : null;
  if (!p || !p.username) return null;
  return {
    username: p.username,
    displayName: p.displayName ?? "",
    bio: p.bio ?? "",
  };
}

// 다른 사용자가 해당 username 을 이미 쓰고 있는지 확인
export async function isUsernameTaken(
  username: string,
  currentUserId: string
): Promise<boolean> {
  const snap = await getDocs(
    query(
      collection(db, "users"),
      where("profile.username", "==", username),
      limit(2)
    )
  );
  return snap.docs.some((d) => d.id !== currentUserId);
}

function baseUsername(email: string | null): string {
  const prefix = (email ?? "").split("@")[0].toLowerCase();
  return prefix.replace(/[^a-z0-9_.-]/g, "") || "user";
}

// 로그인 시 프로필이 없으면 자동 생성:
// username = 이메일 앞부분(중복이면 숫자 접미사), displayName = 로그인 이름
export async function ensureProfile(user: User): Promise<ProfileData> {
  const existing = await getProfile(user.uid);
  if (existing) return existing;

  const base = baseUsername(user.email);
  let username = base;
  for (let i = 1; await isUsernameTaken(username, user.uid); i++) {
    username = `${base}${i}`;
  }

  const profile: ProfileData = {
    username,
    displayName: user.displayName || base,
    bio: "",
  };
  // username 은 저장 직전 중복 체크 후 최초 1회만 기록
  await setDoc(doc(db, "users", user.uid), { profile }, { merge: true });
  return profile;
}

// displayName / bio 만 수정 (username 은 변경 불가)
export async function updateProfile(
  userId: string,
  username: string,
  updates: { displayName: string; bio: string }
): Promise<void> {
  if (await isUsernameTaken(username, userId)) {
    throw new Error("이미 사용 중인 username입니다.");
  }
  await setDoc(
    doc(db, "users", userId),
    { profile: { username, ...updates } },
    { merge: true }
  );
}
