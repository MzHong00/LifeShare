import { create } from 'zustand';

export type ModalType = 'alert' | 'confirm' | 'choice';

interface ModalOptions {
  type: ModalType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructiveText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onDestructive?: () => void;
}

interface ModalState {
  isVisible: boolean;
  options: ModalOptions;
  /**
   * 모달을 표시합니다. 유일한 모달 호출 창구입니다.
   * @param options type('alert' | 'confirm' | 'choice'), title, message 등을 포함한 객체
   */
  showModal: (options: ModalOptions) => void;
  hideModal: () => void;
}

const defaultOptions: ModalOptions = {
  type: 'alert',
  title: '',
  message: '',
  confirmText: '확인',
  cancelText: '취소',
  destructiveText: '삭제',
};

export const useModalStore = create<ModalState>(set => ({
  isVisible: false,
  options: defaultOptions,

  showModal: options =>
    set({
      isVisible: true,
      options: { ...defaultOptions, ...options },
    }),

  hideModal: () => set({ isVisible: false }),
}));
