import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MdArrowBack, MdShare, MdStar, MdOutlineVisibility,
  MdOutlineBookmarkBorder, MdCheckCircle, MdLocalShipping,
  MdSupportAgent, MdVerifiedUser, MdCardGiftcard, MdOutlineMenuBook,
  MdPeopleOutline, MdClose, MdBusiness
} from 'react-icons/md';
import { FaWhatsapp, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../json_data/firebase";

export default function BookDetails() {
  const { slug } = useParams(); // Maps to the API's book ID

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for dynamic functionality
  const [currentImage, setCurrentImage] = useState("");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);


  useEffect(() => {
    const fetchBook = async () => {
      try {
        const snapshot = await getDocs(collection(db, "books (5)"));

        let books = [];

        snapshot.forEach((doc) => {
          const docData = doc.data();

          if (Array.isArray(docData.data)) {
            books.push(...docData.data);
          }
        });

        console.log("All Books:", books);
        console.log("URL Param:", slug);

        // Search by id (recommended)
        const bookData = books.find(
          (book) => book.title && book.title.replace(/\s+/g, '-').toLowerCase() === slug
        );

        // If your URL actually contains a slug instead of id, use this instead:
        // const bookData = books.find(book => book.slug === slug);

        console.log("Selected Book:", bookData);

        if (!bookData) {
          setError("Book not found");
        } else {
          setBook(bookData);
          setCurrentImage(bookData.cover1 || "");
        }
      } catch (err) {
        console.error("Error fetching book:", err);
        setError("Book not found or server error");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [slug]);

  // Form states for checkout flow
  const [custName, setCustName] = useState("");
  const [custLocation, setCustLocation] = useState("");
  const [custQty, setCustQty] = useState("1");

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (error || !book) return <div className="p-8 text-center text-red-500">{error || 'Book not found'}</div>;

  // Modern Native Share handler
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${book.title} - Veritaz International`,
          text: `Check out this book: ${book.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // WhatsApp checkout message generator
  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    const adminPhoneNumber = "919042007413";

    let message = `New Order Request \n`;
    message += `-----------------------\n`;
    message += `Book: ${book.title}\n`;
    message += `Price: ₹${book.price || "1126"}\n`;
    message += `Quantity: ${custQty}\n`;
    message += `-----------------------\n`;
    message += `Name: ${custName}\n`;
    message += `Location: ${custLocation}\n`;
    message += `-----------------------\n`;
    message += `Please confirm availability and payment details.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${adminPhoneNumber}?text=${encodedMessage}`, '_blank');
    setIsOrderModalOpen(false);
  };

  useEffect(() => {
          document.title = "Academic Book Store | ISBN Books | Veritaz International";
  
          // 1. Meta Description
          let metaDescription = document.querySelector('meta[name="description"]');
          if (!metaDescription) {
              metaDescription = document.createElement('meta');
              metaDescription.name = "description";
              document.head.appendChild(metaDescription);
          }
          metaDescription.content = "Browse academic, engineering, research, AI and technology books published with ISBN by Veritaz International. Find quality textbooks by expert authors.";
  
          // 2. Meta Keywords
          let metaKeywords = document.querySelector('meta[name="keywords"]');
          if (!metaKeywords) {
              metaKeywords = document.createElement('meta');
              metaKeywords.name = "keywords";
              document.head.appendChild(metaKeywords);
          }
          metaKeywords.content = "online bookstore Veritaz, buy academic books, research publications, textbook store India, peer-reviewed books online, order scholarly publications";
  
          // 3. Robots Tag
          let metaRobots = document.querySelector('meta[name="robots"]');
          if (!metaRobots) {
              metaRobots = document.createElement('meta');
              metaRobots.name = "robots";
              document.head.appendChild(metaRobots);
          }
          metaRobots.content = "index, follow";
  
          // 4. Canonical Link
          let canonicalLink = document.querySelector('link[rel="canonical"]');
          if (!canonicalLink) {
              canonicalLink = document.createElement('link');
              canonicalLink.rel = "canonical";
              document.head.appendChild(canonicalLink);
          }
          canonicalLink.href = "https://www.veritazinternational.com/books";
      }, []);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 pb-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
          <Link to="/books" className="hover:text-blue-600 transition-colors text-blue-600">Book Store</Link>
          <span>&gt;</span>
          <span className="text-blue-800">{book.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column - Images & Actions */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-[#f0f4f8] rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm relative">
              <img
                src={book.cover1}
                alt={book.title}
                className="w-full max-w-[280px] object-cover rounded-md shadow-2xl mb-8"
                onError={(e) => { e.target.src = 'https://placehold.co/300x400/EEE/31343C?text=No+Cover'; }}
              />

              <p className="text-sm font-semibold text-gray-800 mb-4">Book Preview</p>

              {/* Image Previews */}
              <div className="flex items-center justify-center gap-3 mb-6">
                {/* FIX 2: Updated references from book.cover to book.cover1 */}
                <div
                  className={`w-16 h-20 rounded border-2 overflow-hidden shadow-md cursor-pointer bg-white ${currentImage === book.cover1 ? 'border-blue-500' : 'border-transparent'}`}
                  onClick={() => setCurrentImage(book.cover1)}
                >
                  <img src={book.cover1} alt="Front Cover" className="w-full h-full object-cover" />
                </div>
                {/* FIX 3: Updated reference from book.backCover to book.cover2 */}
                <div
                  className={`w-16 h-20 rounded border-2 overflow-hidden shadow-md cursor-pointer bg-white ${currentImage === book.cover2 ? 'border-blue-500' : 'border-transparent'}`}
                  onClick={() => setCurrentImage(book.cover2 || book.cover1)}
                >
                  {book.cover2 ? (
                    <img src={book.cover2} alt="Back Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col">
                      <div className="h-1/2 bg-gray-800 flex items-center justify-center text-[8px] text-white p-1 text-center">Full Preview</div>
                      <div className="h-1/2 bg-white flex items-center justify-center">
                        <div className="w-6 h-6 border border-gray-300 flex items-center justify-center text-[6px] text-gray-400">Barcode</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="flex-1 bg-white border border-gray-200 rounded-lg py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <MdOutlineVisibility className="text-lg" /> Full Preview
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 bg-white border border-gray-200 rounded-lg py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <MdShare className="text-lg" /> Share
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              {/* Title & Badge */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-green-50 text-green-700 text-xs font-bold mb-3">
                  <MdOutlineMenuBook className="text-sm" /> Book Title
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a2332] leading-snug">
                  {book.title}
                </h1>
              </div>

              {/* Meta Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Authors */}
                <div className="bg-[#f8fafd] rounded-xl p-4 flex gap-3 border border-blue-50">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <MdPeopleOutline className="text-lg" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Authors</p>
                    {/* FIX 4: Corrected property from book.author to book.authors */}
                    {book.authors ? book.authors.split(',').map((auth, idx) => (
                      <p key={idx} className="text-sm font-semibold text-gray-800 mb-1">{auth.trim()}</p>
                    )) : (
                      <p className="text-sm font-semibold text-gray-800 mb-1">Unknown Author</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {/* ISBN */}
                  <div className="bg-[#f8fafd] rounded-xl p-4 flex items-center gap-3 border border-blue-50">
                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                      <span className="font-bold font-mono text-xs">|||</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">ISBN-13</p>
                      <p className="text-sm font-bold text-gray-800">{book.isbn}</p>
                    </div>
                  </div>
                  {/* Edition */}
                  <div className="bg-[#f8fafd] rounded-xl p-4 flex items-center gap-3 border border-blue-50">
                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                      <MdOutlineBookmarkBorder className="text-lg" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Edition</p>
                      <p className="text-sm font-bold text-gray-800">{book.edition || `1st Edition, ${book.copyright || '2026'}`}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ratings Bar */}
              <div className="flex items-center flex-wrap gap-4 py-3 px-4 border border-gray-200 rounded-xl mb-6">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center text-yellow-400">
                    {/* Render rating icons dynamically or fallback */}
                    {[...Array(5)].map((_, i) => (
                      <MdStar key={i} className={i < (book.ratings || 5) ? "text-yellow-400" : "text-yellow-400/50"} />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-800 ml-1">{book.ratings || "5"}.0/5</span>
                  <span className="text-xs text-gray-500">(110 reviews)</span>
                </div>
                <div className="w-px h-4 bg-gray-300 hidden sm:block"></div>
                <div className="flex items-center gap-1.5 text-sm">
                  <MdOutlineVisibility className="text-blue-500 text-lg" />
                  <span className="font-bold text-gray-800">1,243</span>
                  <span className="text-gray-500">views</span>
                </div>
              </div>
              {/* Flipkart Link */}
              {book.flipkart && (
                <div className="mb-6">
                  <a
                    href={book.flipkart}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-5 py-3 bg-[#2874F0] hover:bg-[#1f63d6] text-white rounded-xl font-semibold shadow-md transition-all duration-200"
                  >
                    <img
                      src="https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png"
                      alt="Flipkart"
                      className="w-auto h-8"
                    />
                    Buy on Flipkart
                  </a>
                </div>
              )}


              {/* About this Book */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <span className="font-bold text-xs italic">i</span>
                  </div>
                  <h3 className="font-bold text-gray-800">About This Book</h3>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {/* FIX 5: Fallback to your API field named "about" */}
                    {book.about || book.features || book.description || 'No description provided for this book.'}
                  </p>
                </div>
              </div>

              {/* Pricing Box */}
              <div className="bg-[#f8fbf9] border border-green-100 rounded-xl p-5 mb-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-2xl font-extrabold text-gray-900">₹{book.price}</span>
                    <span className="text-sm font-medium text-gray-400 line-through">₹{book.price ? Number(book.price) + 100 : "0"}</span>
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">SAVE ₹100</span>
                  </div>
                  <p className="text-xs text-gray-500">Inclusive of all taxes • Free shipping on orders</p>
                </div>
                <div className="flex flex-col md:items-end">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-green-700 mb-1">
                    <MdCheckCircle className="text-lg" /> {book.status || 'In Stock'} • Ready to Ship
                  </div>
                  <p className="text-xs text-gray-500">Delivery in 4-5 business days</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mb-6">
                <button
                  onClick={() => setIsOrderModalOpen(true)}
                  className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl py-3.5 px-4 font-bold flex items-center justify-between transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <FaWhatsapp className="text-xl" />
                    <span>Order via WhatsApp</span>
                  </div>
                  <MdArrowBack className="rotate-180" />
                </button>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="flex-1 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl py-2.5 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <MdOutlineMenuBook /> Bulk/Institutional
                  </button>
                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="flex-1 bg-white border border-purple-200 text-purple-600 hover:bg-purple-50 rounded-xl py-2.5 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <MdOutlineVisibility /> Preview Sample
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-semibold text-gray-500 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-1"><span className="text-green-600"><MdCheckCircle /></span> Secure WhatsApp Checkout</div>
                <div className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block"></div>
                <div className="flex items-center gap-1"><span className="text-blue-600"><MdVerifiedUser /></span> 100% Genuine Books</div>
                <div className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block"></div>
                <div className="flex items-center gap-1"><span className="text-orange-500"><MdArrowBack className="rotate-90" /></span> Easy Returns</div>
              </div>

              {/* Features Row */}
              <div className="grid grid-cols-4 gap-2 pt-6">
                <div className="flex flex-col items-center text-center gap-1.5">
                  <MdLocalShipping className="text-blue-500 text-xl" />
                  <span className="text-[10px] font-semibold text-gray-800 uppercase">Free Shipping*</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5">
                  <MdSupportAgent className="text-green-500 text-xl" />
                  <span className="text-[10px] font-semibold text-gray-800 uppercase">24/7 Support</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5">
                  <MdVerifiedUser className="text-yellow-500 text-xl" />
                  <span className="text-[10px] font-semibold text-gray-800 uppercase">Authentic</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5">
                  <MdCardGiftcard className="text-red-500 text-xl" />
                  <span className="text-[10px] font-semibold text-gray-800 uppercase">Safe Wrap</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Product Details Table */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Product Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">

            <div className="grid grid-cols-3 border-b border-gray-50 pb-3">
              <div className="col-span-1 text-xs font-bold text-gray-500">Publisher</div>
              <div className="col-span-2 text-sm text-gray-800">{book.publisher || "Veritaz International Press"}</div>
            </div>

            <div className="grid grid-cols-3 border-b border-gray-50 pb-3">
              <div className="col-span-1 text-xs font-bold text-gray-500">ISBN-13</div>
              <div className="col-span-2 text-sm text-gray-800">{book.isbn}</div>
            </div>

            <div className="grid grid-cols-3 border-b border-gray-50 pb-3">
              <div className="col-span-1 text-xs font-bold text-gray-500">Edition</div>
              <div className="col-span-2 text-sm text-gray-800">{book.edition || `1st Edition`}</div>
            </div>

            <div className="grid grid-cols-3 border-b border-gray-50 pb-3">
              <div className="col-span-1 text-xs font-bold text-gray-500">Item Weight</div>
              <div className="col-span-2 text-sm text-gray-800">{book.weight || "282 grams"}</div>
            </div>

            <div className="grid grid-cols-3 border-b border-gray-50 pb-3">
              <div className="col-span-1 text-xs font-bold text-gray-500">Binding</div>
              <div className="col-span-2 text-sm text-gray-800">{book.binding || "Paperback"}</div>
            </div>

            <div className="grid grid-cols-3 border-b border-gray-50 pb-3">
              <div className="col-span-1 text-xs font-bold text-gray-500">Dimensions</div>
              <div className="col-span-2 text-sm text-gray-800">{book.dimensions || "7.0 x 9.4 inches"}</div>
            </div>

            <div className="grid grid-cols-3 border-b border-gray-50 pb-3">
              <div className="col-span-1 text-xs font-bold text-gray-500">Language</div>
              <div className="col-span-2 text-sm text-gray-800">{book.language || "English"}</div>
            </div>

            <div className="grid grid-cols-3 border-b border-gray-50 pb-3">
              <div className="col-span-1 text-xs font-bold text-gray-500">Print Format</div>
              <div className="col-span-2 text-sm text-gray-800">{book.format || "Single Color"}</div>
            </div>

            <div className="grid grid-cols-3 border-b border-gray-50 pb-3">
              <div className="col-span-1 text-xs font-bold text-gray-500">Pages</div>
              <div className="col-span-2 text-sm text-gray-800">{book.pages || "151"}</div>
            </div>

            <div className="grid grid-cols-3 border-b border-gray-50 pb-3">
              <div className="col-span-1 text-xs font-bold text-gray-500">Copyright</div>
              <div className="col-span-2 text-sm text-gray-800">{book.copyright || "2026"}</div>
            </div>

          </div>
        </div>
      </div>

      {/* 1. Fullscreen Preview Lightbox Component */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
          >
            <MdClose size={24} />
          </button>
          <img
            src={getImageUrl(currentImage || book.cover1)}
            alt="Fullscreen preview"
            className="max-w-full max-h-[90vh] object-contain rounded shadow-2xl"
          />
        </div>
      )}

      {/* 2. Order via WhatsApp Modal Component */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsOrderModalOpen(false)}></div>
          <div className="bg-white w-full max-w-md mx-auto rounded-2xl shadow-2xl z-50 overflow-hidden relative">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900">Confirm Order Details</h3>
              <button onClick={() => setIsOrderModalOpen(false)} className="text-gray-400 hover:text-red-500 transition">
                <MdClose size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-6 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/60">
                <img src={getImageUrl(book.cover1)} alt={book.title} className="w-12 h-16 object-cover rounded shadow-sm bg-white" onError={(e) => { e.target.src = "https://placehold.co/50x70?text=No+Cover" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{book.title}</p>
                  <p className="text-sm text-indigo-600 font-extrabold mt-0.5">₹{book.price}</p>
                </div>
              </div>

              <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Your Name</label>
                  <input
                    type="text"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Delivery City / Pincode</label>
                  <input
                    type="text"
                    value={custLocation}
                    onChange={(e) => setCustLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="City, State, Pincode"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Quantity</label>
                  <select
                    value={custQty}
                    onChange={(e) => setCustQty(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  >
                    <option value="1">1 Copy</option>
                    <option value="2">2 Copies</option>
                    <option value="5">5 Copies</option>
                    <option value="10">10+ (Bulk/Institutional)</option>
                  </select>
                </div>

                <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-md transition flex justify-center items-center gap-2 mt-2">
                  <span>Place Order on WhatsApp</span>
                  <FaWhatsapp size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 3. Bulk Institutional Sales Inquiry Modal Component */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsContactModalOpen(false)}></div>
          <div className="bg-white w-full max-w-sm mx-auto rounded-2xl shadow-2xl z-50 p-6 text-center relative">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-100">
              <MdBusiness size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Institutional Inquiry</h3>
            <p className="text-gray-500 text-sm mb-6">For universities, corporate distributions, libraries, or global bulk batches, contact our management desk.</p>

            <div className="space-y-3">
              <a href="tel:+916380658876" className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition shadow-sm">
                <FaPhoneAlt size={16} /> Call Sales Desk
              </a>
              <a href="mailto:info@veritazinternational.com" className="flex items-center justify-center gap-2 w-full border-2 border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:border-indigo-500 hover:text-indigo-600 transition">
                <FaEnvelope size={16} /> Send Email Route
              </a>
            </div>
            <button onClick={() => setIsContactModalOpen(false)} className="mt-4 text-sm text-gray-400 underline hover:text-gray-600 transition">
              Close Context Window
            </button>
          </div>
        </div>
      )}

    </div>
  );
}