
import React from 'react';
import Cube from './Cube';
import { Star, Zap, Heart, Globe, Rocket } from 'lucide-react';

const CubeGallery = () => {
  const cubes = [
    {
      title: 'Interactive',
      description: 'Create dynamic and engaging user experiences with interactive elements.',
      icon: <Zap className="text-yellow-400" />,
      color: 'bg-purple-500/20',
      size: 200,
    },
    {
      title: 'Creative',
      description: 'Express your brand with unique and creative design solutions.',
      icon: <Star className="text-purple-400" />,
      color: 'bg-blue-500/20',
      size: 180,
    },
    {
      title: 'Passionate',
      description: 'Built with attention to detail and genuine care for quality.',
      icon: <Heart className="text-pink-500" />,
      color: 'bg-pink-500/20',
      size: 220,
    },
    {
      title: 'Global',
      description: 'Solutions designed with international accessibility standards.',
      icon: <Globe className="text-blue-400" />,
      color: 'bg-indigo-500/20',
      size: 190,
    },
    {
      title: 'Innovative',
      description: 'Pushing boundaries with cutting-edge technology and design.',
      icon: <Rocket className="text-orange-400" />,
      color: 'bg-violet-500/20',
      size: 210,
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-10 py-10">
      {cubes.map((cube, index) => (
        <div key={index} className={`animate-float`} style={{ animationDelay: `${index * 0.2}s` }}>
          <Cube
            title={cube.title}
            description={cube.description}
            icon={cube.icon}
            color={cube.color}
            size={cube.size}
          />
        </div>
      ))}
    </div>
  );
};

export default CubeGallery;
