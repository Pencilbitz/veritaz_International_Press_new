import React, { useEffect, useRef } from 'react';

export default function BookPublishing() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Simple fade-in & slide-up animation on scroll
    const cards = containerRef.current?.querySelectorAll('.book-card');
    if (!cards) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach((card) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.title = "Book Publishing Services in India | Veritaz International";

    // 1. Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = "Publish your book with Veritaz International. We offer professional book publishing,ISBN ,editing,cover design,printing and global distribution services.";

    // 2. Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = "keywords";
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = "book publishing services Veritaz, textbook publication India, academic book publishing, professional editing and ISBN, research paper and book publication, author publishing services";
    
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
    canonicalLink.href = "https://www.veritazinternational.com/book-publishing";
  }, []);

  return (
    <div ref={containerRef} className="bg-gray-50 font-sans min-h-screen">

      <div className="container mx-auto">
        {/* Hero Section */}
        <section
          className="book-card text-white py-16 transition-all duration-300 hover:-translate-y-1"
          style={{ background: 'linear-gradient(132deg, rgb(0, 103, 154) 0.00%, rgb(0, 173, 239) 100.00%)' }}
        >
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Book Publication Services</h1>
            <p className="text-xl max-w-3xl mx-auto">
              We help authors bring their manuscripts to life with professional publishing services for all genres and formats.
            </p>
            <button className="mt-8 bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
              Get Started Today
            </button>
          </div>
        </section>

        {/* Main Publication Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Publication Services</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

              {/* Fiction Novels Card */}
              <div
                className="book-card rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)' }}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-white p-3 rounded-lg mr-4 shadow-sm">
                      <i className="fas fa-book text-2xl text-pink-500"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Fiction Novels</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    From fantasy to romance, we help fiction writers craft compelling narratives and bring their imaginative worlds to readers worldwide.
                  </p>
                  <ul className="text-gray-700 mb-6 space-y-2">
                    <li><i className="fas fa-check text-green-500 mr-2"></i> Professional editing</li>
                    <li><i className="fas fa-check text-green-500 mr-2"></i> Cover design</li>
                    <li><i className="fas fa-check text-green-500 mr-2"></i> Marketing support</li>
                  </ul>
                  <a href="/fiction-novels" className="block w-full bg-white text-pink-600 text-center py-2 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
                    Learn More
                  </a>
                </div>
              </div>

              {/* Thesis Book Card */}
              <div
                className="book-card rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' }}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-white p-3 rounded-lg mr-4 shadow-sm">
                      <i className="fas fa-graduation-cap text-2xl text-blue-500"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Thesis Books</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Transform your academic research into a professionally published book that reaches both academic and general audiences.
                  </p>
                  <ul className="text-gray-700 mb-6 space-y-2">
                    <li><i className="fas fa-check text-green-500 mr-2"></i> Academic formatting</li>
                    <li><i className="fas fa-check text-green-500 mr-2"></i> Peer review coordination</li>
                    <li><i className="fas fa-check text-green-500 mr-2"></i> Library distribution</li>
                  </ul>
                  <a href="/thesis-books" className="block w-full bg-white text-blue-600 text-center py-2 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
                    Learn More
                  </a>
                </div>
              </div>

              {/* Poetry Book Card */}
              <div
                className="book-card rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-white p-3 rounded-lg mr-4 shadow-sm">
                      <i className="fas fa-pen-fancy text-2xl text-orange-500"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Poetry Books</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Celebrate the art of verse with beautifully designed poetry collections that honor the rhythm and emotion of your words.
                  </p>
                  <ul className="text-gray-700 mb-6 space-y-2">
                    <li><i className="fas fa-check text-green-500 mr-2"></i> Lyrical formatting</li>
                    <li><i className="fas fa-check text-green-500 mr-2"></i> Artistic layout</li>
                    <li><i className="fas fa-check text-green-500 mr-2"></i> Poetry community outreach</li>
                  </ul>
                  <a href="/poetry-books" className="block w-full bg-white text-orange-600 text-center py-2 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
                    Learn More
                  </a>
                </div>
              </div>

              {/* Short Story Card */}
              <div
                className="book-card rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' }}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-white p-3 rounded-lg mr-4 shadow-sm">
                      <i className="fas fa-file-alt text-2xl text-green-500"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Short Stories</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Whether standalone or in collections, we help short story writers publish impactful narratives that captivate readers.
                  </p>
                  <ul className="text-gray-700 mb-6 space-y-2">
                    <li><i className="fas fa-check text-green-500 mr-2"></i> Collection compilation</li>
                    <li><i className="fas fa-check text-green-500 mr-2"></i> Anthology opportunities</li>
                    <li><i className="fas fa-check text-green-500 mr-2"></i> Literary magazine submissions</li>
                  </ul>
                  <a href="/short-stories" className="block w-full bg-white text-green-600 text-center py-2 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
                    Learn More
                  </a>
                </div>
              </div>

              {/* Conference Proceedings Card */}
              <div
                className="book-card rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'linear-gradient(135deg, #a6c0fe 0%, #f68084 100%)' }}
              >
                <div className="p-6">
                  <div className="flex items-center mb-5">
                    <div className="bg-white p-3 rounded-xl shadow-sm mr-4">
                      <i className="fas fa-users text-2xl text-purple-500"></i>
                    </div>
                    <a href="/conference-proceedings" className="text-xl font-bold text-gray-800 hover:text-purple-600 transition-colors duration-300">
                      Conference Proceedings
                    </a>
                  </div>
                  <p className="text-gray-700 mb-5 leading-relaxed">
                    Document and disseminate the knowledge shared at academic and professional conferences with professionally published proceedings.
                  </p>
                  <ul className="text-gray-700 mb-6 space-y-2">
                    <li><i className="fas fa-check text-green-500 mr-2"></i> Rapid publication</li>
                    <li><i className="fas fa-check text-green-500 mr-2"></i> ISBN assignment</li>
                    <li><i className="fas fa-check text-green-500 mr-2"></i> Academic indexing</li>
                  </ul>
                  <a href="/conference-proceedings" className="block w-full bg-white text-center text-sky-500 py-3 rounded-xl font-semibold hover:bg-gray-100 transition duration-300 shadow-md hover:shadow-lg">
                    Learn More <i className="fas fa-arrow-right ml-2 text-sm"></i>
                  </a>
                </div>
              </div>

              {/* Edited Book Card */}
              <div
                className="book-card rounded-xl shadow-lg overflow-hidden md:col-span-2 lg:col-span-3 transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)' }}
              >
                <div className="p-6 flex flex-col md:flex-row items-center">
                  <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                    <div className="flex items-center mb-4">
                      <div className="bg-white p-3 rounded-lg mr-4 shadow-sm">
                        <i className="fas fa-edit text-2xl text-red-500"></i>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Edited Books</h3>
                    </div>
                    <p className="text-gray-700 mb-4">
                      As an editor or volume coordinator, bring together expert contributions into a cohesive, professionally published book.
                    </p>
                    <ul className="text-gray-700 mb-6 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <li><i className="fas fa-check text-green-500 mr-2"></i> Contributor management</li>
                      <li><i className="fas fa-check text-green-500 mr-2"></i> Consistency editing</li>
                      <li><i className="fas fa-check text-green-500 mr-2"></i> Volume coordination</li>
                      <li><i className="fas fa-check text-green-500 mr-2"></i> Academic standards compliance</li>
                    </ul>
                  </div>
                  <div className="md:w-1/3 w-full">
                    <a href="/edited-books" className="block w-full bg-white text-red-600 text-center py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
                      Learn More
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Publication Process</h2>
            <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 md:space-x-4">

              <div className="text-center max-w-xs">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-indigo-600 text-2xl font-bold">1</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Submission & Review</h3>
                <p className="text-gray-600">Submit your manuscript for initial review and evaluation.</p>
              </div>

              <div className="text-center max-w-xs">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-indigo-600 text-2xl font-bold">2</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Editing & Design</h3>
                <p className="text-gray-600">Professional editing, typesetting, and cover design.</p>
              </div>

              <div className="text-center max-w-xs">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-indigo-600 text-2xl font-bold">3</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Production</h3>
                <p className="text-gray-600">Formatting for print and digital distribution.</p>
              </div>

              <div className="text-center max-w-xs">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-indigo-600 text-2xl font-bold">4</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Distribution</h3>
                <p className="text-gray-600">Global distribution through major retailers.</p>
              </div>

            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="book-card py-16 text-white transition-all duration-300 hover:-translate-y-1"
          style={{ background: 'linear-gradient(132deg, rgb(0, 103, 154) 0.00%, rgb(0, 173, 239) 100.00%)' }}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Publish Your Book?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Join thousands of authors who have successfully published their works with our expert guidance and support.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 items-center">
              <button className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 w-full sm:w-auto">
                Start Your Publication Journey
              </button>
              <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-700 transition duration-300 w-full sm:w-auto">
                Request a Consultation
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}