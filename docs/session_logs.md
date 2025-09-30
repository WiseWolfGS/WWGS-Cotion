## 2025년 9월 25일 디버깅 세션 요약

### 1. 초기 목표 설정: "페이지 띄우기"
확장성을 위해 FSD 기반으로 설계된 복잡한 디렉터리 구조 위에서, 첫 페이지를 성공적으로 렌더링하는 것을 목표로 삼았습니다.

### 2. WASM 도입을 위한 아키텍처 설계 및 구축
- **설계**: Rust 소스 코드는 루트의 `wasm-core`에 격리하고, 실제 앱과의 연결은 `src/services/wasm`이라는 '브릿지'를 통해 추상화하기로 결정했습니다.
- **구축**: `cargo`로 Rust 프로젝트를 생성하고, `wasm-pack`으로 빌드할 수 있도록 `Cargo.toml`과 `package.json`의 빌드 스크립트를 연동했습니다.

### 3. 1차 디버깅: 서버 실행 시 '멈춤(Hang)' 현상 해결
- **가설 1**: WASM의 비동기 초기화(`await`)가 문제일 것이다.
- **시도 1**: `main.ts`에서 WASM 초기화 코드를 제거 → 오히려 Vite 메시지조차 뜨지 않는 더 심각한 멈춤 현상 발생.
- **교훈 및 수정**: 사용자의 정확한 지적에 따라, 성급한 결론을 버리고 코드 변경 자체를 재검토. `main.ts`를 Vue의 가장 표준적인 코드로 재작성하자 서버가 정상적으로 구동되기 시작했습니다.
- **핵심 배움**: 문제 해결 시 성급한 결론은 금물. 가장 최근의 변경점부터 차근차근, 그리고 정확하게 되짚어보는 것이 중요합니다.

### 4. 2차 디버깅: 404 Not Found 오류 해결
- **문제**: 서버는 실행되나, 브라우저가 `main.ts` 파일을 찾지 못함.
- **원인**: `index.html`의 `<script>` 태그가 잘못된 경로 (`/src/main.ts`)를 가리키고 있었음.
- **해결**: 실제 파일 위치인 `/src/app/main.ts`로 경로를 수정.
- **핵심 배움**: `index.html`은 브라우저와 개발 서버를 잇는 첫 관문이므로, 진입점 경로 설정이 매우 중요합니다.

### 5. 3차 디버깅: 500 Internal Server Error 해결 (연속 2회)
- **문제 1**: `App.vue`가 `./components/HelloWorld.vue`를 찾지 못함.
- **원인 1**: FSD 구조로 리팩토링되면서 컴포넌트의 실제 위치와 `import` 경로가 달라짐.
- **해결 1**: 단순히 경로를 수정하는 대신, 올바른 아키텍처를 적용. `App.vue`를 라우터가 페이지를 그릴 `<RouterView />` 껍데기로 만들고, `router/index.ts`에서 페이지를 설정하도록 수정.
- **문제 2**: `vue-router`를 찾지 못함.
- **원인 2**: 라우터 관련 코드는 추가했지만, 정작 `vue-router` 패키지를 설치하지 않았음.
- **해결 2**: `npm install vue-router`로 패키지 설치.
- **핵심 배움**: "Failed to resolve import" 오류는 대부분 '경로 문제' 또는 '패키지 미설치'가 원인입니다.

### 6. 최종 정리 및 환경 점검
- **경고 수정**: `HelloWorld.vue`에 불필요한 `props`를 제거하여 Vue 경고 메시지를 해결했습니다.
- **.gitignore 검토**: GitHub에 올리기 전, WASM 빌드 결과물(`target`, `pkg`)과 Vite 캐시(`.vite`)를 누락 없이 추가하고, 버전 관리에 포함되어야 할 `docs` 폴더를 제외하도록 수정했습니다.

---

## 2025년 9월 26일 세션 요약

