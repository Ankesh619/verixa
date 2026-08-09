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

import StartService from "../pages/StartService";
import ServiceDetails from "../pages/ServiceDetails";
import ApplicationForm from "../pages/ApplicationForm";

// Admin
import AdminLogin from "../admin/AdminLogin";
import AdminDashboard from "../admin/AdminDashboard";
import AdminApplications from "../admin/Applications";
import ApplicationDetails from "../admin/ApplicationDetails";
import Customers from "../admin/Customers";
import Services from "../admin/Services";
import AddService from "../admin/AddService";
import AdminPayments from "../admin/Payments";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/otp"
          element={<Otp />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/edit-profile"
          element={<EditProfile />}
        />

        <Route
          path="/applications"
          element={<Applications />}
        />

        <Route
          path="/track-application"
          element={<TrackApplication />}
        />

        <Route
          path="/payments"
          element={<Payments />}
        />

        <Route
          path="/apply/:serviceId"
          element={<ApplicationForm />}
        />

        <Route
          path="/start-service"
          element={<StartService />}
        />

        <Route
          path="/service/:id"
          element={<ServiceDetails />}
        />

        {/* =========================
            ADMIN ROUTES
        ========================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/applications"
          element={<AdminApplications />}
        />

        <Route
          path="/admin/applications/:id"
          element={<ApplicationDetails />}
        />

        <Route
          path="/admin/customers"
          element={<Customers />}
        />

        <Route
          path="/admin/services"
          element={<Services />}
        />

        <Route
          path="/admin/add-service"
          element={<AddService />}
        />

        <Route
          path="/admin/payments"
          element={<AdminPayments />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;