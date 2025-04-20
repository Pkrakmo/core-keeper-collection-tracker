export interface GameItem {
    id: string;
    name: string;
    icon: string;
    boss: boolean;
    seasonal: boolean;
    craftable: boolean;
    merchant: boolean;
    dropped: boolean;
    owned: boolean;
    fishing: boolean;
    loot: boolean;
    dig: boolean;
  }