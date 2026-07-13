import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { MdStar, MdArrowBack, MdSend, MdPerson, MdPlayCircleOutline } from 'react-icons/md';
import axios from 'axios';
import UploadBox from '../components/UploadBox';

const MAX_CHARS = 1000;

const AddTestimonial = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [charCount, setCharCount] = useState(0);
  
  // 🌟 Updated preview state keys to match new schema
  const [previewData, setPreviewData] = useState({
    name: '',
    designation: '',
    content: '',
    is_video_testimonial: false,
    video_url: ''
  });

  const { id } = useParams();
  const isEdit = Boolean(id);

  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      is_video_testimonial: false
    }
  });

  // Watch fields to instantly reflect changes on the live preview component
  const watchIsVideo = watch('is_video_testimonial');

  useEffect(() => {
    if (isEdit) {
      const fetchTestimonial = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/testimonials/${id}`);
          const t = res.data;
          reset(t);
          setRating(t.rating);
          setPhotoPreview(t.avatar_url); // 🌟 Maps to avatar_url
          setPreviewData(t);
          setCharCount(t.content?.length || 0); // 🌟 Maps to content length
        } catch (error) {
          console.error("Error fetching testimonial", error);
        }
      };
      fetchTestimonial();
    }
  }, [id, reset]);

  const updatePreview = (field, value) => {
    setPreviewData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (data) => {
    if (!rating) {
      Swal.fire({ title: 'Rating Required', text: 'Please select a star rating.', icon: 'warning', confirmButtonColor: '#2563EB' });
      return;
    }
    try {
      let avatarUrl = photoPreview || 'https://via.placeholder.com/150';
      if (photoFile) {
        const formData = new FormData();
        formData.append('image', photoFile);
        const uploadRes = await axios.post('http://localhost:5000/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        avatarUrl = `http://localhost:5000${uploadRes.data.url}`;
      }

      // 🌟 Structured cleanly payload fields to strictly align with target database columns
      const newTestimonial = {
        name: data.name,
        designation: data.designation,
        rating: rating,
        content: data.content,
        avatar_url: avatarUrl,
        is_video_testimonial: Boolean(data.is_video_testimonial),
        video_url: data.is_video_testimonial ? data.video_url : null
      };

      if (isEdit) {
        await axios.put(`http://localhost:5000/api/testimonials/${id}`, newTestimonial);
      } else {
        await axios.post('http://localhost:5000/api/testimonials', newTestimonial);
      }

      await Swal.fire({
        title: isEdit ? '🌟 Testimonial Updated!' : '🌟 Testimonial Added!',
        text: `Testimonial from ${data.name} has been ${isEdit ? 'updated' : 'submitted'} successfully.`,
        icon: 'success',
        confirmButtonColor: '#2563EB',
        confirmButtonText: 'View Testimonials',
      });
      navigate('/admin/testimonials');
    } catch (error) {
      console.error('Error saving testimonial:', error);
      Swal.fire('Error', 'Failed to save testimonial.', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate('/admin/testimonials')} className="w-9 h-9 flex items-center justify-center rounded-xl border border-brand-border hover:border-blue-300 hover:bg-blue-50 transition-all">
          <MdArrowBack className="text-brand-gray" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-brand-dark">{isEdit ? 'Edit Testimonial' : 'Add Testimonial'}</h1>
          <p className="text-sm text-brand-gray">{isEdit ? 'Modify publication experience and video feedback logs' : 'Collect publication feedback reviews and visual updates'}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Form Layout */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 lg:col-span-2"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Star Rating input tracking component */}
            <div>
              <label className="label">Rating (Stars) *</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <MdStar
                      className={`text-3xl transition-all duration-150 ${
                        star <= (hoverRating || rating) ? 'star-active' : 'star-inactive'
                      }`}
                    />
                  </motion.button>
                ))}
                {rating > 0 && (
                  <motion.span className="ml-2 text-sm font-semibold text-blue-500">
                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                  </motion.span>
                )}
              </div>
            </div>

            {/* 🌟 Content field input (Replaced Description) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Testimonial Content *</label>
                <span className={`text-xs font-medium ${charCount > MAX_CHARS * 0.9 ? 'text-red-500' : 'text-brand-gray'}`}>
                  {charCount}/{MAX_CHARS}
                </span>
              </div>
              <textarea
                {...register('content', { required: 'Content is required', maxLength: MAX_CHARS })}
                rows={5}
                className="input-field resize-none"
                placeholder="Share your publication experience with Veritaz International Press..."
                onChange={(e) => {
                  setCharCount(e.target.value.length);
                  updatePreview('content', e.target.value);
                }}
              />
              {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>}
            </div>

            {/* Avatar Photo Input (Replaced Profile Photo) */}
            <UploadBox
              label="Avatar Photo"
              onChange={(file, preview) => {
                setPhotoFile(file);
                setPhotoPreview(preview);
              }}
              value={photoPreview}
              maxSizeMB={2}
            />

            {/* Name & Designation layout wrapper (Replaced Role) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name *</label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="input-field"
                  placeholder="Enter full name (e.g., Dr. Arun .A)"
                  onChange={(e) => updatePreview('name', e.target.value)}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="label">Designation *</label>
                <input
                  {...register('designation', { required: 'Designation is required' })}
                  className="input-field"
                  placeholder="e.g., professor / author"
                  onChange={(e) => updatePreview('designation', e.target.value)}
                />
                {errors.designation && <p className="text-xs text-red-500 mt-1">{errors.designation.message}</p>}
              </div>
            </div>

            {/* 🌟 New Format Toggle Options for Media Playback Elements */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_video_testimonial"
                  {...register('is_video_testimonial')}
                  onChange={(e) => {
                    setValue('is_video_testimonial', e.target.checked);
                    updatePreview('is_video_testimonial', e.target.checked);
                  }}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
                <label htmlFor="is_video_testimonial" className="text-sm font-semibold text-brand-dark cursor-pointer select-none">
                  This contains a Video Testimonial playback track
                </label>
              </div>

              {watchIsVideo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-1.5"
                >
                  <label className="label">Video Asset Path URL *</label>
                  <input
                    {...register('video_url', { required: watchIsVideo ? 'Video URL or asset location path is required' : false })}
                    className="input-field"
                    placeholder="e.g., assets/image/Testmonoials/Arun.mp4"
                    onChange={(e) => updatePreview('video_url', e.target.value)}
                  />
                  {errors.video_url && <p className="text-xs text-red-500 mt-1">{errors.video_url.message}</p>}
                </motion.div>
              )}
            </div>

            {/* Actions Control Toolbar */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-border">
              <button type="button" onClick={() => navigate('/admin/testimonials')} className="btn-outline">Cancel</button>
              <button type="submit" className="btn-primary">
                <MdSend /> {isEdit ? 'Update Testimonial' : 'Submit Testimonial'}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Live Preview Display Element */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="card p-5">
            <h3 className="text-sm font-bold text-brand-dark mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block animate-pulse" />
              Live Preview
            </h3>
            <motion.div
              animate={{ scale: previewData.name ? 1 : 0.97 }}
              className="bg-[#E7F2EF] rounded-3xl p-5 border border-teal-100 relative flex flex-col items-center text-center"
            >
              {/* Avatar Image Circle Box */}
              <div className="w-20 h-20 bg-white rounded-full flex-shrink-0 border-2 border-white/60 overflow-hidden relative group mb-3 shadow-sm">
                {photoPreview ? (
                  <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                    <MdPerson className="text-blue-500 text-2xl" />
                  </div>
                )}
                
                {/* Overlaid video icon element to render if checked */}
                {previewData.is_video_testimonial && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <MdPlayCircleOutline className="text-white text-2xl" />
                  </div>
                )}
              </div>

              {/* Author Info Headings */}
              <div className="mb-2">
                <h5 className="font-bold text-brand-dark text-base tracking-tight flex items-center justify-center gap-1.5">
                  {previewData.name || 'Your Name'}
                  {previewData.is_video_testimonial && (
                    <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded-full flex items-center gap-0.5 font-normal">
                      ▶ Video
                    </span>
                  )}
                </h5>
                <p className="text-xs text-brand-gray/80 font-medium lowercase first-letter:uppercase">{previewData.designation || 'your designation / profession'}</p>
              </div>

              {/* Stars Row */}
              <div className="flex gap-0.5 mb-3 text-yellow-500 text-sm">
                {[1, 2, 3, 4, 5].map((s) => (
                  <MdStar key={s} className={s <= rating ? 'star-active' : 'star-inactive'} />
                ))}
              </div>

              {/* Content Text message */}
              <p className="text-xs text-brand-dark/90 leading-relaxed line-clamp-5 text-center px-1 font-normal italic">
                "{previewData.content || 'Your detailed publication review feedback content text will appear displayed here...'}"
              </p>
            </motion.div>
          </div>

          {/* Guidelines Box */}
          <div className="card p-4">
            <h4 className="text-xs font-bold text-brand-dark mb-3">💡 Guidelines for Content Mapping</h4>
            <ul className="space-y-2 text-xs text-brand-gray">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                Ensure designations are clear (e.g., professor, research author).
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                Video testimonials require accurate relative paths or asset location links.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                Avatar URLs should always fallback safely to placeholders if no file upload is provided.
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddTestimonial;