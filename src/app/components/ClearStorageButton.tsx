'use client';

export default function ClearStorageButton() {
  const clearLocalStorage = () => {
    localStorage.clear();
    window.location.reload(); // Reload the page to reflect the changes
  };

  return (
    <button
      onClick={clearLocalStorage}
      className="mt-6 px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition"
    >
      Clear Local Storage
    </button>
  );
}