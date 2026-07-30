import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { MdArrowBack, MdSave, MdAdd, MdRemoveCircle } from 'react-icons/md';
import UploadBox from '../components/UploadBox';
import axios from 'axios';

import {
  collection,
  addDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../json_data/firebase"; // your firebase config
import { uploadImage } from "../json_data/cloudinary";

const AddConference = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // ── Dynamic Array States ──────────────────────────────────────────
  const [topics, setTopics] = useState(['']);

  // ── Complex Array States ──────────────────────────────────────────
  const [speakers, setSpeakers] = useState([{ name: '', designation: '', image: null }]);
  const [organizingCommittee, setOrganizingCommittee] = useState([{ role: '', name: '', mobile: '', email: '' }]);
  const [advisoryCommittee, setAdvisoryCommittee] = useState([{ name: '', designation: '', institution: '', location: '', image: null }]);
  const [globalExperts, setGlobalExperts] = useState([{ name: '', designation: '', institution: '', location: '', image: null }]);

  // ── Certificates Download ─────────────────────────────────────────
  const [certificatesDownload, setCertificatesDownload] = useState([{ name: 'Track 01', file: null }]);

  // ── Bank Details ──────────────────────────────────────────────────
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    branch: '',
    ifscCode: ''
  });

  // ── Uploads State ─────────────────────────────────────────────────
  const [uploads, setUploads] = useState({
    poster: null,
    proceedingsDownload: null,
    brochureDownload: null
  });

  // ═════════════════════════════════════════════════════════════════
  //  FETCH EXISTING DATA (EDIT MODE)
  // ═════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (isEdit) {
      const fetchConference = async () => {
        try {
          const snapshot = await getDocs(collection(db, "conferences (2)"));

          let conf = null;

          snapshot.forEach((d) => {
            const raw = d.data();
            if (Array.isArray(raw.data)) {
              const match = raw.data.find((c) => String(c.id) === String(id));
              if (match) conf = match;
            }
          });

          if (!conf) {
            Swal.fire("Error", "Conference not found", "error");
            return;
          }

          reset({
            conferencename: conf.conferencename || "",
            conferencetitle: conf.conferencetitle || "",
            isbn: conf.isbn || "",
            type: conf.type || "",
            about: conf.about || "",
            abstractSubmission: conf.dates?.abstractSubmission || "",
            fullPaperSubmission: conf.dates?.fullPaperSubmission || "",
            conferenceDate: conf.dates?.conferenceDate || "",
            conferencestatus: conf.conferencestatus || "Fully Released",
            conferencesecurity: conf.conferencesecurity || "",
            conferencevalidity: conf.conferencevalidity || "",
            registerlink: conf.registerlink || "",
            listenerparticipation: conf.listenerparticipation || "",
            feeAcademicians: conf.fees?.academicians || "",
            feeStudent: conf.fees?.student || "",
            feeResearchScholars: conf.fees?.researchScholars || "",
            feeListener: conf.fees?.listener || ""
          });

          setTopics(
            Array.isArray(conf.topics)
              ? conf.topics
              : [""]
          );

          setSpeakers(
            Array.isArray(conf.speakers)
              ? conf.speakers
              : [{ name: "", designation: "", image: null, imageFile: null }]
          );
          setOrganizingCommittee(
            Array.isArray(conf.organizingcommittee)
              ? conf.organizingcommittee
              : [{ role: "", name: "", mobile: "", email: "" }]
          );
          setAdvisoryCommittee(
            Array.isArray(conf.advisorycommittee)
              ? conf.advisorycommittee
              : [{ name: "", designation: "", institution: "", location: "", image: null, imageFile: null }]
          );
          setGlobalExperts(
            Array.isArray(conf.globalexperts)
              ? conf.globalexperts
              : [{ name: "", designation: "", institution: "", location: "", image: null, imageFile: null }]
          );
          setCertificatesDownload(
            Array.isArray(conf.certificatesdownload)
              ? conf.certificatesdownload
              : [{ name: "Track 01", file: null, actualFile: null }]
          );

          if (conf.bankdetails) {
            setBankDetails(conf.bankdetails);
          }

          setUploads({
            poster: conf.poster || null,
            proceedingsDownload: conf.proceedingsdownload || null,
            brochureDownload: conf.brochuredownload || null,
          });

        } catch (error) {
          console.error(error);
          Swal.fire("Error", "Failed to fetch conference", "error");
        }
      };

      fetchConference();
    }
  }, [isEdit, id, reset]);

  // ═════════════════════════════════════════════════════════════════
  //  HANDLERS
  // ═════════════════════════════════════════════════════════════════
  const handleSimpleArrayChange = (setter, array, index, value) => {
    const newArr = [...array];
    newArr[index] = value;
    setter(newArr);
  };
  const addSimpleArrayItem = (setter, array) => setter([...array, '']);
  const removeSimpleArrayItem = (setter, array, index) => setter(array.filter((_, i) => i !== index));

  const handleComplexArrayChange = (setter, array, index, field, value) => {
    const newArr = [...array];
    newArr[index] = { ...newArr[index], [field]: value };
    setter(newArr);
  };

  const addSpeaker = () => setSpeakers([...speakers, { name: '', designation: '', image: null, imageFile: null }]);
  const removeSpeaker = (index) => setSpeakers(speakers.filter((_, i) => i !== index));

  const addOrganizingMember = () => setOrganizingCommittee([...organizingCommittee, { role: '', name: '', mobile: '', email: '' }]);
  const removeOrganizingMember = (index) => setOrganizingCommittee(organizingCommittee.filter((_, i) => i !== index));

  const addAdvisoryMember = () => setAdvisoryCommittee([...advisoryCommittee, { name: '', designation: '', institution: '', location: '', image: null, imageFile: null }]);
  const removeAdvisoryMember = (index) => setAdvisoryCommittee(advisoryCommittee.filter((_, i) => i !== index));

  const addGlobalExpert = () => setGlobalExperts([...globalExperts, { name: '', designation: '', institution: '', location: '', image: null, imageFile: null }]);
  const removeGlobalExpert = (index) => setGlobalExperts(globalExperts.filter((_, i) => i !== index));

  const addCertificateTrack = () => setCertificatesDownload([...certificatesDownload, { name: `Track 0${certificatesDownload.length + 1}`, file: null, actualFile: null }]);
  const removeCertificateTrack = (index) => setCertificatesDownload(certificatesDownload.filter((_, i) => i !== index));

  const handleUploadChange = (key, file, preview) => {
    setUploads(prev => ({ ...prev, [key]: { file, preview } }));
  };


  // ═════════════════════════════════════════════════════════════════
  //  SUBMIT & ERRORS HANDLER
  // ═════════════════════════════════════════════════════════════════
  const onError = (formErrors) => {
    console.warn("⚠️ Form validation failed:", formErrors);
    Swal.fire({
      title: "Validation Error",
      text: "Please fill in all required fields highlighted in red.",
      icon: "warning"
    });
  };

  const onSubmit = async (data) => {
    try {
      // 1. Fixed Base Media File Resolution Logic
      const uploadedFiles = {};
      for (const key of Object.keys(uploads)) {
        const item = uploads[key];
        if (item && item.file) {
          uploadedFiles[key] = await uploadImage(item.file)
        } else if (item && item.preview) {
          uploadedFiles[key] = item.preview;
        } else if (typeof item === 'string') {
          uploadedFiles[key] = item;
        } else {
          uploadedFiles[key] = null;
        }
      }

      // 2. Upload array images
      const processArrayImages = async (arr) => {
        return Promise.all(arr.map(async (item) => {
          if (item.imageFile) {
            const url = await uploadImage(item.imageFile);
            const cleaned = { ...item, image: url };
            delete cleaned.imageFile;
            return cleaned;
          }
          return item;
        }));
      };

      const finalSpeakers = await processArrayImages(speakers);
      const finalAdvisoryCommittee = await processArrayImages(advisoryCommittee);
      const finalGlobalExperts = await processArrayImages(globalExperts);

      // 3. Upload certificate files
      const finalCertificates = await Promise.all(certificatesDownload.map(async (item) => {
        if (item.actualFile) {
          const url = await uploadImage(item.actualFile);
          const cleaned = { ...item, file: url };
          delete cleaned.actualFile;
          return cleaned;
        }
        return item;
      }));

      // 4. Build complete structured payload
      const finalData = {
        conferencename: data.conferencename || "",
        conferencetitle: data.conferencetitle || "",
        isbn: data.isbn || null,
        type: data.type || null,
        about: data.about || null,
        conferencestatus: data.conferencestatus || "Fully Released",
        conferencesecurity: data.conferencesecurity || null,
        conferencevalidity: data.conferencevalidity || null,
        registerlink: data.registerlink || null,
        listenerparticipation: data.listenerparticipation || null,
        poster: uploadedFiles.poster || null,
        brochuredownload: uploadedFiles.brochureDownload || null,
        proceedingsdownload: uploadedFiles.proceedingsDownload || null,
        dates: {
          abstractSubmission: data.abstractSubmission || null,
          fullPaperSubmission: data.fullPaperSubmission || null,
          conferenceDate: data.conferenceDate || null
        },
        fees: {
          academicians: data.feeAcademicians || null,
          student: data.feeStudent || null,
          researchScholars: data.feeResearchScholars || null,
          listener: data.feeListener || null
        },
        bankdetails: bankDetails.accountName ? bankDetails : null,
        topics: topics.filter(t => t && t.trim() !== ''),
        speakers: finalSpeakers.filter(s => s.name).length ? finalSpeakers.filter(s => s.name) : [],
        organizingcommittee: organizingCommittee.filter(o => o.name).length ? organizingCommittee.filter(o => o.name) : [],
        advisorycommittee: finalAdvisoryCommittee.filter(a => a.name).length ? finalAdvisoryCommittee.filter(a => a.name) : [],
        globalexperts: finalGlobalExperts.filter(g => g.name).length ? finalGlobalExperts.filter(g => g.name) : [],
        certificatesdownload: finalCertificates.filter(c => c.file).length ? finalCertificates.filter(c => c.file) : []
      };

      // 5. Save to Firestore (Edit existing vs Create new)
      const snapshot = await getDocs(collection(db, "conferences (2)"));

      let tableDocId = null;
      let updatedArray = [];

      snapshot.forEach((d) => {
        const raw = d.data();
        if (Array.isArray(raw.data)) {
          tableDocId = d.id;
          updatedArray = [...raw.data];
        }
      });

      if (isEdit) {
        // Update only the conference that matches the URL id
        const index = updatedArray.findIndex((c) => String(c.id) === String(id));

        if (index === -1) {
          throw new Error("Conference not found for editing.");
        }

        finalData.id = id;
        updatedArray[index] = finalData;
      } else {
        // Add: give the new conference its own unique id and append it
        finalData.id =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : Date.now().toString();
        updatedArray.push(finalData);
      }

      if (!tableDocId) {
        throw new Error("Conference table document not found.");
      }

      await updateDoc(doc(db, "conferences (2)", tableDocId), {
        data: updatedArray,
      });

      Swal.fire({
        title: "Success!",
        text: isEdit ? "Conference updated successfully." : "New conference created.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/admin/conferences");
    } catch (error) {
      console.error("❌ Firestore Save Error:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to save conference.",
        icon: "error",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/admin/conferences')}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <MdArrowBack className="text-gray-600" />
        </button>
        <h1 className="text-xl font-bold">
          {isEdit ? 'Edit Conference' : 'Add New Conference'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        {/* --- Basic Information --- */}
        <div className="card p-6">
          <h2 className="section-title mb-5">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Conference Name *</label>
              <input
                {...register('conferencename', { required: 'Name is required' })}
                className="input-field"
                placeholder="e.g. ICEISET - 30 Apr 2026"
              />
              {errors.conferencename && (
                <span className="text-xs text-red-500 mt-1 block">{errors.conferencename.message}</span>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="label">Conference Title *</label>
              <input
                {...register('conferencetitle', { required: 'Title is required' })}
                className="input-field"
                placeholder="Full title of the conference"
              />
              {errors.conferencetitle && (
                <span className="text-xs text-red-500 mt-1 block">{errors.conferencetitle.message}</span>
              )}
            </div>

            <div>
              <label className="label">ISBN</label>
              <input {...register('isbn')} className="input-field" placeholder="978-3-16-148410-0" />
            </div>

            <div>
              <label className="label">Conference Type *</label>
              <select {...register('type', { required: 'Type is required' })} className="input-field">
                <option value="">Select Type</option>
                <option value="Virtual Conference">Virtual Conference</option>
                <option value="In-Person Conference">In-Person Conference</option>
                <option value="Hybrid Conference">Hybrid Conference</option>
              </select>
              {errors.type && <span className="text-xs text-red-500 mt-1 block">{errors.type.message}</span>}
            </div>
          </div>
        </div>

        {/* --- About --- */}
        <div className="card p-6">
          <h2 className="section-title mb-5">About the Conference</h2>
          <textarea {...register('about')} className="input-field resize-none" rows={6} placeholder="Detailed description..." />
        </div>

        {/* --- Dates --- */}
        <div className="card p-6">
          <h2 className="section-title mb-5">Important Dates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="label">Abstract Submission</label>
              <input type="date" {...register('abstractSubmission')} className="input-field" />
            </div>
            <div>
              <label className="label">Full Paper Submission</label>
              <input type="date" {...register('fullPaperSubmission')} className="input-field" />
            </div>
            <div>
              <label className="label">Conference Date</label>
              <input type="date" {...register('conferenceDate')} className="input-field" />
            </div>
          </div>
        </div>

        {/* --- Meta --- */}
        <div className="card p-6">
          <h2 className="section-title mb-5">Conference Meta</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="label">Conference Status</label>
              <select {...register('conferencestatus')} className="input-field">
                <option value="Fully Released">Fully Released</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="label">Conference Security</label>
              <select {...register('conferencesecurity')} className="input-field">
                <option value="">Select Security Level</option>
                <option value="Public">Verified Document</option>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            </div>
            <div>
              <label className="label">Conference Validity</label>
              <input {...register('conferencevalidity')} className="input-field" placeholder="Edition version information" />
            </div>
          </div>
        </div>

        {/* --- Registration Links --- */}
        <div className="card p-6">
          <h2 className="section-title mb-5">Registration & Participation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Register Link</label>
              <input {...register('registerlink')} className="input-field" placeholder="https://..." />
            </div>
            <div>
              <label className="label">Listener Participation Link</label>
              <input {...register('listenerparticipation')} className="input-field" placeholder="https://..." />
            </div>
          </div>
        </div>

        {/* --- Fees --- */}
        <div className="card p-6">
          <h2 className="section-title mb-5">Registration Fees (₹)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="label">Academicians</label>
              <input type="number" {...register('feeAcademicians')} className="input-field" />
            </div>
            <div>
              <label className="label">Student</label>
              <input type="number" {...register('feeStudent')} className="input-field" />
            </div>
            <div>
              <label className="label">Research Scholars</label>
              <input type="number" {...register('feeResearchScholars')} className="input-field" />
            </div>
            <div>
              <label className="label">Listener</label>
              <input type="number" {...register('feeListener')} className="input-field" />
            </div>
          </div>
        </div>

        {/* --- Bank Details --- */}
        <div className="card p-6">
          <h2 className="section-title mb-5">Bank Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Account Holder Name</label>
              <input
                value={bankDetails.accountName || ''}
                onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Account Number</label>
              <input
                value={bankDetails.accountNumber || ''}
                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Bank Name</label>
              <input
                value={bankDetails.bankName || ''}
                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Branch</label>
              <input
                value={bankDetails.branch || ''}
                onChange={(e) => setBankDetails({ ...bankDetails, branch: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">IFSC Code</label>
              <input
                value={bankDetails.ifscCode || ''}
                onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* --- Speakers --- */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="section-title">Speakers</h2>
            <button type="button" onClick={addSpeaker} className="text-sm flex items-center gap-1 font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">
              <MdAdd /> Add Speaker
            </button>
          </div>
          <div className="space-y-4">
            {speakers.map((speaker, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-4 items-start border p-4 rounded-xl bg-gray-50 relative">
                {speakers.length > 1 && (
                  <button type="button" onClick={() => removeSpeaker(index)} className="absolute top-2 right-2 text-red-500">
                    <MdRemoveCircle className="text-xl" />
                  </button>
                )}
                <div className="w-full sm:w-1/3">
                  <UploadBox
                    label="Speaker Photo"
                    onChange={(f, p) => {
                      handleComplexArrayChange(setSpeakers, speakers, index, 'image', p);
                      handleComplexArrayChange(setSpeakers, speakers, index, 'imageFile', f);
                    }}
                    value={speaker.image}
                  />
                </div>
                <div className="w-full sm:w-2/3 space-y-4 pt-2">
                  <div>
                    <label className="label">Speaker Name</label>
                    <input value={speaker.name || ''} onChange={e => handleComplexArrayChange(setSpeakers, speakers, index, 'name', e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="label">Designation / Affiliation</label>
                    <input value={speaker.designation || ''} onChange={e => handleComplexArrayChange(setSpeakers, speakers, index, 'designation', e.target.value)} className="input-field" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Organizing Committee --- */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="section-title">Organizing Committee</h2>
            <button type="button" onClick={addOrganizingMember} className="text-sm flex items-center gap-1 font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">
              <MdAdd /> Add Member
            </button>
          </div>
          <div className="space-y-3">
            {organizingCommittee.map((member, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center border p-3 rounded-lg bg-gray-50 relative pr-10">
                <input value={member.role || ''} onChange={e => handleComplexArrayChange(setOrganizingCommittee, organizingCommittee, index, 'role', e.target.value)} className="input-field" placeholder="Role" />
                <input value={member.name || ''} onChange={e => handleComplexArrayChange(setOrganizingCommittee, organizingCommittee, index, 'name', e.target.value)} className="input-field" placeholder="Name" />
                <input value={member.mobile || ''} onChange={e => handleComplexArrayChange(setOrganizingCommittee, organizingCommittee, index, 'mobile', e.target.value)} className="input-field" placeholder="Mobile" />
                <input value={member.email || ''} onChange={e => handleComplexArrayChange(setOrganizingCommittee, organizingCommittee, index, 'email', e.target.value)} className="input-field" placeholder="Email" />
                {organizingCommittee.length > 1 && (
                  <button type="button" onClick={() => removeOrganizingMember(index)} className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500">
                    <MdRemoveCircle className="text-xl" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* --- Advisory Committee --- */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="section-title">Advisory Committee</h2>
            <button type="button" onClick={addAdvisoryMember} className="text-sm flex items-center gap-1 font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">
              <MdAdd /> Add Member
            </button>
          </div>
          <div className="space-y-4">
            {advisoryCommittee.map((member, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-4 items-start border p-4 rounded-xl bg-gray-50 relative">
                {advisoryCommittee.length > 1 && (
                  <button type="button" onClick={() => removeAdvisoryMember(index)} className="absolute top-2 right-2 text-red-500">
                    <MdRemoveCircle className="text-xl" />
                  </button>
                )}
                <div className="w-full sm:w-1/4">
                  <UploadBox
                    label="Photo"
                    onChange={(f, p) => {
                      handleComplexArrayChange(setAdvisoryCommittee, advisoryCommittee, index, 'image', p);
                      handleComplexArrayChange(setAdvisoryCommittee, advisoryCommittee, index, 'imageFile', f);
                    }}
                    value={member.image}
                  />
                </div>
                <div className="w-full sm:w-3/4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="sm:col-span-2">
                    <label className="label">Name</label>
                    <input value={member.name || ''} onChange={e => handleComplexArrayChange(setAdvisoryCommittee, advisoryCommittee, index, 'name', e.target.value)} className="input-field" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Department / Designation</label>
                    <input value={member.designation || ''} onChange={e => handleComplexArrayChange(setAdvisoryCommittee, advisoryCommittee, index, 'designation', e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="label">Institution</label>
                    <input value={member.institution || ''} onChange={e => handleComplexArrayChange(setAdvisoryCommittee, advisoryCommittee, index, 'institution', e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="label">Location</label>
                    <input value={member.location || ''} onChange={e => handleComplexArrayChange(setAdvisoryCommittee, advisoryCommittee, index, 'location', e.target.value)} className="input-field" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Global Experts --- */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="section-title">Global Experts</h2>
            <button type="button" onClick={addGlobalExpert} className="text-sm flex items-center gap-1 font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">
              <MdAdd /> Add Expert
            </button>
          </div>
          <div className="space-y-4">
            {globalExperts.map((member, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-4 items-start border p-4 rounded-xl bg-gray-50 relative">
                {globalExperts.length > 1 && (
                  <button type="button" onClick={() => removeGlobalExpert(index)} className="absolute top-2 right-2 text-red-500">
                    <MdRemoveCircle className="text-xl" />
                  </button>
                )}
                <div className="w-full sm:w-1/4">
                  <UploadBox
                    label="Photo"
                    onChange={(f, p) => {
                      handleComplexArrayChange(setGlobalExperts, globalExperts, index, 'image', p);
                      handleComplexArrayChange(setGlobalExperts, globalExperts, index, 'imageFile', f);
                    }}
                    value={member.image}
                  />
                </div>
                <div className="w-full sm:w-3/4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="sm:col-span-2">
                    <label className="label">Name</label>
                    <input value={member.name || ''} onChange={e => handleComplexArrayChange(setGlobalExperts, globalExperts, index, 'name', e.target.value)} className="input-field" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Department / Designation</label>
                    <input value={member.designation || ''} onChange={e => handleComplexArrayChange(setGlobalExperts, globalExperts, index, 'designation', e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="label">Institution</label>
                    <input value={member.institution || ''} onChange={e => handleComplexArrayChange(setGlobalExperts, globalExperts, index, 'institution', e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="label">Location</label>
                    <input value={member.location || ''} onChange={e => handleComplexArrayChange(setGlobalExperts, globalExperts, index, 'location', e.target.value)} className="input-field" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Topics --- */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="section-title">Conference Topics</h2>
            <button type="button" onClick={() => addSimpleArrayItem(setTopics, topics)} className="text-sm flex items-center gap-1 font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">
              <MdAdd /> Add Topic
            </button>
          </div>
          <div className="space-y-3">
            {topics.map((topic, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  value={topic || ''}
                  onChange={(e) => handleSimpleArrayChange(setTopics, topics, index, e.target.value)}
                  className="input-field flex-1"
                  placeholder={`Topic ${index + 1}`}
                />
                {topics.length > 1 && (
                  <button type="button" onClick={() => removeSimpleArrayItem(setTopics, topics, index)} className="text-red-500 p-2">
                    <MdRemoveCircle className="text-xl" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* --- Certificates --- */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="section-title">Certificates Download</h2>
            <button type="button" onClick={addCertificateTrack} className="text-sm flex items-center gap-1 font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">
              <MdAdd /> Add Track
            </button>
          </div>
          <div className="space-y-4">
            {certificatesDownload.map((track, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-4 items-center border p-4 rounded-xl bg-gray-50 relative">
                {certificatesDownload.length > 1 && (
                  <button type="button" onClick={() => removeCertificateTrack(index)} className="absolute top-2 right-2 text-red-500">
                    <MdRemoveCircle className="text-xl" />
                  </button>
                )}
                <div className="w-full sm:w-1/2">
                  <label className="label">Track Name</label>
                  <input value={track.name || ''} onChange={e => handleComplexArrayChange(setCertificatesDownload, certificatesDownload, index, 'name', e.target.value)} className="input-field" />
                </div>
                <div className="w-full sm:w-1/2">
                  <UploadBox
                    label="Certificate (PDF)"
                    onChange={(f, p) => {
                      handleComplexArrayChange(setCertificatesDownload, certificatesDownload, index, 'file', p);
                      handleComplexArrayChange(setCertificatesDownload, certificatesDownload, index, 'actualFile', f);
                    }}
                    value={track.file}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Media & Files --- */}
        <div className="card p-6">
          <h2 className="section-title mb-5">Media & Files</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <UploadBox
              label="Poster / Main Banner Image"
              onChange={(f, p) => handleUploadChange('poster', f, p)}
              value={uploads.poster ? (uploads.poster.preview || uploads.poster) : null}
            />
            <UploadBox
              label="Proceedings Download (PDF)"
              onChange={(f, p) => handleUploadChange('proceedingsDownload', f, p)}
              value={uploads.proceedingsDownload ? (uploads.proceedingsDownload.preview || uploads.proceedingsDownload) : null}
            />
            <UploadBox
              label="Brochure Download (PDF)"
              onChange={(f, p) => handleUploadChange('brochureDownload', f, p)}
              value={uploads.brochureDownload ? (uploads.brochureDownload.preview || uploads.brochureDownload) : null}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="btn-primary px-8 py-2.5 text-lg flex items-center gap-2">
            <MdSave className="text-xl" /> {isEdit ? 'Save Changes' : 'Publish Conference'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddConference;