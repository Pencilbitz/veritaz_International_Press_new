import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import {
  MdAdd, MdSearch, MdDownload, MdEdit, MdDelete, MdVisibility,
  MdStar, MdFilterList, MdCloudUpload, MdPlayCircleOutline,
} from 'react-icons/md';
import axios from 'axios';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  writeBatch,
} from "firebase/firestore";

import { db } from "../json_data/firebase";

const StarDisplay = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <MdStar key={s} className={`text-sm ${s <= rating ? 'star-active' : 'star-inactive'}`} />
    ))}
  </div>
);

const Testimonials = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState(''); // Updated from filterStatus to filter Type
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const pageSize = 8;
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Testimonials are spread across several documents in the "testimonials"
  // collection, each holding a `data` array (see AddTestimonial.jsx). Read
  // every doc and flatten their arrays into one list.
  const fetchTestimonials = async () => {
    try {
      const snapshot = await getDocs(collection(db, "testimonials"));

      let allTestimonials = [];

      snapshot.forEach((d) => {
        const raw = d.data();
        if (Array.isArray(raw.data)) {
          allTestimonials.push(...raw.data);
        }
      });

      setTestimonials(allTestimonials);
    } catch (err) {
      console.error("Error fetching testimonials:", err);
    }
  };

  const filtered = testimonials.filter((t) => {
    const q = search.toLowerCase();
    // 🌟 Updated to match new text keys: name and content
    const matchSearch = !search ||
      (t.name && t.name.toLowerCase().includes(q)) ||
      (t.content && t.content.toLowerCase().includes(q)) ||
      (t.designation && t.designation.toLowerCase().includes(q));

    // 🌟 Updated filter query to check if it's a video vs text testimonial
    let matchType = true;
    if (filterType === 'video') matchType = t.is_video_testimonial === true;
    if (filterType === 'text') matchType = !t.is_video_testimonial;

    return matchSearch && matchType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Finds which doc in the collection holds the testimonial with the given
  // id, and removes it from that doc's array, updating just that doc.
  const removeTestimonialById = async (id) => {
    const snapshot = await getDocs(collection(db, "testimonials"));

    let tableDocId = null;
    let updatedArray = [];
    let found = false;

    snapshot.forEach((d) => {
      const raw = d.data();
      if (!Array.isArray(raw.data)) return;

      const index = raw.data.findIndex((t) => String(t.id) === String(id));
      if (index !== -1) {
        found = true;
        tableDocId = d.id;
        updatedArray = raw.data.filter((t) => String(t.id) !== String(id));
      }
    });

    if (!found) {
      throw new Error("Testimonial not found.");
    }

    await updateDoc(doc(db, "testimonials", tableDocId), {
      data: updatedArray,
    });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Testimonial?',
      text: 'This cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Delete',
    });
    if (result.isConfirmed) {
      try {
        await removeTestimonialById(id);
        setTestimonials((prev) => prev.filter((t) => String(t.id) !== String(id)));
        setSelected((prev) => prev.filter((s) => s !== id));
        Swal.fire({ title: 'Deleted!', icon: 'success', timer: 1200, showConfirmButton: false });
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        Swal.fire('Error', 'Failed to delete testimonial.', 'error');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (!selected.length) return;
    const result = await Swal.fire({
      title: `Delete ${selected.length} testimonial(s)?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Delete All',
    });
    if (result.isConfirmed) {
      try {
        // Group affected ids by which doc actually holds them, then batch
        // one array update per doc.
        const snapshot = await getDocs(collection(db, "testimonials"));
        const batch = writeBatch(db);
        const selectedSet = new Set(selected.map(String));

        snapshot.forEach((d) => {
          const raw = d.data();
          if (!Array.isArray(raw.data)) return;

          const stillHasSelected = raw.data.some((t) => selectedSet.has(String(t.id)));
          if (!stillHasSelected) return;

          const updatedArray = raw.data.filter((t) => !selectedSet.has(String(t.id)));
          batch.update(doc(db, "testimonials", d.id), { data: updatedArray });
        });

        await batch.commit();
        setTestimonials((prev) => prev.filter((t) => !selectedSet.has(String(t.id))));
        setSelected([]);
        Swal.fire({ title: 'Done!', icon: 'success', timer: 1200, showConfirmButton: false });
      } catch (error) {
        console.error('Error deleting testimonials:', error);
        Swal.fire('Error', 'Failed to delete some testimonials.', 'error');
      }
    }
  };

  const exportCSV = () => {
    // 🌟 Updated CSV compilation row values to match schema keys
    const headers = ['Name', 'Designation', 'Rating', 'Content', 'Is Video Testimonial', 'Video URL'];
    const rows = filtered.map((t) => [t.name, t.designation, t.rating, t.content, t.is_video_testimonial ? 'Yes' : 'No', t.video_url || 'N/A']);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'testimonials.csv'; a.click();
  };

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        let json = JSON.parse(event.target.result);

        if (Array.isArray(json)) {
          json = { testimonials: json };
        } else if (!json.testimonials) {
          throw new Error('Invalid JSON format. Expected an array or an object with a "testimonials" property.');
        }

        Swal.fire({ title: 'Importing...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const res = await axios.post('http://localhost:5000/api/import', json);

        // Re-read from Firestore so the list reflects whatever the import
        // endpoint actually wrote.
        await fetchTestimonials();

        Swal.fire('Success', res.data.message || 'Imported successfully!', 'success');
      } catch (err) {
        console.error('Import error:', err);
        Swal.fire('Error', err.message || 'Failed to import JSON.', 'error');
      }
      e.target.value = null;
    };
    reader.readAsText(file);
  };

  const toggleSelect = (id) => setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  const toggleAll = () => setSelected(selected.length === paginated.length ? [] : paginated.map((t) => t.id));

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-brand-dark">Testimonials</h1>
          <p className="text-sm text-brand-gray">{filtered.length} testimonials</p>
        </div>
        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleBulkDelete}
              className="btn-danger"
            >
              <MdDelete /> Delete ({selected.length})
            </motion.button>
          )}
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleImportJSON}
            style={{ display: 'none' }}
          />
          <button onClick={() => fileInputRef.current.click()} className="btn-outline text-sm">
            <MdCloudUpload /> Import JSON
          </button>
          <button onClick={exportCSV} className="btn-outline text-sm">
            <MdDownload /> Export CSV
          </button>
          <button onClick={() => navigate('/admin/testimonials/add')} className="btn-primary text-sm">
            <MdAdd /> Add Testimonial
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 bg-brand-bg border border-blue-200 rounded-xl px-3 py-2 flex-1 min-w-[200px] focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <MdSearch className="text-brand-gray text-lg flex-shrink-0" />
            <input
              type="text" value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, designation, content..."
              className="bg-transparent text-sm outline-none flex-1 text-brand-dark placeholder-brand-gray/60"
            />
          </div>
          {/* 🌟 Updated Filter options to reflect visual media vs written layout keys */}
          <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setPage(1); }} className="input-field w-auto">
            <option value="">All Formats</option>
            <option value="text">Text Testimonials</option>
            <option value="video">Video Testimonials</option>
          </select>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50 border-b border-blue-100">
              <tr>
                <th className="table-th w-10">
                  <input
                    type="checkbox"
                    checked={selected.length === paginated.length && paginated.length > 0}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                  />
                </th>
                {/* 🌟 Updated headers configuration matching layout structure keys */}
                {['Avatar', 'Author & Position', 'Rating', 'Content Message', 'Media Format', 'Actions'].map((h) => (
                  <th key={h} className="table-th text-blue-700">{h}</th>
                ))}
              </tr>
            </thead>
            <motion.tbody initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                        <MdFilterList className="text-3xl text-gray-300" />
                      </div>
                      <p className="text-brand-gray font-medium">No testimonials found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((t, i) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className={`table-tr ${selected.includes(t.id) ? 'bg-blue-50' : ''}`}
                  >
                    <td className="table-td">
                      <input
                        type="checkbox"
                        checked={selected.includes(t.id)}
                        onChange={() => toggleSelect(t.id)}
                        className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                      />
                    </td>
                    <td className="table-td">
                      {/* 🌟 Swapped source mapping logic property target to avatar_url */}
                      <img
                        src={t.avatar_url}
                        alt={t.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-200"
                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name || 'User')}&background=2563EB&color=fff&size=36`; }}
                      />
                    </td>
                    <td className="table-td">
                      <p className="font-semibold text-brand-dark text-xs whitespace-nowrap">{t.name}</p>
                      {/* 🌟 Swapped target tracking property to designation */}
                      <p className="text-xs text-brand-gray uppercase tracking-wider text-[10px]">{t.designation}</p>
                    </td>
                    <td className="table-td"><StarDisplay rating={t.rating} /></td>
                    {/* 🌟 Swapped description logic field to match text string property: content */}
                    <td className="table-td text-xs text-brand-gray max-w-[320px] truncate" title={t.content}>
                      {t.content}
                    </td>
                    {/* 🌟 Visual format badge tracking whether it's a playback asset or standard layout */}
                    <td className="table-td">
                      {t.is_video_testimonial ? (
                        <span className="badge-published flex items-center gap-1 w-fit bg-red-50 text-red-600 border-red-100">
                          <MdPlayCircleOutline className="text-sm" /> Video
                        </span>
                      ) : (
                        <span className="badge-draft flex items-center gap-1 w-fit bg-slate-50 text-slate-600 border-slate-100">
                          Text
                        </span>
                      )}
                    </td>
                    <td className="table-td">
                      <div className="flex items-center gap-1.5">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => navigate(`/admin/testimonials/edit/${t.id}`)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <MdEdit className="text-sm" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleDelete(t.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <MdDelete className="text-sm" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </motion.tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-brand-gray">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${p === page ? 'bg-blue-600 text-white shadow-[0_4px_14px_0_rgba(37,99,235,0.30)]' : 'border border-brand-border hover:border-blue-400 hover:text-blue-600 text-brand-gray'}`}
              >{p}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;