'use client';

export default function HideOwnedButton({
  hideOwned,
  toggleHideOwned,
}: {
  hideOwned: boolean;
  toggleHideOwned: () => void;
}) {
  return (
    <button
      onClick={toggleHideOwned}
      className={`w-19 h-10 ${
        hideOwned ? 'bg-blue-600' : 'bg-blue-600'
      } text-white rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none flex flex-col items-center justify-center text-xs font-medium`}
      title={hideOwned ? 'Show all items' : 'Hide owned items'}
    >
      {hideOwned ? (
        <>
          Show
          <br />
          Owned Items
        </>
      ) : (
        <>
          Hide
          <br />
          Owned Items
        </>
      )}
    </button>
  );
}
