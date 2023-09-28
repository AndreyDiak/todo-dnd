import React from 'react';
import { Status } from '../../../types';

const statusColorMap: Record<Status, string> = {
   [Status.Queue]: 'text-gray-600',
   [Status.Development]: 'text-gray-600',
   [Status.Done]: 'text-green-600',
};

const statusTextMap: Record<Status, string> = {
   [Status.Queue]: 'В очереди',
   [Status.Development]: 'В работе',
   [Status.Done]: 'Завершено',
};

export const TaskStatus = React.memo(({ status }: { status: Status }) => {
   return (
      <span className={`text-lg font-base text-right ${statusColorMap[status]}`}>
         {statusTextMap[status]}
      </span>
   );
});

TaskStatus.displayName = 'TaskStatus';
