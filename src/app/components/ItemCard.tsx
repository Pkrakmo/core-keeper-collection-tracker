'use client';

import { GameItem } from '@/app/types/item';

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

  const iconMappings: { [key: string]: { src: string; alt: string; title: string } } = {
    seasonal: { src: '/icons/seasonal.png', alt: 'Seasonal Icon', title: 'Seasonal Item' },
    boss: { src: '/icons/boss.png', alt: 'Boss Icon', title: 'Boss Item' },
    craftable: { src: '/icons/craft.png', alt: 'Craftable Icon', title: 'Craftable Item' },
    loot: { src: '/icons/loot.png', alt: 'Loot Icon', title: 'Loot Item' },
    fishing: { src: '/icons/fish.png', alt: 'Fishing Icon', title: 'Fishing Item' },
    merchant: { src: '/icons/vendor.png', alt: 'Merchant Icon', title: 'Merchant Item' },
    dropped: { src: '/icons/drop.png', alt: 'Drop Icon', title: 'Drop Item' },
    dig: { src: '/icons/dig.png', alt: 'Digspot Icon', title: 'Digspot Item' },
  };

  return (
    <div
      onClick={() => toggleOwned(item.id)}
      className={`relative cursor-pointer border rounded-lg p-2 flex flex-col items-center shadow-sm transition 
        ${item.owned ? 'bg-blue-100 border-green-400' : 'bg-black'}
        sm:p-3 sm:rounded-xl`} // Adjust padding and border radius for larger screens
    >
      {/* Icons in the top-right corner */}
      <div className="absolute top-2 left-2 flex gap-1">
        {Object.entries(iconMappings).map(([key, { src, alt, title }]) =>
          item[key as keyof GameItem] ? (
            <img key={key} src={src} alt={alt} className="w-4 h-4" title={title} />
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
        <img
          src={item.icon}
          alt={item.name || 'Item image'}
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