import { 
  Calendar, 
  Download, 
  FileText, 
  Award,
  User,
  Users
} from "lucide-react";

export default function TemplateICETITMR({ conference }) {
  if (!conference) return null;

  const handleDownload = (url) => {
    if (url) window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="text-sm font-semibold tracking-wider text-blue-200">
            ISBN-978-934759757-2
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            {conference.title}
          </h1>
          <div className="pt-6">
            <span className="inline-block border border-blue-300 text-blue-100 rounded-full px-6 py-2 text-sm font-semibold tracking-wide">
              {conference.conferenceName}
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10 space-y-16">
        
        {/* 2. Conference Downloads */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Conference Downloads</h2>
          <p className="text-gray-500 mb-8">Access your official documents and research proceedings</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Proceedings Card */}
            <div className="border border-green-100 bg-green-50/50 rounded-xl p-6 flex items-start gap-6 hover:shadow-md transition-shadow">
              <div className="p-4 bg-green-100 text-green-600 rounded-xl">
                <FileText size={32} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Conference Proceedings</h3>
                <p className="text-sm text-gray-600 mb-4">Download the complete ICETITMR conference proceedings.</p>
                <button 
                  onClick={() => handleDownload(conference.conferenceProceeding)}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                  <Download size={16} /> Download
                </button>
              </div>
            </div>

            {/* Certificate Card */}
            <div className="border border-blue-100 bg-blue-50/50 rounded-xl p-6 flex items-start gap-6 hover:shadow-md transition-shadow">
              <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
                <Award size={32} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">E-Certificate</h3>
                <p className="text-sm text-gray-600 mb-4">Download your participation or presentation certificates.</p>
                <button 
                  onClick={() => handleDownload(conference.certificateTracks?.[0]?.file)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                  <Download size={16} /> Download
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center font-bold">i</span>
            Note: Files are updated periodically. Certificates available 15 days post conference.
          </div>
        </div>

        {/* 3. About & Dates Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">About Conference</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">
                {conference.aboutConference}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-4">Conference Key Focus Areas:</h3>
              <div className="flex flex-wrap gap-3">
                {conference.topics?.map((topic, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 text-blue-700 text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-2 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    {topic}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 text-blue-50 opacity-50">
                <Calendar size={80} />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2 relative z-10">
                <Calendar className="text-blue-600" /> Important Dates
              </h3>
              
              <div className="space-y-6 relative z-10">
                <div className="border-b border-gray-100 pb-4">
                  <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">Abstract Submission</p>
                  <p className="font-bold text-gray-900">{conference.dates?.abstractSubmission}</p>
                </div>
                <div className="border-b border-gray-100 pb-4">
                  <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">Full Paper Submission</p>
                  <p className="font-bold text-gray-900">{conference.dates?.fullPaperSubmission}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-blue-400 tracking-wider uppercase mb-1">Conference Date</p>
                  <p className="font-bold text-2xl text-blue-900">{conference.dates?.conferenceDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Organizing Committee */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-blue-900 inline-block relative">
              Organizing Committee
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-full"></div>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {conference.organizingCommittee?.slice(0,3).map((member, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
                  <User size={32} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-3">{member.role}</p>
                <p className="text-xs text-gray-500">Mobile: {member.mobile}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Advisory Committee */}
        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4">
            <Users size={300} />
          </div>
          <div className="text-center relative z-10 mb-12">
            <h2 className="text-2xl font-bold inline-block relative">
              Advisory Committee
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-400 rounded-full"></div>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 relative z-10">
            {conference.advisoryCommittee?.map((adv, idx) => (
              <div key={idx} className="flex flex-col border-l-2 border-blue-500/30 pl-4">
                <h4 className="font-bold text-sm mb-1">{adv.name}</h4>
                <p className="text-xs text-blue-200 italic mb-1">{adv.designation}</p>
                <p className="text-[10px] text-blue-100/70 font-semibold uppercase tracking-wider">{adv.institution}, {adv.location}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Registration Fees */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-end gap-2">
            Registration Fees <span className="text-xs text-blue-500 font-normal mb-1">(Per Paper)</span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Academicians</span>
                <span className="bg-blue-50 text-blue-700 font-bold px-4 py-1.5 rounded-lg text-sm">₹{conference.fees?.academicians}/-</span>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Research Scholars</span>
                <span className="bg-blue-50 text-blue-700 font-bold px-4 py-1.5 rounded-lg text-sm">₹{conference.fees?.researchScholars}/-</span>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Students</span>
                <span className="bg-blue-50 text-blue-700 font-bold px-4 py-1.5 rounded-lg text-sm">₹{conference.fees?.student}/-</span>
              </div>
            </div>

            <div className="bg-indigo-900 rounded-xl p-8 text-white shadow-lg">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-indigo-800 flex items-center justify-center">₹</span>
                Account Details
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-indigo-800 pb-2">
                  <span className="text-indigo-200">Name</span>
                  <span className="font-semibold">Dr. K. Baskar</span>
                </div>
                <div className="flex justify-between border-b border-indigo-800 pb-2">
                  <span className="text-indigo-200">Account No</span>
                  <span className="font-semibold">123456789012</span>
                </div>
                <div className="flex justify-between border-b border-indigo-800 pb-2">
                  <span className="text-indigo-200">IFSC Code</span>
                  <span className="font-semibold">SBIN0001234</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-indigo-200">Bank</span>
                  <span className="font-semibold">State Bank of India</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
