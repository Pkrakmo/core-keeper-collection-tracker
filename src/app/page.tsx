'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CollectionGrid from './components/CollectionGrid';
import ClearStorageButton from './components/ClearStorageButton';

import LegendButton from './components/LegendButton';
import InformationButton from './components/InformationButton';
import HideOwnedButton from './components/HideOwnedButton';
import ScrollToTopButton from './components/ScrollToTopButton';
import LanguageSwitcher from './components/LanguageSwitcher';

export default function Home() {
  const { t } = useTranslation();
  const [hideOwned, setHideOwned] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Load saved theme or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <main
      className='p-6 flex flex-col items-center relative min-h-screen'
      style={{
        backgroundColor: 'var(--background)', // Use solid background color
        color: 'var(--text)',
      }}
    >
      <div className='relative w-full'>
        <LanguageSwitcher className='language-switcher' />
        <h1
          className='text-3xl font-bold text-center page-title'
          style={{
            color: 'var(--text)',
          }}
        >
          {t('title')}
        </h1>
      </div>
      <div className='relative w-full flex justify-center items-center mt-4'>
        <div
          className='text-2xl md:text-5xl font-bold animate-pulse pointer-events-none'
          style={{
            color: 'var(--accent)',
          }}
        >
          {t('workInProgress')}
        </div>
      </div>

      <div className='h-20'></div>

      <CollectionGrid hideOwned={hideOwned} />

      <div className='h-20'></div>

      {/* Floating Buttons */}
      <div className='fixed bottom-6 left-0 right-0 flex justify-center'>
        <div
          className='rounded-lg p-4 flex gap-4 shadow-lg'
          style={{
            backgroundColor: 'var(--secondary)',
          }}
        >
          <ClearStorageButton />
          <HideOwnedButton
            hideOwned={hideOwned}
            toggleHideOwned={() => setHideOwned(!hideOwned)}
          />
          <LegendButton />
          <InformationButton />
          <ScrollToTopButton />
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className='w-10 h-10 rounded-full shadow-lg focus:outline-none flex items-center justify-center'
            style={{
              backgroundColor: 'var(--sky)',
              color: 'var(--text)',
            }}
            title={theme === 'light' ? 'Toggle Dark Mode' : 'Toggle Light Mode'}
          >
            {theme === 'light' ? '🌚' : '☀'}
          </button>
        </div>
      </div>
    </main>
  );
}
