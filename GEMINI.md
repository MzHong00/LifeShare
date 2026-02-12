# LifeShare Project Identity & Rules

이 파일은 LifeShare 프로젝트의 핵심 가이드라인과 개발 규칙을 담고 있습니다. Antigravity(AI 코딩 어시스턴트)는 모든 개발 과정에서 이 문서를 최우선으로 참조합니다.

---

## 🚀 프로젝트 개요

- **이름**: LifeShare
- **목표**: 파트너(연인, 가족 등)와 일상, 일정, 추억을 공유하는 프리미엄 커플 앱
- **핵심 디자인 키워드**: Toss-style, Minimalist, Premium, Blue (#3182F6)
- **AI Assist Config**: `.gemini/config.yml`, `.gemini/styleguide.md` (Gemini Code Assist용 설정)

---

## 🛠 테크 스택

- **Core**: React Native (TypeScript)
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **State Management**: Zustand (App logic, Autolinking)
- **Icons**: Lucide-react-native
- **Backend/Services**: Firebase (Analytics, App Distribution, Auth)
- **Styling**: Vanilla StyleSheet (Predefined `COLORS` tokens)

---

## 📂 주요 디렉토리 구조

- `src/App.tsx`: 앱 메인 진입점 컴포넌트
- `src/api`: API 통신 로직 (index, queries, mutations 순으로 구성)
- `src/assets`: 이미지, 아이콘, 폰트 등 정적 리소스 관리
- `src/businesses`: 특정 비즈니스 로직의 훅(hook.ts)과 함수(service.ts)로 구성
- `src/components`: UI 컴포넌트
- `src/constants`: `theme.ts` (컬러, 폰트), `navigation.ts` 등 앱 전역 상수
- `src/hooks`: 재사용 가능한 공통 커스텀 훅
- `src/lib`: Axios, Firebase 등 외부 라이브러리 설정 및 인스턴스
- `src/navigations`: `AppNavigator` 및 단위별 네비게이터 체계
- `src/screens`: 각 페이지 스크린 컴포넌트
- `src/stores`: Zustand를 활용한 전역 상태 관리 (Auth, Workspace 등)
- `src/types`: 전역 TypeScript 인터페이스 및 타입 정의
- `src/utils`: 포맷팅, 유효성 검사 등 공통 유틸리티 함수

---

## 🎨 코딩 및 디자인 규칙

### 1. 디자인 스타일 (The LifeShare Way)

- **Primary Color**: `#3182F6`를 메인 포인트로 사용.
- **Background**: 깨끗한 화이트 배경과 아주 연한 그레이/블루 계열의 레이어 구분.
- **Typography**: 기본 폰트 두께와 크기를 명확히 구분하여 가독성 확보.
- **Interaction**: 버튼 클릭 시 미세한 피드백, 부드러운 화면 전환 강조.

### 2. 코드 구조 및 작성 규칙

- **Functional Components**: 모든 컴포넌트는 화살표 함수(`const App = () => { ... }`) 형식을 사용.
- **Modular Navigation**: `AppNavigator`가 너무 무거워지지 않도록 단위별(Auth, Main) 네비게이터를 분리하여 관리.
- **Consistency**:
  - 색상은 항상 `COLORS` 객체(`@/constants/theme`)에서 가져와 사용하며, 하드코딩된 Hex 코드는 절대 사용하지 않는다. 자주 쓰이는 색상이 없을 경우 `theme.ts`에 토큰을 먼저 추가한다.
  - 내비게이션 등록 및 이동 시에는 반드시 `NAV_ROUTES` 상수(`@/constants/navigation`)를 사용한다.
  - import 시에는 `@/` 접두사를 사용하는 절대 경로를 우선적으로 사용 (예: `@/components/Button`).
  - **Date Handling**: `dayjs` 또는 `new Date()`를 컴포넌트 내부에서 직접 사용하지 않고, 반드시 `@/utils/date`에 정의된 공통 유틸리티 함수를 사용한다.
  - **Import Structure & Order**:
    1. 외부 라이브러리 (`react`, `react-native`, 그 외 npm 패키지)
    2. (한 줄 개행)
    3. 내부 파일 (@/ 접두사) - 아래 순서 권장:
       - `@/types` (데이터 타입)
       - `@/lib` (라이브러리 설정)
       - `@/constants` (테마 및 설정)
       - `@/api` (데이터 처리 index.ts, queries.ts, mutations.ts 순)
       - `@/stores` (데이터 및 상태)
       - `@/utils` (공통 유틸리티)
       - `@/hooks` (공통 커스텀 훅)
       - `@/businesses` (비즈니스 로직에 대한 훅스와 함수)
       - `@/components` (공통 컴포넌트)
       - `@/screens` (페이지 스크린)
       - `@/navigations` (네비게이터)
    4. (한 줄 개행)
    5. 본문 레벨 코드 작성
  - 컴포넌트 내부 스타일은 파일 하단 `StyleSheet.create`로 분리.
- **Clean Code**:
  - 코드를 읽기 쉽고 유지보수하기 쉬운 구조를 가지도록 작성한다.
  - 파일 하나당 하나의 책임만 가질 수 있도록 리팩토링 권장.
  - 타입 정의(`interface`, `type`)는 최대한 명확하게 기술.
  - 도메인 모델이나 공유 타입은 반드시 `@/types` 폴더에서 관리하고 재사용한다.
  - 컴포넌트 내부에 또 다른 컴포넌트를 정의(Nested Component)하지 않는다. 필요 시 별도의 파일로 분리하거나, 파일 내 최상위 수준(Top-level)에서 정의한다.
  - TypeScript의 `any` 타입 사용을 지양하고, 최대한 명확한 타입을 정의하여 사용한다.
  - TypeScript의 타입을 가져올 때는 `import type` 키워드를 사용한다.
  - **Modern Header Management**:
    - 모든 스크린은 상단 여백 보정 및 디자인 일관성을 위해 `AppSafeAreaView`를 필수적으로 사용한다.
    - 내비게이션 헤더 설정(Title, 버튼 등)은 `AppNavigator`가 아닌 각 스크린의 `AppSafeAreaView` 프롭을 통해 선언적으로 관리한다.
    - 성능 최적화와 코드 가독성을 위해 헤더 버튼 등은 반드시 `useCallback`을 사용하여 별도의 렌더링 함수(예: `renderHeaderRight`)로 정의하여 전달한다.
    - `AppSafeAreaView`의 `style={{ backgroundColor: ... }}` 값은 스크린 본문뿐만 아니라 시스템 헤더 및 스택 카드의 배경색까지 자동으로 동기화한다.
    - 주요 프롭: `title`, `headerShown`, `headerRight`, `headerLeft`.
  - **Styles & Performance**:
    - 모든 스타일은 인라인 작성을 지양하고, 파일 하단의 `StyleSheet.create`를 통해 정의한다. 이는 린트 경고를 방지하고 디자인 토큰(`COLORS`, `SPACING`) 활용의 일관성을 보장한다.
    - 조건부 스타일이 필요한 경우에도 `StyleSheet`에 정의된 여러 스타일을 배열로 조합하여 사용한다.
  - **Premium Zustand Pattern**:
    1. **상태(State)**와 **액션(Actions)**을 분리한다. 액션은 스토어 외부의 독립된 객체(`xxxActions`)로 정의하여 훅 규칙에 얽매이지 않고 어디서든 호출 가능하게 한다.
    2. **커스텀 훅(`useXxxStore`)**은 내부적으로 `useShallow`를 기본 적용하여 구조 분해 할당 시에도 최적화된 성능을 보장한다.
    3. **제네릭 셀렉터**를 지원하여 `useStore()`(전체)와 `useStore(s => s.item)`(선택) 방식 모두 타입 안전하게 지원한다.
       (예: `export const useAuthStore = <T = AuthState>(selector: (state: AuthState) => T = (state: AuthState) => state as unknown as T) => authStore(useShallow(selector));`)

---

## � Git & Commit Convention

모든 커밋 메시지는 프로젝트의 이력을 명확히 하고 가독성을 높이기 위해 아래 규칙을 따른다.

### 1. 커밋 메시지 형식

`태그: 메시지`

### 2. 태그 및 이모지 가이드

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `refactor`: 코드 리팩토링 (기능 변화 없음)
- `style`: UI 디자인 변경, 스타일 시트 수정
- `chore`: 단순 설정 변경, 패키지 관리, 주석 수정
- `docs`: 문서 수정 (README, GEMINI.md 등)
- `deploy`: 배포 관련 작업
- `base`: 프로젝트 초기 설정 또는 핵심 아키텍처 작업

### 3. 작성 규칙

- 메시지는 한글로 작성하는 것을 원칙으로 한다. (필요시 영어 병용)
- 무엇을 왜 변경했는지 명확하게 설명한다.
- 하나의 커밋에 너무 많은 변경 사항을 담지 않는다. 기능별 또는 논리적 단위로 분할하여 커밋한다.

---

## 🚀 배포 및 CI/CD

### 1. GitHub Actions

- **통합 파이프라인**: `.github/workflows/main.yml` (Lint, Test, Type Check)
- **Firebase App Distribution**: `.github/workflows/firebase-app-distribution.yml` (Beta 배포)

### 2. 필요한 GitHub Secrets

Firebase 배포를 위해 다음 시크릿 설정이 필요합니다:

- `FIREBASE_ANDROID_APP_ID`: Android App ID (`1:526212275810:android:74be4088b8478e75f67b3b`)
- `FIREBASE_IOS_APP_ID`: iOS App ID (`1:526212275810:ios:d0559b3458c61cabf67b3b`)
- `FIREBASE_CREDENTIALS_JSON`: Firebase 서비스 계정 JSON 키 전문

---

## 🤖 AI 어시스턴트 지침

- 성능과 보안을 최우선으로 고려한다.
- 모든 코드 생성 시 위 규칙을 준수한다.
- UI 작업 시 '토스 스타일'의 간단하고 직관적인 디자인을 추구한다.
- 주석이나 에러 메세지 같은 것은 한국어로 상세히 작성한다. (필요시 영어 사용 가능)
- `import React from 'react';`는 꼭 필요한 경우에만 선언한다. (React.useState => X)
- 내장 Alert를 사용하지 않고, `useModalStore`를 사용한다.

---

_최종 업데이트: 2026-01-30_
