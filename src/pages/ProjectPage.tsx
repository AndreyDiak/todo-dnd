// eslint-disable-next-line import/named
import { DragDropContext } from 'react-beautiful-dnd';
import { PageWrapper, ProjectHeader } from '../components';
import { TodoColumn } from '../components/ProjectPage/TodoColumn';
import { useProject } from '../hooks';
import { useProjectTasks } from '../hooks/useProjectTasks';
import { Status } from '../types';

export const ProjectPage = () => {
   const { project } = useProject();

   const { queuedTasks, inProgressTasks, doneTasks, updateTasks } = useProjectTasks(project._id);

   if (!project) {
      return <div>Loading...</div>;
   }

   return (
      <PageWrapper>
         <div className="flex flex-col h-screen w-full">
            <ProjectHeader />
            <div className="flex space-x-10 max-w-7xl mx-auto flex-1 items-center">
               <DragDropContext onDragEnd={updateTasks}>
                  <TodoColumn droppableId={Status.Queue} items={queuedTasks} />
                  <TodoColumn droppableId={Status.Development} items={inProgressTasks} />
                  <TodoColumn droppableId={Status.Done} items={doneTasks} />
               </DragDropContext>
            </div>
         </div>
      </PageWrapper>
   );
};
