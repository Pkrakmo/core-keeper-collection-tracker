'use client';

import { useState } from 'react';
import CollectionGrid from './components/CollectionGrid';
import ClearStorageButton from './components/ClearStorageButton';
import NavigationButtons from './components/NavigationButtons';
import LegendButton from './components/LegendButton';
import InformationButton from './components/InformationButton';
import HideOwnedButton from './components/HideOwnedButton';
import ScrollToTopButton from './components/ScrollToTopButton';

export default function Home() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [hideOwned, setHideOwned] = useState(false);

  const toggleHideOwned = () => setHideOwned((prev) => !prev);

  return (
    <main className='p-6 bg-dark-blue flex flex-col items-center relative'>
      <h1 className='text-3xl font-bold text-center mb-6'>
        Core Keeper Collection Tracker
      </h1>
      <div className='absolute top-16 left-1/2 transform -translate-x-1/2 -rotate-7 text-red-700 text-5xl font-bold animate-pulse pointer-events-none'>
        Work in Progress
      </div>

      <NavigationButtons />
      <CollectionGrid hideOwned={hideOwned} />

      <div className='h-20'></div>

      {/* Floating Buttons */}
      <div className='fixed bottom-6 left-0 right-0 flex justify-center gap-4'>
        <ClearStorageButton />
        <HideOwnedButton
          hideOwned={hideOwned}
          toggleHideOwned={toggleHideOwned}
        />
        <InformationButton
          isOpen={activeModal === 'information'}
          onOpen={() => setActiveModal('information')}
          onClose={() => setActiveModal(null)}
        />
        <LegendButton
          isOpen={activeModal === 'legend'}
          onOpen={() => setActiveModal('legend')}
          onClose={() => setActiveModal(null)}
        />
        <ScrollToTopButton />
      </div>
    </main>
  );
}
