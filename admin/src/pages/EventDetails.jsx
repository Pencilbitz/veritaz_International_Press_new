import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import axios from 'axios';
import { MdChevronLeft, MdSave } from 'react-icons/md';
import UploadBox from '../components/UploadBox';

const format12Hour = (time24) => {
  if (!time24) return '';
  let [hours, mins] = time24.split(':');
  let h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const hStr = h < 10 ? `0${h}` : h;
  return `${hStr}:${mins} ${ampm}`;
};

const format24Hour = (time12) => {
  if (!time12) return '';
  const match = time12.trim().toUpperCase().match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)?/);
  if (!match) return '';
  let h = parseInt(match[1], 10);
  let m = match[2] || '00';
  const ampm = match[3];
  if (ampm === 'PM' && h < 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  const hStr = h < 10 ? `0${h}` : h;
  return `${hStr}:${m}`;
};

const EventDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = !id;

  const [posterUrl, setPosterUrl] = useState(null);
  const [posterFile, setPosterFile] = useState(null);

  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: { status: 'Upcoming' },
  });
  const status = watch('status');

  useEffect(() => {
    if (!isNew) {
      axios.get(`http://localhost:5000/api/events/${id}`)
        .then(res => {
          const e = res.data;

          let fromT = '';
          let toT = '';
          if (e.time) {
            const parts = e.time.split('-');
            if (parts.length === 2) {
              fromT = format24Hour(parts[0]);
              toT = format24Hour(parts[1]);
            } else {
              fromT = format24Hour(e.time);
            }
          }

          // Map DB fields back to form fields matching the schema
          reset({
            collegeName: e.collegeName || '',
            topic: e.topic || '',
            date: e.date ? e.date.split('T')[0] : '',
            fromTime: fromT,
            toTime: toT,
            location: e.location || '',
            contact1: e.contact1 || '',
            contact2: e.contact2 || '',
            registrationLink: e.registrationLink || '',
            registerButtonText: e.registerButtonText || 'Register Now',
            status: e.status || 'Upcoming'
          });
          if (e.poster) setPosterUrl(`http://localhost:5000${e.poster}`);
        })
        .catch(err => console.error("Error fetching event details", err));
    }
  }, [id, isNew, reset]);

  const onSubmit = async (data) => {
    try {
      let uploadedPosterUrl = posterUrl ? posterUrl.replace('http://localhost:5000', '') : null;

      if (posterFile) {
        const formData = new FormData();
        formData.append('image', posterFile);

        const uploadRes = await axios.post('http://localhost:5000/api/upload/events', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedPosterUrl = uploadRes.data.url;
      }

      let combinedTime = '';
      if (data.fromTime && data.toTime) {
        combinedTime = `${format12Hour(data.fromTime)} - ${format12Hour(data.toTime)}`;
      } else if (data.fromTime) {
        combinedTime = format12Hour(data.fromTime);
      }

      // Payload properties explicitly set to match SQL columns
      const payload = {
        collegeName: data.collegeName,
        topic: data.topic,
        date: data.date,
        time: combinedTime,
        location: data.location,
        contact1: data.contact1,
        contact2: data.contact2,
        registrationLink: data.registrationLink,
        registerButtonText: data.registerButtonText || 'Register Now',
        status: data.status,
        poster: uploadedPosterUrl
      };

      if (isNew) {
        await axios.post('http://localhost:5000/api/events', payload);
      } else {
        await axios.put(`http://localhost:5000/api/events/${id}`, payload);
      }

      Swal.fire({ title: 'Saved!', icon: 'success', timer: 1500, showConfirmButton: false, confirmButtonColor: '#2563EB' });
      navigate('/admin/events');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to save event', 'error');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/events')}
            className="btn-outline py-2 px-3"
          >
            <MdChevronLeft className="text-xl" />
          </button>
          <h1 className="text-xl font-bold text-brand-dark">
            {isNew ? 'Add Event' : 'Edit Event'}
          </h1>
        </div>
        <button onClick={handleSubmit(onSubmit)} className="btn-primary">
          <MdSave /> Save
        </button>
      </div>

      {/* Single Card — Poster + General Info */}
      <div className="card p-6 space-y-6">
        {/* Section: Image Upload */}
        <div>
          <h3 className="section-title mb-4 pb-2 border-b border-blue-100">
            Event Poster
          </h3>
          <UploadBox
            label="Poster"
            value={posterUrl}
            onChange={(file, p) => { setPosterFile(file); setPosterUrl(p); }}
          />
        </div>

        {/* Section: General Info */}
        <div>
          <h3 className="section-title mb-4 pb-2 border-b border-blue-100">
            General Info
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">College Name *</label>
              <input
                {...register('collegeName')}
                className="input-field"
                placeholder="Enter college name"
              />
            </div>
            <div className="col-span-2">
              <label className="label">Topic *</label>
              <input
                {...register('topic')}
                className="input-field"
                placeholder="Enter event topic"
              />
            </div>
            <div>
              <label className="label">Date</label>
              <input type="text" {...register('date')} className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">From Time</label>
                <input
                  type="time"
                  {...register('fromTime')}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">To Time</label>
                <input
                  type="time"
                  {...register('toTime')}
                  className="input-field"
                />
              </div>
            </div>
            <div className="col-span-2">
              <label className="label">Location</label>
              <input
                {...register('location')}
                className="input-field"
                placeholder="e.g. Potinamallayyapalem, Andhra Pradesh"
              />
            </div>

            {/* Contacts mapped directly to DB columns */}
            <div>
              <label className="label">Contact 1 (Speaker/Organizer)</label>
              <input
                {...register('contact1')}
                className="input-field"
                placeholder="e.g. Name or Number"
              />
            </div>
            <div>
              <label className="label">Contact 2 (Speaker/Organizer)</label>
              <input
                {...register('contact2')}
                className="input-field"
                placeholder="e.g. Name or Number"
              />
            </div>

            <div>
              <label className="label">Register Link URL</label>
              <input
                {...register('registrationLink')}
                className="input-field"
                placeholder="https://"
              />
            </div>

            <div>

              <UploadBox
                label="Certificate"
                accept="image/*,application/pdf"
                value={posterUrl}
                onChange={(file, p) => { setPosterFile(file); setPosterUrl(p); }}
              />
            </div>

            {/* Event Status */}
            <div className="col-span-2">
              <label className="label mb-2 block">Event Status</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setValue('status', 'Upcoming')}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200 border ${status === 'Upcoming'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-[0_4px_14px_0_rgba(37,99,235,0.30)]'
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300'
                    }`}
                >
                  Upcoming
                </button>
                <button
                  type="button"
                  onClick={() => setValue('status', 'Completed')}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200 border ${status === 'Completed'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-[0_4px_14px_0_rgba(37,99,235,0.30)]'
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300'
                    }`}
                >
                  Completed
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EventDetails;