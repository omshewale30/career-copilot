# Career Copilot AI

Career Copilot AI is an intelligent career guidance platform that helps users navigate their professional journey using advanced AI technology. The platform provides personalized career advice, resume analysis, and job search assistance.

## 🚀 Features

- **AI-Powered Career Guidance**: Get personalized career advice and recommendations
- **Resume Analysis**: Upload and analyze your resume for improvements
- **Interactive Chat Interface**: Engage with an AI agent for career-related queries
- **Modern UI/UX**: Built with React and Tailwind CSS for a seamless experience

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Framer Motion
- Supabase Client
- React Router DOM

### Backend
- FastAPI
- LangChain
- OpenAI Integration
- Supabase
- PDF Processing (PyPDF2)
- Web Scraping (BeautifulSoup4, Playwright)

## 📋 Prerequisites

- Python 3.8+
- Node.js 18+
- OpenAI API Key
- Supabase Account

## 🚀 Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file with the following variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```

5. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

### Backend (.env)
```
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### Frontend (.env)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📁 Project Structure

```
career-copilot/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   └── agent/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Om Shewale

## 🙏 Acknowledgments

- OpenAI for providing the AI capabilities
- Supabase for the backend infrastructure
- All contributors who have helped shape this project 
