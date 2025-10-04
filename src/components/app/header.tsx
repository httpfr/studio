import { Orbit } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:pt-6">
      <div className="flex items-center gap-2">
        <Orbit className="h-6 w-6 text-accent" />
        <h1 className="font-headline text-xl font-bold">ExoDetect</h1>
      </div>
    </header>
  );
}
