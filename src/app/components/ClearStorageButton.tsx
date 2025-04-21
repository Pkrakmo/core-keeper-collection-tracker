'use client';

export default function ClearStorageButton() {
  const handleClearStorage = () => {
    const userConfirmed = confirm(
      'Are you sure you want to clear all saved data?'
    );
    if (userConfirmed) {
      localStorage.clear();
      location.reload();
    }
  };

  return (
    <button
      onClick={handleClearStorage}
      className='w-10 h-10 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 focus:outline-none flex items-center justify-center'
      title='Clear all saved data'
      aria-label='Clear storage'
    >
      🗑️
    </button>
  );
}
