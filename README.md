# CourseGPT

*CourseGPT* is an AI-powered learning platform that dynamically generates personalized lessons and learning paths based on user-selected topics and concepts — like a digital oracle for modern education.

## Features

- User authentication with Google OAuth
- AI-generated lessons using OpenAI GPT models
- Create and organize custom modules and lessons
- Automatically structured learning outcomes and activities
- CORS-enabled backend (Express.js) and frontend (React)
- MongoDB for user, module, and lesson data storage

## Tech Stack

- *Frontend*: React.js, Vite
- *Backend*: Node.js, Express.js
- *Database*: MongoDB (Mongoose)
- *Authentication*: Passport.js + Google OAuth 2.0
- *AI Integration*: OpenAI API (GPT-3.5/4)
- *Deployment*: Vercel (Frontend), Render/Heroku (Backend)

## How It Works

1. Users sign in with Google
2. Select a topic + concept
3. OpenAI generates structured lesson content
4. Users can save, edit, and organize lessons into modules

## Setup Instructions

### Prerequisites
- Node.js & npm
- MongoDB Atlas account
- OpenAI API key
- Google Developer credentials for OAuth

### Backend Setup

```bash
cd server
npm install
