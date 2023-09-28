import React, { useEffect, useState } from 'react';
import { useProject, useProjectTasks } from '../../../hooks';

export const TaskSearch = React.memo(() => {
   const {
      project: { _id: projectId },
   } = useProject();
   const { setFilter, filter } = useProjectTasks(projectId);

   const [value, setValue] = useState(filter);

   useEffect(() => {
      // TODO:
      // debounce??
      setFilter(value);
   }, [setFilter, value]);

   return (
      <input
         type="text"
         className="modalInput flex-1 font-semibold text-gray-600"
         placeholder="ID или название"
         value={value}
         onChange={(e) => setValue(e.target.value)}
      />
   );
});

TaskSearch.displayName = 'TaskSearch';
