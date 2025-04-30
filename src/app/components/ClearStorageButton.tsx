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
      className='w-10 h-10 rounded-full shadow-lg focus:outline-none flex items-center justify-center'
      style={{
        backgroundColor: 'var(--primary)',
        color: 'var(--text)',
      }}
      title='Clear all saved data'
      aria-label='Clear storage'
    >
      🗑️
    </button>
  );
}
