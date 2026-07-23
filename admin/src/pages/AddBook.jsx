import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import {
  MdCheck, MdChevronLeft, MdChevronRight,
  MdInfo, MdImage, MdStar, MdSettings, MdDelete, MdAdd, MdArrowBack,
  MdCloudUpload, MdClose
} from 'react-icons/md';
import axios from 'axios';
import { languagesList, bindingTypes } from '../data/dummyData';

const steps = [
  { id: 1, label: 'Basic Info', icon: MdInfo },
  { id: 2, label: 'Covers / Media', icon: MdImage },
  { id: 3, label: 'About Book', icon: MdStar },
  { id: 4, label: 'Product Specifications', icon: MdSettings },
];

const AddBook = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [covers, setCovers] = useState({ cover1: null, cover2: null });
  const [coverFiles, setCoverFiles] = useState({ cover1: null, cover2: null });
  const [authorsList, setAuthorsList] = useState([{ id: Date.now(), name: '' }]);

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire('Error', 'Image size should be less than 2MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCoverFiles((prev) => ({ ...prev, [type]: file }));
      setCovers((prev) => ({ ...prev, [type]: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (type) => {
    setCoverFiles((prev) => ({ ...prev, [type]: null }));
    setCovers((prev) => ({ ...prev, [type]: null }));
  };

  const { register, handleSubmit, trigger, getValues, formState: { errors } } = useForm({
    shouldUnregister: false,
    defaultValues: {
      title: '',
      isbn: '',
      edition: '1st Edition',
      ratings: 4.5,
      flipkart: '',
      price: '',
      status: 'In Stock',
      weight: '180g',
      binding: 'Paperback',
      dimensions: '24 x 18 x 1.5 cm',
      language: 'English',
      format: 'Single Color',
      pages: '168',
      copyright: new Date().getFullYear().toString(),
      about: ''
    }
  });

  const stepFields = {
    1: ['title', 'isbn', 'edition', 'price', 'status', 'ratings', 'flipkart'],
    2: [],
    3: ['about'],
    4: ['language', 'binding', 'pages', 'dimensions', 'weight', 'format', 'copyright'],
  };

  const nextStep = async () => {
    const valid = await trigger(stepFields[currentStep]);
    if (valid && currentStep < 4) setCurrentStep((s) => s + 1);
  };

  const prevStep = () => setCurrentStep((s) => Math.max(1, s - 1));

  // Helper logic to construct full book payload based on user inputs
  const buildBookPayload = async (data, explicitStatus = null) => {
    let uploadedCover1 = covers.cover1 || 'https://placehold.co/400x600/EEE/31343C?text=No+Cover';
    let uploadedCover2 = covers.cover2 || null;

    if (coverFiles.cover1) {
      const formData = new FormData();
      formData.append('image', coverFiles.cover1);
      const res = await axios.post('http://localhost:5000/api/upload/books', formData);
      uploadedCover1 = res.data.url;
    }

    if (coverFiles.cover2) {
      const formData = new FormData();
      formData.append('image', coverFiles.cover2);
      const res = await axios.post('http://localhost:5000/api/upload/books', formData);
      uploadedCover2 = res.data.url;
    }

    // Format all custom listed author names together separated with pipes (|)
    const formattedAuthors = authorsList
      .map(a => a.name.trim())
      .filter(name => name !== "")
      .join(' | ') || 'Unknown Author';

    return {
      title: data.title || 'Untitled Book',
      authors: formattedAuthors,
      isbn: data.isbn || '',
      edition: data.edition || '',
      ratings: Number(data.ratings) || 5,
      flipkart: data.flipkart || '',
      about: data.about || '',
      price: data.price ? Number(data.price) : 0,
      status: explicitStatus || data.status || 'In Stock',
      weight: data.weight || '',
      binding: data.binding || '',
      dimensions: data.dimensions || '',
      language: data.language || '',
      format: data.format || '',
      pages: data.pages ? Number(data.pages) : 0,
      copyright: data.copyright || '',
      cover1: uploadedCover1,
      cover2: uploadedCover2
    };
  };

  const onSubmit = async (data) => {
    try {
      const newBook = await buildBookPayload(data);
      await axios.post('http://localhost:5000/api/books', newBook);

      await Swal.fire({
        title: '🎉 Book Listing Created!',
        text: `"${data.title}" has been added to the catalog successfully.`,
        icon: 'success',
        confirmButtonColor: '#2563EB',
        confirmButtonText: 'View Book Store',
      });
      navigate('/admin/books');
    } catch (error) {
      console.error('Error saving book:', error);
      Swal.fire('Error', 'Failed to save book configuration.', 'error');
    }
  };

  const saveDraft = async () => {
    try {
      const data = getValues();
      const draftBook = await buildBookPayload(data, 'Draft');
      await axios.post('http://localhost:5000/api/books', draftBook);

      await Swal.fire({ title: 'Draft Saved', text: 'Book saved as draft layout.', icon: 'info', timer: 1500, showConfirmButton: false });
      navigate('/admin/books');
    } catch (error) {
      console.error('Error saving draft:', error);
      Swal.fire('Error', 'Failed to save product draft.', 'error');
    }
  };

  const stepVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center gap-3 mb-5">
        <button
          type="button"
          onClick={() => navigate('/admin/books')}
          className="w-10 h-10 flex items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm"
        >
          <MdArrowBack className="text-xl" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-brand-dark">Add New Book</h1>
          <p className="text-sm text-brand-gray">Create a new record using standard database metrics</p>
        </div>
      </div>

      {/* Progress Bar steps display layout */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 mb-5">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-brand-border mx-8 z-0">
            <motion.div
              className="h-full bg-gradient-primary rounded-full"
              animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            return (
              <div key={step.id} className="flex flex-col items-center gap-2 z-10">
                <motion.div
                  animate={{
                    backgroundColor: isCompleted ? '#2563EB' : isActive ? '#2563EB' : '#F1F5F9',
                    scale: isActive ? 1.15 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                >
                  {isCompleted ? <MdCheck className="text-white text-lg" /> : <Icon className={`text-lg ${isActive ? 'text-white' : 'text-brand-gray'}`} />}
                </motion.div>
                <span className={`text-xs font-semibold hidden sm:block ${isActive ? 'text-blue-600' : 'text-brand-gray'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Inputs Form Frame */}
      <div className="card p-6">
        <form onSubmit={(e) => e.preventDefault()}>
          <AnimatePresence mode="wait">

            {/* Step 1: Core Database Fields */}
            {currentStep === 1 && (
              <motion.div key="step1" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <h2 className="section-title mb-1">Basic Information</h2>
                <p className="section-subtitle mb-5">Setup critical backend catalog info</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="label">Book Title *</label>
                    <input {...register('title', { required: 'Title is required' })} className="input-field" placeholder="Enter book title" />
                    {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="label mb-2">Authors list *</label>
                    <div className="space-y-3">
                      {authorsList.map((auth, idx) => (
                        <div key={auth.id} className="flex gap-3">
                          <input
                            value={auth.name}
                            onChange={(e) => setAuthorsList(authorsList.map(a => a.id === auth.id ? { ...a, name: e.target.value } : a))}
                            className="input-field flex-1"
                            placeholder="Author Name"
                            required
                          />
                          {authorsList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setAuthorsList(authorsList.filter(a => a.id !== auth.id))}
                              className="w-10 h-10 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center shrink-0"
                            >
                              <MdDelete className="text-xl" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setAuthorsList([...authorsList, { id: Date.now(), name: '' }])}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-2"
                      >
                        <MdAdd className="text-lg" /> Add Another Author
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="label">ISBN Identifier</label>
                    <input {...register('isbn')} className="input-field" placeholder="e.g., 978-3-16-148410-0" />
                  </div>

                  <div>
                    <label className="label">Edition</label>
                    <input {...register('edition')} className="input-field" placeholder="e.g., 3rd Edition" />
                  </div>

                  <div>
                    <label className="label">Price (₹) *</label>
                    <input {...register('price', { required: 'Price field is required' })} type="number" step="0.01" className="input-field" placeholder="0.00" />
                    {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
                  </div>

                  <div>
                    <label className="label">Store Status</label>
                    <select {...register('status')} className="input-field">
                      <option value="In Stock">In Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Product Initial Rating (1-5)</label>
                    <input {...register('ratings')} type="number" min="1" max="5" className="input-field" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Flipkart Link</label>
                    <input
                      {...register('flipkart')}
                      type="url"
                      className="input-field"
                      placeholder="https://www.flipkart.com/..."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Covers matching cover1 and cover2 schemas */}
            {currentStep === 2 && (
              <motion.div key="step2" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <h2 className="section-title mb-1">Upload Media Covers</h2>
                <p className="section-subtitle mb-5">Provide front and secondary asset pictures</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Front Cover -> mapped to cover1 column */}
                  <div>
                    <label className="label mb-2 block">Cover 1 Image (Front Cover)</label>
                    {covers.cover1 ? (
                      <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
                        <img src={covers.cover1} alt="Front Cover" className="w-full h-64 object-cover" />
                        <button type="button" onClick={() => removeImage("cover1")} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center opacity-100 transition"><MdClose /></button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-gray-300 rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                        <MdCloudUpload className="text-5xl text-blue-500 mb-3" />
                        <p className="font-semibold">Upload Front Cover</p>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "cover1")} className="hidden" />
                      </label>
                    )}
                  </div>

                  {/* Back Cover -> mapped to cover2 column */}
                  <div>
                    <label className="label mb-2 block">Cover 2 Image (Back / Layout Summary)</label>
                    {covers.cover2 ? (
                      <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
                        <img src={covers.cover2} alt="Back Preview" className="w-full h-64 object-cover" />
                        <button type="button" onClick={() => removeImage("cover2")} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center opacity-100 transition"><MdClose /></button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-gray-300 rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                        <MdCloudUpload className="text-5xl text-blue-500 mb-3" />
                        <p className="font-semibold">Upload Secondary Cover</p>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "cover2")} className="hidden" />
                      </label>
                    )}
                  </div>

                </div>
              </motion.div>
            )}

            {/* Step 3: mapped to about schema column */}
            {currentStep === 3 && (
              <motion.div key="step3" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <h2 className="section-title mb-1">About This Book</h2>
                <p className="section-subtitle mb-5">Provide clear synopsis and feature details</p>
                <div>
                  <label className="label">About Details *</label>
                  <textarea
                    {...register('about', { required: 'About details are required' })}
                    rows={8}
                    className="input-field resize-none"
                    placeholder="Enter comprehensive information describing book features or summaries..."
                  />
                  {errors.about && <p className="text-xs text-red-500 mt-1">{errors.about.message}</p>}
                </div>
              </motion.div>
            )}

            {/* Step 4: Product Specifications */}
            {currentStep === 4 && (
              <motion.div key="step4" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <h2 className="section-title mb-1">Extended Specifications</h2>
                <p className="section-subtitle mb-5">Fill metadata constraints row elements</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Language</label>
                    <select {...register('language')} className="input-field">
                      <option value="">Select language</option>
                      {languagesList.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Binding Type</label>
                    <select {...register('binding')} className="input-field">
                      <option value="">Select binding</option>
                      {bindingTypes.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Page Count</label>
                    <input {...register('pages')} type="number" className="input-field" placeholder="e.g., 240" />
                  </div>
                  <div>
                    <label className="label">Dimensions</label>
                    <input {...register('dimensions')} className="input-field" placeholder="e.g., 14 x 21 cm" />
                  </div>
                  <div>
                    <label className="label">Weight</label>
                    <input {...register('weight')} className="input-field" placeholder="e.g., 320g" />
                  </div>
                  <div>
                    <label className="label">Format</label>
                    <input {...register('format')} className="input-field" placeholder="e.g., Bi-Color Layout" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Copyright Year</label>
                    <input {...register('copyright')} className="input-field" placeholder="e.g., 2026" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wizard Controls Footer */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-brand-border">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="btn-outline disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <MdChevronLeft /> Previous
            </button>
            <div className="flex items-center gap-2">
              <button type="button" onClick={saveDraft} className="btn-secondary">
                Save Draft
              </button>
              {currentStep < 4 ? (
                <button type="button" onClick={(e) => { e.preventDefault(); nextStep(); }} className="btn-primary">
                  Next <MdChevronRight />
                </button>
              ) : (
                <button type="button" onClick={() => handleSubmit(onSubmit)()} className="btn-primary">
                  <MdCheck /> Publish Book
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;