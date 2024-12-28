'use client'
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserCircle2, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

export const AIBot = () => {
  const location = useLocation();
  const { question } = location.state || {};
  const [lock, setLock] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);

  const [messages, setMessages] = useState<Message[]>(() => {
    const storedMessages = localStorage.getItem('ai-bot-messages');
    return storedMessages ? JSON.parse(storedMessages) : [];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const conversationId = localStorage.getItem('conversation_id');

  useEffect(() => {
    const fetchInitialQuestion = async () => {
      if (conversationId) {
        try {
          const response = await fetch(`http://localhost:8000/conversation/${conversationId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          const data = await response.json();
          if (data[0]?.content && !messages.some(msg => msg.text === data[0].content && msg.sender === 'user')) {
            const userMessage: Message = { text: data[0].content, sender: 'user' };
            setMessages(prev => [...prev, userMessage]);
            await fetchBotResponse(data[0].content);
          }
        } catch (error) {
          console.error('Error fetching initial question:', error);
        }
      }
    };

    if (messages.length === 0) {
      fetchInitialQuestion();
    }
    else if (question && !messages.some(msg => msg.text === question && msg.sender === 'user')) {
      const userMessage: Message = { text: question, sender: 'user' };
      setMessages(prev => [...prev, userMessage]);
      fetchBotResponse(question);
    }
  }, [question, conversationId, messages]);

  useEffect(() => {
    localStorage.setItem('ai-bot-messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handlePause = async () => {
    setIsPaused(true);
    if (readerRef.current) {
      await readerRef.current.cancel();
      readerRef.current = null;
    }
    setIsLoading(false);
    setLock(false);
  };

  const fetchBotResponse = async (userMessage: string) => {
    if (isLoading || lock) return;

    setIsLoading(true);
    setLock(true);
    setIsPaused(false);
    
    const message = {
      role: "user",
      content: userMessage,
      model: "qwen/qwen-2.5-72b-instruct",
      stream: "true",
      conversation_id: conversationId
    };

    try {
      const response = await fetch("http://localhost:8000/stream", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body!.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder('utf-8');
      let botResponse = '';

      // Add empty bot message first
      setMessages(prevMessages => [...prevMessages, { text: '', sender: 'bot' }]);

      while (true) {
        if (isPaused) break;
        
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        botResponse += chunk;

        // Update the last bot message instead of adding new ones
        setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1] = { text: botResponse, sender: 'bot' };
          return newMessages;
        });
      }
    } catch (error) {
      if (!isPaused) {
        console.error('Error fetching bot response:', error);
        setMessages(prevMessages => [
          ...prevMessages,
          { text: 'Error fetching response.', sender: 'bot' }
        ]);
      }
    } finally {
      if (!isPaused) {
        setIsLoading(false);
        setLock(false);
      }
      readerRef.current = null;
    }
  };

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      const userMessage = input.trim();
      setMessages(prevMessages => [...prevMessages, { text: userMessage, sender: 'user' }]);
      setInput('');
      await fetchBotResponse(userMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    localStorage.removeItem('ai-bot-messages');
    localStorage.removeItem('conversation_id');
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <div className="flex-1 flex flex-col justify-start items-center text-center w-full max-w-3xl mx-auto px-4 pb-20">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white mb-6">
          Back to Home
        </button>

        <button onClick={handleClearHistory} className="text-gray-400 hover:text-white mb-6">
          Clear Chat History
        </button>

        <div className="flex-1 overflow-y-auto w-full max-w-3xl mx-auto">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`bg-gray-800 text-gray-300 p-10 max-w-6xl 
                    ${msg.sender === 'bot' && isLoading && index === messages.length - 1 ? 'animate-pulse' : ''}
                    ${msg.sender === 'user'
                      ? 'rounded-t-2xl rounded-bl-2xl rounded-br-sm'
                      : 'rounded-t-2xl rounded-br-2xl rounded-bl-sm'
                    }`}
                >
                  <div className="flex items-start">
                    {msg.sender === 'user' && <UserCircle2 className="text-rose-500 mr-2 h-5 w-5" />}
                    {msg.sender === 'bot' && <Bot className="text-blue-500 mr-2 h-5 w-5" />}
                    <div className="flex-1 text-left">
                      {msg.sender === 'user' ? (
                        msg.text
                      ) : (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                            h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-2" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-lg font-semibold mb-2" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2" {...props} />,
                            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                            code: ({ inline, ...props }: { inline?: boolean } & React.HTMLProps<HTMLElement>) =>
                              inline ? (
                                <code className="bg-gray-700 rounded px-1" {...props} />
                              ) : (
                                <code className="block bg-gray-700 rounded p-2 my-2 whitespace-pre-wrap" {...props} />
                              ),
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
          <div className="fixed bottom-0 right-0 z-50 p-6  flex flex-col  items-center w-full md:w-[calc(100%-260px)] pointer-events-auto px-4">
            <div className="flex items-center bg-gray-800 rounded-xl p-3 w-full max-w-[800px] shadow-lg mx-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-transparent outline-none text-gray-300 placeholder-gray-500 px-2 rounded-l-md"
                onKeyDown={handleKeyPress}
                disabled={isLoading}
                aria-label="Message input"
              />
              {isLoading ? (
                <button
                  onClick={handlePause}
                  className="text-gray-400 hover:text-white px-4"
                  aria-label="Pause response"
                >
                  <span className="material-icons">pause</span>
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  className={`text-gray-400 rounded-r-md ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:text-white'}`}
                  disabled={isLoading}
                  aria-label="Send message"
                >
                  <span className="material-icons">send</span>
                </button>
              )}
            </div>
          </div>
      </div>
    </div>

  );
};


export default AIBot;

