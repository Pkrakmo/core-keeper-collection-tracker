'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { GameItem } from '@/app/types/item';
import CategorySection from './CategorySection';
import FilterControls from './FilterControls';

import data from '@/public/itemData.json';

export default function CollectionGrid({ hideOwned }: { hideOwned: boolean }) {
  const { t } = useTranslation();

  const [isHydrated, setIsHydrated] = useState(false);
  const [mainCategoryVisibility, setMainCategoryVisibility] = useState<
    Record<string, boolean>
  >({});
  const [subCategoryVisibility, setSubCategoryVisibility] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [items, setItems] = useState<GameItem[]>(data);
  const [sortOrder, setSortOrder] = useState<
    'A-Z' | 'Z-A' | 'Lowest-Highest' | 'Highest-Lowest'
  >('A-Z');
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

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      if (sortOrder === 'A-Z') {
        return a.InGameName.localeCompare(b.InGameName);
      } else if (sortOrder === 'Z-A') {
        return b.InGameName.localeCompare(a.InGameName);
      } else if (sortOrder === 'Lowest-Highest') {
        return (a.BaseLevel ?? 0) - (b.BaseLevel ?? 0);
      } else if (sortOrder === 'Highest-Lowest') {
        return (b.BaseLevel ?? 0) - (a.BaseLevel ?? 0);
      }
      return 0;
    });
  }, [filteredItems, sortOrder]);

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
      mainCategory: t(`categories.${mainCategory}`), // Translate MainCategory
      subCategories: Object.entries(subCategories)
        .map(([subCategory, items]) => ({
          subCategory: t(`categories.${subCategory}`), // Translate SubCategory
          items,
        }))
        .sort((a, b) => a.subCategory.localeCompare(b.subCategory)),
    }));

    return unsortedCategories.sort((a, b) =>
      a.mainCategory.localeCompare(b.mainCategory)
    );
  }, [sortedItems, t]);

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
          acc[category.mainCategory] = true; // Use original keys
          return acc;
        }, {});

        const initialSubVisibility = categories.reduce<
          Record<string, Record<string, boolean>>
        >((acc, category) => {
          acc[category.mainCategory] = category.subCategories.reduce<
            Record<string, boolean>
          >((subAcc, subCategory) => {
            subAcc[subCategory.subCategory] = true; // Use original keys
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
        [subCategory]: !prev[mainCategory]?.[subCategory], // Use optional chaining to avoid undefined errors
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
        <FilterControls
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          selectedFlag={selectedFlag}
          setSelectedFlag={setSelectedFlag}
          searchText={searchText}
          setSearchText={setSearchText}
          setAllMainCategoriesVisibility={setAllMainCategoriesVisibility}
          setAllSubCategoriesVisibility={setAllSubCategoriesVisibility}
          items={items}
        />
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
