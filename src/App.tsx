import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import LoginPage from './Pages/LoginPage';
import MainPage from './Pages/MainPage';
// import  {ChatPage}  from './Pages/ChatPage';
// import AIBot from './components/ui/Bot';
import ChatPage from './Pages/ChatPage';
function App() {
  return (
    
      <Router>
        <Routes>
          {/* Default Route - Login Page */}
          {/* <Route path="/" element={<LoginPage/>} /> */}
          {/* Landing Page */}
          <Route path="/" element={<MainPage/>} />
          <Route path="/chat" element={<ChatPage/>} />
        </Routes>
      </Router>
    
  );
}

export default App;
