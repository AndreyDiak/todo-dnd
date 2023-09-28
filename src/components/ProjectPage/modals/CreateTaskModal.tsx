/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useContext } from 'react';
import { ModalContext } from '../../../context/modalContext';
import { useTask } from '../../../hooks';
import { CreateTaskDto, Priority } from '../../../types';
import { Button } from '../../common';

import { TaskForm } from '../Task/TaskForm/TaskForm';

const TASK_DEFAULT_VALUE: CreateTaskDto = {
   header: '',
   description: '',
   expiredAt: new Date(new Date().getTime() + 1000 * 60 * 60),
   isSubtask: false,
   _headTaskId: undefined,
   priority: Priority.Low,
};

export const CreateTaskModal = () => {
   const { createTask } = useTask();

   const { closeModal } = useContext(ModalContext);

   const handleCreate = (createdTask: CreateTaskDto) => {
      if (!createdTask.header || !createdTask.description) return;
      createTask({ ...createdTask });
      closeModal();
   };

   return (
      <div className="flex flex-col space-y-2 font-semibold text-gray-600 font-sans">
         <TaskForm initialValue={TASK_DEFAULT_VALUE} onSubmitHandler={handleCreate}>
            {(submitHandler) => <Button onClick={submitHandler}>Создать задачу</Button>}
         </TaskForm>
      </div>
   );
};
