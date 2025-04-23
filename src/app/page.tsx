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

  const isOpen = activeModal === 'legend';
  const onOpen = () => setActiveModal('legend');
  const onClose = () => setActiveModal(null);

  return (
    <main className='p-6 bg-dark-blue flex flex-col items-center relative'>
      <h1 className='text-3xl font-bold text-center mb-6'>
        Core Keeper Collection Tracker
      </h1>

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
          <InformationButton 
            isOpen={isOpen} 
            onOpen={onOpen} 
            onClose={onClose} 
          />
          <LegendButton 
            isOpen={isOpen} 
            onOpen={onOpen} 
            onClose={onClose} 
          />
          <ScrollToTopButton />
        </div>
      </div>
    </main>
  );
}
