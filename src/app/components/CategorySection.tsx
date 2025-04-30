import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
} from 'react';
import { GameItem } from '@/app/types/item';
import ItemGrid from './ItemGrid';
import { ChevronRight, ChevronDown } from '@deemlol/next-icons';

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

  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [heights, setHeights] = useState<Record<string, number>>({});
  const [themeColor, setThemeColor] = useState<string>('');

  useEffect(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    setThemeColor(computedStyle.getPropertyValue('--text-on-primary').trim());
  }, []);

  useEffect(() => {
    const newHeights: Record<string, number> = {};
    subCategories.forEach(({ subCategory }) => {
      const el = contentRefs.current[subCategory];
      if (el) {
        newHeights[subCategory] = el.scrollHeight;
      }
    });
    setHeights(newHeights);
  }, [subCategories, hideOwned]);

  return (
    <div
      className='p-2 transition-all duration-300' // Reduced padding from p-4 to p-2
      style={{
        marginBottom: isVisible ? '12px' : '4px', // Reduced margin
        overflow: 'hidden',
      }}
    >
      <div
        className='cursor-pointer inline-flex items-center px-2 py-1 rounded-full text-lg font-medium shadow-md mb-1' // Reduced padding and margin
        onClick={toggleVisibility}
        style={{
          backgroundColor: 'var(--primary)',
          color: 'var(--text-on-primary)',
          marginBottom: isVisible ? '12px' : '6px', // Reduced margin when closed
          padding: '6px 10px', // Adjusted padding for less space
        }}
      >
        {mainCategory}{' '}
        {isVisible ? (
          <ChevronDown size={24} color={themeColor} />
        ) : (
          <ChevronRight size={24} color={themeColor} />
        )}
      </div>

      {isVisible &&
        subCategories.map((subCategory, index) => {
          const subCat = subCategory.subCategory;
          const isSubVisible = subCategoryVisibility[subCat];
          return (
            <div key={`${subCat}-${index}`} className='ml-3'>
              {' '}
              {/* Reduced margin-left */}
              <div
                className='cursor-pointer inline-flex items-center px-2 py-1 rounded-full text-base font-medium shadow-sm mb-1' // Reduced padding and margin
                onClick={() =>
                  toggleSubCategoryVisibility(mainCategory, subCat)
                }
                style={{
                  backgroundColor: 'var(--secondary)',
                  color: 'var(--text-on-primary)',
                }}
              >
                {subCat}{' '}
                {isSubVisible ? (
                  <ChevronDown size={24} color={themeColor} />
                ) : (
                  <ChevronRight size={24} color={themeColor} />
                )}
              </div>
              <div
                className='transition-all duration-500 overflow-hidden'
                style={{
                  maxHeight: isSubVisible ? `${heights[subCat] ?? 0}px` : '0px',
                  opacity: isSubVisible ? 1 : 0,
                }}
              >
                <div
                  ref={(el) => {
                    contentRefs.current[subCat] = el;
                  }}
                  style={{
                    marginBottom: '12px', // Adjusted spacing
                    paddingBottom: '12px', // Adjusted spacing
                  }}
                >
                  <ItemGrid
                    items={
                      hideOwned
                        ? subCategory.items.filter((item) => !item.Owned)
                        : subCategory.items
                    }
                    toggleOwned={toggleOwned}
                  />
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
});
