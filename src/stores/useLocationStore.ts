import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { Location } from '@/types';

// 1. 상태 타입 정의 (순수하게 상태 데이터만)
interface LocationState {
  location: Location | null;
  error: string | null;
  loading: boolean;
}

// 2. 내부 스토어 인스턴스 생성
const locationStore = create<LocationState>(() => ({
  location: null,
  error: null,
  loading: true,
}));

// 3. 외부 노출용 커스텀 훅 (useShallow 적용)
export const useLocationStore = <T = LocationState>(
  selector: (state: LocationState) => T = (state: LocationState) =>
    state as unknown as T,
) => locationStore(useShallow(selector));

// 4. 액션 분리 (Static Actions)
// 훅이 아니므로 어디서든 접근 가능하며, 불필요한 리렌더링을 유발하지 않음
export const locationActions = {
  setLocation: (location: Location | null) =>
    locationStore.setState({ location }),
  setError: (error: string | null) => locationStore.setState({ error }),
  setLoading: (loading: boolean) => locationStore.setState({ loading }),
};
