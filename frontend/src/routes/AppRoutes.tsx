import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Otp from "../pages/Otp";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
import Applications from "../pages/Applications";
import TrackApplication from "../pages/TrackApplication";
import Payments from "../pages/Payments";
import ApplyService from "../pages/ApplyService";
import StartService from "../pages/StartService";
import ServiceDetails from "../pages/ServiceDetails";
import AdminLogin from "../admin/AdminLogin";
import AdminDashboard from "../admin/AdminDashboard";
import Services from "../admin/Services";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/otp" element={<Otp />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/track-application" element={<TrackApplication />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/apply" element={<ApplyService />} />
        <Route path="/start-service" element={<StartService />} />
        <Route path="/service/:id" element={<ServiceDetails />} />
        <Route path="/admin/login" element={<AdminLogin />} />

<Route path="/admin/dashboard" element={<AdminDashboard />} />
<Route
  path="/admin/services"
  element={<Services />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;