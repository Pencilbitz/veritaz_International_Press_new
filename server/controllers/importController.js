import * as bookModel from '../models/bookModel.js';
import * as conferenceModel from '../models/conferenceModel.js';
import * as eventModel from '../models/eventModel.js';
import * as testimonialModel from '../models/testimonialModel.js';
import fs from 'fs';

const filterFields = (item, validFields) => {
  const result = {};
  for (const key of validFields) {
    if (item[key] !== undefined) {
      if (typeof item[key] === 'object' && item[key] !== null) {
        result[key] = JSON.stringify(item[key]);
      } else {
        result[key] = item[key];
      }
    }
  }
  return result;
};

export const importData = async (req, res) => {
  try {
    const data = req.body;
    let summary = {
      books: { success: 0, failed: 0 },
      conferences: { success: 0, failed: 0 },
      events: { success: 0, failed: 0 },
      testimonials: { success: 0, failed: 0 }
    };

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ message: 'No data provided for import.' });
    }

    const validBookFields = [
      'title', 'authors', 'isbn', 'copyright', 'price', 'subPrice', 'mrp',
      'status', 'publisher', 'edition', 'language', 'binding', 'pages',
      'dimensions', 'weight', 'about', 'format', 'ratings', 'cover1',
      'cover2', 'image3d', 'page1', 'page2', 'category'
    ];

    const validEventFields = [
      'collegeName', 'topic', 'date', 'time', 'status', 'location',
      'contact1', 'contact2', 'registrationLink', 'registerButtonText', 'poster'
    ];

    const validConferenceFields = [
      'conferenceCategory', 'conferencename', 'conferencetitle', 'isbn',
      'type', 'about', 'dates', 'conferencestatus', 'conferencesecurity',
      'conferencevalidity', 'registerlink', 'poster', 'brochuredownload',
      'proceedingsdownload', 'listenerparticipation', 'certificatesdownload',
      'topics', 'fees', 'bankdetails', 'speakers', 'organizingcommittee',
      'advisorycommittee', 'globalexperts', 'contact'
    ];

    // ── NORMALIZATION LOGIC FOR DIVERSE JSON LAYOUTS ───────────────────
    let targetBooks = [];
    let targetConferences = [];
    let targetEvents = [];
    let targetTestimonials = [];

    if (Array.isArray(data)) {
      // Naked array file layout context fallback
      // Attempt to identify the structure from the first object properties
      const firstItem = data[0] || {};
      if (firstItem.conferencename || firstItem.conferencetitle || firstItem.type) {
        targetConferences = data;
      } else if (firstItem.authors || firstItem.mrp || firstItem.binding) {
        targetBooks = data;
      } else if (firstItem.collegeName || firstItem.topic || firstItem.registrationLink) {
        targetEvents = data;
      } else if (firstItem.comment || firstItem.rating || firstItem.bookName) {
        targetTestimonials = data;
      }
    } else {
      // Handle explicit wrapped structure keys or fallback standalone single records at the root

      // Conferences Routing
      if (data.conferences && Array.isArray(data.conferences)) {
        targetConferences = data.conferences;
      } else if (data.conferencename || data.conferencetitle || data.type) {
        targetConferences = [data];
      }

      // Books Routing
      if (data.books && Array.isArray(data.books)) {
        targetBooks = data.books;
      } else if (data.authors || data.mrp || data.binding) {
        targetBooks = [data];
      }

      // Events Routing
      if (data.events && Array.isArray(data.events)) {
        targetEvents = data.events;
      } else if (data.collegeName || data.topic || data.registrationLink || data.college) {
        targetEvents = [data];
      }

      // Testimonials Routing
      if (data.testimonials && Array.isArray(data.testimonials)) {
        targetTestimonials = data.testimonials;
      } else if (data.comment || data.rating || data.bookName) {
        targetTestimonials = [data];
      }
    }

    // ── PROCESS BOOKS ────────────────────────────────────────────────
    if (targetBooks.length > 0) {
      for (const item of targetBooks) {
        try {
          const mappedItem = filterFields(item, validBookFields);
          if (Object.keys(mappedItem).length > 0) {
            await bookModel.createBook(mappedItem);
            summary.books.success++;
          } else {
            summary.books.failed++;
          }
        } catch (error) {
          console.error('Error importing book:', error);
          summary.books.failed++;
        }
      }
    }

    // ── PROCESS CONFERENCES ──────────────────────────────────────────
    if (targetConferences.length > 0) {
      for (const item of targetConferences) {
        try {
          let rawCertificates = item.certificatesdownload || item.certificateTracks || null;

          if (rawCertificates && typeof rawCertificates === 'string') {
            const trimmed = rawCertificates.trim();
            if (!(trimmed.startsWith('[') || trimmed.startsWith('{'))) {
              rawCertificates = JSON.stringify([{ name: 'Track 01', file: trimmed }]);
            }
          }

          const normalizedItem = {
            ...item,
            conferencename: item.conferencename || item.conferenceName || "Unnamed Conference",
            conferencetitle: item.conferencetitle || item.title || "Untitled Conference Title",
            about: item.about || item.aboutConference || null,
            poster: item.poster || item.image || null,
            brochuredownload: item.brochuredownload || item.brochure || null,
            proceedingsdownload: item.proceedingsdownload || item.conferenceProceeding || null,
            certificatesdownload: rawCertificates,
            organizingcommittee: item.organizingcommittee || item.organizingCommittee || null,
            advisorycommittee: item.advisorycommittee || item.advisoryCommittee || null,
            globalexperts: item.globalexperts || item.globalExperts || null
          };

          const filtered = filterFields(normalizedItem, validConferenceFields);
          await conferenceModel.createConference(filtered);
          summary.conferences.success++;
        } catch (error) {
          console.error('Error importing conference:', error);
          fs.appendFileSync('import_debug.log', `Conference Import Error: ${error.message}\nItem: ${JSON.stringify(item)}\n\n`);
          summary.conferences.failed++;
        }
      }
    }

    // ── PROCESS EVENTS ───────────────────────────────────────────────
    if (targetEvents.length > 0) {
      for (const item of targetEvents) {
        try {
          if (item.title && !item.topic) item.topic = item.title;
          if (item.eventTitle && !item.topic) item.topic = item.eventTitle;
          if (item.college && !item.collegeName) item.collegeName = item.college;
          if (item.speakerContact && !item.contact1) item.contact1 = item.speakerContact;
          if (item.whatsappNumber && !item.contact2) item.contact2 = item.whatsappNumber;
          if (item.image && !item.poster) item.poster = item.image;
          if (item.registerLink && !item.registrationLink) item.registrationLink = item.registerLink;

          const mappedItem = filterFields(item, validEventFields);

          if (Object.keys(mappedItem).length > 0) {
            if (!mappedItem.topic) mappedItem.topic = "Untitled Event";
            if (!mappedItem.registerButtonText) mappedItem.registerButtonText = "Register Now";

            await eventModel.createEvent(mappedItem);
            summary.events.success++;
          } else {
            summary.events.failed++;
          }
        } catch (error) {
          console.error('Error importing event:', error);
          fs.appendFileSync('import_debug.log', `Event Import Error: ${error.message}\nItem: ${JSON.stringify(item)}\n\n`);
          summary.events.failed++;
        }
      }
    }

    // ── PROCESS TESTIMONIALS ─────────────────────────────────────────
    if (targetTestimonials.length > 0) {
      for (const item of targetTestimonials) {
        try {
          const mappedItem = {
            name: item.name || 'Unknown',
            designation: item.designation || null,
            rating: item.rating !== undefined ? item.rating : 5,
            avatar_url: item.avatar_url || null,
            is_video_testimonial: !!item.is_video_testimonial, // Ensures a strict boolean value
            video_url: item.video_url || null,
            content: item.content || ''
          };

          await testimonialModel.createTestimonial(mappedItem);
          summary.testimonials.success++;
        } catch (error) {
          console.error('Error importing testimonial:', error);
          summary.testimonials.failed++;
        }
      }
    }

    res.status(200).json({
      message: 'Import process completed.',
      summary
    });
  } catch (error) {
    console.error('Error in importData controller:', error);
    res.status(500).json({ error: 'Server error during import.' });
  }
};