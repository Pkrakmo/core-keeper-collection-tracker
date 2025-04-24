'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { GameItem } from '@/app/types/item';
import CategorySection from './CategorySection';

import data from '@/public/itemData.json';

export default function CollectionGrid({ hideOwned }: { hideOwned: boolean }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [mainCategoryVisibility, setMainCategoryVisibility] = useState<
    Record<string, boolean>
  >({});
  const [subCategoryVisibility, setSubCategoryVisibility] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [items, setItems] = useState<GameItem[]>(data);
  const [sortOrder, setSortOrder] = useState<'A-Z' | 'Z-A' | 'Lowest-Highest' | 'Highest-Lowest'>('A-Z');
  const [selectedFlag, setSelectedFlag] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');

  const filteredItems = useMemo(() => {
    let filtered = items;
    if (selectedFlag) {
      filtered = filtered.filter((item) => item.Flags?.includes(selectedFlag));
    }
    if (searchText) {
      filtered = filtered.filter((item) =>
        item.InGameName.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    return filtered;
  }, [items, selectedFlag, searchText]);

  // Sort items based on sortOrder
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      if (sortOrder === 'A-Z') {
        return a.InGameName.localeCompare(b.InGameName);
      } else if (sortOrder === 'Z-A') {
        return b.InGameName.localeCompare(a.InGameName);
      } else if (sortOrder === 'Lowest-Highest') {
        return (a.BaseLevel ?? 0) - (b.BaseLevel ?? 0); // Handle undefined BaseLevel
      } else if (sortOrder === 'Highest-Lowest') {
        return (b.BaseLevel ?? 0) - (a.BaseLevel ?? 0); // Handle undefined BaseLevel
      }
      return 0;
    });
  }, [filteredItems, sortOrder]);

  // Create and sort categories and subcategories by name
  const categories = useMemo(() => {
    const unsortedCategories = Object.entries(
      sortedItems.reduce<Record<string, Record<string, GameItem[]>>>(
        (acc, item: GameItem) => {
          if (!acc[item.MainCategory]) acc[item.MainCategory] = {};
          if (!acc[item.MainCategory][item.SubCategory])
            acc[item.MainCategory][item.SubCategory] = [];
          acc[item.MainCategory][item.SubCategory].push(item);
          return acc;
        },
        {}
      )
    ).map(([mainCategory, subCategories]) => ({
      mainCategory,
      subCategories: Object.entries(subCategories)
        .map(([subCategory, items]) => ({
          subCategory,
          items,
        }))
        .sort((a, b) => a.subCategory.localeCompare(b.subCategory)), // Sort subcategories by name
    }));

    // Sort categories by mainCategory name
    return unsortedCategories.sort((a, b) =>
      a.mainCategory.localeCompare(b.mainCategory)
    );
  }, [sortedItems]);

  useEffect(() => {
    if (!isHydrated) {
      const savedMainVisibility = localStorage.getItem(
        'mainCategoryVisibility'
      );
      const savedSubVisibility = localStorage.getItem('subCategoryVisibility');

      if (savedMainVisibility && savedSubVisibility) {
        setMainCategoryVisibility(JSON.parse(savedMainVisibility));
        setSubCategoryVisibility(JSON.parse(savedSubVisibility));
      } else {
        const initialMainVisibility = categories.reduce<
          Record<string, boolean>
        >((acc, category) => {
          acc[category.mainCategory] = true; // Default all main categories to visible
          return acc;
        }, {});

        const initialSubVisibility = categories.reduce<
          Record<string, Record<string, boolean>>
        >((acc, category) => {
          acc[category.mainCategory] = category.subCategories.reduce<
            Record<string, boolean>
          >((subAcc, subCategory) => {
            subAcc[subCategory.subCategory] = true; // Default all subcategories to visible
            return subAcc;
          }, {});
          return acc;
        }, {});

        setMainCategoryVisibility(initialMainVisibility);
        setSubCategoryVisibility(initialSubVisibility);
      }
      setIsHydrated(true);
    }
  }, [isHydrated, categories]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(
        'mainCategoryVisibility',
        JSON.stringify(mainCategoryVisibility)
      );
      localStorage.setItem(
        'subCategoryVisibility',
        JSON.stringify(subCategoryVisibility)
      );
    }
  }, [mainCategoryVisibility, subCategoryVisibility, isHydrated]);

  const toggleMainCategoryVisibility = (mainCategory: string) => {
    setMainCategoryVisibility((prev) => ({
      ...prev,
      [mainCategory]: !prev[mainCategory],
    }));
  };

  const toggleSubCategoryVisibility = (
    mainCategory: string,
    subCategory: string
  ) => {
    setSubCategoryVisibility((prev) => ({
      ...prev,
      [mainCategory]: {
        ...prev[mainCategory],
        [subCategory]: !prev[mainCategory][subCategory],
      },
    }));
  };

  const setAllMainCategoriesVisibility = (visibility: boolean) => {
    const updatedVisibility = Object.keys(mainCategoryVisibility).reduce<
      Record<string, boolean>
    >((acc, mainCategory) => {
      acc[mainCategory] = visibility;
      return acc;
    }, {});
    setMainCategoryVisibility(updatedVisibility);
  };

  const setAllSubCategoriesVisibility = (visibility: boolean) => {
    const updatedVisibility = Object.keys(subCategoryVisibility).reduce<
      Record<string, Record<string, boolean>>
    >((acc, mainCategory) => {
      acc[mainCategory] = Object.keys(
        subCategoryVisibility[mainCategory] || {}
      ).reduce<Record<string, boolean>>((subAcc, subCategory) => {
        subAcc[subCategory] = visibility;
        return subAcc;
      }, {});
      return acc;
    }, {});
    setSubCategoryVisibility(updatedVisibility);
  };

  const toggleOwned = (id: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.ObjectID === id ? { ...item, Owned: !item.Owned } : item
      )
    );
  };

  if (!isHydrated) return <div>Loading...</div>;

  return (
    <div className='flex flex-col gap-8 mt-6'>
      <div className='mb-2 flex flex-wrap gap-2 justify-between items-center'>
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
                e.target.value as 'A-Z' | 'Z-A' | 'Lowest-Highest' | 'Highest-Lowest'
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
            onChange={(e) =>
              setSelectedFlag(e.target.value || null) // Set null if no filter is selected
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
      </div>

      {categories.map((category, index) => (
        <CategorySection
          key={`${category.mainCategory}-${index}`}
          ref={(ref: HTMLDivElement | null) => {
            categoryRefs.current[category.mainCategory] = ref;
          }}
          category={category}
          hideOwned={hideOwned}
          toggleOwned={toggleOwned}
          isVisible={mainCategoryVisibility[category.mainCategory]}
          toggleVisibility={() =>
            toggleMainCategoryVisibility(category.mainCategory)
          }
          toggleSubCategoryVisibility={toggleSubCategoryVisibility}
          subCategoryVisibility={
            subCategoryVisibility[category.mainCategory] || {}
          }
        />
      ))}
    </div>
  );
}