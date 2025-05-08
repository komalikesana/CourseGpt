import React, { useState, useEffect } from 'react';

const ContentEditor = ({ lesson, onUpdateLesson }) => {
  const [editedLesson, setEditedLesson] = useState(lesson);

  useEffect(() => {
    setEditedLesson(lesson);
  }, [lesson]);

  const handleRegenerateSection = (section) => {
    const updatedLesson = { ...editedLesson };
    if (section === 'outcomes') {
      updatedLesson.outcomes = [`Regenerated outcome for ${editedLesson.title}`];
    } else if (section === 'concepts') {
      updatedLesson.concepts = [
        { term: 'Regenerated Term', definition: 'Updated definition' },
      ];
    } else if (section === 'activities') {
      updatedLesson.activities = [`Regenerated activity for ${editedLesson.title}`];
    }
    setEditedLesson(updatedLesson);
    onUpdateLesson(updatedLesson);
  };

  if (!editedLesson) return null;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">{editedLesson.title}</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={editedLesson.description || ''}
          onChange={(e) =>
            setEditedLesson({ ...editedLesson, description: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-32"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Learning Outcomes</label>
        {editedLesson.outcomes?.map((outcome, index) => (
          <div key={index} className="mt-2 flex items-center">
            <span className="mr-2 text-gray-600">•</span>
            <input
              type="text"
              value={outcome}
              onChange={(e) => {
                const updatedOutcomes = [...editedLesson.outcomes];
                updatedOutcomes[index] = e.target.value;
                setEditedLesson({ ...editedLesson, outcomes: updatedOutcomes });
              }}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        ))}
        <button
          onClick={() => handleRegenerateSection('outcomes')}
          className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition duration-200"
        >
          Regenerate Outcomes
        </button>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Key Concepts</label>
        {editedLesson.concepts?.map((concept, index) => (
          <div key={index} className="mt-2 p-4 bg-gray-50 rounded-md">
            <input
              type="text"
              value={concept.term}
              onChange={(e) => {
                const updatedConcepts = [...editedLesson.concepts];
                updatedConcepts[index].term = e.target.value;
                setEditedLesson({ ...editedLesson, concepts: updatedConcepts });
              }}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-semibold"
              placeholder="Term"
            />
            <textarea
              value={concept.definition}
              onChange={(e) => {
                const updatedConcepts = [...editedLesson.concepts];
                updatedConcepts[index].definition = e.target.value;
                setEditedLesson({ ...editedLesson, concepts: updatedConcepts });
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-24"
              placeholder="Definition"
            />
          </div>
        ))}
        <button
          onClick={() => handleRegenerateSection('concepts')}
          className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition duration-200"
        >
          Regenerate Concepts
        </button>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Activities</label>
        {editedLesson.activities?.map((activity, index) => (
          <div key={index} className="mt-2 flex items-center">
            <span className="mr-2 text-gray-600">•</span>
            <textarea
              value={activity}
              onChange={(e) => {
                const updatedActivities = [...editedLesson.activities];
                updatedActivities[index] = e.target.value;
                setEditedLesson({ ...editedLesson, activities: updatedActivities });
              }}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-16"
            />
          </div>
        ))}
        <button
          onClick={() => handleRegenerateSection('activities')}
          className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition duration-200"
        >
          Regenerate Activities
        </button>
      </div>
      <button
        onClick={() => onUpdateLesson(editedLesson)}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200"
      >
        Save Changes
      </button>
    </div>
  );
};

export default ContentEditor;