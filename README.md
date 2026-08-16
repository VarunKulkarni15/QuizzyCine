# QuizzyCine 🎬

QuizzyCine is an AI-powered, dynamic movie trivia web application that generates unique, deep-lore questions on the fly for thousands of movies and TV shows.

Built using HTML, CSS, and Vanilla JavaScript, it leverages the **OMDB API** for a massive media database and the **Groq AI Engine** for rapid, intelligent question generation.

## Features ✨
- **Live Search & Auto-complete**: Search through thousands of movies and TV shows with instant results.
- **Deep-Lore AI Generation**: The AI is strictly prompted to ask deep lore and plot questions, completely avoiding boring actor/director questions.
- **Dynamic Configuration**: Choose anywhere between 1 to 25 questions per quiz.
- **Local Storage Memory Tracker**: The app remembers every question you've been asked for a specific movie, ensuring you *never* get a repeated question.
- **API Key Rotator**: Uses a Round-Robin algorithm to cycle through multiple API keys to prevent rate limits.
- **Custom Fallback Engine**: If a poster fails to load, the app instantly injects a custom, dark-mode SVG fallback poster.

## Tech Stack 🛠️
- **Frontend**: HTML5, CSS3 (Glassmorphism & Flexbox/Grid), Vanilla JavaScript (ES6+)
- **APIs**: OMDB API (Movie Data), Groq API (LLM Trivia Generation)

## Getting Started 🚀
Since this is a client-side frontend project, it can be hosted directly on Render, Vercel, Netlify, or GitHub Pages. 
1. Clone the repository.
2. Ensure you have the `cat_animations` and `cat score single image` assets in the correct relative directory.
3. Serve `index.html` via a local web server (like VS Code Live Server) or deploy the folder to a static host.

*Created by Varun Kulkarni for the SkillsCraft Internship.*
