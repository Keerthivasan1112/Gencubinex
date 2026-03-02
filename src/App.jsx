import {Routes, Route} from 'react-router-dom';
import Home from './home/Home';
import Login from './login/Signin';
import Signup from './login/Signup';
import SignupPage from './pages/SignupPage';
import './App.css';
import ReviewPage from './pages/Review';
import ForgotPassword from './pages/ForgotPassword';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup-page" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/review" element={<ReviewPage />} />
      </Routes>
    </div>
  );
}

export default App;