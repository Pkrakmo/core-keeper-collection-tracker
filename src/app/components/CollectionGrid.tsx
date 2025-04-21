'use client';

import { useState, useEffect } from 'react';
import { GameItem } from '@/app/types/item';
import { useLocalStorage } from '@/app/hooks/useLocalStorage';
import CategorySection from './CategorySection';

import armorData from '@/public/armors.json';
import weaponData from '@/public/weapons.json';
import treasuresData from '@/public/treasures.json';
import accessoriesData from '@/public/accessories.json';

export default function CollectionGrid({ hideOwned }: { hideOwned: boolean }) {
  const [armorItems, setArmorItems] = useLocalStorage<GameItem[]>(
    'corekeeper-armor-items',
    armorData
  );
  const [weaponItems, setWeaponItems] = useLocalStorage<GameItem[]>(
    'corekeeper-weapon-items',
    weaponData.filter((item) => !item.name.toLowerCase().includes('minion'))
  );
  const [accessoriesItems, setAccessoriesItems] = useLocalStorage<GameItem[]>(
    'corekeeper-accessories-items',
    accessoriesData
  );
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

  const [isHydrated, setIsHydrated] = useState(false);
  const [categoryVisibility, setCategoryVisibility] = useState({
    Armors: true,
    Accessories: true,
    Weapons: true,
    Figurines: true,
    'Oracle Cards': true,
  });

  useEffect(() => {
    const savedVisibility =
      typeof window !== 'undefined'
        ? localStorage.getItem('categoryVisibility')
        : null;
    if (savedVisibility) {
      setCategoryVisibility(JSON.parse(savedVisibility));
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(
        'categoryVisibility',
        JSON.stringify(categoryVisibility)
      );
    }
  }, [categoryVisibility, isHydrated]);

  const categories = [
    { name: 'Armors', items: armorItems, setItems: setArmorItems },
    {
      name: 'Accessories',
      items: accessoriesItems,
      setItems: setAccessoriesItems,
    },
    { name: 'Weapons', items: weaponItems, setItems: setWeaponItems },
    { name: 'Figurines', items: figurineItems, setItems: setFigurineItems },
    {
      name: 'Oracle Cards',
      items: oracleCardItems,
      setItems: setOracleCardItems,
    },
  ].sort((a, b) => a.name.localeCompare(b.name));

  const setAllCategoriesVisibility = (visibility: boolean) => {
    setCategoryVisibility({
      Armors: visibility,
      Accessories: visibility,
      Weapons: visibility,
      Figurines: visibility,
      'Oracle Cards': visibility,
    });
  };

  if (!isHydrated) return <div>Loading...</div>;

  return (
    <div className='flex flex-col gap-8 mt-6'>
      <div className='mb-2 flex justify-between items-center'>
        <div className='flex space-x-2'>
          <button
            onClick={() => setAllCategoriesVisibility(false)}
            className='px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700'
          >
            Minimize All
          </button>
          <button
            onClick={() => setAllCategoriesVisibility(true)}
            className='px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700'
          >
            Maximize All
          </button>
        </div>
      </div>

      {/* Render Categories */}
      {categories.map((category) => (
        <CategorySection
          key={category.name}
          category={category}
          hideOwned={hideOwned}
          isVisible={
            categoryVisibility[category.name as keyof typeof categoryVisibility]
          }
          toggleVisibility={() =>
            setCategoryVisibility((prev) => ({
              ...prev,
              [category.name]:
                !prev[category.name as keyof typeof categoryVisibility],
            }))
          }
        />
      ))}
    </div>
  );
}
