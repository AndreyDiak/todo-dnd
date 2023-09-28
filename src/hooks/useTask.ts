import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { taskActions } from '../redux/taskReducer';
import { CreateTaskDto, Project, Status, Task, UpdateTaskDto } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { useProject } from './useProject';

import { v4 as uuidv4 } from 'uuid';
import { projectActions } from '../redux/projectReducer';
import { getQueuedTasks } from '../utils';
import { useComment } from './useComment';

interface UseTask {
   // task: Task;
   createTask(data: CreateTaskDto): void;
   updateTask(taskId: string, data: UpdateTaskDto): void;
   deleteTask(taskId: string): void;
   getTaskById(taskId: string): Task;
}

export function useTask(): UseTask {
   const { project } = useProject();

   const { create, update, get, remove } = useLocalStorage();

   const { deleteComment } = useComment();

   const dispatch = useDispatch();

   const getTaskById = useCallback(
      (taskId: string) => {
         return get<Task>(`task-${taskId}`) ?? {};
      },
      [get],
   );

   const updateHeadTask = useCallback(
      (taskId: string, headTaskId: string, type: 'add' | 'remove') => {
         const headTask = getTaskById(headTaskId);

         const newHeadTaskData: Partial<Task> = {
            subtasks_ids:
               type === 'add'
                  ? [...headTask.subtasks_ids, taskId]
                  : headTask.subtasks_ids.filter((id) => id !== taskId),
         };

         update<Task>(`task-${headTaskId}`, newHeadTaskData);

         dispatch(taskActions.updateTask(project._id, headTaskId, newHeadTaskData));
      },
      [dispatch, getTaskById, project._id, update],
   );

   const updateTask = useCallback(
      (taskId: string, data: UpdateTaskDto) => {
         const oldTask = getTaskById(taskId);

         // если мы указали что это подзадача, и id головной задачи был изменен
         if (oldTask._headTaskId !== data._headTaskId && data._headTaskId && data.isSubtask) {
            updateHeadTask(taskId, data._headTaskId, 'add');
            // если у нас была старая головная задача, то убираем задачу из списка подзадач
            if (oldTask._headTaskId) {
               updateHeadTask(taskId, oldTask._headTaskId, 'remove');
            }
         }

         update<Task>(`task-${taskId}`, data);

         dispatch(taskActions.updateTask(project._id, taskId, data));
      },
      [dispatch, getTaskById, project._id, update, updateHeadTask],
   );

   const createTask = useCallback(
      (data: CreateTaskDto) => {
         // нельзя использовать циклическую зависимость и взять таски из хука useProjectTasks...
         // TODO подумать над решением
         const queuedTasks = getQueuedTasks(
            project.tasks_ids.map((taskId) => get(`task-${taskId}`)),
         );

         const task: Task = {
            _id: uuidv4(),
            _projectId: project._id,
            index: queuedTasks.length > 0 ? queuedTasks.length + 1 : 0,
            number: `TASK-${project.totalTasks + 1}`,
            createdAt: new Date(),
            status: Status.Queue,
            _headTaskId: data.isSubtask ? data._headTaskId : undefined,
            subtasks_ids: [],
            comments_ids: [],
            ...data,
         };

         // если это подзадача
         if (data.isSubtask && data._headTaskId) {
            updateHeadTask(task._id, data._headTaskId, 'add');
         }

         const newProjectData: Partial<Project> = {
            totalTasks: project.totalTasks + 1,
            tasks_ids: [...project.tasks_ids, task._id],
         };

         // обновляем localStorage
         create<Task>(`task-${task._id}`, task);

         update<Project>(`project-${project._id}`, newProjectData);

         // обновляем store
         dispatch(projectActions.updateProject(project._id, newProjectData));

         dispatch(taskActions.addTask(project._id, task));
      },
      [
         create,
         dispatch,
         get,
         project._id,
         project.tasks_ids,
         project.totalTasks,
         update,
         updateHeadTask,
      ],
   );

   const deleteTask = useCallback(
      (taskId: string) => {
         const task = getTaskById(taskId);

         const newTasksIds = project.tasks_ids.filter((id) => id !== taskId);

         const { _headTaskId, isSubtask } = getTaskById(taskId);

         // если это подзадача
         if (isSubtask && _headTaskId) {
            updateHeadTask(taskId, _headTaskId, 'remove');
         }

         if (task.comments_ids.length !== 0) {
            task.comments_ids.forEach((commentId) => {
               deleteComment(taskId, commentId);
            });
         }

         // обновляем localStorage
         remove(`task-${taskId}`);

         update<Project>(`project-${project._id}`, {
            tasks_ids: newTasksIds,
         });

         // обновляем store
         dispatch(taskActions.removeTask(project._id, taskId));

         dispatch(
            projectActions.updateProject(project._id, {
               tasks_ids: newTasksIds,
            }),
         );
      },
      [
         deleteComment,
         dispatch,
         getTaskById,
         project._id,
         project.tasks_ids,
         remove,
         update,
         updateHeadTask,
      ],
   );

   return useMemo(() => {
      return {
         createTask,
         updateTask,
         getTaskById,
         deleteTask,
      };
   }, [createTask, deleteTask, getTaskById, updateTask]);
}
