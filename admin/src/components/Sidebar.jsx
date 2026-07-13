import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdDashboard,
  MdMenuBook,
  MdStar,
  MdChevronLeft,
  MdChevronRight,
  MdMenu,
  MdAutoStories,
  MdEvent,
  MdWork,
  MdAssignment,
  MdGroups,
  MdCloudUpload,
} from 'react-icons/md';
import { FaBookOpen } from 'react-icons/fa';

const navItems = [
  { path: '/admin', icon: MdDashboard, label: 'Dashboard' },
  { path: '/admin/events', icon: MdEvent, label: 'Events' },
  { path: '/admin/books', icon: MdMenuBook, label: 'Store Books' },
  { path: '/admin/conferences', icon: MdGroups, label: 'Conferences' },
  { path: '/admin/testimonials', icon: MdStar, label: 'Testimonials' },
  { path: '/admin/meet-our-team', icon: MdAssignment, label: 'Meet Our Team' },
];

const sidebarVariants = {
  expanded: { width: 240 },
  collapsed: { width: 72 },
};

const Sidebar = ({ isMobileOpen, setIsMobileOpen, collapsed, setCollapsed }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={collapsed ? 'collapsed' : 'expanded'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-brand-border shadow-card-md z-40
          flex flex-col overflow-visible
          lg:translate-x-0
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform lg:transition-none
        `}
        style={{ minWidth: collapsed ? 72 : 240 }}
      >
        <div className="flex flex-col h-full overflow-hidden w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-4 py-5 border-b border-brand-border min-h-[72px]">
            <img src="/logo.jpg" alt="Veritaz Logo" className="w-10 h-10 object-contain flex-shrink-0 rounded-full" />
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="font-bold text-brand-dark text-sm leading-tight">Veritaz</p>
                  <p className="text-xs text-brand-gray">International Press</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 pb-2 text-xs font-semibold text-brand-gray uppercase tracking-wider"
                >
                  Main Menu
                </motion.p>
              )}
            </AnimatePresence>

            {navItems.map((item) => {
              const isActive = item.path === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.path);
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className="block"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
                    title={collapsed ? item.label : ''}
                  >
                    <Icon className="text-xl flex-shrink-0" />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isActive && !collapsed && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60"
                      />
                    )}
                  </motion.div>
                </NavLink>
              );
            })}
          </nav>

          {/* Branding at Bottom */}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-4 pb-4"
              >
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                      <FaBookOpen className="text-white text-xs" />
                    </div>
                    <span className="text-xs font-bold text-blue-700">Knowledge is</span>
                  </div>
                  <p className="text-lg font-extrabold text-gradient">Power</p>
                  <div className="mt-1 h-0.5 w-12 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full" />
                </div>
                <p className="text-xs text-brand-gray text-center mt-3">
                  © 2024 Pencil Bitz Publications
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3.5 top-20 w-7 h-7 bg-white border border-brand-border rounded-full items-center justify-center shadow-card-md hover:border-blue-300 hover:text-blue-600 transition-all duration-200 z-50"
        >
          {collapsed ? (
            <MdChevronRight className="text-sm" />
          ) : (
            <MdChevronLeft className="text-sm" />
          )}
        </button>
      </motion.aside>
    </>
  );
};

export default Sidebar;
