import React, { ReactNode } from 'react';

interface Props {
   children: ReactNode;
   className?: string;
   color?: 'blue' | 'green' | 'red';
   onClick?(): void;
}

const buttonColorMap = {
   blue: 'bg-blue-400 hover:bg-blue-600 ',
   green: 'bg-green-500 hover:bg-green-700',
   red: 'bg-red-400 hover:bg-red-600',
};

const defaultColor = 'blue';

export const Button: React.FC<Props> = ({ children, className, color, onClick }) => {
   return (
      <button
         onClick={onClick}
         className={`text-white text-sm px-2 py-1 lg:px-3 lg:py-2 rounded-md lg:text-base font-bold ${
            buttonColorMap[color ?? defaultColor]
         } ${className}`}
      >
         {children}
      </button>
   );
};
