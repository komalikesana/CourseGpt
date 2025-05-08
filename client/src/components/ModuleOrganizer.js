import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModuleOrganizer = () => {
  const [moduleName, setModuleName] = useState('');
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in.');
          return;
        }

        const [modulesRes, lessonsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/course/modules', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/course/lessons', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setModules(modulesRes.data);
        setLessons(lessonsRes.data);
        setError('');
      } catch (err) {
        console.error('Error fetching data:', err);
        if (err.response) {
          console.log('Response data:', err.response.data);
          setError(err.response.data?.msg || 'Failed to fetch modules or lessons');
        } else {
          setError('Network error: Could not connect to the server');
        }
      }
    };
    fetchData();
  }, []);

  const handleAddModule = async () => {
    if (!moduleName) {
      setError('Please provide a module name');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }

      const res = await axios.post(
        'http://localhost:5000/api/course/modules',
        { name: moduleName, metadata: { difficulty: 'Beginner', estimatedTime: '1 hour' } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModules([...modules, res.data]);
      setModuleName('');
      setError('');
    } catch (err) {
      console.error('Error adding module:', err);
      if (err.response) {
        console.log('Response data:', err.response.data);
        setError(err.response.data?.msg || 'Failed to add module');
      } else {
        setError('Network error: Could not connect to the server');
      }
    }
  };

  const handleAddLessonToModule = async (moduleId, lessonId) => {
    if (!lessonId) {
      setError('Please select a lesson to add');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }

      const res = await axios.put(
        `http://localhost:5000/api/course/modules/${moduleId}/add-lesson`,
        { lessonId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModules(modules.map((m) => (m._id === res.data._id ? res.data : m)));
      setError('');
    } catch (err) {
      console.error('Error adding lesson to module:', err);
      if (err.response) {
        console.log('Response data:', err.response.data);
        setError(err.response.data?.msg || 'Failed to add lesson to module');
      } else {
        setError('Network error: Could not connect to the server');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Module Organizer</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Module Name</label>
          <input
            type="text"
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., Python Basics"
          />
          <button
            onClick={handleAddModule}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
          >
            Add Module
          </button>
        </div>
        {modules.map((module) => (
          <div key={module._id} className="mb-4 p-4 border rounded-md shadow-sm">
            <h3 className="text-lg font-semibold">{module.name}</h3>
            <p className="text-sm text-gray-600">
              Difficulty: {module.metadata?.difficulty || 'N/A'} | Estimated Time: {module.metadata?.estimatedTime || 'N/A'}
            </p>
            {module.lessons?.map((lesson) => (
              <div key={lesson._id} className="mt-2 p-2 bg-gray-100 rounded-md">
                <h4 className="font-medium">{lesson.title}</h4>
                <p>{lesson.description || 'No description available'}</p>
              </div>
            ))}
            {lessons.length > 0 && (
              <select
                onChange={(e) => handleAddLessonToModule(module._id, e.target.value)}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select a lesson</option>
                {lessons.map((lesson) => (
                  <option key={lesson._id} value={lesson._id}>
                    {lesson.title}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleOrganizer;