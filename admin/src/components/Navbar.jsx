import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdMenu,
  MdSearch,
  MdNotifications,
  MdKeyboardArrowDown,
  MdSettings,
  MdLogout,
  MdPerson,
} from 'react-icons/md';
import { Link } from "react-router-dom";


const pageTitles = {
  '/': 'Dashboard',
  '/books': 'Book Store',
  '/books/add': 'Add New Book',
  '/testimonials': 'Testimonials',
  '/testimonials/add': 'Add Testimonial',
};

const Navbar = ({ onMenuToggle }) => {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const title =
    Object.keys(pageTitles)
      .filter((k) => location.pathname.startsWith(k) && k !== '/')
      .sort((a, b) => b.length - a.length)[0] ||
    (location.pathname === '/' ? pageTitles['/'] : 'Admin Panel');

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-brand-border px-4 lg:px-6 h-[72px] flex items-center justify-between gap-4">
      {/* Left: Hamburger + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors text-brand-gray"
        >
          <MdMenu className="text-xl" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-brand-dark">{title}</h1>
          <p className="text-xs text-brand-gray hidden sm:block">Veritaz
            International Press</p>
        </div>
      </div>

      {/* Right: Search + Notif + Profile */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-brand-bg border border-brand-border rounded-xl px-3 py-2 w-56 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
          <MdSearch className="text-brand-gray text-lg flex-shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-brand-dark placeholder-brand-gray/60 outline-none flex-1 min-w-0"
          />
        </div>

        {/* Mobile search */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors text-brand-gray"
        >
          <MdSearch className="text-xl" />
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors text-brand-gray"
          >
            <MdNotifications className="text-xl" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="fixed sm:absolute right-4 sm:right-0 top-[72px] sm:top-12 w-[calc(100vw-2rem)] sm:w-80 max-w-80 bg-white rounded-2xl shadow-card-xl border border-brand-border z-50"
              >
                <div className="p-4 border-b border-brand-border flex items-center justify-between">
                  <p className="font-semibold text-brand-dark">Notifications</p>
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-semibold">3 New</span>
                </div>
                <div className="divide-y divide-brand-border">
                  {[
                    { msg: 'New book submission received', time: '2m ago', dot: 'bg-primary-500' },
                    { msg: 'Testimonial pending approval', time: '1h ago', dot: 'bg-amber-400' },
                    { msg: 'Monthly report ready', time: '3h ago', dot: 'bg-blue-400' },
                  ].map((n, i) => (
                    <div key={i} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex gap-3 items-start">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.dot}`} />
                        <div>
                          <p className="text-sm text-brand-dark font-medium">{n.msg}</p>
                          <p className="text-xs text-brand-gray mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3">
                  <button className="w-full text-center text-sm text-primary-600 font-semibold hover:text-primary-700 py-1">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
              alt="Admin"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-200"
            />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-brand-dark leading-tight">Admin</p>
              <p className="text-xs text-brand-gray">Super Admin</p>
            </div>
            <MdKeyboardArrowDown
              className={`text-brand-gray text-lg transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-card-xl border border-brand-border z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-brand-border">
                  <p className="font-semibold text-brand-dark text-sm">Admin User</p>
                  <p className="text-xs text-brand-gray">admin@pencilbitz.com</p>
                </div>
                <div className="p-2">
                  {[
                    { icon: MdPerson, label: 'Profile' },
                    { icon: MdSettings, label: 'Settings' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-brand-dark hover:bg-gray-50 transition-colors"
                    >
                      <item.icon className="text-brand-gray text-base" />
                      {item.label}
                    </button>
                  ))}
                  <div className="border-t border-brand-border mt-1 pt-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors">
                      <Link
                        to="/logout"
                        className="text-red-600 font-semibold"
                      >
                        Logout
                      </Link>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
