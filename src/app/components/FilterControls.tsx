import React from 'react';
import { GameItem } from '../types/item';

interface FilterControlsProps {
  sortOrder: 'A-Z' | 'Z-A' | 'Lowest-Highest' | 'Highest-Lowest';
  setSortOrder: (
    value: 'A-Z' | 'Z-A' | 'Lowest-Highest' | 'Highest-Lowest'
  ) => void;
  selectedFlag: string | null;
  setSelectedFlag: (value: string | null) => void;
  searchText: string;
  setSearchText: (value: string) => void;
  setAllMainCategoriesVisibility: (visibility: boolean) => void;
  setAllSubCategoriesVisibility: (visibility: boolean) => void;
  items: GameItem[];
}

export default function FilterControls({
  sortOrder,
  setSortOrder,
  selectedFlag,
  setSelectedFlag,
  searchText,
  setSearchText,
  setAllMainCategoriesVisibility,
  setAllSubCategoriesVisibility,
  items,
}: FilterControlsProps) {
  return (
    <div className='flex flex-wrap gap-2 w-full md:w-auto'>
      <button
        onClick={() => {
          setAllMainCategoriesVisibility(false);
          setAllSubCategoriesVisibility(false);
        }}
        className='px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700'
      >
        Minimize All
      </button>
      <button
        onClick={() => {
          setAllMainCategoriesVisibility(true);
          setAllSubCategoriesVisibility(true);
        }}
        className='px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700'
      >
        Maximize All
      </button>
      {/* Sorting Dropdown */}
      <select
        value={sortOrder}
        onChange={(e) =>
          setSortOrder(
            e.target.value as
              | 'A-Z'
              | 'Z-A'
              | 'Lowest-Highest'
              | 'Highest-Lowest'
          )
        }
        className='px-2 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 focus:outline-none'
      >
        <option value='A-Z'>Sort A-Z</option>
        <option value='Z-A'>Sort Z-A</option>
        <option value='Lowest-Highest'>Base Level: Low / High</option>
        <option value='Highest-Lowest'>Base Level: High / Low</option>
      </select>
      {/* Filter Dropdown */}
      <select
        value={selectedFlag || ''}
        onChange={
          (e) => setSelectedFlag(e.target.value || null) // Set null if no filter is selected
        }
        className='px-2 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 focus:outline-none'
      >
        <option value=''>All Items</option>
        {/* Dynamically populate flags and sort them alphabetically */}
        {Array.from(new Set(items.flatMap((item) => item.Flags || [])))
          .sort((a, b) => a.localeCompare(b)) // Sort flags alphabetically
          .map((flag) => (
            <option key={flag} value={flag}>
              {flag}
            </option>
          ))}
      </select>
      {/* Text Filter */}
      <input
        type='text'
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder='Search by name...'
        className='px-2 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 focus:outline-none'
      />
    </div>
  );
}
