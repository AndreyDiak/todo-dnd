import React, { useContext } from 'react';
import { ModalContext } from '../../../context/modalContext';
import { Task } from '../../../types';
import { EditTaskModal } from '../modals';
import { TaskPriority } from './TaskPriority';
import { TaskStatus } from './TaskStatus';

import parse from 'html-react-parser';
import { TaskSubtask } from './TaskSubtask';

interface Props {
   task: Task;
}

export const TaskCard: React.FC<Props> = ({ task }) => {
   const { openModal } = useContext(ModalContext);

   const handleOpenModal = () => {
      openModal({
         title: task.header,
         children: <EditTaskModal task={task} />,
      });
   };

   return (
      <div
         onClick={handleOpenModal}
         className="flex flex-col space-y-2 font-sans min-w-[300px] max-h-[300px] overflow-hidden"
      >
         <div className="border-b border-gray-400 pb-2">
            <div className="flex justify-between items-start">
               <h2 className="text-gray-800 font-bold text-lg text-semibold font-mono">
                  {task.number}
               </h2>
               <TaskPriority priority={task.priority} />
            </div>
            <TaskSubtask isSubtask={task.isSubtask} headTaskId={task._headTaskId} />
         </div>
         <div className="max-h-[150px] overflow-y-">
            <h2 className="text-gray-800 font-bold text-xl">{task.header}</h2>
            <div className="text-gray-500 text-md">{parse(task.description ?? '')}</div>
         </div>

         <TaskStatus status={task.status} />
      </div>
   );
};
