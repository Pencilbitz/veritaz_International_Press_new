import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  MdArrowBack, MdSave, MdOutlineMenuBook,
  MdPeopleOutline, MdCancel, MdStar
} from 'react-icons/md';

const handleUpdate = async (e) => {
  e.preventDefault();
  setUpdateLoading(true);

  try {
    const updatedData = { ...formData };

    console.log("Original Form Data:", formData);
    console.log("Selected Upload Files:", uploadFiles);

    // Upload Cover 1
    if (uploadFiles.cover1) {
      const fd = new FormData();
      fd.append("image", uploadFiles.cover1);

      const res = await axios.post(
        "http://localhost:5000/api/upload/books",
        fd
      );

      console.log("Cover1 Upload Response:", res.data);

      updatedData.cover1 = res.data.url;
    }

    // Upload Cover 2
    if (uploadFiles.cover2) {
      const fd = new FormData();
      fd.append("image", uploadFiles.cover2);

      const res = await axios.post(
        "http://localhost:5000/api/upload/books",
        fd
      );

      console.log("Cover2 Upload Response:", res.data);

      updatedData.cover2 = res.data.url;
    }

    console.log("Final Updated Data:", updatedData);

    const response = await axios.put(
      `http://localhost:5000/api/books/${id}`,
      updatedData
    );

    console.log("Update API Response:", response.data);

    alert("Book updated successfully!");
    navigate("/admin/books");

  } catch (err) {
    console.error("Update Error:", err);

    if (err.response) {
      console.log("Status:", err.response.status);
      console.log("Response:", err.response.data);
    }

    alert(err.response?.data?.message || "Update failed");
  } finally {
    setUpdateLoading(false);
  }
};

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState(null);

  // State configured exactly to your specific table columns
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    isbn: "",
    edition: "",
    ratings: 5,
    about: "",
    flipkart: "",
    price: "",
    status: "In Stock",
    weight: "",
    binding: "",
    dimensions: "",
    language: "",
    format: "",
    pages: "",
    copyright: "",
    cover1: "",
    cover2: ""
  });

  // 🌟 FIX 1: Declared missing states for previewing and capturing binary files
  const [previews, setPreviews] = useState({ cover1: null, cover2: null });
  const [uploadFiles, setUploadFiles] = useState({ cover1: null, cover2: null });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/books/${id}`);
        setFormData({
          title: res.data.title || "",
          authors: res.data.authors || "",
          isbn: res.data.isbn || "",
          edition: res.data.edition || "",
          ratings: res.data.ratings ?? 5,
          about: res.data.about || "",
          flipkart: res.data.flipkart || "",
          price: res.data.price || "",
          status: res.data.status || "In Stock",
          weight: res.data.weight || "",
          binding: res.data.binding || "",
          dimensions: res.data.dimensions || "",
          language: res.data.language || "",
          format: res.data.format || "",
          pages: res.data.pages || "",
          copyright: res.data.copyright || "",
          cover1: res.data.cover1 || "",
          cover2: res.data.cover2 || ""
        });

        // Populate initial image previews from server paths
        setPreviews({
          cover1: res.data.cover1 ? `http://localhost:5000/${res.data.cover1}` : null,
          cover2: res.data.cover2 ? `http://localhost:5000/${res.data.cover2}` : null
        });
      } catch (err) {
        setError("Failed to fetch book data");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const selectedFile = files[0];
    if (!selectedFile) return;

    // Track the absolute physical file for submission
    setUploadFiles(prev => ({ ...prev, [name]: selectedFile }));

    // Track the local asset address for immediate presentation updates
    setPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(selectedFile) }));
  }; // 🌟 FIX 2: Correctly closed handleFileChange block here

  // 🌟 FIX 3: Moved handleUpdate out and configured it to use FormData for multi-part file support
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      const dataToSend = new FormData();

      // 1. Append textual fields and format numbers to match schema types
      Object.keys(formData).forEach((key) => {
        if (key !== "cover1" && key !== "cover2") {
          if (key === "ratings") {
            dataToSend.append(key, Number(formData.ratings) || 5);
          } else if (key === "price") {
            dataToSend.append(key, formData.price ? Number(formData.price) : "");
          } else if (key === "pages") {
            dataToSend.append(key, formData.pages ? Number(formData.pages) : "");
          } else {
            dataToSend.append(key, formData[key]);
          }
        }
      });

      // 2. Append new binary file layers if modifications exist
      if (uploadFiles.cover1) {
        dataToSend.append("cover1", uploadFiles.cover1);
      }
      if (uploadFiles.cover2) {
        dataToSend.append("cover2", uploadFiles.cover2);
      }

      // 3. Dispatch multipart submission
      await axios.put(`http://localhost:5000/api/books/${id}`, dataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert('Book details and covers updated successfully!');
      navigate('/admin/books');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update book database record.');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-brand-gray">Reading Book Data...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;


  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Navigation Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-medium text-brand-gray mb-6">
        <Link to="/admin/books" className="hover:text-blue-600 transition-colors text-blue-600">Book Store</Link>
        <span>&gt;</span>
        <span className="text-blue-800">Update / {formData.title || 'Book Details'}</span>
      </div>

      <form onSubmit={handleUpdate}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column - Media asset URLs matching cover1 & cover2 columns */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-[#f0f4f8] rounded-2xl p-6 flex flex-col shadow-sm">
              <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 pb-2 border-b">Book Covers</h3>

              {/* Cover 1 Image Row Container */}
              <div className="grid grid-cols-3 items-center border-b border-gray-100 pb-2">
                <div className="col-span-1 text-xs font-bold text-brand-gray">Cover Image 1</div>
                <div className="col-span-2 space-y-2">
                  {previews.cover1 && (
                    <img src={previews.cover1} alt="Cover 1 Preview" className="w-16 h-20 object-cover rounded border shadow-sm" />
                  )}
                  <input
                    type="file"
                    name="cover1"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              {/* Cover 2 Image Row Container */}
              <div className="grid grid-cols-3 items-center border-b border-gray-100 pb-2">
                <div className="col-span-1 text-xs font-bold text-brand-gray">Cover Image 2</div>
                <div className="col-span-2 space-y-2">
                  {previews.cover2 && (
                    <img src={previews.cover2} alt="Cover 2 Preview" className="w-16 h-20 object-cover rounded border shadow-sm" />
                  )}
                  <input
                    type="file"
                    name="cover2"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Core Database Information Fields */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-border">

              {/* Title Input */}
              <div className="mb-4">
                <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-green-50 text-green-700 text-xs font-bold mb-2">
                  <MdOutlineMenuBook className="text-sm" /> Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full text-lg font-bold text-[#1a2332] p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* Status and Ratings Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                    <MdStar className="text-yellow-500" /> Default Ratings (1-5)
                  </label>
                  <input type="decimal" min="1" max="5" name="ratings" value={formData.ratings} onChange={handleChange} className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              {/* Authors Field Info */}
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="bg-[#f8fafd] rounded-xl p-4 flex gap-3 border border-blue-50">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <MdPeopleOutline className="text-lg" />
                  </div>
                  <div className="w-full">
                    <label className="block text-xs font-bold text-brand-gray uppercase tracking-wider mb-1">Authors (Separated with |)</label>
                    <input type="text" name="authors" value={formData.authors} onChange={handleChange} className="w-full text-sm font-semibold p-2 border rounded bg-white focus:outline-blue-500" required />
                  </div>
                </div>
              </div>

              {/* Pricing section matching price field */}
              <div className="p-4 bg-[#f8fbf9] border border-green-100 rounded-xl mb-4">
                <label className="block text-xs font-bold text-green-700 uppercase mb-1">Price (₹)</label>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-brand-dark">₹</span>
                  <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full max-w-[185px] text-sm p-2 border rounded bg-white focus:outline-green-500 font-bold" required />
                </div>
              </div>

              {/* About long text block */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">About This Book</label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  rows="4"
                  className="w-full text-sm text-brand-gray p-3 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Provide book features or summaries description..."
                />

                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Flipkart Link
                  </label>
                  <input
                    type="url"
                    name="flipkart"
                    value={formData.flipkart}
                    onChange={handleChange}
                    className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="https://www.flipkart.com/your-book"
                  />
                </div>
              </div>



              {/* Submission Controls */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3.5 font-bold flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
                >
                  <MdSave className="text-xl" /> {updateLoading ? 'Saving...' : 'Update Book Details'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/books')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-3.5 px-6 font-bold transition-colors border border-gray-300 flex items-center gap-1"
                >
                  <MdCancel /> Cancel
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Technical Product Specifications Table Mapping Remaining Columns */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-brand-border">
          <h2 className="text-lg font-bold text-brand-dark mb-4">Product Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">

            <div className="grid grid-cols-3 items-center border-b border-gray-100 pb-2">
              <div className="col-span-1 text-xs font-bold text-brand-gray">ISBN-13</div>
              <div className="col-span-2">
                <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} className="w-full border border-gray-300 p-1.5 text-xs rounded focus:outline-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-3 items-center border-b border-gray-100 pb-2">
              <div className="col-span-1 text-xs font-bold text-brand-gray">Edition</div>
              <div className="col-span-2">
                <input type="text" name="edition" value={formData.edition} onChange={handleChange} className="w-full border border-gray-300 p-1.5 text-xs rounded focus:outline-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-3 items-center border-b border-gray-100 pb-2">
              <div className="col-span-1 text-xs font-bold text-brand-gray">Language</div>
              <div className="col-span-2">
                <input type="text" name="language" value={formData.language} onChange={handleChange} className="w-full border border-gray-300 p-1.5 text-xs rounded focus:outline-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-3 items-center border-b border-gray-100 pb-2">
              <div className="col-span-1 text-xs font-bold text-brand-gray">Binding Type</div>
              <div className="col-span-2">
                <input type="text" name="binding" value={formData.binding} onChange={handleChange} className="w-full border border-gray-300 p-1.5 text-xs rounded focus:outline-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-3 items-center border-b border-gray-100 pb-2">
              <div className="col-span-1 text-xs font-bold text-brand-gray">Dimensions</div>
              <div className="col-span-2">
                <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} className="w-full border border-gray-300 p-1.5 text-xs rounded focus:outline-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-3 items-center border-b border-gray-100 pb-2">
              <div className="col-span-1 text-xs font-bold text-brand-gray">Weight</div>
              <div className="col-span-2">
                <input type="text" name="weight" value={formData.weight} onChange={handleChange} className="w-full border border-gray-300 p-1.5 text-xs rounded focus:outline-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-3 items-center border-b border-gray-100 pb-2">
              <div className="col-span-1 text-xs font-bold text-brand-gray">Format</div>
              <div className="col-span-2">
                <input type="text" name="format" value={formData.format} onChange={handleChange} className="w-full border border-gray-300 p-1.5 text-xs rounded focus:outline-blue-500" placeholder="e.g., Single Color" />
              </div>
            </div>

            <div className="grid grid-cols-3 items-center border-b border-gray-100 pb-2">
              <div className="col-span-1 text-xs font-bold text-brand-gray">Page Count</div>
              <div className="col-span-2">
                <input type="number" name="pages" value={formData.pages} onChange={handleChange} className="w-full border border-gray-300 p-1.5 text-xs rounded focus:outline-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-3 items-center border-b border-gray-100 pb-2">
              <div className="col-span-1 text-xs font-bold text-brand-gray">Copyright</div>
              <div className="col-span-2">
                <input type="text" name="copyright" value={formData.copyright} onChange={handleChange} className="w-full border border-gray-300 p-1.5 text-xs rounded focus:outline-blue-500" placeholder="e.g., 2024" />
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
};

export default BookDetails;