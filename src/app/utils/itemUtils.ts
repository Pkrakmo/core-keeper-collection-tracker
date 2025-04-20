import { GameItem } from '@/app/types/item';

export const countOwned = (items: GameItem[]) => items.filter((item) => item.owned).length;

export const toggleOwned = (
  id: string,
  items: GameItem[],
  setItems: (items: GameItem[]) => void
) => {
  const updated = items.map((item) =>
    item.id === id ? { ...item, owned: !item.owned } : item
  );
  setItems(updated);
};