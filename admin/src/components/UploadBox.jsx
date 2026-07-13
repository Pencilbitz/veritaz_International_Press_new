import { useCallback, useState, useEffect } from 'react';
import { MdCloudUpload, MdClose, MdImage, MdInsertDriveFile } from 'react-icons/md';

// Added application/pdf to the default accept string
const UploadBox = ({ label, onChange, value, accept = 'image/*,application/pdf', maxSizeMB = 25 }) => {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(value || null);
  const [isPdf, setIsPdf] = useState(false);
  const [error, setError] = useState('');

  // Helper function to check if a URL or dataURI is a PDF file
  const checkIfPdf = (stringPath) => {
    // Ensure stringPath exists AND is a string
    if (!stringPath || typeof stringPath !== 'string') return false;
    return stringPath.startsWith('data:application/pdf') || stringPath.toLowerCase().endsWith('.pdf');
  };

  // Keep track of whether initial or changed value is a PDF file
  useEffect(() => {
    // If preview is a File object, check its mime-type instead of using string methods
    if (preview instanceof File) {
      setIsPdf(preview.type === 'application/pdf');
    } else {
      setIsPdf(checkIfPdf(preview));
    }
  }, [preview]);

  const handleFile = useCallback(
    (file) => {
      setError('');
      if (!file) return;
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File too large. Max ${maxSizeMB}MB.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        onChange && onChange(file, e.target.result);
      };
      reader.readAsDataURL(file);
    },
    [maxSizeMB, onChange]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      handleFile(file);
    },
    [handleFile]
  );

  const handleChange = (e) => {
    handleFile(e.target.files[0]);
    e.target.value = '';
  };

  const removeImage = () => {
    setPreview(null);
    onChange && onChange(null, null);
  };

  // Helper to safely extract filename from string or object
  const getFileName = () => {
    if (value instanceof File) return value.name;
    if (typeof value === 'string' && !value.startsWith('data:')) return value.split('/').pop();
    return 'PDF Document Attached';
  };

  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}

      {preview ? (
        <div className="relative group rounded-xl overflow-hidden border border-brand-border">
          {/* Conditional Rendering: Render File Icon for PDFs, Img tag for Images */}
          {isPdf ? (
            <div className="w-full h-40 bg-gray-50 flex flex-col items-center justify-center gap-2 border border-dashed border-gray-200">
              <MdInsertDriveFile className="text-red-500 text-5xl" />
              <span className="text-xs font-medium text-gray-600 px-4 text-center truncate max-w-full">
                {getFileName()}
              </span>
            </div>
          ) : (
            <img
              src={typeof preview === 'string' ? preview : URL.createObjectURL(preview)}
              alt="Preview"
              className="w-full h-40 object-cover"
            />
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center z-10">
            <button
              type="button"
              onClick={removeImage}
              className="opacity-0 group-hover:opacity-100 transition-opacity w-9 h-9 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600"
            >
              <MdClose className="text-lg" />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm z-10">
            Click to change
          </div>
          {/* Hidden input to re-upload */}
          <input
            type="file"
            accept={accept}
            onChange={handleChange}
            className="absolute inset-0 opacity-0 cursor-pointer z-20"
          />
        </div>
      ) : (
        <label
          className={`drop-zone flex flex-col items-center justify-center gap-2 p-6 cursor-pointer min-h-[140px] ${
            dragging ? 'active' : ''
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
            dragging ? 'bg-primary-100' : 'bg-gray-100'
          }`}>
            {dragging ? (
              <MdImage className="text-primary-600 text-2xl" />
            ) : (
              <MdCloudUpload className="text-brand-gray text-2xl" />
            )}
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-brand-dark">
              {dragging ? 'Drop to upload' : 'Click to upload file'}
            </p>
            <p className="text-xs text-brand-gray mt-0.5">JPG, PNG, or PDF (Max {maxSizeMB}MB)</p>
          </div>
          <input
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
        </label>
      )}

      {error && (
        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

export default UploadBox;