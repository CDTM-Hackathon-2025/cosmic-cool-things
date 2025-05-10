
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CubeGallery from '@/components/CubeGallery';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col">
      <div className="flex-grow">
        <Header />
        <main className="container px-4 mx-auto py-10">
          <CubeGallery />
          
          <section className="max-w-2xl mx-auto mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">About The Gallery</h2>
            <p className="text-muted-foreground">
              This interactive 3D cube gallery showcases the power of modern web technologies.
              Each cube represents a different concept and rotates in 3D space. Hover over any cube
              to pause its rotation and reveal more information on the back face.
            </p>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
