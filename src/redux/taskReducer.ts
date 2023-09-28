import { Task, UpdateTaskDto } from '../types';
import { AppStateType, InferActionsType } from './store';

const SET_TASKS = 'task/SET_TASKS';
const ADD_TASK = 'task/ADD_TASK';
const REMOVE_TASK = 'task/REMOVE_TASK';
const UPDATE_TASK = 'task/UPDATE_TASK';
const SET_FILTER = 'task/SET_FILTER';

type TaskType = Record<string, Record<string, Task>>;

const initialState = {
   tasks: {} as TaskType,
   filter: '',
};

type InitialTaskState = typeof initialState;
type TaskActionType = InferActionsType<typeof taskActions>;

export const taskReducer = (state = initialState, action: TaskActionType): InitialTaskState => {
   switch (action.type) {
      case SET_TASKS: {
         const { tasks, projectId } = action;

         return {
            ...state,
            tasks: {
               ...state.tasks,
               [projectId]: tasks.reduce(
                  (acc, task) => {
                     acc[task._id] = task;
                     return acc;
                  },
                  {} as Record<string, Task>,
               ),
            },
         };
      }

      case ADD_TASK: {
         const { projectId, task } = action;

         return {
            ...state,
            tasks: {
               ...state.tasks,
               [projectId]: {
                  ...state.tasks[projectId],
                  [task._id]: task,
               },
            },
         };
      }
      case REMOVE_TASK: {
         const { projectId, taskId } = action;
         const newTasks = { ...state.tasks };

         delete newTasks[projectId][taskId];

         return {
            ...state,
            tasks: newTasks,
         };
      }

      case UPDATE_TASK: {
         const { projectId, taskId, data } = action;

         return {
            ...state,
            tasks: {
               ...state.tasks,
               [projectId]: {
                  ...state.tasks[projectId],
                  [taskId]: {
                     ...state.tasks[projectId][taskId],
                     ...data,
                  },
               },
            },
         };
      }

      case SET_FILTER: {
         const { filter } = action;

         return {
            ...state,
            filter,
         };
      }

      default:
         return state;
   }
};

export const taskActions = {
   setTasks: (projectId: string, tasks: Task[]) => ({ type: SET_TASKS, projectId, tasks }) as const,
   addTask: (projectId: string, task: Task) => ({ type: ADD_TASK, projectId, task }) as const,
   removeTask: (projectId: string, taskId: string) =>
      ({ type: REMOVE_TASK, projectId, taskId }) as const,
   updateTask: (projectId: string, taskId: string, data: UpdateTaskDto) =>
      ({ type: UPDATE_TASK, projectId, taskId, data }) as const,
   setFilter: (filter: string) => ({ type: SET_FILTER, filter }) as const,
};

export const getAllTasksByProjectId = (state: AppStateType, projectId: string) =>
   state.task.tasks[projectId] ?? {};

export const getTaskById = (state: AppStateType, projectId: string, taskId: string) =>
   getAllTasksByProjectId(state, projectId)[taskId];

export const getFilter = (state: AppStateType) => state.task.filter;
