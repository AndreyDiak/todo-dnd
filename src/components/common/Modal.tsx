import { useContext } from 'react';
import { ModalContext } from '../../context/modalContext';

export const Modal = () => {
   const { closeModal, store } = useContext(ModalContext);
   return (
      <div className="absolute w-screen h-screen flex items-center justify-center bg-[rgba(0,0,0,0.7)] z-10">
         <div className="bg-white p-4 rounded-md relative min-w-[400px]">
            <div
               className="absolute right-4 top-2 font-bold text-2xl cursor-pointer text-gray-800"
               onClick={closeModal}
            >
               ✕
            </div>
            <div className="border-b border-gray-200 pb-2 text-lg font-semibold font-sans text-gray-800">
               {store?.title}
            </div>
            {store?.children}
         </div>
      </div>
   );
};
