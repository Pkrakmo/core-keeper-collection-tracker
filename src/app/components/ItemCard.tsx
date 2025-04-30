'use client';

import { GameItem } from '@/app/types/item';
import { iconMappings } from '@/app/utils/iconMappings';
import Image from 'next/image';

interface Props {
  item: GameItem;
  toggleOwned: (id: number) => void;
}

export default function ItemCard({ item, toggleOwned }: Props) {
  // Define the basePath
  const isExport = process.env.NEXT_PUBLIC_IS_EXPORT === 'true';
  const basePath = isExport ? '/core-keeper-collection-tracker' : '';

  // Open the item's wiki link
  const openItemLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const itemName = encodeURIComponent(item.InGameName);
    window.open(`https://core-keeper.fandom.com/wiki/${itemName}`, '_blank');
  };

  // Render an icon based on a flag
  const renderIcon = (flag: keyof typeof iconMappings) => {
    if (iconMappings[flag] && item.Flags?.includes(flag)) {
      const { src, alt, title } = iconMappings[flag];
      return (
        <Image
          key={flag}
          src={`${basePath}${src}`}
          alt={alt}
          width={24}
          height={24}
          className='w-6 h-6'
          title={title}
        />
      );
    }
    return null; // Return null if the flag is not defined in iconMappings
  };

  return (
    <div
      className={`relative cursor-pointer border rounded-lg p-2 flex flex-col items-center shadow-sm transition`}
      style={{
        backgroundColor: item.Owned ? 'var(--primary)' : 'var(--background)',
        color: 'var(--text)',
      }}
      onClick={() => toggleOwned(item.ObjectID)}
    >
      {/* Icons in the top-left corner */}
      <div className='absolute top-2 left-2 flex gap-1'>
        {(
          [
            'loot',
            'merchant',
            'dropped',
            'dig',
            'diggingBeach',
            'diggingForest',
            'diggingDesert',
            'diggingLava',
            'diggingNormal',
            'desertFishingLoot',
            'seaFishingLoot',
            'moldFishingLoot',
            'natureFishingLoot',
            'stoneFishingLoot',
          ] as (keyof typeof iconMappings)[]
        ).map(renderIcon)}
      </div>

      {/* Button in the top-right corner */}
      <button
        onClick={openItemLink}
        className='absolute top-2 right-2'
        style={{
          color: 'var(--accent)',
        }}
        title='View item details on wiki'
      >
        ❔
      </button>

      {/* Item Icon */}
      {item.Icon ? (
        <Image
          src={`${basePath}${item.Icon}`}
          alt={item.InGameName || 'Item image'}
          width={48}
          height={48}
          className='w-12 h-12 mb-1'
        />
      ) : (
        <div
          className='w-12 h-12 mb-1 flex items-center justify-center'
          style={{
            backgroundColor: 'var(--secondary)',
            color: 'var(--text)',
          }}
        >
          <span className='text-sm'>No Image</span>
        </div>
      )}

      {/* Item Name */}
      <div className='flex items-center gap-1 mb-4'>
        <p
          className='text-center font-medium text-sm transition'
          style={{
            color: item.Owned ? 'var(--text-on-primary)' : 'var(--text)',
          }}
        >
          {item.InGameName || 'Unnamed Item'}
        </p>
      </div>

      {/* BaseLevel in the bottom-left corner */}
      {item.BaseLevel !== undefined && item.BaseLevel > 0 && (
        <div
          className='absolute bottom-2 left-2 text-xs font-bold bg-opacity-50 px-1 rounded'
          style={{
            color: 'var(--text)',
          }}
          title='Item Base Level'
        >
          {item.BaseLevel}
        </div>
      )}
    </div>
  );
}
