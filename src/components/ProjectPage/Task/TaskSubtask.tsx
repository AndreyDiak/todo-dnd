import React from 'react';
import { useTask } from '../../../hooks';

interface Props {
   isSubtask: boolean;
   needToAdaptive?: boolean;
   headTaskId?: string;
}

export const TaskSubtask = React.memo(
   ({ isSubtask, headTaskId, needToAdaptive = false }: Props) => {
      const { getTaskById } = useTask();

      if (!isSubtask || !headTaskId) {
         return null;
      }

      return (
         <div>
            <span className="md:text-base leading-3 text-xs text-gray-400">
               <p>
                  Подзадача для{' '}
                  <span className="font-bold text-gray-400">{getTaskById(headTaskId).number}</span>
               </p>
            </span>
         </div>
      );
   },
);

TaskSubtask.displayName = 'TaskSubtask';
