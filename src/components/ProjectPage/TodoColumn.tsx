import React from 'react';
import { Status, Task } from '../../types';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { TaskCard } from './Task/TaskCard';

interface Props {
   droppableId: Status;
   items: Task[];
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

export const TodoColumn: React.FC<Props> = ({ items, droppableId }) => {
   const totalItems = items.length;

   const renderTotal = () => {
      if (totalItems === 0) return null;

      return (
         <span className="text-gray-500">
            ({droppableId === Status.Done ? 'всего' : 'осталось'} <b>{totalItems}</b>)
         </span>
      );
   };

   return (
      <div className="flex flex-col h-[85%] w-[400px] bg-slate-200 rounded-lg p-6 justify-start items-center space-y-4">
         <div className="flex space-x-2 items-center">
            <h2 className="font-semibold text-gray-600 text-lg">{columnNameMap[droppableId]} </h2>
            {renderTotal()}
         </div>
         <Droppable droppableId={droppableId}>
            {(provided) => (
               <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="w-full h-full overflow-y-auto flex flex-col space-y-4"
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
