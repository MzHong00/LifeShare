## Core Principles

- **Toss-style Minimalism**: 단순하고 직관적인 UI/UX를 지향합니다.
- **Premium Aesthetics**: #3182F6 (Blue)를 포인트로 한 깔끔하고 고급스러운 디자인을 유지합니다.
- **Type Safety**: TypeScript를 사용하며, `any` 사용을 절대 지양하고 인터페이스를 명확히 정의합니다.

---

## 🛠 Tech Stack & Patterns

### 1. Component Structure

- 모든 컴포넌트는 **화살표 함수**(`const Component = () => { ... }`) 형식을 사용합니다.
- 컴포넌트 내부에 또 다른 컴포넌트를 정의(Nested Component)하지 않습니다.
- 스타일은 항상 파일 하단에 `StyleSheet.create`를 사용하여 정의합니다. 인라인 스타일은 금지됩니다.

### 2. State Management (Zustand)

- **State와 Action을 분리**합니다.
- Actions는 스토어 외부의 독립된 객체(`xxxActions`)로 정의하여 어디서든 호출 가능하게 합니다.
- 커스텀 훅(`useXxxStore`)은 내부적으로 `useShallow`를 기본 적용하여 성능을 최적화합니다.
- 제네릭 셀렉터를 지원하도록 작성합니다.

### 3. Navigation & Header

- 내비게이션 이동 및 등록 시 반드시 `@/constants/navigation`의 `NAV_ROUTES` 상수를 사용합니다.
- 모든 스크린은 `@/components/AppSafeAreaView`를 필수적으로 사용합니다.
- 헤더 설정(Title, 버튼 등)은 `AppSafeAreaView`의 프롭을 통해 관리하며, 헤더 버튼은 `useCallback`을 사용한 렌더링 함수로 정의합니다.

### 4. Styling & Tokens

- 하드코딩된 Hex 코드는 절대 사용하지 않습니다.
- 모든 색상은 `@/constants/theme`의 `COLORS` 객체에서 가져와 사용합니다.
- 새로운 색상이 필요한 경우 `theme.ts`에 토큰을 먼저 추가합니다.

### 5. Utilities & Date

- 날짜 처리는 직접 `dayjs`나 `new Date()`를 호출하지 않고, 반드시 `@/utils/date`의 공통 함수를 사용합니다.

---

## 📂 Import Order & Structure

1. 외부 라이브러리 (react, react-native, npm packages)
2. (한 줄 개행)
3. 내부 파일 (@/ 접두사 사용 필수):
   - `@/types`, `@/lib`, `@/constants`, `@/api`, `@/stores`, `@/utils`, `@/hooks`, `@/businesses`, `@/components`, `@/screens`, `@/navigations` 순서 권장

---

## 📝 Git & Documentation

- **Commit Format**: `태그: 메시지` (예: `feat: 로그인 기능 추가`)
- **Language**: 코드 내 주석 및 에러 메시지는 한국어를 기본으로 하며, 필요시 영어를 병용합니다.

---

## 🚨 Anti-Patterns (Avoid at all costs)

- `import React from 'react';` 선언은 필요한 경우(타입 등) 외에는 생략합니다.
- 내장 `Alert` 대신 `useModalStore`를 사용합니다.
- `any` 타입을 사용하지 않습니다.
- 인라인 스타일을 사용하지 않습니다.
