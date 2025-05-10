
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface CubeProps {
  size?: number;
  color?: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

const Cube = ({ size = 200, color = 'bg-primary/20', title, description, icon, className }: CubeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={cn('preserve-3d relative cursor-pointer transition-all duration-500', className)}
      style={{ width: size, height: size, '--size': `${size}px` } as React.CSSProperties}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={cn(
          'relative w-full h-full transition-transform duration-1000',
          isHovered ? 'rotate-y-180' : 'animate-rotate-slow'
        )}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Face */}
        <div className={cn('cube-face face-front rounded-xl', color)}>
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="text-4xl mb-4">
              {icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
          </div>
        </div>
        
        {/* Back Face */}
        <div className={cn('cube-face face-back rounded-xl', color)}>
          <div className="p-6 text-center">
            <p className="text-sm">{description}</p>
          </div>
        </div>
        
        {/* Side Faces */}
        <div className={cn('cube-face face-right rounded-xl bg-primary/10')}></div>
        <div className={cn('cube-face face-left rounded-xl bg-primary/10')}></div>
        <div className={cn('cube-face face-top rounded-xl bg-primary/10')}></div>
        <div className={cn('cube-face face-bottom rounded-xl bg-primary/10')}></div>
      </div>
    </div>
  );
};

export default Cube;
