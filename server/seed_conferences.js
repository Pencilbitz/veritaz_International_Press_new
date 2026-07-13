import db from './config/db.js';
import { createConference } from './models/conferenceModel.js';

const conferencesData = [
  {
    conferenceCategory: 'ICGMRFT',
    conferenceName: 'ICGMRFT - 31 March 2026',
    title: 'International Conference on Global Multidisciplinary Research and Future Technologies',
    date: '2026-03-31',
    type: 'Hybrid Conference',
    googleFormLink: 'https://forms.gle/sample2',
    topics: ['AI & Robotics', 'Sustainable Energy', 'Quantum Computing'],
    dates: { abstractSubmission: '2026-03-20', fullPaperSubmission: '2026-03-25', conferenceDate: '2026-03-31' },
    fees: { academicians: 900, student: 700, researchScholars: 800, listener: 600 },
    publication: { journalName: 'Global Tech Review', journalLink: '#', additionalFee: 1200 },
    submissionGuidelines: 'Please submit 6-page double-column IEEE format.',
    aboutConference: 'ICGMRFT focuses on global multidisciplinary advancements.',
    image: null, conferenceProceeding: null, brochure: null, qrCode: null,
    certificateTracks: [{ name: 'Track A', file: null }],
    verificationDetails: { status: 'Verified', validity1: 'Standard', validity2: '2026' },
    keynoteSpeakers: [{ name: 'Dr. John Doe', designation: 'Professor', image: null }],
    organizingCommittee: [{ role: 'Chair', name: 'Alice Smith', mobile: '1234567890', email: 'alice@test.com' }],
    advisoryCommittee: [],
    globalExperts: [],
    contact: { name1: 'Alice Smith', phone1: '1234567890', email: 'contact@icgmrft.com' }
  },
  {
    conferenceCategory: 'ICETITMR',
    conferenceName: 'ICETITMR - 28 February 2026',
    title: 'International Conference on Emerging Trends in IT and Multidisciplinary Research',
    date: '2026-02-28',
    type: 'Virtual Conference',
    googleFormLink: 'https://forms.gle/sample3',
    topics: ['Cybersecurity', 'Data Science', 'Cloud Computing'],
    dates: { abstractSubmission: '2026-02-15', fullPaperSubmission: '2026-02-20', conferenceDate: '2026-02-28' },
    fees: { academicians: 850, student: 650, researchScholars: 750, listener: 550 },
    publication: { journalName: 'IT Trends Journal', journalLink: '#', additionalFee: 1100 },
    submissionGuidelines: 'Standard IEEE format.',
    aboutConference: 'ICETITMR covers emerging IT trends.',
    image: null, conferenceProceeding: null, brochure: null, qrCode: null,
    certificateTracks: [],
    verificationDetails: { status: 'Active', validity1: 'Certified', validity2: '2026' },
    keynoteSpeakers: [], organizingCommittee: [], advisoryCommittee: [], globalExperts: [],
    contact: { name1: 'Bob Jones', phone1: '0987654321', email: 'contact@icetitmr.com' }
  },
  {
    conferenceCategory: 'ICIRMD',
    conferenceName: 'ICIRMD - 31 January 2026',
    title: 'International Conference on Innovative Research in Multidisciplinary Domains',
    date: '2026-01-31',
    type: 'Virtual Conference',
    googleFormLink: 'https://forms.gle/sample4',
    topics: ['Biotech', 'Nanotech', 'Material Science'],
    dates: { abstractSubmission: '2026-01-15', fullPaperSubmission: '2026-01-20', conferenceDate: '2026-01-31' },
    fees: { academicians: 800, student: 600, researchScholars: 700, listener: 500 },
    publication: { journalName: 'Research Innovations', journalLink: '#', additionalFee: 1000 },
    submissionGuidelines: 'Submit before deadline.',
    aboutConference: 'ICIRMD explores new domains.',
    image: null, conferenceProceeding: null, brochure: null, qrCode: null,
    certificateTracks: [], verificationDetails: {}, keynoteSpeakers: [], organizingCommittee: [], advisoryCommittee: [], globalExperts: [],
    contact: { email: 'info@icirmd.com' }
  },
  {
    conferenceCategory: 'ICMARD',
    conferenceName: 'ICMARD - 29 December 2025',
    title: 'International Conference on Multidisciplinary Academic Research & Development',
    date: '2025-12-29',
    type: 'Hybrid Conference',
    googleFormLink: 'https://forms.gle/sample5',
    topics: ['Social Sciences', 'Economics', 'Education'],
    dates: { abstractSubmission: '2025-12-10', fullPaperSubmission: '2025-12-15', conferenceDate: '2025-12-29' },
    fees: { academicians: 750, student: 550, researchScholars: 650, listener: 450 },
    publication: { journalName: 'Academic Development', journalLink: '#', additionalFee: 900 },
    submissionGuidelines: 'Review guidelines on website.',
    aboutConference: 'ICMARD bridges academic disciplines.',
    image: null, conferenceProceeding: null, brochure: null, qrCode: null,
    certificateTracks: [], verificationDetails: {}, keynoteSpeakers: [], organizingCommittee: [], advisoryCommittee: [], globalExperts: [],
    contact: { email: 'contact@icmard.com' }
  }
];

async function seed() {
  try {
    for (const conf of conferencesData) {
      const id = await createConference(conf);
      console.log(`Added ${conf.conferenceCategory} with ID ${id}`);
    }
    console.log('Successfully seeded 4 conferences!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
