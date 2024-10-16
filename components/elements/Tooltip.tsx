import React, { useState } from 'react';
import { Transition } from '@headlessui/react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      <Transition
        show={isVisible}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="absolute z-10 w-48 px-2 py-1 text-sm font-medium text-white bg-gray-700 rounded-md shadow-lg -top-8 left-1/2 transform -translate-x-1/2 -translate-y-full">
          {content}
          <div className="absolute w-2 h-2 bg-gray-700 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      </Transition>
    </div>
  );
};

export default Tooltip;