import { GameItem } from '@/app/types/item';
import ItemCard from './ItemCard';
import { countOwned, toggleOwned } from '@/app/utils/itemUtils';

interface CategorySectionProps {
  category: {
    name: string;
    items: GameItem[];
    setItems: React.Dispatch<React.SetStateAction<GameItem[]>>;
  };
  hideOwned: boolean;
  isVisible: boolean;
  toggleVisibility: () => void;
}

export default function CategorySection({
  category: { name, items, setItems },
  hideOwned,
  isVisible,
  toggleVisibility,
}: CategorySectionProps) {
  const totalOwned = countOwned(items);
  const totalItems = items.length;
  const visibleItems = hideOwned ? items.filter((item) => !item.owned) : items;

  const renderHeader = () => (
    <div
      className={`flex justify-between items-center cursor-pointer mb-4 ${
        totalOwned === totalItems ? 'animate-flash-green' : ''
      }`}
      onClick={toggleVisibility}
    >
      <h1 className="text-3xl font-bold flex-1">{name}</h1>
      <span className="text-sm text-blue-500 ml-4">
        Owned: {totalOwned} / {totalItems}
      </span>
    </div>
  );

  const renderItems = () => (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isVisible ? 'opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {visibleItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            toggleOwned={(id) => toggleOwned(id, items, setItems)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {renderHeader()}
      {renderItems()}
    </div>
  );
}