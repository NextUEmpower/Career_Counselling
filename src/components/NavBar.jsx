import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => (
  <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg">
    <div className="max-w-6xl mx-auto flex gap-6 justify-center">
      <NavLink 
        to="/personality" 
        className={({ isActive }) => 
          `px-4 py-2 rounded-md transition-colors duration-200 ${
            isActive 
              ? 'bg-white text-blue-800 font-semibold' 
              : 'hover:bg-blue-700'
          }`
        }
      >
        Personality
      </NavLink>
      <NavLink 
        to="/intelligences" 
        className={({ isActive }) => 
          `px-4 py-2 rounded-md transition-colors duration-200 ${
            isActive 
              ? 'bg-white text-blue-800 font-semibold' 
              : 'hover:bg-blue-700'
          }`
        }
      >
        Intelligences
      </NavLink>
      <NavLink 
        to="/career" 
        className={({ isActive }) => 
          `px-4 py-2 rounded-md transition-colors duration-200 ${
            isActive 
              ? 'bg-white text-blue-800 font-semibold' 
              : 'hover:bg-blue-700'
          }`
        }
      >
        Career
      </NavLink>
      <NavLink 
        to="/learning" 
        className={({ isActive }) => 
          `px-4 py-2 rounded-md transition-colors duration-200 ${
            isActive 
              ? 'bg-white text-blue-800 font-semibold' 
              : 'hover:bg-blue-700'
          }`
        }
      >
        Learning
      </NavLink>
    </div>
  </nav>
);

export default NavBar;
