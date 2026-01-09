import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- Components ---
import AboutUs from './components/AboutUs';
import ProtectedRoute from './components/ProtectedRoutes';
import AdminProtectedRoute from './components/AdminProtectedRoutes';
import Layout from './components/Layout';

import HomePage from './components/HomePage';
import PetListingPage from './components/PetListingPage';
import PetDetailsPage from './components/PetDetailsPage';
import PetFoodDetailsPage from './components/PetFoodDetailsPage'; // ✅ Import PetFoodDetailsPage
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import AdminAdoptionRequests from './components/AdminAdoptionRequests'; 
import AdoptionHistory from './components/AdoptionHistory'; 
import DaycarePackages from './components/DaycarePackages';
import FoodCart from './components/FoodCart';
import ProductStore from './components/ProductStore';
import AdminDaycareDashboard from './components/AdminDaycareDashboard'; 
import CheckoutPage from './components/CheckoutPage';


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/foodcart" element={<FoodCart />} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* ✅ FIXED: Added AboutUs route inside Routes container */}
          <Route path="/about" element={<AboutUs />} />

          {/* Protected User Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/daycare"
            element={
              <ProtectedRoute>
                <DaycarePackages />
              </ProtectedRoute>
            }
          />

          <Route
            path="/store"
            element={
              <ProtectedRoute>
                <ProductStore />
              </ProtectedRoute>
            }
          />

          {/* Pet Food Details Page Route */}
          <Route 
            path="/food-details/:id"  // The `id` is passed as a URL param for the product
            element={<PetFoodDetailsPage />}  // Show the PetFoodDetailsPage component
          />
          
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <AdoptionHistory />
              </ProtectedRoute>
            }
          />

          {/* --- ADMIN ROUTES --- */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/adoption-requests"
            element={
              <AdminProtectedRoute>
                <AdminAdoptionRequests />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/daycare"
            element={
              <AdminProtectedRoute>
                <AdminDaycareDashboard />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/store"
            element={
              <AdminProtectedRoute>
                <ProductStore />
              </AdminProtectedRoute>
            }
          />

          {/* Pet Routes */}
          <Route
            path="/pets"
            element={
              <ProtectedRoute>
                <PetListingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pets/:id"
            element={
              <ProtectedRoute>
                <PetDetailsPage />
              </ProtectedRoute>
            }
          />
          {/* Checkout Route */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;