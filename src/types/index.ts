export const enum Status {
   Queue = 'queue',
   Development = 'development',
   Done = 'done',
}

export enum Priority {
   Low = 'low',
   Medium = 'medium',
   High = 'high',
   Highest = 'highest',
}

export interface Task {
   _id: string;
   _projectId: string;
   _headTaskId?: string;
   index: number; // нужен для определения номера таски в списке
   number: string;
   header: string;
   description: string;
   createdAt: Date;
   expiredAt: Date;
   status: Status;
   priority: Priority;
   files?: any[];
   isSubtask: boolean;
   subtasks_ids: string[];
   comments_ids: string[];
}

export interface Project {
   _id: string;
   header: string;
   description: string;
   totalTasks: number; // количество задач за все время
   tasks_ids: string[];
}

export type CreateProjectDto = Pick<Project, 'description' | 'header'>;

export type CreateTaskDto = Pick<
   Task,
   'description' | 'header' | 'expiredAt' | 'priority' | 'isSubtask' | '_headTaskId'
>;

export type UpdateTaskDto = Partial<Omit<Task, '_id' | '_projectId' | 'createdAt'>>;

export interface Comment {
   _id: string;
   text: string;
   replies_ids: Comment[];
   // ownerId: string;
   // ownerName: string;
}
