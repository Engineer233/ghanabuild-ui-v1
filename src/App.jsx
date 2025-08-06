import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { trackEvent, logError, trackPerformance } from './monitoring.js';

// Accessible ValidationModal with focus trap
function ValidationModal({ isOpen, onClose, message, details }) {
  const modalRef = useRef(null);
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      tabIndex="-1"
      ref={modalRef}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <h3 className="text-lg font-semibold">Validation Error</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-600">{message}</p>
          {details && details.length > 0 && (
            <ul className="list-disc pl-5 mt-2 text-gray-600">
              {details.map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectForm({ onFormSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    region: "",
    projectType: "residential",
    totalFloorArea: "",
    numberOfBathrooms: "",
    numberOfFloors: "",
    preferredFinishQuality: "standard",
    includeExternalWorks: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalDetails, setModalDetails] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.region || !/^[a-zA-Z\s-]{2,}$/.test(formData.region)) {
      errors.push(
        "Region must be at least 2 characters long and contain only letters, spaces, or hyphens."
      );
    }
    const totalFloorArea = parseInt(formData.totalFloorArea, 10);
    if (
      isNaN(totalFloorArea) ||
      totalFloorArea < 500 ||
      totalFloorArea > 10000 ||
      totalFloorArea !== parseFloat(formData.totalFloorArea)
    ) {
      errors.push(
        "Total Floor Area must be an integer between 500 and 10,000 sq ft."
      );
    }
    const numberOfBathrooms = parseInt(formData.numberOfBathrooms, 10);
    if (
      isNaN(numberOfBathrooms) ||
      numberOfBathrooms < 1 ||
      numberOfBathrooms > 10 ||
      numberOfBathrooms !== parseFloat(formData.numberOfBathrooms)
    ) {
      errors.push(
        "Number of Bathrooms must be an integer between 1 and 10."
      );
    }
    const numberOfFloors = parseInt(formData.numberOfFloors, 10);
    if (
      isNaN(numberOfFloors) ||
      numberOfFloors < 1 ||
      numberOfFloors > 5 ||
      numberOfFloors !== parseFloat(formData.numberOfFloors)
    ) {
      errors.push(
        "Number of Floors must be an integer between 1 and 5."
      );
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    trackEvent('form_submission_attempt', {
      region: formData.region,
      projectType: formData.projectType,
      totalFloorArea: formData.totalFloorArea
    });
    
    const startTime = performance.now();
    const errors = validateForm();
    const validationTime = performance.now() - startTime;
    
    trackPerformance('form_validation', validationTime);
    
    if (errors.length > 0) {
      setModalMessage("Please correct the following errors:");
      setModalDetails(errors);
      setIsModalOpen(true);
      
      trackEvent('form_validation_failed', {
        errorCount: errors.length,
        errors: errors
      });
      return;
    }
    
    trackEvent('form_validation_success');
    onFormSubmit(formData);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <> 
      <section className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Enter Your Project Details</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700">
              Region
            </label>
            <input
              type="text"
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Accra, Kumasi"
            />
          </div>
          
          <div>
            <label htmlFor="projectType" className="block text-sm font-medium text-gray-700">
              Project Type
            </label>
            <select
              id="projectType"
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="totalFloorArea" className="block text-sm font-medium text-gray-700">
              Total Floor Area (sq ft)
            </label>
            <input
              type="number"
              id="totalFloorArea"
              name="totalFloorArea"
              value={formData.totalFloorArea}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., 2000"
              min="500"
              max="10000"
            />
          </div>
          
          <div>
            <label htmlFor="numberOfBathrooms" className="block text-sm font-medium text-gray-700">
              Number of Bathrooms
            </label>
            <input
              type="number"
              id="numberOfBathrooms"
              name="numberOfBathrooms"
              value={formData.numberOfBathrooms}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., 3"
              min="1"
              max="10"
            />
          </div>
          
          <div>
            <label htmlFor="numberOfFloors" className="block text-sm font-medium text-gray-700">
              Number of Floors
            </label>
            <input
              type="number"
              id="numberOfFloors"
              name="numberOfFloors"
              value={formData.numberOfFloors}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., 2"
              min="1"
              max="5"
            />
          </div>
          
          <div>
            <label htmlFor="preferredFinishQuality" className="block text-sm font-medium text-gray-700">
              Finish Quality
            </label>
            <select
              id="preferredFinishQuality"
              name="preferredFinishQuality"
              value={formData.preferredFinishQuality}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="basic">Basic</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="includeExternalWorks"
                checked={formData.includeExternalWorks}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Include External Works</span>
            </label>
          </div>
          
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Calculating Estimate...' : 'Get Cost Estimate'}
            </button>
          </div>
        </form>
      </section>
      <ValidationModal isOpen={isModalOpen} onClose={closeModal} message={modalMessage} details={modalDetails} />
    </>
  );
}

function EstimateSummary({ estimateData, isLoading, error, onRetry }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 10));
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <section className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Calculating Your Estimate...</h3>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-gray-600">Please wait while we calculate your construction estimate.</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-red-600">Error</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Try Again
        </button>
      </section>
    )
  }

  if (estimateData) {
    return (
      <section className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Your Cost Estimate</h3>
        {estimateData.totalCost && (
          <div className="mb-6">
            <p className="text-3xl font-bold text-blue-600 mb-2">
              ${estimateData.totalCost?.toLocaleString()}
            </p>
            <p className="text-gray-600">Total estimated cost</p>
          </div>
        )}
        
        {estimateData.details && (
          <div className="space-y-2">
            <h4 className="font-semibold">Cost Breakdown:</h4>
            {Object.entries(estimateData.details).map(([key, value]) => (
              <div key={key} className="flex justify-between py-1 border-b border-gray-100">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                <span>${value?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    )
  }

  return null
}

function App() {
  const [estimateData, setEstimateData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFormData, setLastFormData] = useState(null);

  const fetchEstimate = async (formData) => {
    setIsLoading(true);
    setError(null);
    
    const startTime = performance.now();
    
    try {
      trackEvent('api_request_started', {
        region: formData.region,
        projectType: formData.projectType
      });
      
      const { data } = await axios.post(
        "https://ghanabuild-backend.onrender.com/estimate",
        formData,
        { timeout: 15000 }
      );
      
      const duration = performance.now() - startTime;
      trackPerformance('api_request_success', duration, {
        totalCost: data.totalCost
      });
      
      trackEvent('estimate_received', {
        totalCost: data.totalCost,
        duration: Math.round(duration)
      });
      
      setEstimateData(data);
    } catch (err) {
      const duration = performance.now() - startTime;
      const errorMessage = err.response?.data?.error || err.message || "Failed to fetch estimate";
      
      logError(err, {
        formData,
        duration,
        endpoint: "https://ghanabuild-backend.onrender.com/estimate"
      });
      
      trackEvent('api_request_failed', {
        error: errorMessage,
        duration: Math.round(duration),
        statusCode: err.response?.status
      });
      
      setError(errorMessage);
      setEstimateData(
        err.response?.data?.details
          ? { details: err.response.data.details }
          : null
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    setLastFormData(formData);
    await fetchEstimate(formData);
  };

  const handleRetry = () => {
    trackEvent('retry_clicked');
    if (lastFormData) fetchEstimate(lastFormData);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Ghanabuild.AI</h1>
        <p className="text-sm">Advanced House Cost Estimator</p>
      </header>
      <main className="flex-grow p-4">
        <ProjectForm onFormSubmit={handleFormSubmit} isLoading={isLoading} />
        <EstimateSummary
          estimateData={estimateData}
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
        />
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2025 Ghanabuild.AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;