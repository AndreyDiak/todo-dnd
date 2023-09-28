import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ModalContext } from '../../context/modalContext';
import { useProject } from '../../hooks';
import { Button } from '../common';
import { CreateTaskModal, DeleteProjectModal } from './modals';
import { TaskSearch } from './Task';

export const ProjectHeader = () => {
   const { project } = useProject();

   const { openModal } = useContext(ModalContext);

   const onDeleteHandler = () => {
      openModal({
         title: 'Удалить проект',
         children: <DeleteProjectModal />,
      });
   };

   const onCreateTaskHandler = () => {
      openModal({
         title: 'Новая задача',
         children: <CreateTaskModal />,
      });
   };

   return (
      <div className="flex justify-between space-x-10 items-center px-4 py-2 border-b border-gray-400">
         {/* project info */}
         <div>
            <h1 className="font-bold text-xl">{project.header}</h1>
            <p className="text-gray-600">{project.description}</p>
         </div>
         {/* task search */}
         <TaskSearch />
         {/* buttons */}
         <div className="flex space-x-2">
            <Button onClick={onCreateTaskHandler} color="green">
               Создать задачу
            </Button>
            <Button color="blue">
               <Link to="/">Вернутся к списку проектов</Link>
            </Button>
            <Button onClick={onDeleteHandler} color="red">
               Удалить проект
            </Button>
         </div>
      </div>
   );
};
