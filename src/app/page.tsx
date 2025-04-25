'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CollectionGrid from './components/CollectionGrid';
import ClearStorageButton from './components/ClearStorageButton';
import NavigationButtons from './components/NavigationButtons';
import LegendButton from './components/LegendButton';
import InformationButton from './components/InformationButton';
import HideOwnedButton from './components/HideOwnedButton';
import ScrollToTopButton from './components/ScrollToTopButton';
import LanguageSwitcher from './components/LanguageSwitcher';

export default function Home() {
  const { t } = useTranslation();
  const [hideOwned, setHideOwned] = useState(false);

  return (
    <main className='p-6 bg-dark-blue flex flex-col items-center relative'>
      <LanguageSwitcher />
      <h1 className='text-3xl font-bold text-center mb-6'>{t('title')}</h1>
      <div className='absolute top-16 left-1/2 transform -translate-x-1/2 -rotate-9 text-red-700 text-5xl font-bold animate-pulse pointer-events-none'>
        {t('workInProgress')}
      </div>

      <NavigationButtons />
      <CollectionGrid hideOwned={hideOwned} />

      <div className='h-20'></div>

      {/* Floating Buttons */}
      <div className='fixed bottom-6 left-0 right-0 flex justify-center'>
        <div className='bg-blue-200/80 backdrop-blur-md rounded-lg p-4 flex gap-4 shadow-lg'>
          <ClearStorageButton />
          <HideOwnedButton
            hideOwned={hideOwned}
            toggleHideOwned={() => setHideOwned(!hideOwned)}
          />
          <LegendButton />
          <InformationButton />
          <ScrollToTopButton />
        </div>
      </div>
    </main>
  );
}
