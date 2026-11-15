"use client";

import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { ExternalLink, Loader2, Plus, Eye, Pencil } from "lucide-react";
import LinkCard from "@/components/link/LinkCard";
import AddLinkModal from "@/components/link/AddLinkModal";
import DeleteConfirmModal from "@/components/link/DeleteConfirmModal";
import Toast from "@/components/common/Toast";
import MyStats from "@/components/profile/MyStats";
import { LinkItem } from "@/types";
import { useLinks } from "@/hooks/useLinks";
import { getProfile, updateProfile, ensureProfile } from "@/lib/profile";

export default function MyPage({ user }: { user: User }) {
  const { links, isLoading, isUpdating, canEdit, addLink, updateLink, removeLink, incrementClick } = useLinks(user.uid);
  const [preview, setPreview] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deletingLink, setDeletingLink] = useState<LinkItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const profile = (await getProfile(user.uid)) ?? (await ensureProfile(user));
      if (cancelled) return;
      setUsername(profile.username);
      setDisplayName(profile.displayName);
      setBio(profile.bio);
      setLoaded(true);
    })().catch((e) => {
      console.error(e);
      if (!cancelled) setError("프로필을 불러오지 못했어요.");
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving || !loaded) return;
    setError(null);
    setSaved(false);
    setSaving(true);
    try {
      await updateProfile(user.uid, username, {
        displayName: displayName.trim() || user.displayName || username,
        bio: bio.trim(),
      });
      setSaved(true);
      setPreview(true);
    } catch (err: any) {
      setError(err?.message || "저장에 실패했어요.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[#e5e8eb] bg-white px-3 py-2.5 text-sm text-[#191f28] focus:outline-none focus:ring-2 focus:ring-[#3182f6]";

  if (preview) {
    const name = displayName || username;
    const publicLinks = links.filter((l) => l.isPublic !== false);
    return (
      <div className="mx-auto w-full max-w-[520px] space-y-6 px-4 py-6">
        <div className="flex items-center justify-between rounded-2xl border border-[#e5e8eb] bg-white px-4 py-3 text-xs text-[#4e5968]">
          <span className="flex items-center gap-1.5 font-semibold">
            <Eye className="h-3.5 w-3.5" /> 다른 사람에게 보이는 미리보기
          </span>
          <button
            onClick={() => {
              setPreview(false);
              setSaved(false);
            }}
            className="inline-flex items-center gap-1 rounded-xl bg-[#f2f4f6] px-2.5 py-1.5 font-semibold hover:bg-[#e5e8eb]"
          >
            <Pencil className="h-3.5 w-3.5" /> 편집으로 돌아가기
          </button>
        </div>
        <section className="flex flex-col items-center text-center">
          {user.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.photoURL}
              alt={name}
              referrerPolicy="no-referrer"
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 text-3xl font-bold text-gray-600">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="mt-4 text-2xl font-bold">{name}</h1>
          <p className="text-sm text-gray-500">@{username}</p>
          {bio && (
            <p className="mt-3 whitespace-pre-line text-sm text-gray-700">{bio}</p>
          )}
        </section>
        <ul className="flex w-full flex-col gap-3">
          {publicLinks.length === 0 && (
            <li className="text-center text-sm text-gray-500">
              아직 등록된 링크가 없습니다.
            </li>
          )}
          {publicLinks.map((link) => (
            <li key={link.id}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 transition hover:bg-gray-50"
              >
                <span>
                  <span className="block font-medium">{link.title}</span>
                  {link.description && (
                    <span className="block text-sm text-gray-500">
                      {link.description}
                    </span>
                  )}
                </span>
                <ExternalLink className="h-4 w-4 shrink-0 text-gray-400" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[520px] space-y-6 px-4 py-6">
      <form
        onSubmit={handleSave}
        className="space-y-4 rounded-3xl border border-black/[0.04] bg-white p-5 shadow-xs"
      >
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#4e5968]">
            username (공유 URL)
          </label>
          <input
            value={username}
            readOnly
            disabled
            className={`${inputClass} bg-[#f2f4f6] text-[#8b95a1]`}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#4e5968]">표시 이름</label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={40}
            className={inputClass}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#4e5968]">소개글</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={200}
            rows={3}
            className={inputClass}
          />
        </div>

        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
        {saved && (
          <p className="text-xs font-medium text-[#3182f6]">저장되었어요.</p>
        )}

        <button
          type="submit"
          disabled={saving || !loaded}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#3182f6] py-2.5 text-sm font-semibold text-white hover:bg-[#1b64da] disabled:opacity-50"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          저장
        </button>
      </form>

      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-bold text-[#191f28]">내 링크</h2>
          <button
            onClick={() => setIsAddOpen(true)}
            disabled={isUpdating}
            className="flex items-center gap-1 text-xs font-semibold text-[#3182f6] hover:underline disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            <span>새 링크 추가</span>
          </button>
        </div>
        {isLoading && links.length === 0 ? (
          <p className="px-1 text-xs text-[#8b95a1]">불러오는 중...</p>
        ) : links.length === 0 ? (
          <p className="px-1 text-xs text-[#8b95a1]">등록된 링크가 없어요.</p>
        ) : (
          <div className="space-y-2">
            {links.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                canEdit={canEdit}
                onLinkClick={incrementClick}
                onShowToast={setToast}
                onUpdate={async (id, updates) => {
                  try {
                    await updateLink(id, updates);
                  } catch (e: any) {
                    setToast(e?.message || "링크 수정에 실패했습니다.");
                    throw e;
                  }
                }}
                onDeleteClick={setDeletingLink}
              />
            ))}
          </div>
        )}
      </section>

      <MyStats links={links} />

      <AddLinkModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={async (data) => {
          try {
            await addLink(data);
            setToast("새 링크가 등록되었어요 ✨");
          } catch (e: any) {
            setToast(e?.message || "링크 저장에 실패했어요.");
            throw e;
          }
        }}
      />
      <DeleteConfirmModal
        isOpen={!!deletingLink}
        linkTitle={deletingLink?.title || ""}
        onClose={() => setDeletingLink(null)}
        onConfirm={async () => {
          if (!deletingLink) return;
          try {
            await removeLink(deletingLink.id);
            setToast(`"${deletingLink.title}" 링크가 삭제되었어요 🗑️`);
            setDeletingLink(null);
          } catch (e: any) {
            setToast(e?.message || "링크 삭제에 실패했어요.");
            throw e;
          }
        }}
      />
      <Toast message={toast} onClose={() => setToast(null)} duration={2500} />
    </div>
  );
}

