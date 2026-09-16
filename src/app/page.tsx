import { INITIAL_LINKS } from "@/constants";

export default function ProfilePage() {
  const profile = {
    name: "홍길동",
    role: "Frontend & Product Engineer",
    bio: "문제를 기술로 풀고 사용자 중심의 가치를 만드는 개발자입니다.\n새로운 기술을 빠르게 습득하며, 아이디어를 완성도 높은 프로덕트로 구현하는 과정을 즐깁니다.",
    tags: ["#Frontend", "#Next.js", "#TypeScript", "#TailwindCSS", "#UserExperience"],
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* 프로필 이미지 / 아바타 */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-3xl font-bold text-white shadow-lg shadow-blue-500/20 ring-4 ring-white dark:ring-zinc-900">
          {profile.name[0]}
        </div>

        {/* 이름 & 직무 */}
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
          {profile.name}
        </h1>
        <p className="mt-1 text-sm font-medium text-blue-600 dark:text-blue-400">
          {profile.role}
        </p>

        {/* 소개글 */}
        <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
          {profile.bio}
        </p>

        {/* 관심사 태그 */}
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {profile.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 구분선 */}
        <div className="my-8 h-px w-full bg-zinc-200 dark:bg-zinc-800" />

        {/* 링크 목록 */}
        <div className="space-y-3">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            주요 링크
          </h2>
          {INITIAL_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-400"
            >
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
                  {link.title}
                </h3>
                {link.description && (
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    {link.description}
                  </p>
                )}
              </div>
              <span className="text-sm text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
