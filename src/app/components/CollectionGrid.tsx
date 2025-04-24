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

  // Sort items by InGameName
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.InGameName.localeCompare(b.InGameName));
  }, [items]);

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
      <div className='mb-2 flex justify-between items-center'>
        <div className='flex space-x-2'>
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
