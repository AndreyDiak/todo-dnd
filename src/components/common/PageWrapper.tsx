import React, { PropsWithChildren } from 'react';
import { ModalProvider } from '../../context/modalContext';

export const PageWrapper = ({ children }: PropsWithChildren<unknown>) => {
   return <ModalProvider>{children}</ModalProvider>;
};
