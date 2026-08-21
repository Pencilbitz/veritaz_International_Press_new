import { 
  Calendar, 
  Globe, 
  Download, 
  FileText, 
  CheckCircle,
  Award,
  Link as LinkIcon,
  MapPin,
  Phone
} from "lucide-react";

export default function TemplateICGMRFT({ conference }) {
  if (!conference || conference.message) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-3xl font-bold text-red-500">Conference Not Found</h2>
      </div>
    );
  }
  const handleDownload = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 1. Header Section */}
      <section className="bg-blue-800 text-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="inline-block bg-yellow-500 text-blue-900 font-bold px-4 py-1 rounded-full text-xs mb-4 uppercase tracking-wider">
            {conference.type} {conference.date ? new Date(conference.date).getFullYear() : ""}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-2 leading-tight">
            {conference.title}
          </h1>
          <h3 className="text-xl font-semibold mb-6 opacity-90">
            ({conference.conferenceName})
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <Calendar size={18} className="text-yellow-400" />
              <span className="text-sm font-medium">{conference.date ? new Date(conference.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : "TBA"}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <Globe size={18} className="text-yellow-400" />
              <span className="text-sm font-medium">{conference.type}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        
        {/* 2. About & Poster Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div>
              <p className="text-blue-600 font-bold text-sm tracking-wider uppercase mb-1">Event: {conference.date ? new Date(conference.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : "TBA"}</p>
              <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-blue-600 pl-3">About the Conference</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {conference.aboutConference}
            </p>
            
            <div className="flex flex-wrap gap-4">
              {conference.dates?.abstractSubmission && (
                <div className="bg-white border shadow-sm p-4 rounded-xl flex-1 min-w-[200px]">
                  <h4 className="font-bold text-xl text-gray-900">{new Date(conference.dates.abstractSubmission).toLocaleDateString('en-GB')}</h4>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">Abstract Deadline</p>
                </div>
              )}
              {conference.dates?.fullPaperSubmission && (
                <div className="bg-white border shadow-sm p-4 rounded-xl flex-1 min-w-[200px]">
                  <h4 className="font-bold text-xl text-gray-900">{new Date(conference.dates.fullPaperSubmission).toLocaleDateString('en-GB')}</h4>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">Full Paper Submission</p>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <a href={conference.googleFormLink || "#"} target="_blank" rel="noreferrer" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition">
                Register Now
              </a>
              {conference.brochure && (
                <button onClick={() => handleDownload(conference.brochure)} className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center gap-2">
                  <Download size={18} /> Download Brochure
                </button>
              )}
            </div>
          </div>
          
          <div className="flex justify-center">
            {conference.image ? (
              <img src={conference.image} alt="Conference Poster" className="rounded-xl shadow-xl w-full max-w-md object-cover border-4 border-white" />
            ) : (
              <div className="w-full max-w-md h-96 bg-gray-200 rounded-xl shadow flex items-center justify-center text-gray-400">
                No Poster Available
              </div>
            )}
          </div>
        </div>

        {/* 3. Conference Downloads (Proceeding) */}
        {conference.conferenceProceeding && (
          <div className="bg-white rounded-2xl shadow-sm border p-8 max-w-3xl mx-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-l-4 border-blue-600 pl-3 flex justify-between items-center">
              <span>CONFERENCE DOWNLOADS</span>
              <span className="text-xs font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Format: Digital PDF</span>
            </h3>
            <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center mx-auto mb-4 text-green-500">
                <FileText size={24} />
              </div>
              <h4 className="font-bold text-green-800 mb-4">CONFERENCE PROCEEDINGS</h4>
              <button onClick={() => handleDownload(conference.conferenceProceeding)} className="bg-blue-400 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-500 transition inline-flex items-center gap-2 text-sm">
                <Download size={16} /> Download
              </button>
            </div>
          </div>
        )}

        {/* 4. Certificate Downloads */}
        {conference.certificateTracks && conference.certificateTracks.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border p-8 max-w-4xl mx-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-l-4 border-orange-500 pl-3 flex justify-between items-center">
              <span>DOWNLOAD CERTIFICATES</span>
              <span className="text-xs font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Format: Digital PDF</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {conference.certificateTracks.map((track, i) => (
                <div key={i} className="border border-gray-100 bg-gray-50 rounded-xl p-5 text-center flex flex-col items-center justify-between h-full">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg text-orange-500 flex items-center justify-center mb-4">
                    <Award size={20} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{track.name}</h4>
                  <p className="text-xs text-gray-500 mb-4 uppercase tracking-wider">Conference Track</p>
                  <button onClick={() => handleDownload(track.file)} disabled={!track.file} className="border border-gray-200 bg-white text-gray-700 px-4 py-2 w-full rounded-lg font-medium hover:bg-gray-50 transition flex justify-center items-center gap-2 text-sm disabled:opacity-50">
                    <Download size={16} /> Download
                  </button>
                </div>
              ))}
            </div>

            {/* Verification Details */}
            {conference.verificationDetails && (
              <div className="mt-8 pt-6 border-t">
                <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-4">
                  <CheckCircle size={18} className="text-blue-500" /> Verification Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 border rounded-lg p-3">
                    <span className="block text-xs text-gray-500 uppercase font-semibold">Status</span>
                    <span className="text-green-600 font-medium text-sm flex items-center gap-1 mt-1">
                      <CheckCircle size={14} /> {conference.verificationDetails.status}
                    </span>
                  </div>
                  <div className="bg-gray-50 border rounded-lg p-3">
                    <span className="block text-xs text-gray-500 uppercase font-semibold">Validity</span>
                    <span className="text-purple-600 font-medium text-sm mt-1 block">
                      {conference.verificationDetails.validity1}
                    </span>
                  </div>
                  <div className="bg-gray-50 border rounded-lg p-3">
                    <span className="block text-xs text-gray-500 uppercase font-semibold">Validity</span>
                    <span className="text-blue-600 font-medium text-sm mt-1 block">
                      {conference.verificationDetails.validity2}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. Topics Section */}
        {conference.topics && conference.topics.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-8 border-l-4 border-blue-600 pl-3">
              Conference Topics & Tracks
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {conference.topics.map((topic, i) => (
                <div key={i} className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-4 rounded-xl hover:shadow-md transition">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                    <FileText size={18} />
                  </div>
                  <p className="font-medium text-sm text-gray-800">{topic}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Fees and Registration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-3 h-5 bg-yellow-500 rounded-sm"></span> Registration Fees (Per Paper)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left pb-3 text-gray-500 font-semibold uppercase text-xs tracking-wider">Category</th>
                    <th className="text-right pb-3 text-gray-500 font-semibold uppercase text-xs tracking-wider">Fee (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {conference.fees && Object.entries(conference.fees).map(([cat, fee], idx) => (
                    <tr key={idx}>
                      <td className="py-4 font-medium text-gray-800 capitalize">{cat.replace(/([A-Z])/g, ' $1')}</td>
                      <td className="py-4 text-right font-bold text-blue-700">₹ {fee}/-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-blue-900 rounded-2xl shadow-sm p-8 text-white flex flex-col items-center justify-center">
            <h3 className="text-xl font-bold mb-6">Register Now</h3>
            {conference.qrCode && (
              <div className="bg-white p-2 rounded-xl mb-6">
                <img src={conference.qrCode} alt="QR Code" className="w-32 h-32 object-contain rounded-lg" />
              </div>
            )}
            <a href={conference.googleFormLink || "#"} target="_blank" rel="noreferrer" className="bg-yellow-500 text-blue-900 font-bold px-8 py-3 rounded-full hover:bg-yellow-400 transition shadow-lg w-full max-w-xs text-center">
              Link to Register
            </a>
          </div>
        </div>

        {/* 7. Committees and Experts */}
        <div className="space-y-8">
          {/* Dark block: Conveners and Advisory */}
          <div className="bg-slate-900 rounded-2xl p-8 text-white grid grid-cols-1 md:grid-cols-2 gap-8 border-t-4 border-yellow-500">
            <div>
              <h3 className="text-yellow-500 font-bold mb-6">Conference Conveners</h3>
              <div className="space-y-4">
                {conference.organizingCommittee && conference.organizingCommittee.map((c, i) => (
                  <div key={i} className="mb-4">
                    <p className="font-bold text-sm">{c.name}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-2 mt-1">
                      <Phone size={12} /> {c.mobile}
                    </p>
                  </div>
                ))}
                {conference.contact?.email && (
                  <p className="text-blue-400 text-sm flex items-center gap-2 mt-4 bg-white/10 p-2 rounded inline-flex">
                    <LinkIcon size={14} /> {conference.contact.email}
                  </p>
                )}
              </div>
            </div>
            <div className="md:border-l md:border-gray-700 md:pl-8">
              <h3 className="text-yellow-500 font-bold mb-6">Advisory Committee</h3>
              <div className="space-y-4">
                {conference.advisoryCommittee && conference.advisoryCommittee.map((c, i) => (
                  <div key={i}>
                    <p className="font-bold text-sm">{c.name}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-wide my-1">{c.designation}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={10}/> {c.location}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Global Experts Grid */}
          {conference.globalExperts && conference.globalExperts.length > 0 && (
            <div className="pt-8 text-center">
              <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-2">Advisory Committee</p>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-10">Meet Our Global Experts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                {conference.globalExperts.map((exp, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{exp.name}</h4>
                      <p className="text-xs font-semibold text-blue-600 mb-3">{exp.designation}</p>
                      <div className="flex items-start gap-2 text-gray-500 text-xs mb-2">
                        <MapPin size={14} className="flex-shrink-0 mt-0.5" />
                        <span>{exp.institution}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mt-3 pt-3 border-t">
                      <Globe size={12} />
                      <span className="uppercase tracking-wider font-medium">{exp.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}