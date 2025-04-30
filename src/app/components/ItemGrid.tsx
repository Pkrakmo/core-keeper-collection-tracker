'use client';

import { GameItem } from '@/app/types/item';
import ItemCard from './ItemCard';

export default function ItemGrid({
  items,
  toggleOwned,
}: {
  items: GameItem[];
  toggleOwned: (id: number) => void;
}) {
  return (
    <div
      className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'
      style={{
        color: 'var(--text)',
      }}
    >
      {items.map((item, index) => (
        <ItemCard
          key={`${item.ObjectID}-${index}`}
          item={item}
          toggleOwned={toggleOwned}
        />
      ))}
    </div>
  );
}
