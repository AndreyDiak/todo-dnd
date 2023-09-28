import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModalContext } from '../../../context/modalContext';
import { useProject } from '../../../hooks';
import { Button } from '../../common';

export const DeleteProjectModal = () => {
   const { deleteProject } = useProject();

   const navigate = useNavigate();

   const { closeModal } = useContext(ModalContext);

   const onClickHandler = () => {
      deleteProject();
      closeModal();
      navigate('/');
   };

   return (
      <>
         <h2 className="text-xl my-4">Are u sure, you wanna to delete this project?</h2>
         <Button
            onClick={onClickHandler}
            className="bg-red-400 text-white hover:bg-red-500 text-center"
         >
            Delete project
         </Button>
      </>
   );
};
