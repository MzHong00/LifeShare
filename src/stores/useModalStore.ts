import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

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
}

const defaultOptions: ModalOptions = {
  type: 'alert',
  title: '',
  message: '',
  confirmText: '확인',
  cancelText: '취소',
  destructiveText: '삭제',
};

export const modalStore = create<ModalState>(() => ({
  isVisible: false,
  options: defaultOptions,
}));

// 3. 외부 노출용 커스텀 훅 (useShallow 적용)
export const useModalStore = <T = ModalState>(
  selector: (state: ModalState) => T = (state: ModalState) =>
    state as unknown as T,
) => modalStore(useShallow(selector));

// 4. 액션 분리 (Static Actions)
export const modalActions = {
  showModal: (options: Partial<ModalOptions>) =>
    modalStore.setState({
      isVisible: true,
      options: { ...defaultOptions, ...options } as ModalOptions,
    }),
  hideModal: () => modalStore.setState({ isVisible: false }),
};
