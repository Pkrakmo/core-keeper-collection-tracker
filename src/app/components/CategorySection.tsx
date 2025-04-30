import { forwardRef, useImperativeHandle } from 'react';
import { GameItem } from '@/app/types/item';
import ItemGrid from './ItemGrid';

interface CategorySectionProps {
  category: {
    mainCategory: string;
    subCategories: { subCategory: string; items: GameItem[] }[];
  };
  hideOwned: boolean;
  isVisible: boolean;
  toggleVisibility: () => void;
  toggleOwned: (id: number) => void;
  toggleSubCategoryVisibility: (
    mainCategory: string,
    subCategory: string
  ) => void;
  subCategoryVisibility: Record<string, boolean>;
}

export default forwardRef(function CategorySection(
  {
    category: { mainCategory, subCategories },
    hideOwned,
    toggleOwned,
    isVisible,
    toggleVisibility,
    toggleSubCategoryVisibility,
    subCategoryVisibility,
  }: CategorySectionProps,
  ref
) {
  useImperativeHandle(ref, () => ({
    setAllSubCategoriesVisibility: () => {
      subCategories.forEach((subCategory) => {
        toggleSubCategoryVisibility(mainCategory, subCategory.subCategory);
      });
    },
  }));

  return (
    <div
      style={{
        color: 'var(--text)',
      }}
    >
      <div
        className='cursor-pointer text-lg font-bold mb-2'
        onClick={toggleVisibility}
        style={{
          color: 'var(--primary)',
        }}
      >
        {mainCategory} {isVisible ? '▼' : '▶'}
      </div>

      {isVisible &&
        subCategories.map((subCategory, index) => (
          <div
            key={`${subCategory.subCategory}-${index}`}
            className='ml-4'
            style={{
              color: 'var(--text)',
            }}
          >
            <div
              className='cursor-pointer text-md font-semibold mb-2'
              onClick={() =>
                toggleSubCategoryVisibility(
                  mainCategory,
                  subCategory.subCategory
                )
              }
              style={{
                color: 'var(--primary)',
              }}
            >
              {subCategory.subCategory}{' '}
              {subCategoryVisibility[subCategory.subCategory] ? '▼' : '▶'}
            </div>

            {subCategoryVisibility[subCategory.subCategory] && (
              <ItemGrid
                items={
                  hideOwned
                    ? subCategory.items.filter((item) => !item.Owned)
                    : subCategory.items
                }
                toggleOwned={toggleOwned}
              />
            )}
          </div>
        ))}
    </div>
  );
});
