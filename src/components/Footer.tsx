import React from "react";
import { Instagram, Github, Linkedin } from "lucide-react";
import { Home, Shield, Trophy } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <p className="text-gray-300">
              Your platform for competitive programming and learning.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white flex items-center gap-2">
                <Home size={20} />
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white flex items-center gap-2">
                <Shield size={20} />
                  About Us
                </a>
              </li>
              <li>
                <a href="/compete" className="text-gray-300 hover:text-white flex items-center gap-2">
                <Trophy size={20} />
                  Compete
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://www.instagram.com/cybersentinelupes?igsh=MTdqeHpvMmQ4ajc2Zg==" 
                   className="text-gray-300 hover:text-white flex items-center gap-2">
                  <Instagram size={20} />
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://github.com/CyberSentinel-UPES" className="text-gray-300 hover:text-white flex items-center gap-2">
                    <Github size={20} />
                  GitHub
                </a>
              </li>
              <li>
                <a href="" className="text-gray-300 hover:text-white flex items-center gap-2">
                    <Linkedin size={20} />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p className="font-semibold">
            &copy; {new Date().getFullYear()} Created By CyberSentinel. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
