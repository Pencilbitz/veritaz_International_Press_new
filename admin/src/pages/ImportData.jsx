import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MdCloudUpload, MdCheckCircle, MdErrorOutline, MdChevronLeft } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const ImportData = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [dataSummary, setDataSummary] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/json' && !selectedFile.name.endsWith('.json')) {
        setError('Please select a valid JSON file.');
        setFile(null);
        setParsedData(null);
        setDataSummary(null);
        return;
      }
      
      setError('');
      setFile(selectedFile);
      setImportResult(null);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          let json = JSON.parse(event.target.result);
          
          if (Array.isArray(json)) {
            const fileName = selectedFile.name.toLowerCase();
            if (json.length > 0) {
              if (fileName.includes('book') || json[0].isbn !== undefined || json[0].price !== undefined) json = { books: json };
              else if (fileName.includes('event') || json[0].eventTitle !== undefined || json[0].collegeName !== undefined) {
                if (fileName.includes('completed')) {
                  json = json.map(e => ({ ...e, status: 'Completed' }));
                }
                json = { events: json };
              }
              else if (fileName.includes('conference') || json[0].conferenceName !== undefined) json = { conferences: json };
              else if (fileName.includes('testimonial') || json[0].rating !== undefined || json[0].role !== undefined) json = { testimonials: json };
              else json = { events: json }; // fallback
            } else {
              json = {};
            }
          }

          setParsedData(json);
          
          const summary = [];
          if (json.books && Array.isArray(json.books)) summary.push(`${json.books.length} Books`);
          if (json.conferences && Array.isArray(json.conferences)) summary.push(`${json.conferences.length} Conferences`);
          if (json.events && Array.isArray(json.events)) summary.push(`${json.events.length} Events`);
          if (json.testimonials && Array.isArray(json.testimonials)) summary.push(`${json.testimonials.length} Testimonials`);
          
          if (summary.length === 0) {
            setError('JSON file does not contain valid arrays for books, conferences, events, or testimonials.');
            setParsedData(null);
            setDataSummary(null);
          } else {
            setDataSummary(summary.join(', '));
          }
        } catch (err) {
          setError('Failed to parse JSON file. Ensure it is valid JSON.');
          setParsedData(null);
          setDataSummary(null);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!parsedData) return;
    
    setIsImporting(true);
    setImportResult(null);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData),
      });

      const result = await response.json();
      
      if (response.ok) {
        setImportResult(result.summary);
      } else {
        setError(result.message || 'Error occurred during import.');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 transition-colors"
        >
          <MdChevronLeft className="text-xl mr-1" />
          Go Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Import Data</h1>
        <p className="text-gray-500 text-sm mt-1">Upload a JSON file to bulk import books, conferences, events, and testimonials.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            JSON File Upload
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors">
            <div className="space-y-1 text-center">
              <MdCloudUpload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" accept=".json" className="sr-only" onChange={handleFileChange} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">.json up to 10MB</p>
            </div>
          </div>
          {file && (
             <p className="mt-3 text-sm text-gray-600">
               Selected file: <span className="font-semibold">{file.name}</span>
             </p>
          )}
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2">
              <MdErrorOutline className="text-lg" />
              {error}
            </div>
          )}
        </div>
      </div>

      {dataSummary && !importResult && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 rounded-xl border border-blue-100 p-6 mb-6"
        >
          <h3 className="text-lg font-medium text-blue-900 mb-2">Data Summary</h3>
          <p className="text-blue-700 mb-4">
            Found the following items ready to import: <br/>
            <strong>{dataSummary}</strong>
          </p>
          <button
            onClick={handleImport}
            disabled={isImporting}
            className={`px-4 py-2 rounded-lg font-medium text-white transition-all ${
              isImporting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
            }`}
          >
            {isImporting ? 'Importing...' : 'Confirm & Import to Database'}
          </button>
        </motion.div>
      )}

      {importResult && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 rounded-xl border border-green-200 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <MdCheckCircle className="text-2xl text-green-600" />
            <h3 className="text-lg font-bold text-green-900">Import Completed</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(importResult).map(([key, stats]) => (
              (stats.success > 0 || stats.failed > 0) && (
                <div key={key} className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">{key}</p>
                  <div className="flex gap-4">
                    <div className="text-green-600">
                      <span className="text-xl font-bold">{stats.success}</span> <span className="text-xs">OK</span>
                    </div>
                    {stats.failed > 0 && (
                      <div className="text-red-500">
                        <span className="text-xl font-bold">{stats.failed}</span> <span className="text-xs">Fail</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ImportData;
