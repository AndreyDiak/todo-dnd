import React, { ReactNode, useRef, useState } from 'react';
import { Priority, Task } from '../../../../types';
import { Selector } from '../../../common';
import { DescriptionEditor } from './DescriptionEditor';
import { priorityTextMap } from '../TaskPriority';

import { Editor } from '@tinymce/tinymce-react';
import Flatpickr from 'react-flatpickr';
import { useProject, useProjectTasks } from '../../../../hooks';

const priorityItems = [
   { value: Priority.Low, label: priorityTextMap[Priority.Low] },
   { value: Priority.Medium, label: priorityTextMap[Priority.Medium] },
   { value: Priority.High, label: priorityTextMap[Priority.High] },
   { value: Priority.Highest, label: priorityTextMap[Priority.Highest] },
];

interface Props {
   initialValue: Partial<Task>;
   children: (submitHandler: () => void) => ReactNode;
   onSubmitHandler(task: Partial<Task>): void;
}

export const TaskForm = React.memo(({ initialValue, children, onSubmitHandler }: Props) => {
   const {
      project: { _id: projectId },
   } = useProject();

   const { tasks } = useProjectTasks(projectId);

   const [task, setTask] = useState(initialValue);

   const filteredTasks = tasks.filter((filteredTask) => filteredTask._id !== task._id);

   const isAbleToSubtask = filteredTasks.length > 0;

   const editorRef = useRef<Editor>();

   const onSubtaskChange = (value: boolean) => {
      setTask((prev) => ({
         ...prev,
         isSubtask: value,
         _headTaskId: value ? tasks[0]._id : undefined,
      }));
   };

   return (
      <div className="flex flex-col space-y-2">
         <div className="flex flex-col space-y-4 formBlock pb-4">
            <div>
               <h2>Название задачи:</h2>
               <input
                  type="text"
                  placeholder="Task header"
                  value={task.header}
                  onChange={(e) =>
                     setTask((prev) => ({
                        ...prev,
                        header: e.target.value,
                     }))
                  }
                  className="modalInput w-full"
               />
            </div>
            <div>
               <h2>Описание задачи:</h2>
               <DescriptionEditor initialValue={task.description} ref={editorRef} />
            </div>
         </div>
         <div className="formBlock pb-4">
            <h2>Приоритет задачи:</h2>
            <Selector
               items={priorityItems}
               defaultValue={task.priority ?? Priority.Low}
               onChange={(value) => setTask((prev) => ({ ...prev, priority: value as Priority }))}
            />
         </div>
         {isAbleToSubtask && (
            <div className="flex space-x-2 items-center formBlock pb-2">
               <input
                  type="checkbox"
                  checked={task.isSubtask}
                  onChange={(e) => onSubtaskChange(e.target.checked)}
                  className="cursor-pointer"
               />
               <label>Сделать подзадачей:</label>
               {/* TODO добавить выбор среди текущих задач */}
               {task.isSubtask && (
                  <select
                     value={task._headTaskId}
                     onChange={(e) => {
                        setTask((prev) => ({
                           ...prev,
                           _headTaskId: e.target.value,
                        }));
                     }}
                     className="p-2 focus:outline-none cursor-pointer hover:bg-gray-100 rounded-md"
                  >
                     {filteredTasks.map((task) => (
                        <option
                           key={task._id}
                           value={task._id}
                           className="border-b-[1px] border-gray-400"
                        >
                           {task.number} / {task.header}
                        </option>
                     ))}
                  </select>
               )}
            </div>
         )}
         <div className="formBlock pb-2">
            <h2>Дедлайн</h2>
            <Flatpickr
               date-enable-time
               value={task.expiredAt}
               options={{
                  minDate: new Date(),
                  enableTime: true,
                  dateFormat: 'Y-m-d H:i',
                  time_24hr: true,
               }}
               onChange={([date]) => setTask((prev) => ({ ...prev, expiredAt: date }))}
            />
         </div>
         {children(() =>
            onSubmitHandler({ ...task, description: (editorRef?.current as any).getContent() }),
         )}
      </div>
   );
});

TaskForm.displayName = 'TaskForm';
