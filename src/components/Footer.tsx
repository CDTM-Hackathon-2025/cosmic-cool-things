
import React from 'react';

const Footer = () => {
  return (
    <footer className="py-6 border-t border-muted/20">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} 3D Cube Gallery. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-primary text-sm">About</a>
            <a href="#" className="text-muted-foreground hover:text-primary text-sm">Projects</a>
            <a href="#" className="text-muted-foreground hover:text-primary text-sm">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
