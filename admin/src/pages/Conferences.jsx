import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { MdGroups, MdAdd, MdEdit, MdDelete, MdSearch, MdCloudUpload } from 'react-icons/md';
import axios from 'axios';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db } from "../json_data/firebase";

// Handles both legacy records where `dates` was saved as a JSON string,
// and current records where `dates` is already a plain object.
const getConferenceDate = (dates) => {
  if (!dates) return "N/A";

  if (typeof dates === "object") {
    return dates.conferenceDate || "N/A";
  }

  if (typeof dates === "string") {
    try {
      const parsed = JSON.parse(dates);
      return parsed.conferenceDate || "N/A";
    } catch (error) {
      return "N/A";
    }
  }

  return "N/A";
};

const Conferences = () => {
  const navigate = useNavigate();
  const [conferences, setConferences] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchConferences();
  }, []);

  const fetchConferences = async () => {
    try {
      const snapshot = await getDocs(collection(db, "conferences (2)"));

      let allConferences = [];

      snapshot.forEach((d) => {
        const data = d.data();

        if (Array.isArray(data.data)) {
          allConferences.push(...data.data);
        }
      });

      setConferences(allConferences);
    } catch (error) {
      console.error("Error fetching conferences:", error);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#2563EB",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const snapshot = await getDocs(collection(db, "conferences (2)"));

      let tableDocId = "";
      let conferenceArray = [];

      snapshot.forEach((d) => {
        const data = d.data();

        if (Array.isArray(data.data)) {
          tableDocId = d.id;
          conferenceArray = data.data;
        }
      });

      conferenceArray = conferenceArray.filter(
        (conf) => String(conf.id) !== String(id)
      );

      await updateDoc(
        doc(db, "conferences (2)", tableDocId),
        {
          data: conferenceArray,
        }
      );

      setConferences(conferenceArray);

      Swal.fire(
        "Deleted!",
        "Conference has been removed.",
        "success"
      );
    } catch (error) {
      console.error(error);

      Swal.fire(
        "Error!",
        "Failed to delete conference.",
        "error"
      );
    }
  };

  // UPDATED: Filter conditions updated to use lowercase database naming configurations safely
  const filtered = conferences.filter(c => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    const nameMatch = c.conferencename ? c.conferencename.toLowerCase().includes(searchLower) : false;
    const titleMatch = c.conferencetitle ? c.conferencetitle.toLowerCase().includes(searchLower) : false;
    return nameMatch || titleMatch;
  });

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <MdGroups className="text-blue-600" /> Conferences
        </h1>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/admin/import')} className="btn-outline text-sm">
            <MdCloudUpload /> Import JSON
          </button>
          <button onClick={() => navigate('/admin/conferences/add')} className="btn-primary text-sm">
            <MdAdd /> Add Conference
          </button>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center gap-2 border border-blue-200 rounded-xl px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-400 transition-all">
          <MdSearch className="text-blue-400 text-lg" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title or conference name..."
            className="outline-none flex-1 text-sm bg-transparent"
          />
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-50 border-b border-blue-100">
            <tr>
              {['Conference Name', 'Title', 'Date', 'Type', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-blue-700 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((conf) => (
              <tr key={conf.id} className="hover:bg-blue-50 transition-colors border-b border-brand-border">
                {/* UPDATED: Displays conf.conferencename */}
                <td className="px-4 py-4">
                  <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded text-sm">
                    {conf.conferencename || 'N/A'}
                  </span>
                </td>
                {/* UPDATED: Displays conf.conferencetitle */}
                <td className="px-4 py-4 max-w-xs">
                  <p className="font-semibold text-gray-900 line-clamp-2" title={conf.conferencetitle}>
                    {conf.conferencetitle || 'N/A'}
                  </p>
                </td>
                {/* Safely reads conferenceDate whether dates is a string or object */}
                <td className="px-4 py-4 text-sm text-gray-600">
                  {getConferenceDate(conf.dates)}
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    {conf.type}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/conferences/edit/${conf.id}`)}
                      className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                      title="Edit"
                    >
                      <MdEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(conf.id)}
                      className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"
                      title="Delete"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500 text-sm">
                  No conferences found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Conferences;