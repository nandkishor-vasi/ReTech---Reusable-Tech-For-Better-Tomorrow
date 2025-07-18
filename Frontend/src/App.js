import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Navbar from './components/Navbar';
import Contact from './pages/Contact';
import About from './pages/About';
import Home from './pages/Home';
import AuthPage from './components/AuthPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DonorDashboard from './pages/DonorDashboard';
import BeneficiaryDashboard from './pages/BeneficiaryDashboard';
import DonorProfile from './pages/DonorProfile';
import BeneficiaryProfile from './pages/BeneficiaryProfile';
import DonorLeaderboard from './pages/DonorLeaderboard';
import DonorDonations from './pages/DonorDonations';
import Requests from './pages/Requests';
import BeneficiaryRequest from "./pages/BeneficiaryRequest"
import BeneficiartHistory from "./pages/BeneficiaryHistory"

const sampleDevices = [
  {
    id: 1,
    name: "MacBook Pro 2019",
    type: "laptop",
    condition: "excellent",
    description: "Lightly used laptop with 16GB RAM",
    status: "available",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8"
  },
  {
    id: 2,
    name: "iPad Air 4th Gen",
    type: "tablet",
    condition: "good",
    description: "Perfect for online classes",
    status: "reserved",
    image: "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33"
  }
];

const stats = {
  devicesDonated: 1420,
  beneficiaries: 980,
  eWasteReduced: 35
};

function App() {
  const [devices, setDevices] = useState([]);
  const [stats, setStats] = useState({
    devicesDonated: 0,
    beneficiaries: 0,
    eWasteReduced: 0
  });



  return (
    <AuthProvider>  
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home stats={stats} devices={sampleDevices} />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<ProtectedRoute allowedRoles={["DONOR"]} />}>
            <Route path="/donorDashboard/:donorId" element={<DonorDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["BENEFICIARY"]} />}>
            <Route path="/beneficiaryDashboard/:beneficiaryId" element={<BeneficiaryDashboard />} />
          </Route>
          <Route path="/beneficiaryHistory/:beneficiaryId" element={< BeneficiartHistory />}></Route>
          <Route path="/donor/profile/:id" element={<DonorProfile />}></Route>
          <Route path="/beneficiary/profile/:id" element={<BeneficiaryProfile />}></Route>
          <Route path="/leaderboard" element={<DonorLeaderboard />} />
          <Route path="/devices/donors/:donorId" element={< DonorDonations />} />
          <Route path="/requests/donors/:donorId" element={< Requests />} />
          <Route path="/requests/beneficiary/:beneficiaryId" element={< BeneficiaryRequest />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
