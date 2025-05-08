import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContentEditor from './ContentEditor';

const LessonGenerator = () => {
  const [topic, setTopic] = useState('');
  const [concept, setConcept] = useState('');
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in.');
          return;
        }

        const res = await axios.get('http://localhost:5000/api/course/lessons', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLessons(res.data);
        setError('');
      } catch (err) {
        console.error('Error fetching lessons:', err);
        if (err.response) {
          console.log('Response data:', err.response.data);
          setError(err.response.data?.msg || 'Failed to fetch lessons');
        } else {
          setError('Network error: Could not connect to the server');
        }
      }
    };
    fetchLessons();
  }, []);

  const handleGenerate = async () => {
    if (!topic || !concept) {
      setError('Please provide both a topic and a core concept');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }

      const res = await axios.post(
        'http://localhost:5000/api/course/lessons',
        { topic, concept },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newLesson = res.data;
      setLessons([...lessons, newLesson]);
      setSelectedLesson(newLesson);
      setTopic('');
      setConcept('');
      setError('');
    } catch (err) {
      console.error('Error generating lesson:', err);
      if (err.response) {
        console.log('Response data:', err.response.data);
        setError(err.response.data?.msg || 'Failed to generate lesson');
      } else {
        setError('Network error: Could not connect to the server');
      }
    }
  };

  const handleUpdateLesson = async (updatedLesson) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }

      const res = await axios.put(
        `http://localhost:5000/api/course/lessons/${updatedLesson._id}`,
        updatedLesson,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLessons(lessons.map((l) => (l._id === res.data._id ? res.data : l)));
      setSelectedLesson(res.data);
      setError('');
    } catch (err) {
      console.error('Error updating lesson:', err);
      if (err.response) {
        console.log('Response data:', err.response.data);
        setError(err.response.data?.msg || 'Failed to update lesson');
      } else {
        setError('Network error: Could not connect to the server');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Lesson Generator</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., Python Programming"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Core Concept</label>
          <input
            type="text"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., Variables"
          />
        </div>
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200"
        >
          Generate Lesson
        </button>
      </div>
      {selectedLesson && (
        <ContentEditor lesson={selectedLesson} onUpdateLesson={handleUpdateLesson} />
      )}
    </div>
  );
};

export default LessonGenerator;