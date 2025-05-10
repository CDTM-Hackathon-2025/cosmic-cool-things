
import React from 'react';
import { cn } from '@/lib/utils';

const Header = () => {
  return (
    <header className="py-10">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-pulse-gentle">
            3D Cube Gallery
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Interactive 3D cubes with hover effects. Hover over each cube to discover more information.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
