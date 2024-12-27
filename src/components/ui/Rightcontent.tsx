

'use client'
import logo from "@/assets/logo.png";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CodeIcon from '@mui/icons-material/Code';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";

const Rightcontent = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  
  const exampleQuestions = [
    {
      icon: <MenuBookIcon className="text-purple-500 mr-2" />,
      text: "Can you summarize the plot of the novel 'The Great Gatsby' in 5 sentences or less?"
    },
    {
      icon: <SentimentSatisfiedIcon className="text-rose-500 mr-2" />,
      text: "Write a short poem about a robot falling in love with a human."
    },
    {
      icon: <LocationOnIcon className="text-blue-500 mr-2" />,
      text: "What are the top 5 tourist attractions in Paris, and why are they popular?"
    },
    {
      icon: <CodeIcon className="text-green-500 mr-2" />,
      text: "How can I learn to code in Python? Can you give me some resources for beginners?"
    }
  ];

  const handleSearch = async () => {
    if (query.trim()) {
      try {
        const response = await fetch("http://localhost:8000/conversation", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ question: query })
        });
        const data = await response.json();
        localStorage.setItem('conversation_id', data.conversation_id);
        navigate('/chat', { state: { question: query } });
      } catch (error) {
        console.error('Error sending question:', error);
      }
    }
  };

  const handleExampleClick = async (question: string) => {
    try {
      const response = await fetch("http://localhost:8000/conversation", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question })
      });
      const data = await response.json();
      localStorage.setItem('conversation_id', data.conversation_id);
      navigate('/chat', { state: { question } });
    } catch (error) {
      console.error('Error sending question:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-start items-center text-center w-full max-w-3xl mx-auto px-4 pt-8 pb-20">
        {/* Logo */}
        <div className="mb-10 ">
          <img
            src={logo}
            alt="Logo"
            className="mx-auto w-45 h-16"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-6">
          <span className="text-white-100 flex items-center">
            Ask <span className="text-purple-500 ml-2">Questions </span> 
          </span>
        </h1>

        {/* Search bar */}
        <div className="flex items-center bg-gray-800 rounded-xl p-3 mb-6 w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you most curious about right now?"
            className="flex-1 bg-transparent outline-none text-gray-300 placeholder-gray-500 px-2 rounded-l-md"
            onKeyDown={handleKeyPress}
          />
          <button
            className="text-gray-400 rounded-r-md"
            onClick={handleSearch}
          >
            <i className="material-icons">search</i>
          </button>
        </div>

        {/* Example Questions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
          {exampleQuestions.map((item, index) => (
            <button
              key={index}
              className="bg-gray-800 hover:bg-gray-700 rounded-xl p-4 flex items-center justify-center"
              onClick={() => handleExampleClick(item.text)}
            >
              {item.icon}
              <span className="block text-justify">{item.text}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <footer className="py-4 mt-16">
          <nav className="flex justify-center space-x-4 text-gray-500 text-sm">
            <a href="#" className="hover:text-white">
              About
            </a>
            <a href="#" className="hover:text-white">
              Features
            </a>
            <a href="#" className="hover:text-white">
              Resources
            </a>
            <a href="#" className="hover:text-white">
              Contact
            </a>
          </nav>
        </footer>
      </div>
    </div>
  );
};

export default Rightcontent;