import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import axios from 'axios';
import {
  MdSearch, MdDelete, MdCheckCircle, MdPendingActions, MdPending,
  MdAdd, MdEdit, MdEmail, MdPhone, MdClose, MdPerson
} from 'react-icons/md';
import { inquiriesData as initialData } from '../data/dummyData';
import UploadBox from '../components/UploadBox';
import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../json_data/firebase";
import { uploadImage } from "../json_data/cloudinary";

const TEAM_DOC_ID = "uMoNnFpI06K7JOX0HFfI";
const MeetOurTeam = () => {
  const [activeTab, setActiveTab] = useState('inquiries');

  // --- INQUIRIES STATE ---
  const [inquiries, setInquiries] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredInquiries = inquiries.filter((iq) => {
    const q = search.toLowerCase();
    const nameMatch = iq.name ? iq.name.toLowerCase().includes(q) : false;
    const emailMatch = iq.email ? iq.email.toLowerCase().includes(q) : false;
    const matchSearch = !search || nameMatch || emailMatch;
    const matchType = !filterType || iq.formType === filterType;
    const matchStatus = !filterStatus || iq.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const fetchInquiries = async () => {
    try {
      const q = query(collection(db, "inquiries"), orderBy("date", "desc"));

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setInquiries(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteInquiry = async (id) => {
    const result = await Swal.fire({
      title: "Delete Inquiry?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteDoc(doc(db, "inquiries", id));

      setInquiries(prev => prev.filter(item => item.id !== id));

      Swal.fire({
        title: "Deleted!",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to delete inquiry", "error");
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "inquiries", id), {
        status: newStatus
      });

      setInquiries(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, status: newStatus }
            : item
        )
      );
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  // --- TEAM CONTACTS STATE ---
  const [teamContacts, setTeamContacts] = useState([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({ id: null, name: '', designation: '', phone: '', email: '', photo: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);




  const fetchTeam = async () => {
    try {
      const snap = await getDoc(
        doc(db, "team_contacts", TEAM_DOC_ID)
      );

      if (snap.exists()) {
        setTeamContacts(snap.data().data || []);
      } else {
        setTeamContacts([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'contacts') {
      fetchTeam();
    } else if (activeTab === 'inquiries') {
      fetchInquiries();
    }
  }, [activeTab]);

  const handleAddContactClick = () => {
    setContactForm({ id: null, name: '', designation: '', phone: '', email: '', photo: '' });
    setPhotoFile(null);
    setPhotoPreview(null);
    setShowContactForm(true);
  };

  const handleEditContactClick = (contact) => {
    setContactForm({ ...contact });
    setPhotoFile(null);
    setPhotoPreview(contact.photo || null);
    setShowContactForm(true);
  };


  const handleDeleteContact = async (id) => {

    const result = await Swal.fire({
      title: "Delete Contact?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {

      const snap = await getDoc(
        doc(db, "team_contacts", TEAM_DOC_ID)
      );

      let contacts = [];

      if (snap.exists()) {
        contacts = [...(snap.data().data || [])];
      }

      contacts = contacts.filter(
        item => String(item.id) !== String(id)
      );

      await setDoc(
        doc(db, "team_contacts", TEAM_DOC_ID),
        {
          data: contacts
        },
        {
          merge: true
        }
      );

      await fetchTeam();

      Swal.fire({
        title: "Deleted!",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });

    } catch (err) {
      console.error(err);

      Swal.fire(
        "Error",
        "Failed to delete contact",
        "error"
      );
    }
  };


  const handleSaveContact = async () => {
    if (!contactForm.name) {
      Swal.fire("Error", "Name is required", "error");
      return;
    }

    if (saving) return;

    setSaving(true);
    

    try {
      let photo = contactForm.photo;

      if (photoFile) {
        photo = await uploadImage(photoFile);
      }

      const snap = await getDoc(
        doc(db, "team_contacts", TEAM_DOC_ID)
      );

      let contacts = [];

      if (snap.exists()) {
        contacts = [...(snap.data().data || [])];
      }

      let maxId = contacts.reduce(
        (max, item) => Math.max(max, Number(item.id) || 0),
        0
      );

      if (contactForm.id) {

        const index = contacts.findIndex(
          c => String(c.id) === String(contactForm.id)
        );

        if (index !== -1) {
          contacts[index] = {
            ...contacts[index],
            name: contactForm.name,
            designation: contactForm.designation,
            phone: contactForm.phone,
            email: contactForm.email,
            photo
          };
        }

      } else {

        contacts.push({
          id: String(maxId + 1),
          created_at: new Date().toISOString(),
          name: contactForm.name,
          designation: contactForm.designation,
          phone: contactForm.phone,
          email: contactForm.email,
          photo
        });

      }

      await setDoc(
        doc(db, "team_contacts", TEAM_DOC_ID),
        {
          data: contacts
        },
        {
          merge: true
        }
      );

      Swal.fire({
        title: contactForm.id ? "Updated!" : "Added!",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });

      await fetchTeam();
      setShowContactForm(false);

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to save contact", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Tabs */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl font-bold text-brand-dark">Contact Management</h1>
          <p className="text-sm text-brand-gray">Manage inquiries and team contact profiles</p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-brand-border gap-6">
          {['inquiries', 'contacts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold transition-all relative ${activeTab === tab ? 'text-blue-600' : 'text-brand-gray hover:text-brand-dark'
                }`}
            >
              {tab === 'inquiries' ? 'User Inquiries' : 'Team Contacts'}
              {activeTab === tab && (
                <motion.div layoutId="contactTabs" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'inquiries' && (
          <motion.div
            key="inquiries"
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
            className="space-y-5"
          >
            {/* Filters */}
            <div className="card p-4">
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2 bg-brand-bg border border-brand-border rounded-xl px-3 py-2 flex-1 min-w-[200px] focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <MdSearch className="text-brand-gray text-lg flex-shrink-0" />
                  <input
                    type="text" value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="bg-transparent text-sm outline-none flex-1 text-brand-dark placeholder-brand-gray/60"
                  />
                </div>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="input-field w-auto">
                  <option value="">All Form Types</option>
                  <option>Publish Your Book</option>
                  <option>Get In Touch</option>
                </select>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field w-auto">
                  <option value="">All Statuses</option>
                  <option>Pending</option>
                  <option>Reviewed</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-brand-border">
                    <tr>
                      <th className="table-th text-left px-4 py-3 text-xs font-semibold text-gray-500 tracking-wider">Date</th>
                      <th className="table-th text-left px-4 py-3 text-xs font-semibold text-gray-500 tracking-wider">User Info</th>
                      <th className="table-th text-left px-4 py-3 text-xs font-semibold text-gray-500 tracking-wider">Form Type</th>
                      <th className="table-th text-left px-4 py-3 text-xs font-semibold text-gray-500 tracking-wider">Message</th>
                      <th className="table-th text-center px-4 py-3 text-xs font-semibold text-gray-500 tracking-wider">Status</th>
                      <th className="table-th text-right px-4 py-3 text-xs font-semibold text-gray-500 tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInquiries.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-16 text-center text-brand-gray font-medium">No inquiries found</td>
                      </tr>
                    ) : (
                      filteredInquiries.map((iq) => (
                        <tr key={iq.id} className="table-tr hover:bg-gray-50 border-b border-gray-100 last:border-none">
                          <td className="table-td text-xs text-brand-gray whitespace-nowrap px-4 py-3">{iq.date}</td>
                          <td className="table-td px-4 py-3">
                            <p className="font-semibold text-brand-dark text-sm">{iq.name}</p>
                            <p className="text-xs text-brand-gray">{iq.email}</p>
                            <p className="text-xs text-brand-gray">{iq.phone}</p>
                          </td>
                          <td className="table-td px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${iq.formType === 'Publish Your Book' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-800'}`}>
                              {iq.formType}
                            </span>
                          </td>
                          <td className="table-td px-4 py-3">
                            <p className="text-xs text-brand-gray max-w-xs truncate" title={iq.message}>{iq.message}</p>
                          </td>
                          <td className="table-td text-center px-4 py-3">
                            {iq.status === 'Resolved' ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                <MdCheckCircle className="mr-1" /> Resolved
                              </span>
                            ) : iq.status === 'In Progress' ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                <MdPendingActions className="mr-1" /> In Progress
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">
                                <MdPending className="mr-1" /> Pending
                              </span>
                            )}
                          </td>
                          <td className="table-td text-right px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              {iq.status === 'Pending' && (
                                <button
                                  onClick={() => handleUpdateStatus(iq.id, 'Reviewed')}
                                  className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                >
                                  <MdCheckCircle /> Mark Reviewed
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteInquiry(iq.id)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                title="Delete"
                              >
                                <MdDelete className="text-sm" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'contacts' && (
          <motion.div
            key="contacts"
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
            className="space-y-5"
          >
            {showContactForm ? (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-brand-dark">{contactForm.id ? 'Edit Contact' : 'Add New Contact'}</h2>
                  <button onClick={() => setShowContactForm(false)} className="text-brand-gray hover:text-red-500">
                    <MdClose size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <UploadBox
                      label="Contact Photo"
                      value={photoPreview}
                      onChange={(file, preview) => {
                        setPhotoFile(file);
                        setPhotoPreview(preview);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-1">Name <span className="text-red-500">*</span></label>
                    <input
                      type="text" className="input-field w-full" placeholder="e.g. Shahin"
                      value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-1">Designation</label>
                    <input
                      type="text" className="input-field w-full" placeholder="e.g. BD MANAGER - PATENT"
                      value={contactForm.designation} onChange={(e) => setContactForm({ ...contactForm, designation: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-1">Phone Number</label>
                    <input
                      type="text" className="input-field w-full" placeholder="e.g. +91 9003025706"
                      value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-1">Email <span className="text-red-500">*</span></label>
                    <input
                      type="email" className="input-field w-full" placeholder="e.g. patent.bbinternational@gmail.com"
                      value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setShowContactForm(false)} className="btn-outline">Cancel</button>
                  <button
                    onClick={handleSaveContact}
                    disabled={saving}
                    className="btn-primary disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Contact"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-end">
                  <button onClick={handleAddContactClick} className="btn-primary text-sm flex items-center gap-1">
                    <MdAdd /> Add Contact
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {teamContacts.map((contact) => (
                    <div key={contact.id} className="card overflow-hidden group">
                      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                        {contact.photo ? (
                          <img src={contact.photo} alt={contact.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-200">
                            <MdPerson size={64} />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEditContactClick(contact)} className="w-8 h-8 rounded-lg bg-white/90 text-blue-600 shadow-sm flex items-center justify-center hover:bg-blue-50 transition-colors">
                            <MdEdit size={16} />
                          </button>
                          <button onClick={() => handleDeleteContact(contact.id)} className="w-8 h-8 rounded-lg bg-white/90 text-red-500 shadow-sm flex items-center justify-center hover:bg-red-50 transition-colors">
                            <MdDelete size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="font-bold text-brand-dark text-lg">{contact.name}</h3>
                        <p className="text-xs font-semibold text-blue-600 tracking-wide uppercase mt-1 mb-3">{contact.designation}</p>

                        <div className="space-y-2 text-sm text-brand-gray bg-gray-50 rounded-xl p-3">
                          <div className="flex items-center justify-center gap-2">
                            <MdPhone className="text-teal-600 flex-shrink-0" />
                            <span className="truncate">{contact.phone || 'N/A'}</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <MdEmail className="text-teal-600 flex-shrink-0" />
                            <span className="truncate" title={contact.email}>{contact.email || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {teamContacts.length === 0 && (
                    <div className="col-span-full py-16 text-center text-brand-gray font-medium card">
                      No team contacts found. Click "Add Contact" to create one.
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MeetOurTeam;