import { useState, useEffect } from "react";
import { Search, Barcode } from "lucide-react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../json_data/firebase";

export default function BookStore() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const snapshot = await getDocs(collection(db, "books (5)"));

        let books = [];

        snapshot.forEach((doc) => {
          const docData = doc.data();

          // If your Firestore stores the books inside a data array
          if (Array.isArray(docData.data)) {
            books.push(...docData.data);
          }
        });

        console.log("All Books:", books);

        // Filter only In Stock books
        const inStockBooks = books.filter(
          (book) => book.status === "In Stock"
        );

        console.log("In Stock Books:", inStockBooks);

        setBooks(inStockBooks);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    const value = search.toLowerCase();

    // FIX 2: Changed book.author to book.authors to match your API
    return (
      (book.title && book.title.toLowerCase().includes(value)) ||
      (book.authors && book.authors.toLowerCase().includes(value)) ||
      (book.isbn && book.isbn.toLowerCase().includes(value))
    );
  });

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-indigo-900 mb-6">
            Find Your Book
          </h1>

          <div className="max-w-2xl mx-auto relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search by title, author or ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 shadow bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <p className="mt-4 text-gray-500">
            {filteredBooks.length} Book
            {filteredBooks.length !== 1 && "s"} Found
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredBooks.map((book) => (
            <Link
              key={book.id}
              to={`/books/${book.id}`}
              className="bg-white rounded-xl shadow border border-gray-100 p-4 hover:scale-105 transition"
            >
              {/* FIX 3: Changed book.cover to book.cover1 to match API structure */}
              <img
                src={book.cover1}
                alt={book.title}
                className="mx-auto h-64 object-cover rounded mb-4"
                onError={(e) => { e.target.src = "https://via.placeholder.com/150x200?text=No+Cover" }}
              />

              <h3 className="font-bold text-lg text-gray-800 line-clamp-2">
                {book.title}
              </h3>

              {/* FIX 4: Changed book.author to book.authors */}
              <p className="text-xs text-gray-500 font-semibold mt-2 line-clamp-3">
                {book.authors}
              </p>

              <p className="flex items-center justify-center gap-2 mt-4 text-xs font-bold text-orange-500 uppercase">
                <Barcode size={16} className="text-gray-600" />
                ISBN : {book.isbn}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}