import React, { useEffect, useState } from 'react';
import { Priority } from '../../../types';

interface Props {
   priority: Priority;
   needToAdaptive?: boolean;
}

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

export const TaskPriority = React.memo(({ priority, needToAdaptive = false }: Props) => {
   const isMobile = window.innerWidth < 768;

   return (
      <span
         className={`text-lg font-semibold ${needToAdaptive ? 'text-lg' : ''}`}
         style={{
            color: priorityColorsMap[priority],
         }}
      >
         {needToAdaptive && isMobile ? '●' : priorityTextMap[priority]}
      </span>
   );
});

TaskPriority.displayName = 'Priority';
