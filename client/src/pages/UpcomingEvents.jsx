import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Phone,
  Download,
  ArrowRight,
  ArrowLeft,
  Book,
  Award, // Changed from Certificate to Award
  CalendarCheck,
  Scroll,
  Users,
  GraduationCap
} from "lucide-react";

export default function UpcomingEvents() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/events/${eventId}`)
      .then(res => res.json())
      .then(data => {
        setEvent(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching event:", err);
        setLoading(false);
      });
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-bold text-gray-500 animate-pulse">Loading Event...</h2>
      </div>
    );
  }

  if (!event || event.message) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-3xl font-bold text-red-500">
          Event Not Found
        </h2>
      </div>
    );
  }

  return (
    <div className="text-gray-700 bg-[#f7f9fc]">
      {/* ================= HERO / EVENT DETAILS ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-violet-50 py-24">
        {/* Background Decorations */}
        <div className="absolute -top-32 -right-28 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-28 h-[420px] w-[420px] rounded-full bg-blue-200/40 blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#8b5cf610,transparent_40%)]"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            
            {/* LEFT DETAILS COLUMN */}
            <div className="order-2 lg:order-1">
              <Link 
                to="/events" 
                className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-800 font-semibold mb-6 transition"
              >
                <ArrowLeft size={20} /> Back to Events
              </Link>
              <br />
              
              <div className="mb-2">
                <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-5 py-1.5 text-xs font-bold uppercase tracking-wider mb-2">
                  College
                </span>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                  {event.collegeName}
                </h1>
              </div>

              <div className="mt-4">
                <span className="inline-flex items-center rounded-full bg-purple-100 text-purple-700 px-5 py-1.5 text-xs font-bold uppercase tracking-wider mb-2">
                  Topic
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-pink-500 leading-tight">
                  {event.topic}
                </h2>
              </div>

              {/* Info Grid Cards */}
              <div className="mt-8 grid sm:grid-cols-2 gap-5">
                {/* Date Card */}
                <div className="rounded-2xl bg-white p-5 shadow-lg border border-slate-100 hover:-translate-y-1 transition duration-300">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-violet-100 flex items-center justify-center shrink-0">
                      <CalendarDays className="text-violet-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-400">Date</p>
                      <h4 className="font-bold text-slate-800 text-sm">
                        {event.date ? new Date(event.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Flexible Dates'}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Time Card */}
                <div className="rounded-2xl bg-white p-5 shadow-lg border border-slate-100 hover:-translate-y-1 transition duration-300">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
                      <Clock3 className="text-blue-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-400">Time</p>
                      <h4 className="font-bold text-slate-800 text-sm">{event.time || "TBD"}</h4>
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                <div className="rounded-2xl bg-white p-5 shadow-lg border border-slate-100 hover:-translate-y-1 transition duration-300">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
                      <MapPin className="text-emerald-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-400">Location</p>
                      <h4 className="font-bold text-slate-800 text-sm">{event.location || "Campus Venue"}</h4>
                    </div>
                  </div>
                </div>

                {/* Contact Card */}
                <div className="rounded-2xl bg-white p-5 shadow-lg border border-slate-100 hover:-translate-y-1 transition duration-300">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-pink-100 flex items-center justify-center shrink-0">
                      <Phone className="text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-400">Contact</p>
                      {event.contact1 && (
                        <a href={`tel:${event.contact1}`} className="block text-sm font-bold text-slate-800 hover:text-violet-600 truncate">
                          {event.contact1}
                        </a>
                      )}
                      {event.contact2 && (
                        <a href={`tel:${event.contact2}`} className="block text-sm font-bold text-slate-800 hover:text-violet-600 truncate">
                          {event.contact2}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Action Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row gap-5">
                <a
                  href={event.registrationLink || "#"}
                  target={event.registrationLink ? "_blank" : "_self"}
                  rel="noreferrer"
                  className="group flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 px-8 py-4 font-semibold text-white shadow-xl hover:scale-105 transition duration-300 flex-1"
                >
                  {event.registerButtonText || "Register Now"}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
                </a>

                {/* Conditional Download Option matching PHP implementation if it's a PDF target */}
                {event.poster && event.poster.toLowerCase().endsWith('.pdf') && (
                  <a 
                    href={event.poster.startsWith('http') ? event.poster : `http://localhost:5000${event.poster}`}
                    download
                    className="border-2 border-purple-700 text-purple-700 font-semibold py-4 px-8 rounded-xl text-center transition-all duration-300 hover:bg-purple-700 hover:text-white flex-1 flex items-center justify-center gap-2 shadow-sm hover:scale-105"
                  >
                    <Download size={18} /> Download Certificate
                  </a>
                )}
              </div>
            </div>

            {/* RIGHT IMAGE/POSTER COLUMN */}
            <div className="relative order-1 lg:order-2">
              <div className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-violet-300 blur-3xl opacity-40"></div>
              <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-blue-300 blur-3xl opacity-40"></div>
              
              <div className="relative rounded-[32px] bg-gradient-to-br from-purple-600 to-indigo-600 p-1.5 shadow-2xl transition duration-500 hover:scale-[1.02]">
                <img
                  src={event.poster?.startsWith('http') ? event.poster : `http://localhost:5000${event.poster}`}
                  alt={event.topic}
                  className="rounded-[26px] w-full h-auto object-cover max-h-[500px]"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/600x600?text=No+Event+Media" }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= PREMIUM SERVICES SECTION ================= */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <span className="text-purple-700 font-bold tracking-widest uppercase text-xs">Veritaz International</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">Our Premium Services</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-indigo-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Box 1 */}
            <div className="bg-[#f7f9fc] rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-50 group hover:-translate-y-1">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-purple-700 text-2xl shadow-sm mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Book size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-purple-700 transition-colors">Textbook Publications</h3>
            </div>

            {/* Box 2 */}
            <div className="bg-[#f7f9fc] rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-50 group hover:-translate-y-1">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-indigo-500 text-2xl shadow-sm mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Award size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-500 transition-colors">Patent Grant Support</h3>
            </div>

            {/* Box 3 */}
            <div className="bg-[#f7f9fc] rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-50 group hover:-translate-y-1">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-pink-500 text-2xl shadow-sm mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <CalendarCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-pink-500 transition-colors">Organizing Educational Events</h3>
            </div>

            {/* Box 4 */}
            <div className="bg-[#f7f9fc] rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-50 group hover:-translate-y-1">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-emerald-500 text-2xl shadow-sm mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Scroll size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-500 transition-colors">SCI & Scopus Journal Publication</h3>
            </div>

            {/* Box 5 */}
            <div className="bg-[#f7f9fc] rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-50 group hover:-translate-y-1">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-orange-500 text-2xl shadow-sm mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-orange-500 transition-colors">IEEE Conference Publications</h3>
            </div>

            {/* Box 6 */}
            <div className="bg-[#f7f9fc] rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-50 group hover:-translate-y-1">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-indigo-600 text-2xl shadow-sm mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Ph.D. Assistance</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}