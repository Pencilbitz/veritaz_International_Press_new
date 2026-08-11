import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../json_data/firebase";

export default function Contacts() {
  // Form submission state
  const [formStatus, setFormStatus] = useState({ message: '', type: '' });
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const snapshot = await getDocs(collection(db, "team_contacts"));

        let members = [];

        snapshot.forEach((doc) => {
          const data = doc.data();

          // If the document contains an array called "data"
          if (Array.isArray(data.data)) {
            members = [...members, ...data.data];
          }
        });

        console.log(members);
        setTeamMembers(members);
      } catch (err) {
        console.error("Error fetching contacts:", err);
      }
    };

    fetchTeam();
  }, []);

  // Handle Third-Party Scripts (GTM & Google Analytics) on Mount
  useEffect(() => {
    // 1. Google Tag Manager
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });

    const gtmScript = document.createElement('script');
    gtmScript.async = true;
    gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-WZ969VN8';
    document.head.appendChild(gtmScript);

    // 2. Google Analytics
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-T1PQ97DJ6F';
    document.head.appendChild(gaScript);

    const gaConfigScript = document.createElement('script');
    gaConfigScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-T1PQ97DJ6F');
    `;
    document.head.appendChild(gaConfigScript);

    return () => {
      // Clean up scripts on unmount if necessary
      gtmScript.remove();
      gaScript.remove();
      gaConfigScript.remove();
    };
  }, []);

  // Form Submit Handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    setFormStatus({ message: 'Processing...', type: 'loading' });

    const formData = new FormData(form);
    const payload = {
      name: `${formData.get('first_name') || ''} ${formData.get('last_name') || ''}`.trim(),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
      formType: 'Contact Us'
    };

    try {
      const response = await fetch("http://localhost:5000/api/inquiries", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (response.ok) {
        setFormStatus({
          message: "✅ Success! We'll be in touch within 24 hours.",
          type: 'success'
        });
        form.reset();
      } else {
        setFormStatus({
          message: "❌ " + (data.message || "Submission failed."),
          type: 'error'
        });
      }
    } catch (error) {
      setFormStatus({
        message: "❌ Connection error. Please try again.",
        type: 'error'
      });
    }
  };

  useEffect(() => {
    document.title = "Contact Veritaz International | Book Publishing Experts";

    // 1. Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = "Contact Veritaz International for book publishing, ISBN registration, patent support, copyright services, research publication, and academic assistance.";

    // 2. Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = "keywords";
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = "contact Veritaz International, publisher support, publishing inquiry, author help, academic publishing contact India, reach Veritaz team";
    
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
    canonicalLink.href = "https://www.veritazinternational.com/contact";
  }, []);

  return (
    <div style={{ maxWidth: '1520px' }} className="container mx-auto bg-gray-50 font-sans">

      {/* Meet Our Team Section */}
      <section className="py-5 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-[#3e7d89] text-4xl md:text-4xl font-bold mb-4">Meet our team!</h2>
          <p className="text-slate-500 font-medium">Direct lines to our department specialists</p>
        </div>

        <div className="max-w-5xl mx-auto flex flex-wrap gap-6 lg:gap-6 justify-center">
          {(() => {
            const coo = teamMembers.find(m => m.designation?.toLowerCase().includes('chief operations officer') || m.name?.toLowerCase().includes('baskar'));
            if (!coo) return null;
            return (
              <div className="relative group overflow-hidden bg-white w-[350px] h-[500px] shadow-lg rounded-lg flex items-center justify-center">
                <img
                  src={coo.photo ? (coo.photo.startsWith('http') ? coo.photo : `${coo.photo}`) : 'https://placehold.co/400x500/EEE/31343C?text=Photo'}
                  alt={coo.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                  <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider leading-tight">{coo.name}</h2>
                  <p className="text-white font-semibold text-sm sm:text-base mb-3">{coo.designation}</p>

                  <div className="flex items-center text-white text-sm sm:text-base">
                    {coo.phone && (
                      <a href={`tel:${coo.phone.replace(/[^+\d]/g, '')}`} className="inline-flex items-center hover:text-white transition-colors duration-300">
                        <i className="fa-solid fa-phone mr-2 text-blue-400"></i>
                        <span className="font-medium">{coo.phone}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Assistant Senior Manager Section */}
      <section className="py-8 bg-gray-50 px-4">
        <div className="max-w-[350px] mx-auto">
          {(() => {
            const asst = teamMembers.find(m => m.designation?.toLowerCase().includes('assistant senior manager') || m.name?.toLowerCase().includes('logeshwari'));
            if (!asst) return null;
            return (
              <div className="bg-white rounded-tl-[60px] rounded-br-[60px] overflow-hidden shadow-lg border border-slate-100 flex flex-col h-full hover:shadow-2xl transition-all duration-300">
                <div className="h-72 overflow-hidden relative group shrink-0">
                  <img
                    src={asst.photo ? (asst.photo.startsWith('http') ? asst.photo : `${asst.photo}`) : 'https://placehold.co/400x400/EEE/31343C?text=Photo'}
                    alt={asst.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3e7d89]/20 to-transparent pointer-events-none"></div>
                </div>

                <div className="p-4 flex-grow flex flex-col w-full bg-white relative z-10">
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{asst.name}</h3>
                  <p className="text-[#3e7d89] text-xs font-bold uppercase tracking-widest">{asst.designation}</p>

                  <div className="space-y-2 mt-2">
                    {asst.phone && (
                      <a href={`tel:${asst.phone.replace(/[^+\d]/g, '')}`} className="flex items-center rounded-xl bg-slate-50 hover:bg-[#3e7d89] hover:text-white transition-colors p-2 group">
                        <span className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#3e7d89]">
                          <i className="fa-solid fa-phone text-sm"></i>
                        </span>
                        <span className="text-sm font-semibold ml-3">{asst.phone}</span>
                      </a>
                    )}

                    {asst.email && (
                      <a href={`mailto:${asst.email}`} className="flex items-center rounded-xl bg-slate-50 hover:bg-[#3e7d89] hover:text-white transition-colors p-2 group">
                        <span className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#3e7d89]">
                          <i className="fa-solid fa-envelope text-sm"></i>
                        </span>
                        <span className="text-xs font-semibold truncate ml-3">{asst.email}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Main BD Team Grid Section */}
      <section className="bg-[#f8fafc] py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {teamMembers
              .filter(m => {
                const isCoo = m.designation?.toLowerCase().includes('chief operations officer') || m.name?.toLowerCase().includes('baskar');
                const isAsst = m.designation?.toLowerCase().includes('assistant senior manager') || m.name?.toLowerCase().includes('logeshwari');
                return !isCoo && !isAsst;
              })
              .map((member) => (
                <div key={member.id} className="bg-white rounded-tl-[60px] rounded-br-[60px] overflow-hidden shadow-lg border border-slate-100 flex flex-col h-full hover:shadow-2xl transition-all duration-300">
                  <div className="h-72 overflow-hidden relative group shrink-0">
                    <img
                      src={member.photo ? (member.photo.startsWith('http') ? member.photo : `${member.photo}`) : 'https://placehold.co/400x400/EEE/31343C?text=Photo'}
                      alt={member.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3e7d89]/20 to-transparent pointer-events-none"></div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col w-full bg-white relative z-10">
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{member.name}</h3>
                    <p className="text-[#3e7d89] text-xs font-bold uppercase tracking-widest">{member.designation}</p>

                    <div className="space-y-2 mt-4 flex-grow">
                      {member.phone && (
                        <a href={`tel:${member.phone.replace(/[^+\d]/g, '')}`} className="flex items-center rounded-xl bg-slate-50 hover:bg-[#3e7d89] hover:text-white transition-colors p-2 group">
                          <span className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#3e7d89]">
                            <i className="fa-solid fa-phone text-sm"></i>
                          </span>
                          <span className="text-sm font-semibold ml-3">{member.phone}</span>
                        </a>
                      )}
                      {member.email && (
                        <a href={`mailto:${member.email}`} className="flex items-center rounded-xl bg-slate-50 hover:bg-[#3e7d89] hover:text-white transition-colors p-2 group">
                          <span className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#3e7d89]">
                            <i className="fa-solid fa-envelope text-sm"></i>
                          </span>
                          <span className="text-xs font-semibold truncate ml-3">{member.email}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}

            {/* Join Our Team Card */}
            <div className="bg-slate-100 rounded-tl-[60px] rounded-br-[60px] border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-8 text-center h-full min-h-[350px]">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <i className="fa-solid fa-plus text-2xl"></i>
              </div>
              <p className="font-bold text-slate-400">Join our growing team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-slate-50 py-24 px-6 relative overflow-hidden font-sans">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#3e7d89]/10 to-transparent pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#3e7d89]/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-[#3e7d89] uppercase bg-[#3e7d89]/10 rounded-full">Contact Support</span>
            <h1 class="text-4xl md:text-4xl font-black text-slate-900 mb-6 tracking-tight">Get In <span className="text-[#3e7d89]">Touch.</span></h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-stretch">
            {/* Contact Info Panel */}
            <div className="lg:w-[40%] bg-slate-900 rounded-tl-[80px] rounded-br-[40px] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>

              <h2 className="text-3xl font-bold mb-2">Contact</h2>
              <h3 className="text-2xl font-bold text-[#3e7d89] mb-8">Information</h3>

              <p className="mb-12 opacity-80 leading-relaxed">
                Thank you for your interest in our services. Please fill out the form or contact us directly using the information below.
              </p>

              <div className="space-y-10 relative z-10">
                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-[#3e7d89]/20 flex items-center justify-center text-[#3e7d89] group-hover:bg-[#3e7d89] group-hover:text-white transition-all duration-300">
                    <i className="fa-solid fa-phone-volume text-xl"></i>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Call us directly</p>
                    <a href="tel:+916380658876" className="text-lg font-medium hover:text-[#3e7d89] transition-colors">+91 63806 58876</a>
                  </div>
                </div>

                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-[#3e7d89]/20 flex items-center justify-center text-[#3e7d89] group-hover:bg-[#3e7d89] group-hover:text-white transition-all duration-300">
                    <i className="fa-solid fa-envelope-open-text text-xl"></i>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Email Support</p>
                    <a href="mailto:info@veritazinternational.com" className="text-lg font-medium hover:text-[#3e7d89] transition-colors">info@veritazinternational.com</a>
                  </div>
                </div>
              </div>

              <div className="mt-16 pt-8 border-t border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Follow Our Progress</h4>
                <div className="flex gap-4">
                  <a href="#" className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#3e7d89] hover:translate-y-[-4px] transition-all duration-300">
                    <i className="fab fa-facebook-f text-lg"></i>
                  </a>
                  <a href="#" className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#3e7d89] hover:translate-y-[-4px] transition-all duration-300">
                    <i className="fab fa-twitter text-lg"></i>
                  </a>
                  <a href="#" className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#3e7d89] hover:translate-y-[-4px] transition-all duration-300">
                    <i className="fab fa-instagram text-lg"></i>
                  </a>
                  <a href="#" className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#3e7d89] hover:translate-y-[-4px] transition-all duration-300">
                    <i className="fab fa-linkedin-in text-lg"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form Container */}
            <div className="lg:w-[60%] bg-white rounded-3xl p-10 md:p-16 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-center">
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Send us a message</h3>
                <p className="text-slate-500 font-medium">Fill out the form below and our team will get back to you within 24 hours.</p>
              </div>

              <form id="web3form" onSubmit={handleFormSubmit} className="space-y-8" noValidate>
                <input type="hidden" name="access_key" value="351a2b0f-5bed-4078-a9ce-dc3cdb628eb5" />
                <input type="hidden" name="subject" value="New Message from Contact Form" />
                <input type="checkbox" name="botcheck" style={{ display: 'none' }} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-[#3e7d89] transition-colors">First Name *</label>
                    <div className="relative">
                      <span className="absolute left-0 bottom-3 text-slate-300 group-focus-within:text-[#3e7d89] transition-colors">
                        <i className="fas fa-user text-sm"></i>
                      </span>
                      <input type="text" name="first_name" id="first-name" placeholder="John" required
                        className="w-full pl-8 py-3 bg-transparent border-b-2 border-slate-100 focus:border-[#3e7d89] outline-none transition-all duration-300 placeholder:text-slate-200 text-slate-800 font-semibold" />
                    </div>
                  </div>
                  <div className="relative group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-[#3e7d89] transition-colors">Last Name *</label>
                    <div className="relative">
                      <span className="absolute left-0 bottom-3 text-slate-300 group-focus-within:text-[#3e7d89] transition-colors">
                        <i className="fas fa-user text-sm"></i>
                      </span>
                      <input type="text" name="last_name" id="last-name" placeholder="Doe" required
                        className="w-full pl-8 py-3 bg-transparent border-b-2 border-slate-100 focus:border-[#3e7d89] outline-none transition-all duration-300 placeholder:text-slate-200 text-slate-800 font-semibold" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-[#3e7d89] transition-colors">Email Address *</label>
                    <div className="relative">
                      <span className="absolute left-0 bottom-3 text-slate-300 group-focus-within:text-[#3e7d89] transition-colors">
                        <i className="fas fa-envelope text-sm"></i>
                      </span>
                      <input type="email" name="email" id="email" placeholder="john.doe@example.com" required
                        className="w-full pl-8 py-3 bg-transparent border-b-2 border-slate-100 focus:border-[#3e7d89] outline-none transition-all duration-300 placeholder:text-slate-200 text-slate-800 font-semibold" />
                    </div>
                  </div>
                  <div className="relative group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-[#3e7d89] transition-colors">Phone Number</label>
                    <div className="relative">
                      <span className="absolute left-0 bottom-3 text-slate-300 group-focus-within:text-[#3e7d89] transition-colors">
                        <i className="fas fa-phone text-sm"></i>
                      </span>
                      <input type="tel" name="phone" id="phone" placeholder="+91 9876541230"
                        className="w-full pl-8 py-3 bg-transparent border-b-2 border-slate-100 focus:border-[#3e7d89] outline-none transition-all duration-300 placeholder:text-slate-200 text-slate-800 font-semibold" />
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-[#3e7d89] transition-colors">Your Message</label>
                  <div className="relative">
                    <span className="absolute left-0 top-3 text-slate-300 group-focus-within:text-[#3e7d89] transition-colors">
                      <i className="fas fa-comment text-sm"></i>
                    </span>
                    <textarea name="message" id="message" placeholder="Tell us how we can help you..." rows="4" required
                      className="w-full pl-8 py-3 bg-transparent border-b-2 border-slate-100 focus:border-[#3e7d89] outline-none transition-all duration-300 placeholder:text-slate-200 text-slate-800 font-semibold resize-none"></textarea>
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit"
                    className="w-full bg-[#3e7d89] hover:bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-[#3e7d89]/20 hover:shadow-slate-900/20 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3">
                    Send Message
                    <i className="fa-solid fa-paper-plane text-[10px]"></i>
                  </button>
                </div>

                {/* Dynamically Styled Response Message container */}
                {formStatus.message && (
                  <p className={`text-center text-sm font-bold mt-4 p-3 rounded-xl ${formStatus.type === 'success' ? 'text-green-600 bg-green-50' :
                    formStatus.type === 'loading' ? 'text-blue-600' : 'text-red-600 bg-red-50'
                    }`}>
                    {formStatus.message}
                  </p>
                )}

                <p className="text-[10px] text-gray-400 text-center mt-6 uppercase tracking-widest">
                  Your privacy is our priority. We never share your personal information.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}