// eslint-disable-next-line import/named
import { DragDropContext } from 'react-beautiful-dnd';
import { PageWrapper, ProjectHeader } from '../components';
import { TodoColumn } from '../components/ProjectPage/TodoColumn';
import { useProject } from '../hooks';
import { useProjectTasks } from '../hooks/useProjectTasks';
import { Status } from '../types';
import { useState } from 'react';
import { ProjectMenu } from '../components/ProjectPage/ProjectMenu';

export const ProjectPage = () => {
   const { project } = useProject();

   const { queuedTasks, inProgressTasks, doneTasks, updateTasks } = useProjectTasks(project._id);

   const isMobile = screen.width <= 768;

   const [visibility, setVisibility] = useState<Record<Status, boolean>>({
      development: true,
      done: true,
      queue: true,
   });

   const onClickHandler = (status: Status) => {
      setVisibility({ ...visibility, [status]: !visibility[status] });
   };

   const totalCols = Object.values(visibility).filter(Boolean).length;

   if (!project) {
      return <div>Loading...</div>;
   }

   return (
      <PageWrapper>
         <div className="flex flex-col w-full h-screen">
            <ProjectHeader />
            <ProjectMenu visibility={visibility} onClickHandler={onClickHandler} />
            <div
               className={`flex px-1 flex-1 w-full md:w-11/12 xl:w-10/12 h-4/6 mx-auto justify-center items-center md:items-start pt-2 md:pt-10`}
               style={{
                  columnGap: isMobile ? '6px' : '12px',
               }}
            >
               <DragDropContext onDragEnd={updateTasks}>
                  <TodoColumn
                     droppableId={Status.Queue}
                     items={queuedTasks}
                     isVisible={visibility.queue}
                     visibleCols={totalCols}
                  />
                  <TodoColumn
                     droppableId={Status.Development}
                     items={inProgressTasks}
                     isVisible={visibility.development}
                     visibleCols={totalCols}
                  />
                  <TodoColumn
                     droppableId={Status.Done}
                     items={doneTasks}
                     isVisible={visibility.done}
                     visibleCols={totalCols}
                  />
               </DragDropContext>
            </div>
         </div>
      </PageWrapper>
   );
};
