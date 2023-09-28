import React from 'react';
import { Priority } from '../../../types';

const priorityColorsMap: Record<Priority, string> = {
   [Priority.Low]: '#44944A',
   [Priority.Medium]: '#daa82a',
   [Priority.High]: '#e46f09',
   [Priority.Highest]: '#d20407',
};
export const priorityTextMap: Record<Priority, string> = {
   [Priority.Low]: 'Низкий',
   [Priority.Medium]: 'Средний',
   [Priority.High]: 'Высокий',
   [Priority.Highest]: 'Критический',
};

export const TaskPriority = React.memo(({ priority }: { priority: Priority }) => {
   return (
      <span
         className={`text-lg font-semibold`}
         style={{
            color: priorityColorsMap[priority],
         }}
      >
         {priorityTextMap[priority]}
      </span>
   );
});

TaskPriority.displayName = 'Priority';
