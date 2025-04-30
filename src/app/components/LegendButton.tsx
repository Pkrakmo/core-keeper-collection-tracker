'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { iconMappings } from '@/app/utils/iconMappings';
import Image from 'next/image';

export default function LegendButton() {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  // Define the basePath
  const isExport = process.env.NEXT_PUBLIC_IS_EXPORT === 'true';
  const basePath = isExport ? '/core-keeper-collection-tracker' : '';

  return (
    <>
      {/* Legend Button */}
      <button
        onClick={isOpen ? onClose : onOpen} // Toggle modal on button click
        className='w-10 h-10 rounded-full shadow-lg hover:opacity-90 focus:outline-none flex items-center justify-center'
        style={{
          backgroundColor: 'var(--primary)', // Dynamic background color
          color: 'var(--text-on-primary)', // Dynamic text color
        }}
        title='Legend'
      >
        📜
      </button>

      {/* Modal */}
      {isOpen &&
        createPortal(
          <div
            className='fixed inset-0 z-50 flex items-center justify-center'
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent background
            }}
            onClick={onClose} // Close modal when clicking outside the content
          >
            <div
              className='p-6 rounded-lg shadow-lg w-130 relative'
              style={{
                backgroundColor: 'var(--secondary)', // Dynamic modal background
                color: 'var(--text)', // Dynamic text color
              }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className='absolute top-2 right-2 hover:opacity-80 focus:outline-none'
                style={{
                  color: 'var(--text)', // Dynamic close button color
                }}
                title='Close'
                aria-label='Close'
              >
                ✖
              </button>

              <h2
                className='text-xl font-bold mb-4'
                style={{
                  color: 'var(--text)', // Dynamic heading color
                }}
              >
                Legend
              </h2>
              <div className='grid grid-cols-2 gap-4'>
                {Object.entries(iconMappings).map(([key, { src, title }]) => {
                  const fullSrc = `${basePath}${src}`;

                  return (
                    <div key={key} className='flex items-center space-x-2'>
                      <Image
                        src={fullSrc}
                        alt={title}
                        width={24}
                        height={24}
                        className='w-6 h-6'
                      />
                      <span
                        style={{
                          color: 'var(--text)', // Dynamic text color for icons
                        }}
                      >
                        {title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>,
          document.body // Render the modal at the root of the DOM
        )}
    </>
  );
}
