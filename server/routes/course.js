const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Lesson = require('../models/Lesson');
const Module = require('../models/Module');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate lesson content using OpenAI
const generateLessonContent = async (topic, concept) => {
  console.log(`Generating lesson content for topic: ${topic}, concept: ${concept}`);

  try {
    const prompt = `
      You are an expert educator creating a lesson for a beginner in database management. Generate a structured lesson for a course on the topic "${topic}" with a focus on the core concept "${concept}". The lesson should be engaging, practical, and easy to understand for someone new to the subject. Include:
      - A compelling title that reflects the topic and concept (e.g., "Unlocking Data with SQL Joins for Beginners")
      - A detailed description (150-200 words) that introduces the lesson, explains why the topic and concept are important, and previews what the user will learn, using a friendly and encouraging tone
      - 3-5 learning outcomes written in simple, actionable language (e.g., "You will learn how to combine tables using a JOIN")
      - 2-4 key concepts with terms and their definitions, explained in a beginner-friendly way with practical examples (e.g., "INNER JOIN: Combines rows from two tables where a condition is met, like matching customer orders with customer names")
      - 2-3 engaging learning activities that help the user practice the concept with hands-on tasks (e.g., "Write a SQL query to join two tables and find matching records")
      Return the response in JSON format.
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const content = JSON.parse(completion.choices[0].message.content);
    console.log('OpenAI response:', content);

    return {
      topic,
      concept,
      title: content.title || `Getting Started with ${concept} in ${topic}`,
      description: content.description || `Learn the basics of ${concept} in ${topic} with practical examples.`,
      outcomes: content.outcomes || [
        `Learn how to use ${concept} in ${topic}`,
        `Practice ${concept} with a simple database`,
        `Understand the role of ${concept} in data management`,
      ],
      concepts: content.concepts || [
        { term: `${concept}`, definition: `A fundamental concept in ${topic} for combining data.` },
        { term: `Practical Example`, definition: `How ${concept} is applied in real-world ${topic} tasks.` },
      ],
      activities: content.activities || [
        `Try a simple ${topic} task using ${concept}`,
        `Explore a dataset with ${concept}`,
      ],
    };
  } catch (err) {
    console.error('OpenAI Error:', err.message);
    // Fallback for "SQL" with focus on "Joins"
    if (topic.toLowerCase().includes('sql') && concept.toLowerCase().includes('join')) {
      return {
        topic: "SQL",
        concept: "Joins",
        title: "Unlocking Data with SQL Joins for Beginners",
        description: "Dive into the world of SQL with this beginner-friendly lesson on Joins! SQL is a powerful language for managing and querying databases, and Joins are a key skill for combining data from multiple tables. In this lesson, you’ll learn what Joins are and why they’re essential for tasks like analyzing customer orders or tracking employee projects. We’ll cover the basics of different types of Joins, like INNER JOIN and LEFT JOIN, and show you how to use them with simple examples. You’ll practice writing SQL queries to connect tables, such as linking a list of customers with their orders. By the end, you’ll be ready to use Joins to solve real-world data problems with confidence!",
        outcomes: [
          "Learn how to combine tables using an INNER JOIN",
          "Understand the difference between INNER JOIN and LEFT JOIN",
          "Practice writing SQL queries to retrieve data from multiple tables",
          "Explore how Joins can help solve real-world data problems"
        ],
        concepts: [
          {
            term: "INNER JOIN",
            definition: "A type of Join that combines rows from two tables where a condition is met. For example, joining a 'Customers' table with an 'Orders' table to find customers who placed orders."
          },
          {
            term: "LEFT JOIN",
            definition: "A type of Join that includes all rows from the left table and matching rows from the right table. If there’s no match, NULL values are returned. For instance, listing all employees and their projects, even if they have no projects."
          },
          {
            term: "Foreign Key",
            definition: "A column in one table that links to the primary key in another table, used in Joins to connect data. For example, a 'customer_id' in an 'Orders' table links to the 'id' in a 'Customers' table."
          }
        ],
        activities: [
          "Create two simple tables (e.g., 'Students' and 'Courses') in a database, then write an INNER JOIN query to list students and the courses they’re enrolled in",
          "Use a LEFT JOIN to find all employees and their assigned projects, including employees without projects, using a sample dataset",
          "Discuss with a group: How can Joins help analyze real-world data, like combining sales data with customer information?"
        ],
      };
    }
    // Fallback for "Introduction to Pandas" with focus on "DataFrames"
    if (topic.toLowerCase().includes('pandas') && concept.toLowerCase().includes('dataframes')) {
      return {
        topic: "Introduction to Pandas",
        concept: "DataFrames",
        title: "Mastering DataFrames in Pandas for Beginners",
        description: "Welcome to your first step in data analysis with Pandas! In this lesson, you’ll learn about DataFrames, the heart of Pandas, which act like spreadsheets to store and manage data. We’ll start by understanding what a DataFrame is and why it’s so powerful for tasks like cleaning, analyzing, and visualizing data. You’ll see how to create a DataFrame, access its data, and perform simple operations like filtering rows or calculating averages. With practical examples, you’ll work with a real-world dataset (like a list of students and their grades) to see how DataFrames make data analysis easy and fun. By the end, you’ll feel confident using DataFrames in your own projects!",
        outcomes: [
          "Learn how to create a DataFrame from a list or CSV file",
          "Understand how to view and filter data in a DataFrame",
          "Practice calculating basic statistics, like averages, using a DataFrame",
          "Explore how DataFrames can help solve real-world data problems"
        ],
        concepts: [
          {
            term: "DataFrame",
            definition: "A table-like structure in Pandas, similar to a spreadsheet, where data is organized in rows and columns. For example, you can store student names and grades in a DataFrame to analyze them."
          },
          {
            term: "Indexing",
            definition: "A way to access specific rows or columns in a DataFrame. For instance, using df['name'] lets you see the 'name' column of your data."
          },
          {
            term: "Data Cleaning",
            definition: "The process of fixing missing or incorrect data in a DataFrame, like filling in missing grades or removing duplicates."
          }
        ],
        activities: [
          "Create a DataFrame from a list of dictionaries (e.g., students with names and grades) and display its first 5 rows using df.head()",
          "Filter your DataFrame to show only students with grades above 80, then calculate the average grade using df['grade'].mean()",
          "Discuss with a group: How can DataFrames help analyze real-world data, like sales or weather records?"
        ],
      };
    }
    // Generic fallback for other topics
    return {
      topic,
      concept,
      title: `Getting Started with ${concept} in ${topic}`,
      description: `Learn the basics of ${concept} in ${topic} with practical examples. This lesson will guide you through the essentials, helping you understand how to apply ${concept} in real-world scenarios.`,
      outcomes: [
        `Learn how to use ${concept} in ${topic}`,
        `Practice ${concept} with a simple database`,
        `Understand the role of ${concept} in data management`,
      ],
      concepts: [
        { term: `${concept}`, definition: `A fundamental concept in ${topic} for combining data.` },
        { term: `Practical Example`, definition: `How ${concept} is applied in real-world ${topic} tasks.` },
      ],
      activities: [
        `Try a simple ${topic} task using ${concept}`,
        `Explore a dataset with ${concept}`,
      ],
    };
  }
};

// Create a lesson
router.post('/lessons', auth, async (req, res) => {
  const { topic, concept, title, description, outcomes, concepts } = req.body;

  if (!topic || !concept) {
    console.log('Missing topic or concept:', req.body);
    return res.status(400).json({ msg: 'Topic and concept are required' });
  }

  try {
    const lessonData = title
      ? { topic, concept, title, description, outcomes, concepts }
      : await generateLessonContent(topic, concept);

    const lesson = new Lesson({
      ...lessonData,
      userId: req.user.id,
    });
    await lesson.save();
    console.log('Lesson created:', lesson);
    res.status(201).json(lesson);
  } catch (err) {
    console.error('Error creating lesson:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all lessons for the authenticated user
router.get('/lessons', auth, async (req, res) => {
  try {
    const lessons = await Lesson.find({ userId: req.user.id });
    console.log(`Fetched ${lessons.length} lessons for user: ${req.user.id}`);
    res.status(200).json(lessons);
  } catch (err) {
    console.error('Error fetching lessons:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update a lesson
router.put('/lessons/:id', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson || lesson.userId.toString() !== req.user.id) {
      console.log(`Lesson not found or unauthorized: ${req.params.id}`);
      return res.status(404).json({ msg: 'Lesson not found or unauthorized' });
    }
    Object.assign(lesson, req.body);
    await lesson.save();
    console.log('Lesson updated:', lesson);
    res.status(200).json(lesson);
  } catch (err) {
    console.error('Error updating lesson:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create a module
router.post('/modules', auth, async (req, res) => {
  const { name, metadata } = req.body;

  if (!name) {
    console.log('Missing module name:', req.body);
    return res.status(400).json({ msg: 'Module name is required' });
  }

  try {
    const module = new Module({
      name,
      metadata: metadata || { difficulty: 'Beginner', estimatedTime: '1 hour' },
      userId: req.user.id,
      lessons: [],
    });
    await module.save();
    console.log('Module created:', module);
    res.status(201).json(module);
  } catch (err) {
    console.error('Error creating module:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all modules for the authenticated user
router.get('/modules', auth, async (req, res) => {
  try {
    const modules = await Module.find({ userId: req.user.id }).populate('lessons');
    console.log(`Fetched ${modules.length} modules for user: ${req.user.id}`);
    res.status(200).json(modules);
  } catch (err) {
    console.error('Error fetching modules:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add a lesson to a module
router.put('/modules/:id/add-lesson', auth, async (req, res) => {
  const { lessonId } = req.body;

  if (!lessonId) {
    console.log('Missing lessonId:', req.body);
    return res.status(400).json({ msg: 'Lesson ID is required' });
  }

  try {
    const module = await Module.findById(req.params.id);
    if (!module || module.userId.toString() !== req.user.id) {
      console.log(`Module not found or unauthorized: ${req.params.id}`);
      return res.status(404).json({ msg: 'Module not found or unauthorized' });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      console.log(`Lesson not found: ${lessonId}`);
      return res.status(404).json({ msg: 'Lesson not found' });
    }

    if (module.lessons.includes(lessonId)) {
      console.log(`Lesson already in module: ${lessonId}`);
      return res.status(400).json({ msg: 'Lesson already added to this module' });
    }

    module.lessons.push(lessonId);
    await module.save();
    await module.populate('lessons');
    console.log('Lesson added to module:', module);
    res.status(200).json(module);
  } catch (err) {
    console.error('Error adding lesson to module:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;