import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import OurCompany from "./pages/OurCompany";
import Events from "./pages/Events";
import UpcomingEvents from "./pages/UpcomingEvents";
import BookStore from "./pages/BookStore";
import BookDetails from "./pages/BookDetails";
import BookPublishing from "./pages/BookPublishing";
import Contacts from "./pages/Contacts";
import Conference from "./pages/Conference";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/our-company" element={<OurCompany />} />
        <Route path="/events" element={<Events />} />
        <Route
          path="/upcoming-events/:eventId"
          element={<UpcomingEvents />}
        />
        <Route path="/book-store" element={<BookStore />} />
        <Route
          path="/books/:slug"
          element={<BookDetails />}
        />
        <Route path="/book-publishing" element={<BookPublishing />} />
        <Route path="/contact" element={<Contacts />} />
        <Route path="/conferences/:confname" element={<Conference />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;