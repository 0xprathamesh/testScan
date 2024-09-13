
"use client" 
import React, { useState } from 'react';
import SetRPCModal from '../SetRPCModal';

const ParentComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button
        onClick={openModal}
        className="bg-blue text-white px-2 py-1 rounded font-inter text-sm"
      >
        Update RPC URL
      </button>

      {isModalOpen && <SetRPCModal onClose={closeModal} />}
    </div>
  );
};

export default ParentComponent;
