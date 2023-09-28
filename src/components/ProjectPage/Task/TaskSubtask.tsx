import React from 'react';
import { useTask } from '../../../hooks';

interface Props {
   isSubtask: boolean;
   headTaskId?: string;
}

export const TaskSubtask = React.memo(({ isSubtask, headTaskId }: Props) => {
   const { getTaskById } = useTask();

   if (!isSubtask || !headTaskId) {
      return null;
   }

   return (
      <div>
         <span className="text-gray-400">
            Подзадача для{' '}
            <span className="font-bold text-gray-400">{getTaskById(headTaskId).number}</span>
         </span>
      </div>
   );
});

TaskSubtask.displayName = 'TaskSubtask';
