'use client';
export default function InformationButton({
  isOpen,
  onOpen,
  onClose,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <>
      {/* Information Button */}
      <button
        onClick={() => (isOpen ? onClose() : onOpen())}
        className='w-10 h-10 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none flex items-center justify-center'
        title='Information'
      >
        ℹ️
      </button>

      {/* Modal */}
      {isOpen && (
        <div className='fixed inset-0 flex items-center justify-center pointer-events-none z-50'>
          <div className='bg-blue-100 p-6 rounded-lg shadow-lg w-80 pointer-events-auto relative'>
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
              If you want to contribute or ran into an issue using this app
              please check out the GitHub Project{' '}
              <a
                href='https://github.com/Pkrakmo/core-keeper-collection-tracker/issues'
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 underline hover:text-blue-800'
              >
                repo
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
