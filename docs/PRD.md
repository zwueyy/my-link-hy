# [PRD] 마이링크 (MyLink) - 링크트리 클론 서비스 제품 요구사항 정의서

> **문서 버전**: v1.7  
> **최종 수정일자**: 2026-09-29  
> **상태**: Approved (Tailwind CSS 스타일링 단일화 원칙 확정)

---

## 1. 개요 (Product Overview)

### 1.1 제품 정의
**마이링크(MyLink)**는 크리에이터, 프리랜서, 1인 기업이 자신의 다양한 SNS 채널, 포트폴리오, 작업 링크를 단 하나의 고유 URL로 통합하고, 방문자와의 소통(문의/리드 수집)을 극대화할 수 있는 **링크-인-바이오(Link-in-Bio) 및 미니 프로필 서비스**입니다.

### 1.2 기획 배경 및 목적
- SNS(인스타그램, 유튜브, X 등) 프로필에 등록 가능한 링크 개수의 한계 극복
- 단순 링크 나열을 넘어 **소셜 아이콘 연동**, **문의 폼(Lead Generation)**, **다양한 테마 커스터마이징**을 통해 개인 브랜딩 강화
- 메인 화면의 미니멀리즘 유지: 테마 스위처 등 복잡한 설정은 **'설정(Settings)' 모달**에 숨겨두고, 사용자가 원할 때 언제든 변경 가능하도록 설계
- 브라우저 **LocalStorage 영속성**을 통해 별도 백엔드 연결 전에도 모든 데이터(링크, 프로필, 테마, 문의 내역)가 안전하게 유지

---

## 2. 디자인 시스템 및 스타일링 원칙 (Styling & Design System Guidelines)

> [!IMPORTANT]
> **Tailwind CSS 단일 표준화 원칙 (No CSS Modules)**:
> 마이링크의 모든 페이지와 UI 컴포넌트의 스타일은 **CSS Modules(`*.module.css`)를 일체 사용하지 않고, 오직 Tailwind CSS 유틸리티 클래스로 100% 통일**하여 작성합니다.

### 2.1 Tailwind CSS + shadcn/ui 기반 컴포넌트 아키텍처
- **유틸리티 중심 (Utility-First)**: 모든 마진, 패딩, 폰트, 색상, 애니메이션, 반응형 분기점(`sm:`, `md:`)은 Tailwind 유틸리티 클래스로만 선언합니다.
- **클래스 병합 (`cn()`)**: 조건부 스타일이나 외부 `className` 주입 시 `clsx`와 `tailwind-merge` 기반의 `cn()` 헬퍼 함수를 표준으로 사용합니다.
- **컴포넌트 소유권**: `src/components/ui/`에 shadcn 프리미티브 컴포넌트를 직접 소유하며 일관된 Tailwind 클래스로 관리합니다.

### 2.2 토스 디자인 시스템 (TDS, `design.md`) 5대 원칙
1. **톤앤매너 & 카피라이팅 (Tone & Voice)**:
   - "은행에 다니는 유능하고 친절한 친구"
   - 존중과 친근함을 담은 **해요체**(`~해요`, `~있어요`, `~보내주세요`) 전면 적용 (딱딱한 `~다/-습니다` 금지)
2. **단일 Primary Action 원칙**:
   - 한 화면/뷰포트당 **토스 블루(`bg-[#3182f6]`) Primary CTA 버튼은 오직 1개**만 배치
   - 보조 액션은 부드러운 그레이 배경(`bg-[#f2f4f6]`) 또는 텍스트 버튼으로 계층화
3. **곡률 & 표면 계층 (Shapes & Surfaces)**:
   - 카드 컨테이너: `rounded-3xl` (24px)
   - 버튼/입력창/다이얼로그: `rounded-2xl` (16px)
   - 칩/뱃지: `rounded-full`
   - 배경: 부드러운 오프화이트 Canvas(`bg-[#f2f4f6]`), 카드 표면: `bg-white`
