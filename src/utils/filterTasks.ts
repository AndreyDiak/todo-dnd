import { Task } from '../types';
import { isEmpty } from './isEmpty';

export const filterTasks = (tasks: Task[], filter: string) =>
   tasks.filter((task) => {
      if (isEmpty(filter)) {
         return true;
      }
      return (
         task.number.toLowerCase().includes(filter.toLowerCase()) ||
         task.header.toLowerCase().includes(filter.toLowerCase())
      );
   });
