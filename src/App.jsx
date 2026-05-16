import {Routes, Route} from 'react-router-dom';
import Home from './home/Home';
import Login from './login/Signin';
import SignupPage from './pages/SignupPage';
import OtpVerification from './pages/Otp';
import Mainpage from './pages/main/Mainpage';
import './App.css';
import ReviewPage from './pages/Review';
import ForgotPassword from './pages/ForgotPassword';
import AdminLayout from './pages/admin/Admin';
import Pending from './pages/admin/Pending';
import Approved from './pages/admin/Approval';
import RejectedUsers from './pages/admin/Rejected';
import HistoryPage from './pages/admin/History';
import All from './pages/admin/All';
import Message from './pages/Message';
import Profile from './pages/Profile';
import Convert from './pages/Convert';
import Withdraw from './pages/Withdraw';
import Transactions from './pages/Transactions';
import UserList from './pages/admin/Userlist';


function App() {
  return (
    <div className="App">
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<Login />} />
        <Route path="/signup-page" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/home" element={<Mainpage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/convert" element={<Convert />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/transactions" element={<Transactions />} />
           <Route path="/admin" element={<AdminLayout />} />
          <Route path="/pending" element={<Pending />} />
          <Route path="/approved" element={<Approved />} />
          <Route path="/rejected" element={<RejectedUsers />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/all" element={<All />} />
          <Route path="/message" element={<Message />} />
          <Route path="/userlist" element={<UserList />} />

      </Routes>
    </div>
  );
}

export default App;