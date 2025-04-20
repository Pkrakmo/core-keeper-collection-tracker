'use client';

import { useState, useEffect } from 'react';
import { GameItem } from '@/app/types/item';
import { useLocalStorage } from '@/app/hooks/useLocalStorage';

import ItemCard from './ItemCard';
import armorData from '@/public/armors.json';
import weaponData from '@/public/weapons.json';
import treasuresData from '@/public/treasures.json'; // Import treasures data
import accessoriesData from '@/public/accessories.json'; 

type CategoryName = "Armors" | "Accessories" | "Weapons" | "Figurines" | "Oracle Cards";

export default function CollectionGrid() {
  const [armorItems, setArmorItems] = useLocalStorage<GameItem[]>('corekeeper-armor-items', armorData);
  const [weaponItems, setWeaponItems] = useLocalStorage<GameItem[]>(
    'corekeeper-weapon-items',
    weaponData.filter((item) => !item.name.toLowerCase().includes('minion')) // Exclude items with "minion" in the name
  );
  const [accessoriesItems, setAccessoriesItems] = useLocalStorage<GameItem[]>('corekeeper-accessories-items', accessoriesData);
  const [figurineItems, setFigurineItems] = useLocalStorage<GameItem[]>(
    'corekeeper-figurine-items',
    treasuresData.filter((item) => item.name.toLowerCase().includes('figurine'))
  );
  const [oracleCardItems, setOracleCardItems] = useLocalStorage<GameItem[]>(
    'corekeeper-oraclecard-items',
    treasuresData
      .filter((item) => item.name.includes('Oracle Card'))
      .map((item) => ({
        ...item,
        name: item.name.replace('Oracle Card ', 'Oracle Card "').concat('"'),
      }))
  );

  const [hideOwned, setHideOwned] = useLocalStorage<boolean>('corekeeper-hide-owned', false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [allCategoriesVisible, setAllCategoriesVisible] = useState(true); // State to control all categories visibility
  const [categoryVisibility, setCategoryVisibility] = useState({
    Armors: true,
    Accessories: true,
    Weapons: true,
    Figurines: true,
    'Oracle Cards': true,
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const toggleOwned = (id: string, items: GameItem[], setItems: (items: GameItem[]) => void) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, owned: !item.owned } : item
    );
    setItems(updated);
  };

  const countOwned = (items: GameItem[]) => items.filter((item) => item.owned).length;

  const categories: { name: CategoryName; items: GameItem[]; setItems: React.Dispatch<React.SetStateAction<GameItem[]>>; totalOwned: number; totalItems: number }[] = [
    {
      name: "Armors",
      items: armorItems,
      setItems: setArmorItems,
      totalOwned: countOwned(armorItems),
      totalItems: armorItems.length,
    },
    {
      name: "Accessories",
      items: accessoriesItems,
      setItems: setAccessoriesItems,
      totalOwned: countOwned(accessoriesItems),
      totalItems: accessoriesItems.length,
    },
    {
      name: "Weapons",
      items: weaponItems,
      setItems: setWeaponItems,
      totalOwned: countOwned(weaponItems),
      totalItems: weaponItems.length,
    },
    {
      name: "Figurines",
      items: figurineItems,
      setItems: setFigurineItems,
      totalOwned: countOwned(figurineItems),
      totalItems: figurineItems.length,
    },
    {
      name: "Oracle Cards",
      items: oracleCardItems,
      setItems: setOracleCardItems,
      totalOwned: countOwned(oracleCardItems),
      totalItems: oracleCardItems.length,
    },
  ];

  // Sort categories alphabetically by name
  categories.sort((a, b) => a.name.localeCompare(b.name));

  const toggleCategoryVisibility = (categoryName: keyof typeof categoryVisibility) => {
    setCategoryVisibility((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const toggleAllCategories = () => {
    const newVisibility = !allCategoriesVisible;
    setAllCategoriesVisible(newVisibility);

    const updatedVisibility = Object.keys(categoryVisibility).reduce((acc, key) => {
      acc[key as keyof typeof categoryVisibility] = newVisibility;
      return acc;
    }, { ...categoryVisibility }); // Start with the same type as categoryVisibility

    setCategoryVisibility(updatedVisibility);
  };

  if (!isHydrated) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-8 mt-6">
      {/* Global Hide Owned Checkbox */}
      <div className="mb-2 flex justify-between items-center">
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            checked={hideOwned}
            onChange={(e) => setHideOwned(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-sm">Hide owned items</span>
        </label>
        <button
          onClick={toggleAllCategories} // Toggle all categories visibility
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {allCategoriesVisible ? 'Minimize All' : 'Maximize All'}
        </button>
      </div>

      {/* Render Categories */}
      {categories.map((category) => {
        const allOwned = category.totalOwned === category.totalItems;
        const visibleItems = hideOwned
          ? category.items.filter((item) => !item.owned)
          : category.items;

        return (
          <div key={category.name}>
            <div
              className={`flex justify-between items-center cursor-pointer mb-4 ${
                allOwned ? 'animate-flash-green' : ''
              }`}
              onClick={() => toggleCategoryVisibility(category.name)}
            >
              <h1 className="text-3xl font-bold flex-1">{category.name}</h1>
              <span className="text-sm text-blue-500 ml-4">
                Owned: {category.totalOwned} / {category.totalItems}
              </span>
            </div>

            {categoryVisibility[category.name] && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {visibleItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    toggleOwned={(id) => toggleOwned(id, category.items, category.setItems)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
