import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../json_data/firebase";

export default function Conference() {
  const { confname } = useParams();
  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConference = async () => {
      try {
        const snapshot = await getDocs(collection(db, "conferences (2)"));

        const conferences = [];

        snapshot.forEach((doc) => {
          const docData = doc.data();

          if (Array.isArray(docData.data)) {
            conferences.push(...docData.data);
          }
        });

        console.log("All Conferences:", conferences);
        console.log("URL confname:", confname);

        const selectedConference = conferences.find((item) => {
          const itemName = item.conferencename || item.conferenceName || "";
          return itemName.replace(/\s+/g, "-").toLowerCase() === confname;
        });

        console.log("Selected:", selectedConference);

        if (selectedConference) {
          const normalize = (value, fallback) => {
            if (!value) return fallback;

            if (typeof value === "string") {
              try {
                return JSON.parse(value);
              } catch {
                return fallback;
              }
            }

            return value;
          };

          setConference({
            ...selectedConference,

            topics: normalize(selectedConference.topics, []),
            speakers: normalize(selectedConference.speakers, []),
            organizingcommittee: normalize(selectedConference.organizingcommittee, []),
            advisorycommittee: normalize(selectedConference.advisorycommittee, []),
            globalexperts: normalize(selectedConference.globalexperts, []),
            certificatesdownload: normalize(selectedConference.certificatesdownload, []),

            fees: normalize(selectedConference.fees, {}),

            dates: normalize(selectedConference.dates, {}),

            bankdetails: normalize(selectedConference.bankdetails, {}),
          });
        } else {
          setConference(null);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConference();
  }, [confname]);

  useEffect(() => {
        document.title = "Conference Paper Listings";
    
        // 1. Meta Description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.name = "description";
          document.head.appendChild(metaDescription);
        }
        metaDescription.content = "Explore academic conferences, research symposiums, and publishing workshops hosted by Veritaz International. Join scholarly discussions and events.";
        
        // 2. Meta Keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
          metaKeywords = document.createElement('meta');
          metaKeywords.name = "keywords";
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.content = "Veritaz conferences, academic conferences India, research symposiums, publishing workshops, scholarly events, author seminars, academic webinars Veritaz";

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
        canonicalLink.href = "https://www.veritazinternational.com/conferences";
      }, []);

  if (loading) {
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <h2 className="text-xl font-bold text-blue-900 animate-pulse">Loading Conference Details...</h2>
      </div>
    );
  }

  if (!conference || conference.message) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <h2 className="text-3xl font-bold text-red-600">Conference Not Found</h2>
      </div>
    );
  }

  const getAssetUrl = (path) => {
    if (!path) return "";

    // Prepend the backend server host domain if it's a local relative path
    let fullUrl = path;
    if (!path.startsWith("http://") && !path.startsWith("https://")) {
      const cleanPath = path.startsWith("/") ? path.slice(1) : path;
      fullUrl = `http://localhost:5000/${cleanPath}`;
    }

    // Encode spaces and special characters so <img> components can load them cleanly
    return encodeURI(fullUrl);
  };

  // Safe checks for validation variables 
  const hasData = (field) => {
    if (!field) return false;
    if (Array.isArray(field) && field.length === 0) return false;
    if (typeof field === "object" && Object.values(field).every(val => !val)) return false;
    return true;
  };

  const parseJSONField = (str) => {
    if (!str) return [];
    if (Array.isArray(str)) return str;
    try { return JSON.parse(str); } catch (e) { return []; }
  };

  const parsedCertificates = parseJSONField(conference.certificatesdownload);

  // Layout color palette matching for loop indices 
  const borders = ["hover:border-green-200", "hover:border-blue-200", "hover:border-indigo-200", "hover:border-orange-200", "hover:border-purple-200", "hover:border-red-200"];
  const texts = ["text-green-600", "text-blue-600", "text-indigo-600", "text-orange-600", "text-purple-600", "text-red-600"];

  return (
    <div className="bg-slate-50/50 font-sans text-slate-800 min-h-screen pb-12">
      <div className="max-w-[1520px] mx-auto">

        {/* Dynamic Premium Header Hero */}
        <header className="relative bg-blue-900 text-white py-16 px-4 overflow-hidden shadow-inner">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="max-w-6xl mx-auto text-center relative z-10 space-y-4">
            {conference.type && (
              <span className="bg-amber-500 text-blue-950 font-extrabold py-1 px-4 rounded-full text-xs uppercase tracking-wider inline-block">
                {conference.type}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight max-w-5xl mx-auto">
              International E-Conference on <br />
              <span className="text-sky-400">{conference.conferencetitle}</span>
            </h1>
            {conference.conferencename && (
              <p className="text-xl font-light text-slate-300 font-mono">({conference.conferencename})</p>
            )}
            <div className="flex flex-wrap justify-center gap-4 text-sm pt-2">
              {conference.dates?.conferenceDate && (
                <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg font-medium">
                  📅 {new Date(conference.dates.conferenceDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              )}
              <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg font-medium">
                🌐 Online Mode
              </span>
              {conference.isbn && (
                <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg font-mono text-xs">
                  📑 ISBN: {conference.isbn}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Sections Layout */}
        <main className="max-w-7xl mx-auto px-4 py-12 space-y-16">

          {/* About & Core Deadlines Grid */}
          <section className="container mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 items-start justify-between">

              <div className="lg:col-span-7 space-y-8">
                {conference.about && (
                  <div>
                    {conference.dates?.conferenceDate && (
                      <div className="inline-block px-4 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-100">
                        Event Date: {new Date(conference.dates.conferenceDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    )}
                    <h2 className="text-3xl font-bold border-l-4 border-indigo-600 pl-4 mb-6 text-gray-800 tracking-tight">
                      About the Conference
                    </h2>
                    <p className="text-slate-600 leading-relaxed text-justify text-base whitespace-pre-line">
                      {conference.about}
                    </p>
                  </div>
                )}

                {/* Optional Dynamic Deadlines Grid */}
                {hasData(conference.dates) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {conference.dates.abstractSubmission && (
                      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 border-b-4 border-amber-500 transform hover:-translate-y-1 transition duration-300">
                        <h3 className="text-indigo-950 font-black text-2xl font-mono">
                          {new Date(conference.dates.abstractSubmission).toLocaleDateString('en-GB').replace(/\//g, '-')}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">Abstract Submission Deadline</p>
                      </div>
                    )}
                    {conference.dates.fullPaperSubmission && (
                      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 border-b-4 border-emerald-500 transform hover:-translate-y-1 transition duration-300">
                        <h3 className="text-indigo-950 font-black text-2xl font-mono">
                          {new Date(conference.dates.fullPaperSubmission).toLocaleDateString('en-GB').replace(/\//g, '-')}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">Full Paper Submission Deadline</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Interactive Actions */}
                <div className="flex flex-wrap gap-4 pt-2">
                  {conference.registerlink && (
                    <a href={conference.registerlink} target="_blank" rel="noreferrer" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-all active:scale-95">
                      Register Now
                    </a>
                  )}
                  {conference.brochuredownload && (
                    <a href={conference.brochuredownload} download className="px-8 py-3 border-2 border-slate-200 text-slate-600 bg-white font-bold rounded-xl hover:bg-slate-50 transition-all">
                      Download Brochure
                    </a>
                  )}
                </div>
              </div>

              {/* Poster Box Column */}
              {conference.poster && (
                <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
                  <div className="relative group max-w-[460px] w-full">
                    <img
                      src={conference.poster}
                      alt="Conference Poster"
                      className="w-full h-auto max-w-full object-contain rounded-2xl shadow-xl"
                      onError={(e) => {
                        e.currentTarget.closest(".lg\\:col-span-5")?.remove();
                      }}
                    />
                  </div>
                </div>
              )}

            </div>
          </section>

          {/* Dynamic Proceedings Section */}
          {conference.proceedingsdownload && (
            <section className="py-6 bg-white rounded-3xl shadow-sm px-6 max-w-4xl mx-auto border border-slate-100">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-7 bg-blue-500 rounded-full"></div>
                    <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Conference Downloads</h3>
                  </div>
                  <span className="hidden sm:block text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    Format: Digital PDF
                  </span>
                </div>
                <div className="flex justify-center">
                  <div className="group flex flex-col w-full max-w-md justify-between p-5 bg-emerald-50 rounded-2xl border border-emerald-100 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300">
                    <div className="mb-4 flex items-start gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                        📄
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-800">Conference Proceedings</h4>
                        <p className="text-[11px] text-emerald-800 uppercase font-bold tracking-wider mt-0.5">Official Research Compilation</p>
                      </div>
                    </div>
                    <a href={conference.proceedingsdownload} download className="flex items-center justify-center py-2.5 bg-blue-600 border border-blue-600 rounded-xl text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-sm">
                      📥 Download Proceedings
                    </a>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Dynamic Track Certificates Hub */}
          {parsedCertificates.length > 0 && (
            <section className="py-6 bg-white rounded-3xl shadow-sm px-6 border border-slate-100">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-7 bg-orange-500 rounded-full"></div>
                    <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Download Certificates</h3>
                  </div>
                  <span className="hidden sm:block text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    Format: Digital PDF
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {parsedCertificates.map((track, idx) => (
                    <div key={idx} className="group flex flex-col justify-between p-5 bg-slate-50 rounded-2xl border border-slate-200/60 hover:border-orange-300 hover:bg-orange-50/20 transition-all duration-300">
                      <div className="mb-5 flex items-start gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-sm shrink-0">
                          🎓
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-800">{track.name || `Track 0${idx + 1}`}</h4>
                          <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">Conference Session Track</p>
                        </div>
                      </div>
                      <a href={track.file} download className="flex items-center justify-center py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs font-bold hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all shadow-sm">
                        📥 Download PDF
                      </a>
                    </div>
                  ))}
                </div>

                {/* Meta Verification Metrics Block */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center text-sm uppercase tracking-wider">
                    ℹ️ Verification Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    {conference.conferencestatus && (
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col">
                        <span className="text-slate-400 uppercase text-[10px] font-bold tracking-widest mb-1">Status</span>
                        <span className="text-emerald-600 font-bold text-sm">✓ {conference.conferencestatus}</span>
                      </div>
                    )}
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col">
                      <span className="text-slate-400 uppercase text-[10px] font-bold tracking-widest mb-1">Security</span>
                      <span className="text-purple-600 font-bold text-sm">🛡️ Verified Records</span>
                    </div>
                    {conference.conferencevalidity && (
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col">
                        <span className="text-slate-400 uppercase text-[10px] font-bold tracking-widest mb-1">Validity</span>
                        <span className="text-blue-600 font-bold text-sm">📆 {conference.conferencevalidity}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Dynamic Tracks & Scope Section */}
          {hasData(conference.topics) && (
            <section className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-8 w-1.5 bg-indigo-600 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Conference Topics & Tracks</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {conference.topics.map((topic, i) => (
                    <div key={i} className="group flex items-center gap-4 p-3 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-indigo-100 transition-all duration-300">
                      <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors text-sm font-bold">
                        #{i + 1}
                      </div>
                      <p className="font-semibold text-slate-700 text-sm leading-tight">{topic}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Registration Fees & Payment Info Node */}
          {hasData(conference.fees) && (
            <section id="Register" className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                  🎟️ Registration Fees (Per Paper)
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="py-3 text-slate-400 font-bold uppercase text-xs tracking-wider">Participant Category</th>
                        <th className="py-3 text-slate-400 font-bold uppercase text-xs tracking-wider text-right">Fee Standard</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {Object.entries(conference.fees).map(([key, val]) => {
                        if (!val) return null;
                        return (
                          <tr key={key} className="hover:bg-slate-50/80 transition">
                            <td className="py-3.5 text-sm font-semibold capitalize text-slate-700">{key.replace(/([A-Z])/g, ' $1')}</td>
                            <td className="py-3.5 text-right text-indigo-600 font-extrabold text-sm font-mono">₹ {val}/-</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dynamic QR / Alternate Bank Transfer Layout Card */}
              <div className="bg-blue-950 text-white p-6 rounded-3xl shadow-lg flex flex-col justify-center items-center text-center space-y-4">
                <h3 className="text-lg font-bold tracking-wide">Secure Checkout</h3>

                {conference.bankdetails ? (
                  <div className="w-full text-left bg-blue-900/40 border border-blue-800 p-4 rounded-xl font-mono text-xs text-slate-300 space-y-1.5">
                    <p className="text-[10px] text-amber-500 font-sans font-bold uppercase mb-1">Direct Bank Remittance</p>
                    {conference.bankdetails.bankName && <p><strong>Bank:</strong> {conference.bankdetails.bankName}</p>}
                    {conference.bankdetails.accountName && <p><strong>Name:</strong> {conference.bankdetails.accountName}</p>}
                    {conference.bankdetails.accountNo && <p><strong>A/C No:</strong> {conference.bankdetails.accountNo}</p>}
                    {conference.bankdetails.ifscCode && <p><strong>IFSC:</strong> {conference.bankdetails.ifscCode}</p>}
                  </div>
                ) : (
                  <div className="bg-white p-2 rounded-xl">
                    <img
                      src="/assets/image/conference/ICGMRFT-QR%2031-Mar-2026.jpg"
                      alt="Conference Registration QR Code"
                      className="w-32 h-32 object-contain rounded-lg border border-slate-200"
                    />
                  </div>
                )}

                {conference.registerlink && (
                  <a href={conference.registerlink} target="_blank" rel="noreferrer" className="w-full bg-amber-500 text-blue-950 font-black py-3 px-6 rounded-xl hover:scale-[1.02] transition active:scale-95 text-xs uppercase tracking-wider block">
                    Link to Register
                  </a>
                )}
              </div>
            </section>
          )}

          {/* Dynamic Speakers Showcase */}
          {hasData(conference.speakers) && (
            <section className="container mx-auto mt-12">
              <div className="text-center mb-10">
                <h2 className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-2">Expert Insights</h2>
                <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Keynote Speakers</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {conference.speakers.map((speaker, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
                    {speaker.image && (
                      <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full border-2 border-slate-100">
                        <img
                          src={getAssetUrl(speaker.image)} // 🌟 CRITICAL FIX: Wrapped in your helper function
                          alt={speaker.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to a placeholder icon if the local image fails entirely
                            e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                          }}
                        />
                      </div>
                    )}
                    <h3 className="text-base font-bold text-gray-900">{speaker.name}</h3>
                    <p className="text-xs text-indigo-600 font-semibold mb-2">{speaker.designation}</p>
                    <p className="text-gray-500 text-[11px] leading-tight">{speaker.institution}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Committee / Conveners and Board Node */}
          {(hasData(conference.organizingcommittee) || hasData(conference.advisorycommittee)) && (
            <section className="bg-slate-900 text-white rounded-3xl p-6 md:p-10 border border-slate-800">
              <div className="grid md:grid-cols-12 gap-10">

                {hasData(conference.organizingcommittee) && (
                  <div className="md:col-span-6 space-y-6">
                    <h3 className="text-xl font-bold text-amber-400 tracking-tight">Conference Conveners</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {conference.organizingcommittee.map((member, idx) => (
                        <div key={idx} className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
                          <p className="font-bold text-sm text-slate-100">{member.name}</p>
                          <p className="text-[11px] text-slate-400 uppercase tracking-wide mt-0.5">{member.role || "Convener"}</p>
                          {member.mobile && <p className="text-xs text-indigo-400 font-mono mt-1">📞 {member.mobile}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {hasData(conference.advisorycommittee) && (
                  <div className={`space-y-6 pl-0 md:pl-8 ${hasData(conference.organizingcommittee) ? "md:col-span-6 md:border-l md:border-slate-800" : "md:col-span-12"}`}>
                    <h3 className="text-xl font-bold text-amber-400 tracking-tight">Advisory Committee</h3>
                    <ul className="space-y-4">
                      {conference.advisorycommittee.map((member, idx) => (
                        <li key={idx} className="border-b border-dashed border-slate-800/60 pb-3 last:border-none last:pb-0">
                          <p className="font-bold text-sm text-slate-200">{member.name}</p>
                          <p className="text-[11px] text-slate-400 uppercase tracking-wide mt-0.5">
                            {member.designation && `${member.designation}, `}{member.institution}{member.location && ` (${member.location})`}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            </section>
          )}

          {/* Dynamic Global Experts Showcase */}
          {hasData(conference.globalexperts) && (
            <section className="container mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-2">Advisory Committee</h2>
                <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Meet Our Global Experts</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {conference.globalexperts.map((exp, idx) => {
                  const borderClass = borders[idx % borders.length];
                  const textClass = texts[idx % texts.length];

                  return (
                    <div key={idx} className={`bg-white rounded-2xl p-5 shadow-sm border border-slate-100 transition-all duration-300 relative overflow-hidden hover:shadow-md ${borderClass}`}>
                      <h3 className="text-lg font-bold text-gray-900 mb-0.5">{exp.name}</h3>
                      <p className={`font-semibold text-xs mb-3 ${textClass}`}>{exp.designation}</p>
                      <p className="text-gray-500 text-xs flex items-center gap-1.5 mb-1">
                        🏢 {exp.institution}
                      </p>
                      {exp.location && (
                        <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">
                          📍 {exp.location}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}