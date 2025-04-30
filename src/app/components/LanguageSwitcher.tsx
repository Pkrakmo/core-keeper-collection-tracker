'use client';

import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
  className?: string; // Add className as an optional prop
}

export default function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <div className={`absolute top-4 right-4 ${className || ''}`}>
      <select
        onChange={handleLanguageChange}
        value={i18n.language}
        className='p-2 rounded focus:outline-none'
        style={{
          backgroundColor: 'var(--background)',
          color: 'var(--text)',
        }}
      >
        <option value='en'>English</option>
        <option value='de'>Deutsch</option>
        <option value='no'>Norsk</option>
      </select>
    </div>
  );
}
