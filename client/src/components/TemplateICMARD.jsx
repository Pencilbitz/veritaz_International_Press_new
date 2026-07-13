import { 
  Download, 
  Mail, 
  MessageCircle,
  FileText,
  Award,
  HeartPulse,
  Cpu,
  Leaf,
  Lightbulb
} from "lucide-react";

export default function TemplateICMARD({ conference }) {
  if (!conference) return null;

  const handleDownload = (url) => {
    if (url) window.open(url, "_blank");
  };

  const getIconForTopic = (idx) => {
    const icons = [HeartPulse, Cpu, Leaf, Lightbulb];
    const Icon = icons[idx % icons.length];
    const colors = ["text-blue-500", "text-green-500", "text-orange-500", "text-purple-500"];
    const bgColors = ["bg-blue-50", "bg-green-50", "bg-orange-50", "bg-purple-50"];
    return { Icon, color: colors[idx % colors.length], bg: bgColors[idx % bgColors.length] };
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-20 px-4 flex flex-col items-center text-center">
        <div className="max-w-4xl space-y-6 flex flex-col items-center">
          <span className="inline-block bg-orange-600 text-white px-6 py-1.5 rounded-full text-xs font-bold tracking-widest shadow-md">
            OFFICIAL PROCEEDINGS | ISBN: 978-93-47597-52-7
          </span>
          <h1 className="text-3xl md:text-5xl font-black uppercase leading-tight tracking-wide drop-shadow-lg">
            {conference.title}
          </h1>
          <p className="text-lg font-bold text-blue-200">
            Call for Full Paper Publication - {conference.conferenceName}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        
        {/* 2. Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column (Summary & Downloads) */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-blue-900 flex items-center gap-3 border-l-4 border-orange-500 pl-4 mb-6">
              CONFERENCE SUMMARY
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              {conference.aboutConference}
            </p>

            <div className="border border-gray-200 rounded-xl p-6 relative overflow-hidden">
              <h3 className="text-lg font-bold text-blue-900 border-l-4 border-orange-500 pl-4 mb-4">
                FULL PAPER SUBMISSION & DOWNLOAD
              </h3>
              <p className="text-xs text-gray-600 font-semibold mb-6">
                Accepted papers will be published in the official proceedings with <span className="font-bold text-gray-900">ISBN: 978-93-47597-52-7</span> and indexed in Google Scholar.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-orange-50/50 border border-orange-100 rounded-lg p-5 text-center flex flex-col items-center hover:bg-orange-50 transition-colors">
                  <FileText className="text-red-500 mb-2" size={28} />
                  <h4 className="font-bold text-sm text-gray-900 mb-1">Full Proceedings</h4>
                  <p className="text-[10px] text-gray-500 mb-4 px-4">ICMARD-25 ISBN 978-93-47597-52-7</p>
                  <button 
                    onClick={() => handleDownload(conference.conferenceProceeding)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded flex items-center justify-center gap-2"
                  >
                    <Download size={14} /> Download
                  </button>
                </div>

                <div className="bg-orange-50/50 border border-orange-100 rounded-lg p-5 text-center flex flex-col items-center hover:bg-orange-50 transition-colors">
                  <Award className="text-orange-500 mb-2" size={28} />
                  <h4 className="font-bold text-sm text-gray-900 mb-1">E-Certificate</h4>
                  <p className="text-[10px] text-gray-500 mb-4 px-4">Download personalized certificate</p>
                  <button 
                    onClick={() => handleDownload(conference.certificateTracks?.[0]?.file)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 rounded flex items-center justify-center gap-2"
                  >
                    <Download size={14} /> Get Certificate
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-lg p-6 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10">
                  <FileText size={120} className="translate-x-1/4 translate-y-1/4" />
                </div>
                <h4 className="font-bold text-lg mb-2 relative z-10">How to Submit:</h4>
                <p className="text-xs text-gray-400 mb-6 relative z-10">
                  Send your full-length research paper directly to our editorial team via email or WhatsApp for quick review.
                </p>
                <div className="flex gap-4 relative z-10">
                  <a href={`mailto:${conference.contact?.email}`} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded text-xs font-bold transition-colors">
                    Email Paper
                  </a>
                  <a href={`https://wa.me/91${conference.contact?.phone1?.replace(/\\s/g, '')}`} target="_blank" rel="noreferrer" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-xs font-bold transition-colors">
                    WhatsApp Now
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Deadlines & Fees) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Deadlines */}
            <div className="bg-slate-900 rounded-xl shadow-lg p-6 text-white border-b-8 border-indigo-700">
              <h3 className="font-bold text-lg mb-6 tracking-widest">DEADLINES</h3>
              <div className="space-y-4 text-xs font-bold">
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-gray-300">Abstract Due</span>
                  <span className="text-blue-300">{conference.dates?.abstractSubmission}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-gray-300">Full Paper Due</span>
                  <span className="text-orange-400">{conference.dates?.fullPaperSubmission}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-gray-300">Conference</span>
                  <span className="text-white">{conference.dates?.conferenceDate}</span>
                </div>
              </div>
            </div>

            {/* Fees */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-sm text-blue-900 tracking-wider text-center mb-6">REGISTRATION FEE</h3>
              <div className="space-y-4 text-xs font-bold text-gray-600 mb-8">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span>Academicians</span>
                  <span className="text-gray-900">{conference.fees?.academicians}/-</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span>Scholars</span>
                  <span className="text-gray-900">{conference.fees?.researchScholars}/-</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span>Students</span>
                  <span className="text-gray-900">{conference.fees?.student}/-</span>
                </div>
              </div>

              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
                <h4 className="text-[10px] font-bold text-blue-800 uppercase tracking-widest mb-2">Payment Info</h4>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Bank Name: State Bank of India<br/>
                  A/C: 1234567890<br/>
                  IFSC: SBIN0001234<br/>
                  Branch: Coimbatore Branch
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Topics */}
        {conference.topics?.length > 0 && (
          <div className="pt-8">
            <h2 className="text-xl font-bold text-blue-900 text-center uppercase tracking-wide mb-8">
              CALL FOR PAPERS: MULTIDISCIPLINARY TRACKS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {conference.topics.map((topic, idx) => {
                const { Icon, color, bg } = getIconForTopic(idx);
                return (
                  <div key={idx} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                    <div className={`p-3 rounded-lg ${bg} ${color}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">{topic.split(',')[0]}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{topic}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. Pre-Footer Contacts */}
      <div className="bg-[#2D3748] text-white py-12 px-4 border-b border-gray-600">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2">CONVENER</h4>
            <p className="font-bold text-sm mb-1">{conference.organizingCommittee?.[0]?.name || "Mrs. Sangeetha Subramaniam"}</p>
            <p className="text-xs text-gray-400">Mobile: {conference.organizingCommittee?.[0]?.mobile || "9900000000"}</p>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2">PAPER SUBMISSION</h4>
            <p className="font-bold text-sm mb-1">{conference.organizingCommittee?.[1]?.name || "Dr. Baskar Kandasamy"}</p>
            <p className="text-xs text-gray-400">Mobile: {conference.organizingCommittee?.[1]?.mobile || "9900000000"}</p>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2">CONTACT INFO</h4>
            <p className="font-bold text-sm mb-1">{conference.contact?.name2 || "Ms. C. Bharathi"}</p>
            <p className="text-xs text-gray-400 mb-2">Mobile: {conference.contact?.phone2 || "9900000000"}</p>
            <p className="text-xs text-gray-400">{conference.contact?.email || "info@veritaz.com"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
