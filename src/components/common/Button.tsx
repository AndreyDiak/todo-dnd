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
         className={`text-white px-3 py-2 rounded-md text-base font-bold ${
            buttonColorMap[color ?? defaultColor]
         } ${className}`}
      >
         {children}
      </button>
   );
};
