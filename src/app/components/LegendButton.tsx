'use client';

import { useState } from 'react';
import { iconMappings } from '@/app/utils/iconMappings';
import Image from 'next/image';

export default function LegendButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Legend Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-30 w-10 h-10 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
        title="Legend"
      >
        ℹ️
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Legend</h2>
            <ul className="space-y-2">
              {Object.entries(iconMappings).map(([key, { src, title }]) => (
                <li key={key} className="flex items-center space-x-2">
                  <Image src={src} alt={title} width={24} height={24} className="w-6 h-6" />
                  <span className="text-gray-600">{title}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}