import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppStateType } from '../redux/store';
import { getAllTasksByProjectId, getFilter, taskActions } from '../redux/taskReducer';
import { Status, Task } from '../types';
import { isEmpty } from '../utils/isEmpty';
import { useLocalStorage } from './useLocalStorage';
import { useProject } from './useProject';
// eslint-disable-next-line import/named
import { DropResult } from 'react-beautiful-dnd';
import {
   filterTasks,
   getDoneTasks,
   getInProgressTasks,
   getQueuedTasks,
   getTasksWithStatus,
} from '../utils';
import { useTask } from './useTask';

interface UseTasks {
   tasks: Task[];
   queuedTasks: Task[];
   inProgressTasks: Task[];
   doneTasks: Task[];
   filter: string;
   updateTasks(result: DropResult): void;
   setFilter(filter: string): void;
}

export function useProjectTasks(projectId: string): UseTasks {
   const { project } = useProject();

   const { get } = useLocalStorage();

   const { updateTask } = useTask();

   const rawTasksSelector = useCallback(
      (state: AppStateType) => getAllTasksByProjectId(state, projectId),
      [projectId],
   );

   const rawTasks = useSelector(rawTasksSelector);

   const filter = useSelector(getFilter);

   const dispatch = useDispatch();

   const tasksList = Object.values(rawTasks);

   // с useMemo не обновляется при изменении state
   const tasks = useMemo(() => filterTasks(tasksList, filter), [filter, tasksList]);

   const setFilter = useCallback(
      (filter: string) => {
         dispatch(taskActions.setFilter(filter));
      },
      [dispatch],
   );

   const getTasksData = useCallback(() => {
      const tasks = project.tasks_ids?.map((taskId) => get(`task-${taskId}`) as Task);

      if (isEmpty(tasks)) return;

      dispatch(taskActions.setTasks(projectId, tasks));
   }, [dispatch, get, projectId, project.tasks_ids]);

   const updateTasksWithStore = useCallback(
      (
         indexFrom: number,
         indexTo: number,
         items: Task[],
         additionalOptions?: Partial<Record<keyof Task, boolean>>,
      ) => {
         for (let i = indexFrom; i < indexTo; i++) {
            // таска где надо обновить индекс...
            const updated = items[i];
            // берем доп данные из объекта при необходимости...
            const additionalData = additionalOptions
               ? Object.keys(additionalOptions).reduce((total, key) => {
                    if (additionalOptions[key as keyof Task]) {
                       return {
                          ...total,
                          [key]: updated[key as keyof Task],
                       };
                    }
                    return total;
                 }, {} as Partial<Task>)
               : {};

            // обновляем store
            updateTask(updated._id, { index: i, ...additionalData });
         }
      },
      [updateTask],
   );

   const updateTasks = useCallback(
      (result: DropResult) => {
         const { source, destination } = result;

         if (!destination) return;
         // если перемещаем в другую колонку...

         const { index: indexFrom, droppableId: droppableFromId } = source;
         // draggableId - id таски которую мы перемещаем...
         const { index: indexTo, droppableId: droppableToId } = destination;

         // перемещение в рамках одной колонки...
         if (droppableFromId === droppableToId) {
            const newTasks = getTasksWithStatus(tasks, droppableFromId as Status);
            /// удаляем таску с прошлого места
            const [taskToUpdate] = newTasks.splice(indexFrom, 1);
            // ставим таску на новое место
            newTasks.splice(indexTo, 0, taskToUpdate);
            // обновляем индексы...
            updateTasksWithStore(
               Math.min(indexFrom, indexTo),
               Math.max(indexFrom, indexTo) + 1,
               newTasks,
            );
            return;
         }
         // перемещение в разные колонки со сменой статуса..
         const newTasksFrom = getTasksWithStatus(tasks, droppableFromId as Status);
         const newTasksTo = getTasksWithStatus(tasks, droppableToId as Status);
         // удаляем из старой колонки...
         const [taskToUpdate] = newTasksFrom.splice(indexFrom, 1);
         // добавляем в новую колонку...
         newTasksTo.splice(indexTo, 0, {
            ...taskToUpdate,
            status: droppableToId as Status,
         });
         // обновляем индексы...
         updateTasksWithStore(indexFrom, newTasksFrom.length, newTasksFrom);
         updateTasksWithStore(indexTo, newTasksTo.length, newTasksTo, {
            status: true,
         });
      },
      [tasks, updateTasksWithStore],
   );

   useEffect(() => {
      if (isEmpty(rawTasks)) {
         getTasksData();
      }
   }, [getTasksData, rawTasks]);

   return useMemo(() => {
      const queuedTasks = getQueuedTasks(tasks);
      const inProgressTasks = getInProgressTasks(tasks);
      const doneTasks = getDoneTasks(tasks);

      return {
         tasks,
         queuedTasks,
         inProgressTasks,
         doneTasks,
         filter,
         updateTasks,
         setFilter,
      };
   }, [filter, setFilter, tasks, updateTasks]);
}
