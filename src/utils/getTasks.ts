import { Status, Task } from '../types';

export const getTasksWithStatus = (tasks: Task[], status: Status) =>
	tasks.filter((task) => task.status === status).sort((a, b) => a.index - b.index);

export const getQueuedTasks = (tasks: Task[]) =>
	tasks.filter((task) => task.status === Status.Queue).sort((a, b) => a.index - b.index);

export const getInProgressTasks = (tasks: Task[]) =>
	tasks.filter((task) => task.status === Status.Development).sort((a, b) => a.index - b.index);

export const getDoneTasks = (tasks: Task[]) =>
	tasks.filter((task) => task.status === Status.Done).sort((a, b) => a.index - b.index);
