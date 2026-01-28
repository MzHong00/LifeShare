import { create } from 'zustand';

interface ModalOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructiveText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onDestructive?: () => void;
  type?: 'alert' | 'confirm' | 'choice';
}

interface ModalState {
  isVisible: boolean;
  options: ModalOptions;
  showAlert: (title: string, message: string, onConfirm?: () => void) => void;
  showConfirm: (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText?: string,
    cancelText?: string,
  ) => void;
  showChoice: (
    title: string,
    message: string,
    onConfirm: () => void,
    onDestructive: () => void,
    onCancel?: () => void,
    confirmText?: string,
    destructiveText?: string,
    cancelText?: string,
  ) => void;
  hideModal: () => void;
}

const defaultOptions: ModalOptions = {
  title: '',
  message: '',
  confirmText: '확인',
  cancelText: '취소',
  type: 'alert',
};

export const useModalStore = create<ModalState>(set => ({
  isVisible: false,
  options: defaultOptions,
  showAlert: (title, message, onConfirm) =>
    set({
      isVisible: true,
      options: {
        ...defaultOptions,
        title,
        message,
        onConfirm,
        type: 'alert',
      },
    }),
  showConfirm: (title, message, onConfirm, onCancel, confirmText, cancelText) =>
    set({
      isVisible: true,
      options: {
        ...defaultOptions,
        title,
        message,
        onConfirm,
        onCancel,
        confirmText: confirmText || '확인',
        cancelText: cancelText || '취소',
        type: 'confirm',
      },
    }),
  showChoice: (
    title,
    message,
    onConfirm,
    onDestructive,
    onCancel,
    confirmText,
    destructiveText,
    cancelText,
  ) =>
    set({
      isVisible: true,
      options: {
        ...defaultOptions,
        title,
        message,
        onConfirm,
        onDestructive,
        onCancel,
        confirmText: confirmText || '확인',
        destructiveText: destructiveText || '삭제',
        cancelText: cancelText || '취소',
        type: 'choice',
      },
    }),
  hideModal: () => set({ isVisible: false }),
}));
