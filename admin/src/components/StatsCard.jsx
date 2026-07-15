import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MdMenuBook,
  MdStar,
  MdPeople,
  MdVisibility,
  MdTrendingUp,
  MdTrendingDown,
  MdEvent,
  MdAssignment,
} from 'react-icons/md';
import { FaBookOpen } from 'react-icons/fa';

const iconMap = {
  books: MdMenuBook,
  edited: FaBookOpen,
  event: MdEvent,
  assignment: MdAssignment,
  star: MdStar,
  users: MdPeople,
  eye: MdVisibility,
};

const colorMap = {
  primary: {
    bg: 'bg-gradient-to-br from-primary-500 to-primary-600',
    ring: 'ring-primary-100',
    badge: 'bg-primary-50 text-primary-700',
    glow: 'shadow-primary',
  },
  sky: {
    bg: 'bg-gradient-to-br from-sky-400 to-sky-600',
    ring: 'ring-sky-100',
    badge: 'bg-sky-50 text-sky-700',
    glow: 'shadow-[0_4px_14px_0_rgb(14_165_233_/_0.25)]',
  },
  indigo: {
    bg: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
    ring: 'ring-indigo-100',
    badge: 'bg-indigo-50 text-indigo-700',
    glow: 'shadow-[0_4px_14px_0_rgb(99_102_241_/_0.25)]',
  },
  blue: {
    bg: 'bg-gradient-to-br from-blue-400 to-blue-600',
    ring: 'ring-blue-100',
    badge: 'bg-blue-50 text-blue-700',
    glow: 'shadow-[0_4px_14px_0_rgb(59_130_246_/_0.25)]',
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-400 to-purple-600',
    ring: 'ring-purple-100',
    badge: 'bg-purple-50 text-purple-700',
    glow: 'shadow-[0_4px_14px_0_rgb(147_51_234_/_0.25)]',
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-400 to-orange-500',
    ring: 'ring-orange-100',
    badge: 'bg-orange-50 text-orange-700',
    glow: 'shadow-[0_4px_14px_0_rgb(249_115_22_/_0.25)]',
  },
  amber: {
    bg: 'bg-gradient-to-br from-amber-400 to-amber-500',
    ring: 'ring-amber-100',
    badge: 'bg-amber-50 text-amber-700',
    glow: 'shadow-[0_4px_14px_0_rgb(245_158_11_/_0.25)]',
  },
};

const StatsCard = ({ stat, index, onClick }) => {
  const [count, setCount] = useState(0);
  const Icon = iconMap[stat.icon] || MdMenuBook;
  const colors = colorMap[stat.color] || colorMap.primary;

  useEffect(() => {
    const duration = 1200;
    const steps = 50;
    const increment = stat.value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= stat.value) {
        setCount(stat.value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [stat.value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="card p-5 flex items-center gap-4 group cursor-pointer hover:shadow-card-hover transition-shadow"
    >
      {/* Icon */}
      <div
        className={`w-14 h-14 rounded-2xl ${colors.bg} ${colors.glow} flex items-center justify-center flex-shrink-0 ring-4 ${colors.ring} transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon className="text-white text-2xl" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-brand-gray font-medium truncate">{stat.title}</p>
        <p className="text-2xl font-extrabold text-brand-dark mt-0.5">
          {count.toLocaleString()}
        </p>
        
      </div>
    </motion.div>
  );
};

export default StatsCard;
