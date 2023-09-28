import React, { useState } from 'react';
import { capitalizeFirstLetter } from '../../utils';

interface Props<T> {
   items: {
      value: T;
      label: string;
   }[];
   defaultValue: T;
   onChange(value: T): void;
}

export const Selector = <T extends string>({ items, defaultValue, onChange }: Props<T>) => {
   const [active, setActive] = useState(defaultValue);

   return (
      <div className="bg-gray-200 rounded-md space-x-4 px-2 py-1 max-w-fit">
         {items.map(({ value, label }, index) => (
            <button
               key={index}
               className={`py-1 px-2 rounded-lg font-semibold font-sans text-gray-700 ${
                  active === value ? 'bg-gray-400 text-gray-900' : ''
               }`}
               onClick={() => {
                  setActive(value);
                  onChange(value);
               }}
            >
               {capitalizeFirstLetter(label)}
            </button>
         ))}
      </div>
   );
};
