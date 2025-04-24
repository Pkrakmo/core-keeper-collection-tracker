'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';

export default function InformationButton() {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <>
      {/* Information Button */}
      <button
        onClick={isOpen ? onClose : onOpen} // Toggle modal on button click
        className='w-10 h-10 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none flex items-center justify-center'
        title='Information'
      >
        ℹ️
      </button>

      {/* Modal */}
      {isOpen &&
        createPortal(
          <div
            className='fixed inset-0 z-50 flex items-center justify-center'
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} // Transparent background
            onClick={onClose} // Close modal when clicking outside the content
          >
            <div
              className='bg-blue-100 p-6 rounded-lg shadow-lg w-80 relative'
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className='absolute top-2 right-2 text-gray-600 hover:text-gray-900 focus:outline-none'
                title='Close'
                aria-label='Close'
              >
                ✖
              </button>

              <h2 className='text-xl font-bold mb-4 text-gray-900'>
                Information
              </h2>
              <p className='text-gray-800 mb-4'>
                Thanks for using this application!
                <br />
                <br />
                This is a version of the tracker that I update regularly with
                new features and improvements. The saved data might be corrupted
                when I keep updating the app, so please do not rely on it for
                long-term use.
                <br />
                <br />
                If you should encounter any issues, please clear your browser&#39;s
                local storage for this app.
                <br />
                <br />
                If you want to contribute or ran into an issue using this app,
                please check out the GitHub Project{' '}
                <a
                  href='https://github.com/Pkrakmo/core-keeper-collection-tracker'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 underline hover:text-blue-800'
                >
                  repo
                </a>
              </p>
            </div>
          </div>,
          document.body // Render the modal at the root of the DOM
        )}
    </>
  );
}