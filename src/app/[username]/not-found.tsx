import Link from "next/link";

export default function UserNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-gray-600">존재하지 않는 사용자입니다.</p>
      <Link href="/" className="rounded-lg bg-black px-5 py-2 text-white">
        홈으로 돌아가기
      </Link>
    </main>
  );
}
