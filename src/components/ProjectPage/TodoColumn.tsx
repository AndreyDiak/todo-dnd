import React from 'react';
import { Status, Task } from '../../types';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { TaskCard } from './Task/TaskCard';

interface Props {
   droppableId: Status;
   items: Task[];
   isVisible?: boolean;
   visibleCols: number;
}

const columnNameMap: Record<Status, string> = {
   [Status.Queue]: 'В очереди',
   [Status.Development]: 'В разработке',
   [Status.Done]: 'Завершено',
};

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
   padding: 10,
   background: isDragging ? 'rgb(254 226 226)' : 'white',
   borderRadius: '10px',
   color: isDragging ? 'white' : 'black',
   ...draggableStyle,
});

export const TodoColumn: React.FC<Props> = ({
   items,
   droppableId,
   isVisible = true,
   visibleCols,
}) => {
   const totalItems = items.length;

   const isMobile = screen.width <= 768;

   const renderTotal = () => {
      if (totalItems === 0) return null;

      return (
         <span className="text-gray-500 text-xs sm:text-sm md:text-base">
            ({droppableId === Status.Done ? 'всего' : 'осталось'} <b>{totalItems}</b>)
         </span>
      );
   };

   return (
      <div
         className={`flex-col h-5/6 bg-slate-200 rounded-lg p-2 sm:p-4 md:p-6 justify-start items-center md:space-y-4 ${
            isVisible ? 'flex' : 'hidden'
         }`}
         style={{
            width: `${100 / visibleCols}%`,
            maxWidth: isMobile ? '70%' : '50%',
         }}
      >
         <div className="flex flex-col space-y-1 md:flex-row md:space-x-2 items-center">
            <h2 className="font-semibold text-gray-600 text-sm md:text-lg">
               {columnNameMap[droppableId]}{' '}
            </h2>
            {renderTotal()}
         </div>
         <Droppable droppableId={droppableId}>
            {(provided) => (
               <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="w-full h-full overflow-y-auto flex flex-1 flex-col space-y-2 md:space-y-4 px-1 md:px-4"
               >
                  {items.map((task, index) => (
                     <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                           <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                 snapshot.isDragging,
                                 provided.draggableProps.style,
                              )}
                           >
                              <TaskCard task={task} />
                           </div>
                        )}
                     </Draggable>
                  ))}
                  {provided.placeholder}
               </div>
            )}
         </Droppable>
      </div>
   );
};
