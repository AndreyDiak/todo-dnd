import React from 'react';
import { useTask } from '../../../hooks';
import { TaskStatus } from './TaskStatus';

interface Props {
   subtaskIds: string[];
}

export const TaskSubtaskList = React.memo(({ subtaskIds }: Props) => {
   const { getTaskById } = useTask();

   if (subtaskIds.length === 0) {
      return null;
   }

   return (
      <div className="">
         <h2 className="pb-2">Список подзадач:</h2>
         <ol className="flex flex-col space-y-1">
            {subtaskIds.map((id) => {
               const task = getTaskById(id);
               return (
                  <li key={id} className="">
                     <span className="font-semibold">{task.number}</span> /{' '}
                     <span className="font-normal">{task.header}</span> (
                     <TaskStatus status={task.status} />)
                  </li>
               );
            })}
         </ol>
      </div>
   );
});

TaskSubtaskList.displayName = 'TaskSubtaskList';
