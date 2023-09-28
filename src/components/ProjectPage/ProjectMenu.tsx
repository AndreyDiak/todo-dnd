import React from 'react';
import { Status } from '../../types';

interface Props {
   visibility: Record<Status, boolean>;
   onClickHandler: (status: Status) => void;
}

export const ProjectMenu = ({ visibility, onClickHandler }: Props) => {
   return (
      <div className="pl-2">
         <h2 className="font-semibold">Включить отображение</h2>
         <div className="flex flex-col space-y-1 md:space-y-2">
            <span className="cursor-pointer" onClick={() => onClickHandler(Status.Queue)}>
               <input type="checkbox" checked={visibility.queue} /> <span>Очередь</span>
            </span>
            <span className="cursor-pointer" onClick={() => onClickHandler(Status.Development)}>
               <input type="checkbox" checked={visibility.development} /> <span>В процессе</span>
            </span>
            <span className="cursor-pointer" onClick={() => onClickHandler(Status.Done)}>
               <input type="checkbox" checked={visibility.done} /> <span>Выполненные</span>
            </span>
         </div>
      </div>
   );
};
