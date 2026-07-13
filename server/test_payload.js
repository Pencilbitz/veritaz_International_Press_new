
async function test() {
  try {
    const finalData = {
      conferenceCategory: 'ICGMRFT',
      conferenceName: 'Test Name',
      title: 'Test Title',
      date: '2026-05-10',
      type: 'Virtual Conference',
      topics: ['Topic 1'],
      highlights: ['Highlight 1'],
      keynoteSpeakers: [{ name: 'Test', designation: 'Test', image: null }],
      organizingCommittee: [{ role: 'Role', name: 'Name', mobile: '123', email: 'test@test.com' }],
      advisoryCommittee: [],
      globalExperts: [],
      certificateTracks: [],
      verificationDetails: {},
      uploads: {
        image: '/uploads/conferences/test.png'
      },
      dates: {
        abstractSubmission: '2026-05-01',
        fullPaperSubmission: '2026-05-05',
        conferenceDate: '2026-05-10'
      },
      fees: {
        academicians: '100',
        student: '50',
        researchScholars: '75',
        listener: '25'
      },
      publication: {
        journalName: 'Journal',
        journalLink: 'http://test.com'
      },
      contact: {
        name1: 'Name1', phone1: 'Phone1',
        name2: 'Name2', phone2: 'Phone2',
        email: 'test@test.com'
      }
    };

    // Use dynamic import for node-fetch since we don't have axios installed in server
    const res = await fetch('http://localhost:5000/api/conferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalData)
    });
    const text = await res.text();
    console.log(res.status, text);
  } catch(e) {
    console.error(e.message);
  }
}
test();
