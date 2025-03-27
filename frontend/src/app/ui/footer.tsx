import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full flex flex-col bottom-0 items-center justify-around border-gray-200 border-t shadow-lg">
      {/* Main footer content - Contact and Social sections */}
      <div className="w-full px-4 md:px-8 py-8 md:py-12 flex flex-col md:flex-row">
        {/* Contact Details Section */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-8 flex flex-col items-center">
          <h3 className="text-lg md:text-xl font-bold mb-4">Contact Us</h3>
          <div className="space-y-3 text-center">
            <div className="flex items-center justify-center space-x-3">
              <Mail className="text-gray-600 w-5 h-5 md:w-6 md:h-6" />
              <span className="text-sm md:text-base">contact@bigfoodindustries.com</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Phone className="text-gray-600 w-5 h-5 md:w-6 md:h-6" />
              <span className="text-sm md:text-base">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <MapPin className="text-gray-600 w-5 h-5 md:w-6 md:h-6" />
              <span className="text-sm md:text-base">123 Food Street, Culinary City, FC 12345</span>
            </div>
          </div>
        </div>
        
        {/* Social Media Section */}
        <div className="w-full md:w-1/2 md:pl-8 flex flex-col items-center">
          <h3 className="text-lg md:text-xl font-bold mb-4">Follow Us</h3>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-blue-600">
              <Facebook className="w-6 h-6 md:w-7 md:h-7" />
            </a>
            <a href="#" className="hover:text-blue-400">
              <Twitter className="w-6 h-6 md:w-7 md:h-7" />
            </a>
            <a href="#" className="hover:text-pink-600">
              <Instagram className="w-6 h-6 md:w-7 md:h-7" />
            </a>
            <a href="#" className="hover:text-blue-800">
              <Linkedin className="w-6 h-6 md:w-7 md:h-7" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Copyright Section */}
      <div className="w-full bg-gray-100 py-4 text-center">
        <p className="text-xs md:text-sm text-gray-600 px-4">
          © 2025 Big Food Industries. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