4. **마이크로 인터랙션 (Micro-interactions)**:
   - 모든 터치/클릭 가능한 요소에 토스 특유의 부드러운 프레스 효과(`toss-press`: `active:scale-[0.98] transition-transform`) 적용
5. **타이포그래피 & 고정폭 숫자 (Typography & Numbers)**:
   - Pretendard 폰트 스택 적용
   - 통계 지표, 클릭 수, 날짜는 `tabular-nums` 고정폭으로 가독성 극대화

---

## 3. 기본 초기 데이터 명세 (Initial Dummy Data Specification)

신규 방문자나 초기 실행 시 완성도 높은 경험을 위해 아래의 표준 더미 데이터를 기본값으로 사용합니다 (`src/constants/index.ts`).

### 3.1 기본 프로필 (`DEFAULT_PROFILE`)
- **이름**: 김민지 (`@minji.design`)
- **직군/역할**: UI/UX 디자이너 & 크리에이터
- **한 줄 바이오**: *"사용자의 일상을 편리하게 만드는 직관적인 인터페이스를 디자인해요. 브랜드 스토리텔링과 디자인 시스템, 그리고 생산성 도구에 관심이 많아요 ✨"*
- **위치 / 이메일**: 서울 강남구 / `minji.creator@gmail.com`
- **상태 메시지**: *"새로운 외주 프로젝트 및 커피챗 환영해요 💬"*
- **태그**: `UI/UX`, `Figma`, `DesignSystem`, `Framer`, `브랜딩`, `인스타툰`
- **소셜 링크**: Instagram, GitHub, LinkedIn, Brunch, Email
- **통계 요약 타일**: 총 링크 8개, 누적 클릭 3.8k, 오늘 방문 482, 받은 문의 24건

### 3.2 링크 카테고리 분류 (`DEFAULT_CATEGORIES`)
- `all` (전체)
- `portfolio` (포트폴리오)
- `channel` (소셜 & 채널)
- `project` (사이드 프로젝트)
- `contact` (문의 & 협업)

### 3.3 표준 8종 링크 카드 목록 (`INITIAL_LINKS`)

| ID | 링크 제목 | 카테고리 | 뱃지 | 클릭 수 | 설명 (해요체 톤) |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **1** | **2026 UI/UX 디자인 포트폴리오 (Behance)** | `portfolio` | `⭐️ 대표작` | 1,240 | 모바일 금융 앱 & 이커머스 디자인 케이스 스터디를 모아두었어요 |
| **2** | **인스타그램 디자인툰 & 일상 만화** | `channel` | `🔥 인기` | 890 | 디자이너의 우당탕탕 실무 생존기를 매주 화/금 연재하고 있어요 |
| **3** | **Figma UI Kit & 디자인 시스템 템플릿** | `project` | `무료 배포` | 654 | 오토레이아웃과 변수(Variables)가 완벽 적용된 무료 컴포넌트 팩이에요 |
| **4** | **브런치(Brunch) 디자인 인사이트 연재** | `channel` | - | 420 | 좋은 UX를 만드는 마이크로 인터랙션과 디자인 시스템 구축 회고록이에요 |
| **5** | **노션 템플릿: 프리랜서 프로젝트 & 정산 관리** | `project` | `추천` | 312 | 계약서 작성부터 세금계산서 발행까지 한 번에 정리하는 워크스페이스예요 |
| **6** | **YouTube: 5분 피그마 꿀팁 & 튜토리얼** | `channel` | - | 245 | 실무에서 바로 쓰는 피그마 플러그인과 컴포넌트 설계법을 공유해요 |
| **7** | **1:1 포트폴리오 피드백 & 커피챗 예약** | `contact` | `NEW` | 180 | 주니어 디자이너 취업/이직 포트폴리오 리뷰와 멘토링을 신청할 수 있어요 |
| **8** | **GitHub 프로필 & 오픈소스 저장소** | `portfolio` | - | 95 | Tailwind 및 React 기반 UI 컴포넌트 오픈소스 프로젝트를 확인해보세요 |

