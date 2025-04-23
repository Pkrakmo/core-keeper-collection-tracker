'use client';

import { iconMappings } from '@/app/utils/iconMappings';
import Image from 'next/image';

export default function LegendButton({
  isOpen,
  onOpen,
  onClose,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  // Define the basePath
  const isExport = process.env.NEXT_PUBLIC_IS_EXPORT === 'true';
  const basePath = isExport ? '/core-keeper-collection-tracker' : '';

  return (
    <>
      {/* Legend Button */}
      <button
        onClick={() => (isOpen ? onClose() : onOpen())}
        className='w-10 h-10 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 focus:outline-none flex items-center justify-center'
        title='Legend'
      >
        📜
      </button>

      {/* Modal */}
      {isOpen && (
        <div className='fixed inset-0 flex items-center justify-center z-50'>
          <div className='bg-blue-100 p-6 rounded-lg shadow-lg w-80 relative'>
            {/* Close Button */}
            <button
              onClick={onClose}
              className='absolute top-2 right-2 text-gray-600 hover:text-gray-900 focus:outline-none'
              title='Close'
              aria-label='Close'
            >
              ✖
            </button>

            <h2 className='text-xl font-bold mb-4 text-gray-900'>Legend</h2>
            <ul className='space-y-2'>
              {Object.entries(iconMappings).map(([key, { src, title }]) => {
                const fullSrc = `${basePath}${src}`;

                return (
                  <li key={key} className='flex items-center space-x-2'>
                    <Image
                      src={fullSrc}
                      alt={title}
                      width={24}
                      height={24}
                      className='w-6 h-6'
                    />
                    <span className='text-gray-900'>{title}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}