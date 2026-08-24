import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  MdAdd, MdStar, MdMenuBook, MdPeople, MdVisibility,
  MdArrowForward, MdSchedule, MdTrendingUp, MdEvent, MdWork, MdAssignment, MdGroups
} from 'react-icons/md';
import { FaBookOpen } from 'react-icons/fa';

import StatsCard from '../components/StatsCard';

import axios from 'axios';

import { collection, getDocs } from "firebase/firestore";
import { db } from "../json_data/firebase";
import { Link } from "react-router-dom";


const activityIcons = {
  book: <MdMenuBook className="text-blue-600 text-base" />,
  testimonial: <MdStar className="text-rose-500 text-base" />,
  author: <MdPeople className="text-purple-500 text-base" />,
  event: <MdEvent className="text-blue-500 text-base" />,
  conference: <MdGroups className="text-purple-600 text-base" />,
  application: <MdAssignment className="text-rose-500 text-base" />,
  edited: <FaBookOpen className="text-blue-400 text-base" />
};

import { MdClose } from 'react-icons/md';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl p-3 shadow-card-lg border border-brand-border">
        <p className="text-xs font-semibold text-brand-dark mb-1">{label}</p>
        {payload.map((entry) => (
          <p key={entry.name} className="text-xs text-brand-gray">
            <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: entry.color || entry.fill }} />
            {entry.name}: <strong>{entry.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStatCard, setSelectedStatCard] = useState(null);

  // Generate some dummy monthly data for the selected category
  const categoryDetailData = selectedCategory ? [
    { month: 'Jan', value: Math.floor(selectedCategory.value * 0.1) },
    { month: 'Feb', value: Math.floor(selectedCategory.value * 0.15) },
    { month: 'Mar', value: Math.floor(selectedCategory.value * 0.12) },
    { month: 'Apr', value: Math.floor(selectedCategory.value * 0.2) },
    { month: 'May', value: Math.floor(selectedCategory.value * 0.18) },
    { month: 'Jun', value: Math.floor(selectedCategory.value * 0.25) },
  ] : [];

  // Generate dummy pie chart data for stat cards
  const getStatPieData = (stat) => {
    if (!stat) return [];
    
    // Some varied color palettes based on the stat type
    const palettes = {
      1: ['#1D4ED8', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD'],
      2: ['#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'],
      3: ['#9333EA', '#A855F7', '#C084FC', '#D8B4FE', '#E9D5FF'],
      4: ['#BE123C', '#E11D48', '#FB7185', '#FCA5A5', '#FECDD3'],
      5: ['#1D4ED8', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'],
      6: ['#6D28D9', '#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD']
    };
    
    const colors = palettes[stat.id] || palettes[1];
    const total = stat.value;
    
    return [
      { name: 'Segment A', value: Math.floor(total * 0.4), color: colors[0] },
      { name: 'Segment B', value: Math.floor(total * 0.3), color: colors[1] },
      { name: 'Segment C', value: Math.floor(total * 0.15), color: colors[2] },
      { name: 'Segment D', value: Math.floor(total * 0.1), color: colors[3] },
      { name: 'Segment E', value: total - Math.floor(total * 0.95), color: colors[4] },
    ];
  };

  const statPieData = getStatPieData(selectedStatCard);

  const API = "http://localhost:5000/api";

const [booksData, setBooksData] = useState([]);
const [eventsData, setEventsData] = useState([]);
const [conferencesData, setConferencesData] = useState([]);
const [testimonialsData, setTestimonialsData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchDashboardData();
}, []);

const fetchCollectionData = async (collectionName) => {
  const snapshot = await getDocs(collection(db, collectionName));

  let data = [];

  snapshot.forEach((doc) => {
    const docData = doc.data();

    if (Array.isArray(docData.data)) {
      data.push(...docData.data);
    }
  });

  return data;
};

const fetchDashboardData = async () => {
  try {
    const [
      books,
      events,
      conferences,
      testimonials
    ] = await Promise.all([
      fetchCollectionData("books (5)"),
      fetchCollectionData("events (2)"),
      fetchCollectionData("conferences (2)"),
      fetchCollectionData("testimonials")
    ]);

    console.log("Books:", books);
    console.log("Events:", events);
    console.log("Conferences:", conferences);
    console.log("Testimonials:", testimonials);

    setBooksData(books);
    setEventsData(events);
    setConferencesData(conferences);
    setTestimonialsData(testimonials);
  } catch (err) {
    console.error("Dashboard Error:", err);
  } finally {
    setLoading(false);
  }
};

const statsData = [
  {
    id: 1,
    title: "Books",
    value: booksData.length,
    icon: <MdMenuBook />,
    color: "#2563EB"
  },
  {
    id: 2,
    title: "Events",
    value: eventsData.length,
    icon: <MdEvent />,
    color: "#3B82F6"
  },
  {
    id: 3,
    title: "Conferences",
    value: conferencesData.length,
    icon: <MdGroups />,
    color: "#8B5CF6"
  },
  {
    id: 4,
    title: "Testimonials",
    value: testimonialsData.length,
    icon: <MdStar />,
    color: "#E11D48"
  }
];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, i) => (
          <StatsCard 
            key={stat.id} 
            stat={stat} 
            index={i} 
            onClick={() => setSelectedStatCard(stat)}
          />
        ))}
      </div>

      {/* Row 2: Recent Books + Latest Testimonials */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent Books Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-5 xl:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="section-title">Recent Books</h2>
              <p className="section-subtitle">Latest additions to book store</p>
            </div>
            <button
              onClick={() => navigate('/admin/books')}
              className="text-xs text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1"
            >
              View All <MdArrowForward />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-border">
                  <th className="table-th">Book</th>
                  <th className="table-th">Author</th>
                  <th className="table-th">Price</th>
                  <th className="table-th">Status</th>
                </tr>
              </thead>
              <tbody>
                {booksData.slice(0, 5).map((book, i) => (
                  <motion.tr
                    key={book.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="table-tr"
                  >
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        <img
                          src={book.cover1}
                          alt={book.title}
                          className="w-8 h-10 rounded-md object-cover shadow-card"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/32x40?text=B'; }}
                        />
                        <span className="font-medium text-brand-dark text-xs line-clamp-2 max-w-[140px]">{book.title}</span>
                      </div>
                    </td>
                    <td className="table-td text-xs text-brand-gray">{book.authors}</td>
                    <td className="table-td font-semibold text-brand-dark text-xs">₹{book.price.toLocaleString()}</td>
                    <td className="table-td">
                      <span className={book.status === 'Published' ? 'badge-published' : 'badge-draft'}>
                        {book.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Row 4: Latest Testimonials */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="section-title">Latest Testimonials</h2>
            <p className="section-subtitle">Recent feedback from professors and educators</p>
          </div>
          <button
            onClick={() => navigate('/admin/testimonials')}
            className="text-xs text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1"
          >
            View All <MdArrowForward />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {testimonialsData.slice(0, 4).map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              whileHover={{ y: -3 }}
              className="bg-brand-bg rounded-xl p-4 border border-brand-border"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={t.avatar_url}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-200"
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=2563EB&color=fff`; }}
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-brand-dark truncate">{t.name}</p>
                  <p className="text-xs text-brand-gray truncate">{t.designation}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-2">
                {[1,2,3,4,5].map(s => (
                  <MdStar key={s} className={s <= t.rating ? 'star-active text-sm' : 'star-inactive text-sm'} />
                ))}
              </div>
              <p className="text-xs text-brand-gray line-clamp-3">"{t.content}"</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Modal Overlay for Chart Details */}
      <AnimatePresence>
        {selectedCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-card-lg p-6 w-full max-w-2xl border border-brand-border"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-brand-dark flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: selectedCategory.color }} />
                    {selectedCategory.name} Activity
                  </h3>
                  <p className="text-sm text-brand-gray mt-1">
                    Monthly growth breakdown over the last 6 months
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="w-8 h-8 rounded-full bg-blue-50 hover:bg-rose-100 flex items-center justify-center transition-colors"
                >
                  <MdClose className="text-blue-600" />
                </button>
              </div>

              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryDetailData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: '#F1F5F9' }}
                      contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" name={selectedCategory.name} fill={selectedCategory.color} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Overlay for StatsCard PieChart Details */}
      <AnimatePresence>
        {selectedStatCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-card-lg p-6 w-full max-w-xl border border-brand-border"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-brand-dark flex items-center gap-2">
                    {selectedStatCard.title} Breakdown
                  </h3>
                  <p className="text-sm text-brand-gray mt-1">
                    Detailed segments for {selectedStatCard.title}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedStatCard(null)}
                  className="w-8 h-8 rounded-full bg-blue-50 hover:bg-rose-100 flex items-center justify-center transition-colors"
                >
                  <MdClose className="text-blue-600" />
                </button>
              </div>

              <div className="h-[250px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {statPieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [value, name]}
                      contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 11 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                {statPieData.map((seg, i) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: seg.color }} />
                      <span className="text-brand-gray font-medium">{seg.name}</span>
                    </div>
                    <span className="font-semibold text-brand-dark">{seg.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
