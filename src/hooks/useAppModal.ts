import { useCallback } from 'react';

import { modalActions, useModalStore } from '@/stores/useModalStore';
import type { ModalOptions } from '@/stores/useModalStore';

/**
 * 앱 전체에서 개별적으로 호출 가능한 모달 제어 훅
 */
export const useAppModal = () => {
  const options = useModalStore(state => state.options);

  const openModal = useCallback((newOptions: Partial<ModalOptions>) => {
    modalActions.showModal(newOptions);
  }, []);

  const closeModal = useCallback(() => {
    modalActions.hideModal();
  }, []);

  /**
   * 이미 열린 모달의 옵션을 업데이트 (예: 버튼 활성화 제어)
   */
  const updateModal = useCallback((updateOptions: Partial<ModalOptions>) => {
    modalActions.updateOptions(updateOptions);
  }, []);

  return { openModal, closeModal, updateModal, options };
};
