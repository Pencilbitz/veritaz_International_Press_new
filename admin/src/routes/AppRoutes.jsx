import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/Dashboard';
import Events from '../pages/Events';
import EventDetails from '../pages/EventDetails';
import BookStore from '../pages/BookStore';
import BookDetails from '../pages/BookDetails';
import AddBook from '../pages/AddBook';
import Conferences from '../pages/Conferences';
import AddConference from '../pages/AddConference';
import Testimonials from '../pages/Testimonials';
import AddTestimonial from '../pages/AddTestimonial';
import MeetOurTeam from '../pages/MeetOurTeam';
import ImportData from '../pages/ImportData';
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import ProtectedRoute from "../pages/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Login */}
      <Route path="/" element={<Login />} />

      {/* Logout */}
      <Route path="/logout" element={<Logout />} />

      {/* Protected Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        <Route path="events" element={<Events />} />
        <Route path="events/add" element={<EventDetails />} />
        <Route path="events/details/:id" element={<EventDetails />} />

        <Route path="books" element={<BookStore />} />
        <Route path="books/add" element={<AddBook />} />
        <Route path="books/:id" element={<BookDetails />} />

        <Route path="conferences" element={<Conferences />} />
        <Route path="conferences/add" element={<AddConference />} />
        <Route path="conferences/edit/:id" element={<AddConference />} />

        <Route path="testimonials" element={<Testimonials />} />
        <Route path="testimonials/add" element={<AddTestimonial />} />
        <Route path="testimonials/edit/:id" element={<AddTestimonial />} />

        <Route path="meet-our-team" element={<MeetOurTeam />} />

        <Route path="import" element={<ImportData />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

