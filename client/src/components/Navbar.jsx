import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Building2,
  Calendar,
  ShoppingBag,
  BookOpen,
  Mail,
  Users,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../json_data/firebase";

import {
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import axios from "axios";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [conferences, setConferences] = useState([]);

    const openMenu = () => setIsMenuOpen(true);

    const closeMenu = () => {
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
    };

    const toggleMobileDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
  const fetchConferences = async () => {
    try {
      const snapshot = await getDocs(collection(db, "conferences (2)"));

      let conferences = [];

      snapshot.forEach((doc) => {
        const docData = doc.data();

        if (Array.isArray(docData.data)) {
          conferences.push(...docData.data);
        }
      });

      console.log("Conferences:", conferences);

      setConferences(conferences);
    } catch (error) {
      console.error("Failed to fetch conferences:", error);
      setConferences([]);
    }
  };

  fetchConferences();
}, []);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isMenuOpen]);

    return (
        <header className="w-full bg-white shadow-sm sticky top-0 z-50">

            {/* ================= TOP HEADER ================= */}

            <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">

                {/* Logo */}

                <div className="flex items-center gap-1">
                    <div className="w-25 h-25 md:w-18 md:h-18">
                        <img
                            src="/assets/image/veritaz-bg-Remove.png"
                            alt="Veritaz"
                            className="w-20 h-full object-contain"
                        />
                    </div>

                    <div>
                        <h1 className="text-lg md:text-2xl font-bold tracking-widest text-gray-800 uppercase leading-none">
                            Veritaz
                        </h1>

                        <p className="text-[10px] md:text-[10px] tracking-[0.2em] text-gray-500 uppercase font-bold mt-0.5">
                            International Press
                        </p>
                    </div>
                </div>

                {/* Right Side */}

                <div className="flex items-center gap-2 md:gap-6">

                    {/* Mail */}

                    <a
                        href="mailto:veritazinternationalpress@gmail.com?subject=Enquiry%20from%20Website"
                        className="flex items-center gap-3 px-4 py-2 border border-gray-200 rounded-full bg-white hover:bg-yellow-50 hover:border-yellow-500 hover:shadow-md transition-all group"
                    >
                        <Mail className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />

                        <div className="flex flex-col leading-tight">
                            <span className="font-bold text-[10px] tracking-wider text-gray-400">
                                Send Mail
                            </span>
                        </div>
                    </a>

                    {/* WhatsApp */}

                    <a
                        href="https://chat.whatsapp.com/Fc8Y3g9K43PBu6YhFv1JrA"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-3 py-2 border border-green-200 rounded-full bg-white hover:bg-green-50 hover:border-green-500 transition-all group"
                    >
                        <FaWhatsapp className="text-green-500 text-xl group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline font-bold text-xs text-gray-700">
                            Join WhatsApp
                        </span>
                    </a>

                    {/* Desktop Social */}

                    <div className="hidden md:flex items-center space-x-4 text-gray-400 border-l pl-6 ml-2">

                        <a
                            href="https://www.linkedin.com/in/veritaz-international-press/"
                            className="hover:text-blue-700 transition-colors"
                        >
                            <FaLinkedinIn className="w-5 h-5" />
                        </a>

                        <a
                            href="https://www.facebook.com/profile.php?id=61583778217764"
                            className="hover:text-blue-600 transition-colors"
                        >
                            <FaFacebookF className="w-5 h-5" />
                        </a>

                        <a
                            href="https://www.instagram.com/veritazinternationalpress/"
                            className="hover:text-pink-600 transition-colors"
                        >
                            <FaInstagram className="w-5 h-5" />
                        </a>

                    </div>

                    {/* Mobile Menu */}

                    <button
                        onClick={openMenu}
                        className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                        <Menu className="w-7 h-7" />
                    </button>

                </div>

            </div>

            {/* ================= DESKTOP NAV ================= */}

            <nav className="hidden lg:block border-t border-gray-100 bg-white">

                <div className="container mx-auto px-6">

                    <div className="flex justify-center items-center h-14 space-x-2">

                        <a
                            href="/"
                            className="px-4 py-2 rounded-md text-sm font-semibold text-slate-700 hover:bg-gray-50 hover:text-blue-600 transition-all flex items-center gap-2"
                        >
                            <Home className="w-4 h-4 text-blue-500" />
                            Home
                        </a>

                        <a
                            href="/our-company"
                            className="px-4 py-2 rounded-md text-sm font-semibold text-slate-700 hover:bg-gray-50 hover:text-purple-600 transition-all flex items-center gap-2"
                        >
                            <Building2 className="w-4 h-4 text-purple-500" />
                            Our Company
                        </a>

                        <a
                            href="/events"
                            className="px-4 py-2 rounded-md text-sm font-semibold text-slate-700 hover:bg-gray-50 hover:text-pink-600 transition-all flex items-center gap-2"
                        >
                            <Calendar className="w-4 h-4 text-pink-500" />
                            Events
                        </a>

                        <a
                            href="/book-store"
                            className="px-4 py-2 rounded-md text-sm font-semibold text-slate-700 hover:bg-gray-50 hover:text-emerald-600 transition-all flex items-center gap-2"
                        >
                            <ShoppingBag className="w-4 h-4 text-emerald-500" />
                            Book Store
                        </a>

                        <a
                            href="/book-publishing"
                            className="px-4 py-2 rounded-md text-sm font-semibold text-slate-700 hover:bg-gray-50 hover:text-yellow-600 transition-all flex items-center gap-2"
                        >
                            <BookOpen className="w-4 h-4 text-yellow-500" />
                            Publishing
                        </a>

                        {/* Conference Dropdown */}

                        <div className="relative group">

                            <button className="px-4 py-2 rounded-md text-sm font-semibold text-slate-700 group-hover:bg-gray-50 group-hover:text-indigo-600 transition-all flex items-center gap-2">

                                <Users className="w-4 h-4 text-indigo-500" />

                                Conference

                                <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />

                            </button>

                            <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl py-2 hidden group-hover:block border border-gray-100 animate-fadeIn">
                                {conferences.length > 0 ? (
                                    conferences.map((conf) => (
                                        <Link
                                            key={conf.id}
                                            to={`/conferences/${conf.id}`}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                        >
                                            {conf.conferencename || conf.conferenceName || "Unnamed Conference"}
                                        </Link>
                                    ))
                                ) : (
                                    <span className="block px-4 py-2 text-xs text-gray-400">No Released Conferences</span>
                                )}
                            </div>

                        </div>

                        <a
                            href="/contact"
                            className="px-4 py-2 rounded-md text-sm font-semibold text-slate-700 hover:bg-gray-50 hover:text-red-600 transition-all flex items-center gap-2"
                        >
                            <Mail className="w-4 h-4 text-red-500" />
                            Contact
                        </a>

                    </div>

                </div>

            </nav>

            {/* ================= MOBILE MENU (Structure Only) ================= */}

            <div
                className={`fixed inset-0 z-[100] transition-all duration-300 ${isMenuOpen ? "visible" : "invisible"
                    }`}
            >
                {/* Backdrop */}

                <div
                    onClick={closeMenu}
                    className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0"
                        }`}
                />

                {/* Menu Panel */}

                <div
                    className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    {/* Header */}

                    <div className="p-6 flex items-center justify-between border-b border-gray-100">

                        <span className="text-lg font-bold text-gray-800 uppercase tracking-widest">
                            Menu
                        </span>

                        <button
                            onClick={closeMenu}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                        >
                            <X className="w-6 h-6" />
                        </button>

                    </div>

                    {/* PART 2 STARTS HERE */}

                    {/* Mobile navigation and footer will be added in Part 2 */}

                    {/* ================= MOBILE NAVIGATION ================= */}

                    <nav className="flex-1 overflow-y-auto py-2">

                        <a
                            href="/"
                            className="flex items-center gap-4 px-6 py-3 text-slate-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                <Home className="w-5 h-5" />
                            </div>
                            <span className="flex-1">Home</span>
                            <ChevronRight className="w-4 h-4 text-slate-300" />
                        </a>

                        <a
                            href="/our-company"
                            className="flex items-center gap-4 px-6 py-3 text-slate-700 font-medium hover:bg-purple-50 hover:text-purple-600 transition-colors"
                        >
                            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <span className="flex-1">Our Company</span>
                            <ChevronRight className="w-4 h-4 text-slate-300" />
                        </a>

                        <a
                            href="/events"
                            className="flex items-center gap-4 px-6 py-3 text-slate-700 font-medium hover:bg-pink-50 hover:text-pink-600 transition-colors"
                        >
                            <div className="p-2 rounded-lg bg-pink-50 text-pink-600">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <span className="flex-1">Events</span>
                            <ChevronRight className="w-4 h-4 text-slate-300" />
                        </a>

                        <a
                            href="/book-store"
                            className="flex items-center gap-4 px-6 py-3 text-slate-700 font-medium hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                        >
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                <ShoppingBag className="w-5 h-5" />
                            </div>
                            <span className="flex-1">Book Store</span>
                            <ChevronRight className="w-4 h-4 text-slate-300" />
                        </a>

                        <a
                            href="/book-publishing"
                            className="flex items-center gap-4 px-6 py-3 text-slate-700 font-medium hover:bg-amber-50 hover:text-amber-600 transition-colors"
                        >
                            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <span className="flex-1">Publishing</span>
                            <ChevronRight className="w-4 h-4 text-slate-300" />
                        </a>

                        {/* Conference Dropdown */}

                        <div className="border-b border-gray-100">

                            <button
                                onClick={toggleMobileDropdown}
                                className="w-full flex items-center gap-4 px-6 py-3 text-slate-700 font-medium hover:bg-indigo-50 transition-colors"
                            >
                                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                                    <Users className="w-5 h-5" />
                                </div>

                                <span className="flex-1 text-left">
                                    Conference
                                </span>

                                <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {isDropdownOpen && (
                                <div className="bg-gray-50 py-2 pl-14">
                                    {conferences.map((conf) => (
                                        <a
                                            key={conf.id}
                                            href={`/conferences/${conf.id}`}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md truncate"
                                        >
                                            {conf.conferenceName}
                                        </a>
                                    ))}
                                    {conferences.length === 0 && (
                                        <div className="px-4 py-2 text-sm text-gray-500">
                                            No conferences available
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>

                        <a
                            href="/contact"
                            className="flex items-center gap-4 px-6 py-3 text-slate-700 font-medium hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                            <div className="p-2 rounded-lg bg-red-50 text-red-600">
                                <Mail className="w-5 h-5" />
                            </div>

                            <span className="flex-1">
                                Contact Us
                            </span>

                            <ChevronRight className="w-4 h-4 text-slate-300" />
                        </a>

                    </nav>

                    {/* ================= MOBILE FOOTER ================= */}

                    <div className="p-8 border-t border-gray-100 bg-gray-50">

                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                            Follow Us
                        </p>

                        <div className="flex space-x-6">

                            <a
                                href="https://www.linkedin.com/in/veritaz-international-press/"
                                target="_blank"
                                rel="noreferrer"
                                className="text-gray-400 hover:text-blue-700 transition-colors"
                            >
                                <FaLinkedinIn className="w-5 h-5" />
                            </a>

                            <a
                                href="https://www.facebook.com/profile.php?id=61583778217764"
                                target="_blank"
                                rel="noreferrer"
                                className="text-gray-400 hover:text-blue-600 transition-colors"
                            >
                                <FaFacebookF className="w-5 h-5" />
                            </a>

                            <a
                                href="https://www.instagram.com/veritazinternationalpress/"
                                target="_blank"
                                rel="noreferrer"
                                className="text-gray-400 hover:text-pink-600 transition-colors"
                            >
                                <FaInstagram className="w-5 h-5" />
                            </a>

                        </div>

                    </div>

                    {/* End Mobile Menu */}
                </div>
            </div>
        </header>
    );
}