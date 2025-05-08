import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ setActiveSection, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-indigo-600 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-lg font-semibold">CourseGPT Dashboard</div>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setActiveSection('moduleOrganizer');
              navigate('/module');
            }}
            className="px-3 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
          >
            Module Organizer
          </button>
          <button
            onClick={() => {
              setActiveSection('lessonGenerator');
              navigate('/lesson');
            }}
            className="px-3 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
          >
            Lesson Generator
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-2 bg-red-500 rounded-md hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;