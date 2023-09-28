import { useContext } from 'react';
import { ModalContext } from '../../context/modalContext';
import { Button } from '../common';
import { CreateProjectModal } from './CreateProjectModal';

export const ProjectsHeader = () => {
   const { openModal } = useContext(ModalContext);

   const handleModal = () => {
      openModal({
         title: 'Create Project',
         children: <CreateProjectModal />,
      });
   };
   return (
      <div className="flex items-center justify-between py-4 px-4 md:px-10 border-b border-gray-400 mb-4">
         <div className="text-base md:text-lg font-medium">Выберите проект</div>
         <Button onClick={handleModal}>Создать новый проект</Button>
      </div>
   );
};
