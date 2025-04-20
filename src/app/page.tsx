import CollectionGrid from './components/CollectionGrid';
import ClearStorageButton from './components/ClearStorageButton';
import NavigationButtons from './components/NavigationButtons';
import LegendButton from './components/LegendButton';

export default function Home() {
  return (
    <main className="p-6 bg-dark-blue flex flex-col items-center relative">
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 -rotate-7 text-red-700 text-4xl font-bold animate-pulse pointer-events-none">
        Work in Progress
      </div>
      <h1 className="text-3xl font-bold text-center mb-6">Core Keeper Collection Tracker</h1>

      <NavigationButtons />
      <CollectionGrid />

      {/* Add bottom padding to prevent overlap */}
      <div className="h-20"></div>

      {/* Floating Buttons */}
      <div className="fixed bottom-6 flex space-x-4">
        <ClearStorageButton />
        <LegendButton />
      </div>
    </main>
  );
}