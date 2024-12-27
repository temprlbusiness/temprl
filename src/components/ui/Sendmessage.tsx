import React, { useState } from 'react';

interface SendMessageProps {
  onSend: (message: string) => void;
  placeholder?: string;
}

const SendMessage: React.FC<SendMessageProps> = ({ onSend, placeholder }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex items-center bg-gray-800 rounded-xl p-3 w-full mt-6">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder || 'Type your message...'}
        className="flex-1 bg-transparent outline-none text-gray-300 placeholder-gray-500 px-2 rounded-l-md"
        onKeyDown={handleKeyPress}
      />
      <button onClick={handleSend} className="text-gray-400 rounded-r-md">
        <i className="material-icons">send</i>
      </button>
    </div>
  );
};

export default SendMessage;