### 1. 개발 환경 설정 및 디버깅
- `docs/treeWithoutNodeandWASM.txt` 파일의 UTF-16 LE 인코딩 문제 해결.
- `package.json` 및 `developStack.md`를 기반으로 누락된 프론트엔드 의존성(`pinia`, `tailwindcss`, `postcss`, `autoprefixer`) 설치.
- Tailwind CSS v4 설정 과정에서 발생한 문제 해결:
  - `npx tailwindcss init -p` 명령어 실패.
  - Tailwind CSS v4는 `@tailwindcss/vite` 플러그인과 `postcss.config.js`의 `@tailwindcss/postcss` 플러그인 사용이 필요함을 확인.
  - `vite.config.ts` 수정, `tailwind.config.ts` 및 `postcss.config.js` 파일 생성.
  - 최종적으로 `src/app/styles/index.css`에 `@import 'tailwindcss';`를 추가하여 Tailwind CSS 스타일 적용 문제 해결.

### 2. 컴포넌트 개발 및 FSD 적용
- `src/shared/ui/AppButton.vue` (범용 버튼 컴포넌트) 생성.
- `src/widgets/AppNavigation.vue`를 `src/widgets/AppSidebar.vue`로 이름 변경 및 수직형 사이드바 레이아웃으로 리팩토링.
- `src/widgets/AppHeader.vue`를 `AppButton.vue`를 사용하도록 업데이트하고, Notion과 유사한 고정 헤더 레이아웃으로 변경.
- `src/widgets/AppFooter.vue`를 고정 푸터로 변경.
- `src/pages/HelloWorld.vue`를 `src/pages/HomePage.vue`로 이름 변경 및 `AppSidebar`, `AppHeader`, `AppFooter`를 통합하여 Notion과 유사한 메인 레이아웃(사이드바 + 메인 콘텐츠 영역) 구현.
- `shared/ui/AppButton.vue`를 `widgets` 컴포넌트에서 성공적으로 사용하여 FSD 원칙 시연.

### 3. 사용자 기여
- `docs/treeWithoutNodeandWASM.txt` 파일의 인코딩 문제 원인 파악.
- Tailwind CSS v4의 올바른 설정 방식(Vite 플러그인 및 `@import 'tailwindcss';`) 발견 및 적용.
- `CotionLogo.svg` 추가 및 User Avatar 이미지 경로 수정.
- `HomePage.vue`, `AppHeader.vue`, `AppFooter.vue`, `AppSidebar.vue` 파일에 Notion과 유사한 레이아웃을 위한 중요한 변경 사항 적용.

---

## 2025년 9월 28일 세션 요약

### 1. 사용자 인증 기능 구현 (End-to-End)
- Firebase SDK를 연동하고, Google 계정을 사용한 `signInWithPopup` 방식의 로그인 및 로그아웃 기능을 `AuthService`에 구현.
- `onAuthStateChanged` 리스너를 활용하여 실시간으로 인증 상태를 감지하고, Pinia(`authStore`) 상태를 업데이트하는 매커니즘 구축.
- `AppHeader`에 로그인 상태에 따라 동적으로 UI(로그인/로그아웃 버튼, 사용자 정보)가 변경되도록 연동 및 반응성 버그 수정.

### 2. 페이지 관리 기능 기반 구현
- Firestore 데이터베이스를 연동하고, `PageRepository`에 페이지 목록 조회(`getPagesByAuthor`) 및 페이지 생성(`createPage`) 기능 구현.
- `pageStore`를 생성하여 페이지 목록 상태를 관리하고, 로그인 시 자동으로 페이지 목록을 불러오도록 구현.
- `AppSidebar`를 수정하여 정적인 목록을 동적으로 렌더링하도록 변경.
- 'New Page' 버튼에 `prompt`를 이용한 새 페이지 생성 기능 연동.

### 3. `AppButton` 컴포넌트 리팩토링 및 표준화
- 기존 `text` 속성 방식에서 `<slot>`을 사용하도록 `AppButton`을 수정하여 아이콘 등 다양한 컨텐츠를 받을 수 있도록 개선.
- `size` 속성('default', 'icon')을 추가하여 버튼 크기를 유연하게 조절할 수 있도록 개선.
- 프로젝트 내 모든 버튼(`Search`, `Logout`, `Notifications` 등)을 개선된 `AppButton`으로 통일하여 일관성 확보.

