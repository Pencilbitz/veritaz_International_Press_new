import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { MdEvent, MdAdd, MdEdit, MdDelete, MdSearch, MdCloudUpload } from 'react-icons/md';

const Events = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/events');
      setEvents(res.data || []);
    } catch (err) {
      console.error('Error fetching events', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Event?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#2563EB',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${id}`);
        setEvents(events.filter(e => e.id !== id));
        Swal.fire({ title: 'Deleted!', text: 'Event has been removed.', icon: 'success', timer: 1500, showConfirmButton: false });
      } catch (err) {
        Swal.fire('Error', 'Failed to delete event', 'error');
      }
    }
  };

  const filtered = events.filter(e => {
    const matchesSearch = !search || e.eventTitle.toLowerCase().includes(search.toLowerCase());
    const isCompleted = e.status === 'Completed';
    return activeTab === 'events' ? (!isCompleted && matchesSearch) : (isCompleted && matchesSearch);
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filtered.map(evt => evt.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const result = await Swal.fire({
      title: `Delete ${selectedIds.length} Events?`,
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#2563EB',
      confirmButtonText: 'Yes, Delete All',
      cancelButtonText: 'Cancel',
    });
    if (result.isConfirmed) {
      try {
        await axios.post('http://localhost:5000/api/events/bulk-delete', { ids: selectedIds });
        setEvents(events.filter(e => !selectedIds.includes(e.id)));
        setSelectedIds([]);
        Swal.fire({ title: 'Deleted!', text: 'Selected events have been removed.', icon: 'success', timer: 1500, showConfirmButton: false });
      } catch (err) {
        Swal.fire('Error', 'Failed to delete events', 'error');
      }
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-brand-dark">🎓 Events</h1>

      <div className="card p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-xl">
              <MdEvent className="text-2xl text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Events Management</h2>
              <p className="text-sm text-gray-500">Manage all your academic events</p>
            </div>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => { setActiveTab('events'); setSelectedIds([]); }}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'events' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <MdEvent className="inline-block mr-2 text-lg" />
              Upcoming Events
            </button>
            <button
              onClick={() => { setActiveTab('completed'); setSelectedIds([]); }}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'completed' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <MdEvent className="inline-block mr-2 text-lg" />
              Completed Events
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-blue-50 mb-6">
          <div className="flex gap-4">
            <button onClick={() => navigate('/admin/import')} className="btn-outline flex items-center gap-2">
              <MdCloudUpload className="text-xl" /> Import JSON
            </button>
            <button onClick={() => navigate('/admin/events/add')} className="btn-primary flex items-center gap-2">
              <MdAdd className="text-xl" /> Add Event
            </button>
            {selectedIds.length > 0 && (
              <button onClick={handleBulkDelete} className="btn-secondary !bg-red-50 !text-red-600 !border-red-200 hover:!bg-red-100 flex items-center gap-2">
                <MdDelete className="text-xl" /> Delete Selected ({selectedIds.length})
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 border border-blue-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-300 transition-all">
            <MdSearch className="text-blue-400 text-lg flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search events..."
              className="outline-none flex-1 text-sm text-brand-dark placeholder-gray-400"
            />
          </div>
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50 border-b border-blue-100">
              <tr>
                <th className="table-th text-blue-700 w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                    checked={filtered.length > 0 && selectedIds.length === filtered.length}
                    onChange={handleSelectAll}
                  />
                </th>
                {['Poster', 'Event', 'Date & Time', 'Status', 'Actions'].map(h => (
                  <th key={h} className="table-th text-blue-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400 text-sm">
                    No events found.
                  </td>
                </tr>
              ) : (
                filtered.map((evt) => (
                  <tr key={evt.id} className="table-tr">
                    <td className="table-td text-center">
                      <input 
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                        checked={selectedIds.includes(evt.id)}
                        onChange={() => handleSelect(evt.id)}
                      />
                    </td>
                    <td className="table-td">
                      {evt.poster
                        ? <img src={evt.poster.startsWith('http') ? evt.poster : `http://localhost:5000${evt.poster}`} className="w-10 h-12 object-cover rounded-lg shadow-sm" alt={evt.eventTitle} onError={(e) => e.target.src = "https://placehold.co/150x150/EEE/31343C"} />
                        : <div className="w-10 h-12 rounded-lg bg-blue-50 flex items-center justify-center"><MdEvent className="text-blue-400" /></div>
                      }
                    </td>
                    <td className="table-td">
                      <p className="font-semibold text-brand-dark">{evt.eventTitle}</p>
                      <p className="text-xs text-gray-500">{evt.collegeName}</p>
                    </td>
                    <td className="table-td">
                      <p className="text-sm font-medium text-brand-dark">{evt.date}</p>
                      <p className="text-xs text-gray-500">{evt.time}</p>
                    </td>
                    <td className="table-td">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${evt.status === 'Completed'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-blue-50 text-blue-600 border border-blue-200'
                        }`}>
                        {evt.status || 'Upcoming'}
                      </span>
                    </td>
                    <td className="table-td">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => navigate(`/admin/events/details/${evt.id}`)}
                          className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                        >
                          <MdEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(evt.id)}
                          className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Events;
