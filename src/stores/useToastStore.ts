import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

/**
 * ToastType은 토스트의 성격을 결정합니다.
 * - success: 긍정적인 완료 메시지
 * - error: 오류 또는 경고 메시지
 * - info: 일반적인 안내 메시지
 */
export type ToastType = 'success' | 'error' | 'info';

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastState {
  isVisible: boolean;
  options: Required<ToastOptions>;
}

const defaultOptions: Required<ToastOptions> = {
  message: '',
  type: 'info',
  duration: 2500,
};

const toastStore = create<ToastState>(() => ({
  isVisible: false,
  options: defaultOptions,
}));

export const useToastStore = <T = ToastState>(
  selector: (state: ToastState) => T = (state: ToastState) =>
    state as unknown as T,
) => toastStore(useShallow(selector));

let timeoutId: ReturnType<typeof setTimeout> | null = null;

export const toastActions = {
  showToast: (
    message: string,
    type: ToastType = 'info',
    duration: number = 2500,
  ) => {
    // 이전 타이머가 있다면 클리어
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    toastStore.setState({
      isVisible: true,
      options: { message, type, duration },
    });

    timeoutId = setTimeout(() => {
      toastActions.hideToast();
      timeoutId = null;
    }, duration);
  },
  hideToast: () => toastStore.setState({ isVisible: false }),
};