### 4. 디버깅 및 문제 해결
- **Firestore 권한 오류:** 로그인 직후 페이지 조회 시 발생한 `Missing or insufficient permissions` 오류를 보안 규칙 수정을 통해 해결.
- **UI 반응성 오류:** 로그인 후 헤더가 업데이트되지 않는 문제를 `storeToRefs`를 사용하여 Pinia 스토어의 반응성을 유지하는 방식으로 해결.

### 5. 아키텍처에 대한 논의
- **현황:** 현재는 빠른 프로토타이핑을 위해 인증(Authentication)과 데이터베이스(Firestore) 모두 Firebase를 사용.
- **전략:** 이는 프론트엔드 핵심 기능 구현에 집중하기 위한 전략적 선택. 추후 프로젝트가 고도화되면, 최종 목표 기술 스택인 `NestJS` 백엔드 서버와 `PostgreSQL` 데이터베이스로 전환할 계획.
- **전환 계획:** 현재의 서비스 분리 아키텍처(`services` 폴더) 덕분에, 미래에 데이터 소스를 교체(Firestore 호출 → NestJS API 호출)하는 작업이 용이함.

---

## 2025년 9월 30일 세션 요약

### 1. UI/UX 개선 계획 수립
- 기존 기능 구현에서 방향을 전환하여, Notion과 유사한 UI/UX를 구현하는 것을 목표로 설정.
- **1단계: 레이아웃/색상 개편**, **2단계: 다크 모드**, **3단계: 사이드바 너비 조절**, **4단계: 반응형 디자인**의 순차적 로드맵 수립.

### 2. 레이아웃 리팩토링 및 디버깅
- **작업:** `AppHeader`와 `AppSidebar`의 역할을 Notion에 가깝게 재정의. 사용자 정보 및 주요 액션을 사이드바로 옮기고, 헤더는 페이지 경로(Breadcrumb) 역할로 변경. 전체적인 색상 톤을 밝게 통일.
- **문제 발생 및 해결:**
  - **1차 문제:** `h-full`과 `position: fixed`의 오용으로 저장 버튼이 보이지 않는 레이아웃 붕괴 현상 발생.
  - **2차 문제:** 1차 문제 해결 과정에서 `position: fixed`와 `overflow` 속성의 상호작용으로 인해 버튼이 스크롤 영역 밖으로 밀려나는 스태킹 컨텍스트(Stacking Context) 문제 발생.
  - **최종 해결:** `position: fixed`를 모두 제거하고, `HomePage.vue`를 중심으로 전체 레이아웃을 Flexbox로 재구성하여 안정성을 확보. 저장 버튼을 `AppHeader`로 이동시키고, Pinia 스토어를 이용해 컴포넌트 간 통신을 구현하여 문제를 해결.

### 3. 다크 모드 구현 및 디버깅
- **작업:** `tailwind.config.ts`에 `darkMode: 'class'` 설정, 테마 상태를 관리하는 `useTheme` 컴포저블 생성, 사이드바에 토글 버튼 추가.
- **문제 발생 및 해결:**
  - **현상:** 모든 로직과 설정이 올바른 것으로 보였으나 다크 모드 스타일이 전혀 적용되지 않음.
  - **디버깅 과정:** 설정 파일 재확인, CSS 강제 리빌드, 전역 CSS 충돌 확인 등 여러 시도를 하였으나 실패.
  - **최종 원인 (사용자 발견):** Tailwind CSS v4에서 `darkMode: 'class'` 전략 사용 시, CSS 파일에 `@custom-variant dark (&:where(.dark, .dark *));` 선언이 필수적이었으나 누락됨.
  - **최종 해결:** 사용자가 공식 문서를 통해 직접 원인을 파악하고, 해당 선언을 `index.css`에 추가하여 문제를 해결.

### 4. 사용자 기여
- 끈질긴 디버깅 과정에서 여러 번의 잘못된 수정을 정확히 바로잡음.
- 최종적으로 공식 문서를 통해 다크 모드 미작동의 핵심 원인(`@custom-variant` 누락)을 직접 발견하고 해결책을 제시함.
