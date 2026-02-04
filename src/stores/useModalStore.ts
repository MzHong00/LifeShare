import type { ReactNode } from 'react';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

/**
 * ModalType은 하단 버튼의 구성을 결정합니다.
 * - none: 버튼 없음
 * - alert: 확인 버튼 1개
 * - confirm: 취소, 확인 버튼 2개
 */
export type ModalType = 'none' | 'alert' | 'confirm';

export interface ModalOptions {
  type: ModalType;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  content?: ReactNode;
  confirmDisabled?: boolean; // 확인 버튼 비활성화 여부
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ModalState {
  isVisible: boolean;
  options: ModalOptions;
}

const defaultOptions: ModalOptions = {
  type: 'alert',
  title: '',
  message: '',
  confirmText: '확인',
  cancelText: '취소',
  confirmDisabled: false,
};

export const modalStore = create<ModalState>(() => ({
  isVisible: false,
  options: defaultOptions,
}));

export const useModalStore = <T = ModalState>(
  selector: (state: ModalState) => T = (state: ModalState) =>
    state as unknown as T,
) => modalStore(useShallow(selector));

export const modalActions = {
  showModal: (options: Partial<ModalOptions>) =>
    modalStore.setState({
      isVisible: true,
      options: { ...defaultOptions, ...options } as ModalOptions,
    }),
  /**
   * 모달이 열려있는 상태에서 옵션만 업데이트 (예: 확인 버튼 활성화 제어)
   */
  updateOptions: (options: Partial<ModalOptions>) =>
    modalStore.setState(state => ({
      options: { ...state.options, ...options },
    })),
  hideModal: () => modalStore.setState({ isVisible: false }),
};
