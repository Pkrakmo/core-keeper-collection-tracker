'use client';

import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  console.log('i18n instance:', i18n); // Debugging line

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <div className='absolute top-4 right-4'>
      <select
        onChange={handleLanguageChange}
        value={i18n.language}
        className='p-2 bg-gray-800 text-white rounded'
      >
        <option value='en'>English</option>
        <option value='de'>Deutsch</option>
      </select>
    </div>
  );
}