---

## 4. 타깃 사용자 & 핵심 페르소나 (Target Audience)

- **주요 타깃**: 크리에이터, 프리랜서(디자이너/개발자/작가), 1인 사업가 및 인플루언서
- **페르소나 예시**:
  - **김민지 (28세, 프리랜서 UI/UX 디자이너 & 인스타툰 작가)**: 인스타그램 프로필에 올릴 단 하나의 감각적인 링크가 필요함. 포트폴리오(Behance), 브런치 글, 외주 문의를 한곳에서 받고 싶어 함.
  - **이준호 (32세, 1인 테크 크리에이터)**: 유튜브, 깃허브, 뉴스레터 구독 링크를 공유하고 다크 모드/네온 감성의 테마를 적용하고 싶어 함.

---

## 5. 사용자 여정 및 핵심 시나리오 (User Scenarios)

### 5.1 [시나리오 1] 크리에이터(소유자)의 첫 세팅 및 테마 커스텀
1. 헤더의 **⚙️ [설정]** 아이콘을 클릭하여 shadcn 기반 설정 다이얼로그 오픈
2. 프로필 이미지 URL, 이름, 한 줄 소개, SNS 링크 입력
3. **8종 테마 프리뷰** 중 원하는 테마를 선택하고 저장 (LocalStorage 자동 동기화)
4. **[+ 링크 추가]**로 주요 작업물/채널 등록

### 5.2 [시나리오 2] 방문자의 프로필 탐색 및 링크 아웃링크 이동
1. 모바일/웹 환경에서 크리에이터의 프로필 접속
2. 소셜 아이콘 클릭으로 SNS 채널 이동
3. 링크 카드 터치 시 부드러운 마이크로 인터랙션과 함께 새 창 이동 및 **실시간 클릭 수(+1)** 증가

### 5.3 [시나리오 3] 방문자의 외주/협업 문의 전송 및 크리에이터의 확인
1. 방문자가 **[문의하기]** 버튼 클릭 후 shadcn 기반 문의 폼 작성 및 전송 (TDS 다크 토스트 알림 노출)
2. 크리에이터가 **⚙️ [설정] > [수신된 문의함]**에서 메시지 확인 및 읽음/답장 처리

---

## 6. 핵심 기능 요구사항 (Core Features)

### 6.1 설정 모달 (Settings Modal)
- 헤더의 ⚙️ 설정 아이콘 클릭 시 오픈 (shadcn `Dialog` 기반)
- **테마 선택기 (Theme Picker)**: 8종 테마 프리뷰 카드 선택 및 즉시 적용
- **프로필 설정**: 이름, 닉네임, 아바타 이미지 URL, 한 줄 바이오 수정
- **소셜 링크 관리**: GitHub, Instagram, YouTube, LinkedIn, X, Email 등 URL 수정
- **수신된 문의함**: 방문자 메시지 목록 확인, 읽음 상태 토글, 삭제

### 6.2 8종 테마 프리셋 라인업 (Themes Lineup)

| 테마 ID | 테마 이름 | 비주얼 특징 & 주요 Tailwind 스타일 |
| :--- | :--- | :--- |
| `toss` | **Toss Blue (기본)** | 토스 블루(`bg-[#3182f6]`), 오프화이트 배경(`bg-[#f2f4f6]`), 깔끔한 라운드 카드(`rounded-3xl bg-white`) |
| `dark-neon` | **Cyberpunk Dark** | 딥 다크 배경(`bg-slate-950`), 네온 시안 액센트(`text-cyan-400`, `border-cyan-500/30`) |
| `soft-pastel` | **Peach Pastel** | 복숭아빛 그라데이션(`bg-gradient-to-b from-rose-50 to-amber-50`), 소프트 무드 |
| `minimal-mono` | **Minimalist Mono** | 흑백 대비(`bg-neutral-50`, `border-neutral-200`, `text-black`), 간결한 타이포 |
| `neo-brutalism`| **Neo Brutalism** | 굵은 블랙 보더(`border-2 border-black`), 하드 섀도우(`shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`) |
| `forest-calm` | **Forest Calm** | 세이지 그린(`bg-emerald-950/20`), 자연 친화적인 오가닉 톤 |
| `sunset-glow` | **Sunset Gradient**| 석양 그라데이션(`from-orange-400 via-pink-500 to-purple-600`), 글래스모피즘(`backdrop-blur-md bg-white/70`) |
| `mac-retro` | **90s Mac OS Retro**| 클래식 Mac OS 창틀과 베이지 톤(`bg-[#e0ded7] border-2 border-black`) |

