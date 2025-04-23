import { GameItem } from '@/app/types/item';

export const countOwned = (items: GameItem[]) =>
  items.filter((item) => item.Owned).length;

export const toggleOwned = (
  id: string,
  items: GameItem[],
  setItems: (items: GameItem[]) => void
) => {
  const updated = items.map((item) =>
    item.ObjectID === Number(id) ? { ...item, owned: !item.Owned } : item
  );
  setItems(updated);
};
