import { PropsWithChildren, createContext, useCallback } from 'react';
import { UseModalLayout, useModalLayout } from '../hooks';
import { Modal } from '../components/common/Modal';

export const ModalContext = createContext<UseModalLayout>({} as UseModalLayout);

export const ModalProvider = ({ children }: PropsWithChildren<unknown>) => {
   const { openModal, closeModal, store } = useModalLayout();

   const renderModal = useCallback(() => {
      if (store === null) {
         return null;
      }
      return <Modal />;
   }, [store]);

   return (
      <ModalContext.Provider
         value={{
            openModal,
            closeModal,
            store,
         }}
      >
         {renderModal()}
         {children}
      </ModalContext.Provider>
   );
};
