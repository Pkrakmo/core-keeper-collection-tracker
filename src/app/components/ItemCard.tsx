'use client';

import { GameItem } from '@/app/types/item';
import { iconMappings } from '@/app/utils/iconMappings';
import Image from 'next/image';

type Props = {
  item: GameItem;
  toggleOwned: (id: string) => void;
};

export default function ItemCard({ item, toggleOwned }: Props) {
  const openItemLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const itemName = encodeURIComponent(item.name);
    window.open(`https://core-keeper.fandom.com/wiki/${itemName}`, '_blank');
  };

  return (
    <div
      onClick={() => toggleOwned(item.id)}
      className={`relative cursor-pointer border rounded-lg p-2 flex flex-col items-center shadow-sm transition 
        ${item.owned ? 'bg-blue-100 border-green-400' : 'bg-black'}
        sm:p-3 sm:rounded-xl`}
    >
      {/* Icons in the top-right corner */}
      <div className="absolute top-2 left-2 flex gap-1">
        {Object.entries(iconMappings).map(([key, { src, alt, title }]) =>
          item[key as keyof GameItem] ? (
            <Image
              key={key}
              src={src}
              alt={alt}
              width={16} // Adjusted size for w-4
              height={16} // Adjusted size for h-4
              className="w-4 h-4"
              title={title}
            />
          ) : null
        )}
      </div>

      {/* Button in the top-right corner */}
      <button
        onClick={openItemLink}
        className="absolute top-2 right-8 text-blue-500"
        title="View item details on wiki"
      >
        ?
      </button>

      {item.icon ? (
        <Image
          src={item.icon}
          alt={item.name || 'Item image'}
          width={48} // Adjusted size for w-12
          height={48} // Adjusted size for h-12
          className="w-12 h-12 mb-1"
        />
      ) : (
        <div className="w-12 h-12 mb-1 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-sm">No Image</span>
        </div>
      )}
      <div className="flex items-center gap-1">
        <p
          className={`text-center font-medium text-sm transition ${
            item.owned ? 'text-green-800' : 'text-white'
          }`}
        >
          {item.name || 'Unnamed Item'}
        </p>
      </div>
    </div>
  );
}