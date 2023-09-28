/* eslint-disable @typescript-eslint/ban-ts-comment */
import moment from 'moment';
import React, { useContext, useState } from 'react';
import { ModalContext } from '../../../context/modalContext';
import { useTask } from '../../../hooks';
import { Task } from '../../../types';
import { Button } from '../../common';
import { TaskForm, TaskPriority, TaskStatus, TaskSubtask, TaskSubtaskList } from '../Task';

import parse from 'html-react-parser';

interface Props {
   task: Task;
}

export const EditTaskModal: React.FC<Props> = ({ task }) => {
   const [isEditing, setIsEditing] = useState(false);

   const { deleteTask, updateTask } = useTask();

   const { closeModal } = useContext(ModalContext);

   const isTaskExpired = new Date(task.expiredAt).getTime() < new Date().getTime();

   const handleDelete = () => {
      // если у задачи есть подзадачи...
      if (task.subtasks_ids.length > 0) return;
      deleteTask(task._id);
      closeModal();
   };

   const handleUpdate = (updatedTask: Task) => {
      if (!updatedTask.header || !updatedTask.description) return;
      updateTask(task._id, { ...updatedTask });
      closeModal();
   };

   const isBigDescription = task.description.length > 45;

   if (isEditing) {
      return (
         <div className="flex flex-col space-y-2 justify-center font-semibold text-gray-600 font-sans">
            <TaskForm initialValue={task} onSubmitHandler={handleUpdate}>
               {(submitHandler) => (
                  <div className="flex space-x-2 justify-end">
                     <Button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-700 hover:bg-gray-900"
                     >
                        Режим просмотра
                     </Button>
                     <Button onClick={submitHandler}>Сохранить</Button>
                  </div>
               )}
            </TaskForm>
         </div>
      );
   }

   return (
      <div className="flex flex-col space-y-6 font-semibold text-gray-600 font-sans">
         <div
            className={`formBlock flex flex-col justify-center space-x-4 ${
               isBigDescription ? 'md:flex-row' : 'md:flex-col'
            }`}
         >
            <div
               className={`border-gray-200 border-b-[1px] md:border-b-0 px-2 py-2 mx-2 mb-2 ${
                  isBigDescription ? 'md:border-r-[1px]' : 'md:border-b-[1px]'
               }`}
            >
               {parse(task.description ?? '')}
            </div>
            <div className="flex flex-col space-y-3">
               <div className="">
                  <h2>Приоритет:</h2> <TaskPriority priority={task.priority} />
               </div>
               <div className="">
                  <h2>Стутус:</h2> <TaskStatus status={task.status} />
               </div>
               <div className="pb-2">
                  <h2>Создана:</h2>
                  <div className="text-gray-400 font-normal">
                     {moment(task.createdAt).calendar()}
                  </div>
                  <div>
                     <h2>Дедлайн:</h2>{' '}
                     <div
                        className={`font-normal ${
                           isTaskExpired ? 'text-red-400' : 'text-green-400'
                        }`}
                     >
                        {moment(task.expiredAt).fromNow()}
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <TaskSubtaskList subtaskIds={task.subtasks_ids} />
         <TaskSubtask isSubtask={task.isSubtask} headTaskId={task._headTaskId} />
         <div className="flex space-x-2 items-center justify-end">
            <Button onClick={() => setIsEditing(true)}>Редактировать задачу</Button>
            <Button onClick={handleDelete} color="red">
               Удалить
            </Button>
         </div>
      </div>
   );
};
