import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { MatchProvider } from "./contexts/MatchContext";
import { PetProvider } from "./contexts/PetContext";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Header from "./Components/common/header";
import AdoptPage from "./pages/AdoptPage";
import LostFoundPage from "./pages/LostFound";
import ReportPetPage from "./pages/ReportPet";
import UserDashboard from "./pages/UserDashboard";
import AdminReports from "./pages/AdminPage";
import RegisterPetPage from "./pages/RegisterPet";
import FavoritesPage from "./pages/FavoritesPage";
import PetDetail from "./Components/Pets/PetDetail";
import AdoptionRequest from "./pages/AdoptionRequest";
import SettingsPage from "./pages/SettingsPage";
import EditPetPage from "./pages/EditPetPage";
import ProtectedRoute from "./ProtectedRoute";
import LostFoundResponse from "./pages/LostFoundResponse";

const App = () => {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <MatchProvider>
          <PetProvider>

            <Routes>

              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Route>

              <Route element={<MainLayout />}>
                <Route path="/" element={<Header />} />
                <Route path="/adopt" element={<AdoptPage />} />
                <Route path="/adopt/:id" element={<PetDetail />} />
                <Route path="/lost-found/:id" element={<PetDetail />} />
                <Route path="/adopt/:id/request" element={<AdoptionRequest />} />
                <Route path="/lost-found" element={<LostFoundPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/lost-found/:id/respond" element={<LostFoundResponse />} />
              </Route>

              <Route
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }>
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/pets/edit/:id"element={<EditPetPage />}/>
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/reportPet" element={<ReportPetPage />} />
                <Route path="/registerPet" element={<RegisterPetPage />} />
                <Route path="/admin" element={<AdminReports />} />
              </Route>

            </Routes>

          </PetProvider>
        </MatchProvider>
      </NotificationsProvider>
    </AuthProvider>
  );
};

export default App;