### 6.3 링크 카드 관리 (Link Management)
- 링크 카드 등록/수정/삭제: 제목, 설명, 이동 URL, 커스텀 아이콘 선택
- 링크 활성화/비활성화 (On/Off 토글)
- 실시간 클릭 수(Click Count) 집계 및 노출

### 6.4 문의/리드 수집 폼 (Contact Form & Lead Gen)
- 방문자용 직관적인 문의 모달 (이름, 이메일, 제목, 메시지)
- 전송 완료 시 실시간 토스트 알림 제공

---

## 7. 상태 관리 & 저장소 아키텍처 (State & Storage)

### 7.1 Zustand + `persist` 미들웨어 (LocalStorage)
- 모든 스토어 데이터는 `localStorage`에 자동 직렬화/역직렬화되어 브라우저에 영구 보존됩니다.

```
src/store/
├── useLinkStore.ts      # links (CRUD, clicks) -> LocalStorage ('mylink-links')
├── useProfileStore.ts   # profile, theme, socials -> LocalStorage ('mylink-profile')
├── useContactStore.ts   # messages -> LocalStorage ('mylink-contacts')
└── useToastStore.ts     # UI 토스트 알림 (비영속 메모리 상태)
```

---

## 8. 기술 스택 (Tech Stack)

- **Frontend Framework**: Next.js 15+ (App Router)
- **UI & Component System**: **shadcn/ui** + **TDS (`design.md`) Guidelines**
- **Styling Standard**: **100% Tailwind CSS (CSS Modules 일체 배제)**
- **Language**: TypeScript
- **State Management**: Zustand (+ `persist` middleware)
- **Icons**: Lucide React, Custom Brand SVGs
- **Deployment**: Vercel

---

## 9. 마일스톤 및 단계별 개발 로드맵 (Milestones)

### Phase 1: shadcn/ui 기반 TDS 컴포넌트 & 테마 & Zustand 완성 (현재)
- [x] shadcn/ui 환경 초기화 (`components.json`, `cn()` utils, core packages)
- [x] 표준 크리에이터 더미 데이터 8종 작성 (`src/constants/index.ts`)
- [x] 100% Tailwind CSS 기반 링크 목록 페이지 구현 (`src/app/page.tsx`)
- [ ] shadcn 기반 UI 프리미티브 컴포넌트 구축 (`Button`, `Dialog`, `Input`, `Card` 등)
- [ ] Zustand 스토어 구현 (`useLinkStore`, `useProfileStore`, `useContactStore`, `useToastStore` with `persist`)
- [ ] 8종 테마 토큰 정의 및 설정 모달 연동

### Phase 2: Supabase 풀스택 연동 및 다중 사용자 확장
- [ ] Supabase Auth (로그인/회원가입/세션)
- [ ] PostgreSQL 테이블 생성 및 Zustand Store와 비동기 연동
- [ ] 고유 URL 라우팅 (`/@username`)

### Phase 3: 분석 및 부가 기능
- [ ] 방문자 유입 경로 및 링크 클릭 애널리틱스 차트
- [ ] 간편 후원/결제 링크 위젯 (Toss/카카오페이)
