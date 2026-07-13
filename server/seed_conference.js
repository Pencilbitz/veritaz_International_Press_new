import db from './config/db.js';
import { createConference } from './models/conferenceModel.js';
import fs from 'fs';
import path from 'path';

// Since dummyData.js is not easily importable from server (ES module paths, React components inside etc),
// we will just recreate the object here based on what we saw in dummyData.js

const defaultConference = {
    conferenceCategory: 'ICEISET',
    conferenceName: 'ICEISET - 30 Apr 2026',
    title: 'International Conference on Emerging Innovations in Science, Engineering and Technology',
    date: '2026-04-30',
    type: 'Virtual Conference',
    googleFormLink: 'https://forms.gle/sample',
    topics: [
      'Artificial Intelligence, Machine Learning, and Data Science',
      'Emerging Technologies: IoT, Blockchain, Cybersecurity',
      'Advanced Engineering Systems and Smart Manufacturing'
    ],
    dates: {
      abstractSubmission: '2026-04-25',
      fullPaperSubmission: '2026-04-27',
      conferenceDate: '2026-04-30'
    },
    fees: {
      academicians: 800,
      student: 600,
      researchScholars: 700,
      listener: 500
    },
    publication: {
      journalName: 'International Journal of Engineering Applied Science and Management',
      journalLink: 'https://example.com/journal',
      additionalFee: 1500
    },
    submissionGuidelines: 'Authors are invited to submit original research papers.',
    aboutConference: 'The International Conference on Emerging Innovations...',
    image: null,
    conferenceProceeding: null,
    brochure: null,
    qrCode: null,
    certificateTracks: [
      { name: 'Track 01', file: null },
      { name: 'Track 02', file: null },
      { name: 'Track 03', file: null }
    ],
    verificationDetails: {
      status: 'Fully Released',
      validity1: 'Verified Document',
      validity2: 'March 2026 Edition'
    },
    keynoteSpeakers: [
      { name: 'Dr. Sailesh S. Iyer', designation: 'Professor and I/c Principal, NIIT-IPRCS, Ahmedabad', image: null }
    ],
    organizingCommittee: [
      { role: 'Convener', name: 'Mrs. Sangeetha Subramaniam', mobile: '7708826906', email: '' },
      { role: 'Co-Convener', name: 'Dr. Baskar Kandasamy', mobile: '9344810452', email: 'iceiset.26@gmail.com' },
      { role: 'Co-Convener', name: 'Swetha Pandiyan', mobile: '7708826906', email: '' }
    ],
    advisoryCommittee: [
      { name: 'Dr. Shailendra Daf', designation: 'CO-DEAN - MECHANICAL ENGG', institution: 'PRIYADARSHINI BHAGWATI COLLEGE', location: 'NAGPUR', image: null },
      { name: 'Prof (Dr) Manoj Kumar Katuat', designation: 'PRINCIPAL - PHARMACY', institution: 'FLORENCE COLLEGE', location: 'JHARKHAND', image: null }
    ],
    globalExperts: [
      { name: 'Prof. Dr. Priya Trivedi', designation: 'Principal | Botany', institution: 'Maa Narmada Mahavidyalaya Dhamnod', location: 'MADHYA PRADESH, INDIA', image: null },
      { name: 'Vishal Dahiya', designation: 'Director | Computer Science', institution: 'Sardar Vallabhbhai Global University', location: 'GUJARAT, INDIA', image: null },
      { name: 'Dr. S. Ranjana', designation: 'Assistant Professor | Data Science', institution: 'Anna Adarsh College for Women', location: 'TAMIL NADU, INDIA', image: null }
    ],
    highlights: [
      'E-Certificate for presentation',
      'Opportunity to present research work',
      'Publication / Proceedings consideration'
    ],
    contact: {
      name1: 'Dr. Baskar Kandasamy', phone1: '93448 10452',
      name2: 'Ms. C. Bharathi', phone2: '96009 21734',
      email: 'iceiset.26@gmail.com'
    }
  };

async function seed() {
  try {
    console.log('Seeding default conference...');
    const id = await createConference(defaultConference);
    console.log('Successfully added default conference with ID:', id);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
