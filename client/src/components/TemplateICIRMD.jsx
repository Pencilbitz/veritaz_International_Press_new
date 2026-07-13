import { 
  Download, 
  MapPin, 
  Phone,
  CheckCircle,
  FileText,
  Award,
  Calendar,
  User
} from "lucide-react";

export default function TemplateICIRMD({ conference }) {
  if (!conference) return null;

  const handleDownload = (url) => {
    if (url) window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 text-white py-20 px-4 rounded-b-[3rem] shadow-xl">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight drop-shadow-md">
            {conference.title}
          </h1>
          <p className="text-xl font-semibold tracking-wider text-blue-200 drop-shadow">
            ({conference.conferenceName})
          </p>
          <p className="text-sm font-semibold tracking-widest text-indigo-200">
            ISBN - 978-93-47785-04-7
          </p>
          <div className="pt-4">
            <span className="inline-block bg-white text-indigo-900 rounded-full px-8 py-3 text-sm font-bold tracking-widest shadow-lg">
              {conference.dates?.conferenceDate || "31ST JANUARY 2026"}
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-10 space-y-12">
        
        {/* 2. Conference Full Paper */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col md:flex-row items-center gap-6">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex-1 flex flex-col md:flex-row items-center gap-6 w-full">
            <div className="p-4 bg-white text-indigo-600 rounded-xl shadow-sm">
              <FileText size={32} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-gray-900 text-lg mb-1">Conference Full Paper</h3>
              <p className="text-sm text-gray-600">Complete proceedings document with all presented research papers.</p>
            </div>
            <button 
              onClick={() => handleDownload(conference.conferenceProceeding)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md transition-all shrink-0"
            >
              <Download size={18} /> Download Full Paper
            </button>
          </div>
        </div>

        {/* 3. Certificates & Verification */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
              DOWNLOAD CERTIFICATES
            </h2>
            <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-3 py-1 rounded-full">Format: Digital PDF</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {conference.certificateTracks?.slice(0, 3).map((track, idx) => (
              <div key={idx} className="border border-gray-100 bg-gray-50 rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="text-orange-500 mb-3">
                  <FileText size={24} />
                </div>
                <h3 className="font-bold text-gray-900">{track.name}</h3>
                <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase mb-4">Conference Track</p>
                <button 
                  onClick={() => handleDownload(track.file)}
                  className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Download size={14} /> Download
                </button>
              </div>
            ))}
            {/* Listener Card */}
            <div className="border border-blue-100 bg-blue-50/30 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="text-blue-600 mb-3">
                <Award size={24} />
              </div>
              <h3 className="font-bold text-gray-900">Listener</h3>
              <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase mb-4">Participation</p>
              <button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Download size={14} /> Download
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Verification Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-100 rounded-xl p-4 bg-white flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Status</span>
                <span className="font-bold text-sm text-gray-900 flex items-center gap-2"><CheckCircle size={14} className="text-green-500"/> {conference.verificationDetails?.status || "Fully Released"}</span>
              </div>
              <div className="border border-gray-100 rounded-xl p-4 bg-white flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Validity</span>
                <span className="font-bold text-sm text-gray-900 flex items-center gap-2"><Award size={14} className="text-purple-500"/> {conference.verificationDetails?.validity1 || "Verified Document"}</span>
              </div>
              <div className="border border-gray-100 rounded-xl p-4 bg-white flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Validity</span>
                <span className="font-bold text-sm text-gray-900 flex items-center gap-2"><Calendar size={14} className="text-blue-500"/> {conference.verificationDetails?.validity2 || "Edition"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">About Conference</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm mb-8 flex-1">
              {conference.aboutConference}
            </p>
            
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex gap-4 mt-auto">
              <div className="mt-1">
                <span className="w-3 h-3 rounded-full bg-indigo-500 flex ring-4 ring-indigo-200"></span>
              </div>
              <div>
                <h4 className="font-bold text-indigo-900 mb-1">E-Certificate Notice</h4>
                <p className="text-xs text-indigo-700/70 leading-relaxed">
                  Thank you for participating in {conference.conferenceName}. Your personalized certificate is available for download above.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl shadow-xl p-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
            
            <h3 className="text-2xl font-black text-white tracking-widest mb-2 relative z-10">ICIRMD-2026</h3>
            <p className="text-indigo-300 font-semibold tracking-[0.2em] uppercase text-xs mb-10 relative z-10">International Conference</p>
            
            <div className="w-20 h-20 rounded-full border border-indigo-500/30 flex items-center justify-center mb-10 relative z-10">
              <MapPin size={28} className="text-blue-400" />
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-sm mb-8 relative z-10">
              <h4 className="text-white font-black text-xl uppercase tracking-wider mb-4">Call For Papers</h4>
              <a 
                href={conference.googleFormLink} 
                target="_blank" 
                rel="noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded text-sm font-bold tracking-wide transition-colors"
              >
                SUBMIT PAPER
              </a>
            </div>

            <p className="text-blue-400 font-black tracking-widest uppercase relative z-10">{conference.dates?.conferenceDate}</p>
          </div>
        </div>

        {/* 5. Contacts */}
        <div className="bg-slate-900 rounded-2xl p-6 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {conference.organizingCommittee?.slice(0,2).map((member, idx) => (
              <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800 transition-colors">
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-2">{member.role}</p>
                <h4 className="text-white font-bold mb-3">{member.name}</h4>
                <p className="text-sm text-gray-400 flex items-center gap-2"><Phone size={14} className="text-gray-500"/> +91 {member.mobile}</p>
              </div>
            ))}
            {/* Inquiry */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800 transition-colors">
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-2">Inquiry</p>
              <h4 className="text-white font-bold mb-3">{conference.contact?.name2 || "Support Team"}</h4>
              <p className="text-sm text-gray-400 flex items-center gap-2"><Phone size={14} className="text-gray-500"/> +91 {conference.contact?.phone2 || "---"}</p>
            </div>
          </div>
        </div>

        {/* 6. Keynote Speakers */}
        {conference.keynoteSpeakers?.length > 0 && (
          <div className="pt-8">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-4">
              <span className="w-12 h-0.5 bg-blue-600"></span> KEYNOTE SPEAKERS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {conference.keynoteSpeakers.map((speaker, idx) => (
                <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                  <div className="w-24 h-24 rounded-full bg-gray-100 mb-4 overflow-hidden border-4 border-white shadow-lg">
                    {speaker.image ? (
                      <img src={`http://localhost:5000${speaker.image}`} alt={speaker.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <User size={32} />
                      </div>
                    )}
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{speaker.name}</h4>
                  <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{speaker.designation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
