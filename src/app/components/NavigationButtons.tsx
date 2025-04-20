import ClearStorageButton from './ClearStorageButton'; // Import ClearStorageButton

export default function NavigationButtons() {
  return (
    <div className="flex gap-4 mt-4">
      {/* Example buttons */}
      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
        About
      </button>

      {/* Use ClearStorageButton */}
      <ClearStorageButton />
    </div>
  );
}