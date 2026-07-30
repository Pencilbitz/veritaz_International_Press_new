import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import axios from 'axios';
import {
  MdAdd,
  MdSearch,
  MdGridView,
  MdViewList,
  MdDownload,
  MdClose,
  MdCloudUpload,
  MdDelete,
  MdEdit,
} from 'react-icons/md';

import { authorsList, yearsList } from '../data/dummyData';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../json_data/firebase";

const BookStore = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list');
  const [search, setSearch] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const pageSize = 6;

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);

      const snapshot = await getDocs(collection(db, "books (5)"));

      let allBooks = [];

      snapshot.forEach((doc) => {
        const docData = doc.data();

        if (Array.isArray(docData.data)) {
          allBooks.push(...docData.data);
        }
      });

      setBooks(allBooks);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered logic aligning with fields from database schema
  const filtered = books.filter((b) => {
    const matchSearch =
      !search ||
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.authors?.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn?.includes(search);

    const matchAuthor =
      !filterAuthor || b.authors === filterAuthor;

    const matchYear =
      !filterYear || Number(b.year) === Number(filterYear);

    const matchStatus =
      filterStatus === "All" || b.status === filterStatus;

    return (
      matchSearch &&
      matchAuthor &&
      matchYear &&
      matchStatus
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const resetFilters = () => {
    setSearch(''); setFilterAuthor(''); setFilterYear(''); setFilterStatus('All'); setPage(1);
  };

  const handleSelect = (id, isSelected) => {
    if (isSelected) {
      setSelectedBooks((prev) => [...prev, id]);
    } else {
      setSelectedBooks((prev) => prev.filter((bookId) => bookId !== id));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allFilteredIds = filtered.map(b => b.id || b._id);
      setSelectedBooks(allFilteredIds);
    } else {
      setSelectedBooks([]);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedBooks.length) return;

    try {
      const snapshot = await getDocs(collection(db, "books (5)"));

      let tableDocId = "";
      let booksArray = [];

      snapshot.forEach((d) => {
        const data = d.data();
        if (Array.isArray(data.data)) {
          tableDocId = d.id;
          booksArray = data.data;
        }
      });

      if (!tableDocId) {
        Swal.fire("Error", "Could not locate books document in database.", "error");
        return;
      }

      // Convert all selected IDs to Strings for accurate comparison
      const selectedIds = selectedBooks.map(String);

      // Filter out deleted books matching either b.id or b._id
      const updatedBooksArray = booksArray.filter((b) => {
        const bookId = String(b.id || b._id);
        return !selectedIds.includes(bookId);
      });

      // Update Firestore document
      await updateDoc(doc(db, "books (5)", tableDocId), {
        data: updatedBooksArray
      });

      // Update local state
      setBooks(updatedBooksArray);
      setSelectedBooks([]);

      Swal.fire("Deleted!", "Selected books have been deleted.", "success");
    } catch (error) {
      console.error("Bulk Delete Error:", error);
      Swal.fire("Error", "Failed to delete selected books.", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Book?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!"
    });

    if (!result.isConfirmed) return;

    try {
      const snapshot = await getDocs(collection(db, "books (5)"));

      let tableDocId = "";
      let booksArray = [];

      snapshot.forEach((d) => {
        const data = d.data();
        if (Array.isArray(data.data)) {
          tableDocId = d.id;
          booksArray = data.data;
        }
      });

      if (!tableDocId) {
        Swal.fire("Error", "Could not locate books document in database.", "error");
        return;
      }

      // Filter out deleted book matching either b.id or b._id
      const updatedBooksArray = booksArray.filter(
        (b) => String(b.id || b._id) !== String(id)
      );

      // Update Firestore document
      await updateDoc(doc(db, "books (5)", tableDocId), {
        data: updatedBooksArray
      });

      // Update local UI state
      setBooks(updatedBooksArray);

      // Clear ID from selected list if present
      setSelectedBooks((prev) => prev.filter((item) => String(item) !== String(id)));

      Swal.fire("Deleted!", "Book has been removed.", "success");
    } catch (error) {
      console.error("Delete Error:", error);
      Swal.fire("Error", "Failed to delete the book.", "error");
    }
  };

  const exportCSV = () => {
    const headers = ['Title', 'Author', 'ISBN', 'Year', 'Price', 'Status', 'Category'];
    const rows = filtered.map((b) => [b.title, b.author, b.isbn, b.year, b.price, b.status, b.category]);
    const csv = [headers, ...rows].map((r) => r.map(val => `"${String(val || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'books_catalog.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  // Helper function to return dynamic badge classes based on status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Published':
        return 'bg-green-50 text-green-700 border border-green-200 text-xs font-bold px-2 py-1 rounded-md';
      case 'Archived':
        return 'bg-red-50 text-red-700 border border-red-200 text-xs font-bold px-2 py-1 rounded-md';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200 text-xs font-bold px-2 py-1 rounded-md';
    }
  };

  const hasActiveFilters = search || filterAuthor || filterYear || filterStatus !== 'All';

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h1 className="text-xl font-bold text-brand-dark">Book Store</h1>
          <p className="text-sm text-brand-gray">Manage your entire catalog and drafts</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {selectedBooks.length > 0 && (
            <button onClick={handleBulkDelete} className="btn-danger text-sm flex items-center gap-1">
              <MdDelete /> Delete ({selectedBooks.length})
            </button>
          )}
          <button onClick={() => navigate('/admin/import')} className="btn-outline text-sm">
            <MdCloudUpload /> Import JSON
          </button>
          <button onClick={exportCSV} className="btn-outline text-sm">
            <MdDownload /> Export CSV
          </button>
          <button onClick={() => navigate('/admin/books/add')} className="btn-primary text-sm">
            <MdAdd /> Add Book
          </button>
        </div>
      </motion.div>

      {/* Tabs updated to support all 3 layout statuses + All */}
      <div className="flex border-b border-brand-border gap-6 overflow-x-auto whitespace-nowrap scrollbar-none">
        {['All', 'Published', 'Draft', 'Archived'].map((tab) => (
          <button
            key={tab}
            onClick={() => { setFilterStatus(tab); setPage(1); }}
            className={`pb-3 text-sm font-semibold transition-all relative ${filterStatus === tab ? 'text-blue-600' : 'text-brand-gray hover:text-brand-dark'
              }`}
          >
            {tab === 'All' ? 'All Books' : tab === 'Draft' ? 'Drafts' : tab}
            <span className="ml-2 text-xs bg-gray-100 text-brand-gray py-0.5 px-2 rounded-full">
              {tab === 'All' ? books.length : books.filter(b => b.status === tab).length}
            </span>
            {filterStatus === tab && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-4"
      >
        <div className="flex flex-wrap gap-3 items-end">
          {/* Search */}
          <div className="flex items-center gap-2 bg-brand-bg border border-brand-border rounded-xl px-3 py-2 min-w-[200px] flex-1 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <MdSearch className="text-brand-gray text-lg flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search title, author, isbn..."
              className="bg-transparent text-sm outline-none flex-1 min-w-0 text-brand-dark placeholder-brand-gray/60"
            />
          </div>

          {/* Filter Author */}
          <select
            value={filterAuthor}
            onChange={(e) => { setFilterAuthor(e.target.value); setPage(1); }}
            className="input-field w-auto min-w-[160px]"
          >
            <option value="">All Authors</option>
            {authorsList.map((a) => <option key={a}>{a}</option>)}
          </select>



          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-brand-bg border border-brand-border rounded-xl p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-[0_4px_14px_0_rgba(59,130,246,0.25)]' : 'text-brand-gray hover:bg-gray-100'}`}
            >
              <MdViewList size={20} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-[0_4px_14px_0_rgba(59,130,246,0.25)]' : 'text-brand-gray hover:bg-gray-100'}`}
            >
              <MdGridView className="text-lg" />
            </button>
          </div>

          {hasActiveFilters && (
            <button onClick={resetFilters} className="btn-danger text-sm">
              <MdClose /> Clear
            </button>
          )}
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {paginated.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <MdSearch className="text-3xl text-gray-300" />
                </div>
                <p className="text-brand-gray font-medium">No books found</p>
              </div>
            ) : (
              paginated.map((book, i) => {
                const bookId = book.id || book._id;
                return (
                  <motion.div
                    key={bookId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    whileHover={{ y: -6, scale: 1.03 }}
                    className={`card group overflow-hidden ${selectedBooks.includes(bookId) ? "ring-2 ring-blue-500" : ""}`}
                  >
                    <div className="relative">
                      <img
                        src={book.cover1}
                        alt={book.title}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/240x320?text=No+Cover";
                        }}
                      />

                      <div className="absolute top-3 right-3 z-10 bg-white/80 p-1.5 rounded-md backdrop-blur-sm">
                        <input
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer accent-blue-600"
                          checked={selectedBooks.includes(bookId)}
                          onChange={(e) => handleSelect(bookId, e.target.checked)}
                        />
                      </div>

                      <div className="absolute top-3 left-3">
                        <span className={getStatusBadgeClass(book.status)}>
                          {book.status || 'Draft'}
                        </span>
                      </div>

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-end justify-center gap-3 pb-4">
                        <button
                          onClick={() => navigate(`/admin/books/${bookId}`)}
                          className="bg-white hover:bg-blue-50 rounded-full p-2.5 text-blue-600 shadow-md transition-all"
                        >
                          <MdEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(bookId)}
                          className="bg-white hover:bg-red-50 rounded-full p-2.5 text-red-600 shadow-md transition-all"
                        >
                          <MdDelete className="text-lg" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-sm text-brand-dark line-clamp-2 min-h-[40px]">
                        {book.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {book.author}
                      </p>

                      <div className="flex justify-between items-end mt-3 border-t border-gray-50 pt-2">
                        <div>
                          <p className="text-[10px] text-brand-gray font-mono">
                            ISBN: {book.isbn ? String(book.isbn).slice(-6) : 'N/A'}
                          </p>

                        </div>
                        <p className="font-bold text-sm text-blue-600">
                          ₹{Number(book.price || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-brand-border">
                  <tr>
                    <th className="table-th w-12 text-center pl-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        checked={filtered.length > 0 && selectedBooks.length === filtered.length}
                        onChange={handleSelectAll}
                      />
                    </th>
                    {['Book', 'Author', 'ISBN', 'Price', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="table-th">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                            <MdSearch className="text-3xl text-gray-300" />
                          </div>
                          <p className="text-brand-gray font-medium">No books found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginated.map((book, i) => {
                      const bookId = book.id || book._id;
                      return (
                        <motion.tr
                          key={bookId}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className={`table-tr ${selectedBooks.includes(bookId) ? "bg-blue-50/70" : ""}`}
                        >
                          <td className="table-td text-center">
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                              checked={selectedBooks.includes(bookId)}
                              onChange={(e) => handleSelect(bookId, e.target.checked)}
                            />
                          </td>

                          <td className="table-td">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  book.cover1

                                }
                                className="w-10 h-14 rounded object-cover shadow-sm shrink-0"
                                onError={(e) => {
                                  e.target.src = "https://placehold.co/40x60?text=Book";
                                }}
                                alt=""
                              />
                              <div className="max-w-[240px]">
                                <p className="font-semibold text-brand-dark text-sm line-clamp-1">
                                  {book.title}
                                </p>

                              </div>
                            </div>
                          </td>

                          <td className="table-td text-sm text-brand-dark">
                            {book.authors}
                          </td>

                          <td className="table-td text-xs font-mono text-brand-gray">
                            {book.isbn || '—'}
                          </td>



                          <td className="table-td font-semibold text-sm text-brand-dark">
                            ₹{Number(book.price || 0).toLocaleString()}
                          </td>

                          <td className="table-td">
                            <span className={getStatusBadgeClass(book.status)}>
                              {book.status || 'Draft'}
                            </span>
                          </td>

                          <td className="table-td">
                            <div className="flex gap-2">
                              <button
                                onClick={() => navigate(`/admin/books/${bookId}`)}
                                className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition-colors"
                              >
                                <MdEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(bookId)}
                                className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors"
                              >
                                <MdDelete />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-brand-gray">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${p === page
                  ? 'bg-blue-600 text-white shadow-[0_4px_14px_0_rgba(59,130,246,0.25)]'
                  : 'border border-brand-border hover:border-blue-300 text-brand-gray'
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookStore;