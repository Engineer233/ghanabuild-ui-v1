import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { GDPRConsentBanner, PrivacyPolicyLink } from './components/GDPRConsent.jsx';
import { monitoring } from './monitoring.js';

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
    const errors = validateForm();
    if (errors.length > 0) {
      setModalMessage("Please correct the following errors:");
      setModalDetails(errors);
      setIsModalOpen(true);
      return;
    }
    onFormSubmit(formData);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <> 
      <section className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Enter Your Project Details</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
              Region *
            </label>
            <input
              type="text"
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Greater Accra"
              required
            />
          </div>

          <div>
            <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-1">
              Project Type
            </label>
            <select
              id="projectType"
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
            </select>
          </div>

          <div>
            <label htmlFor="totalFloorArea" className="block text-sm font-medium text-gray-700 mb-1">
              Total Floor Area (sq ft) *
            </label>
            <input
              type="number"
              id="totalFloorArea"
              name="totalFloorArea"
              value={formData.totalFloorArea}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 2500"
              min="500"
              max="10000"
              required
            />
          </div>

          <div>
            <label htmlFor="numberOfBathrooms" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Bathrooms *
            </label>
            <input
              type="number"
              id="numberOfBathrooms"
              name="numberOfBathrooms"
              value={formData.numberOfBathrooms}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 3"
              min="1"
              max="10"
              required
            />
          </div>

          <div>
            <label htmlFor="numberOfFloors" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Floors *
            </label>
            <input
              type="number"
              id="numberOfFloors"
              name="numberOfFloors"
              value={formData.numberOfFloors}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 2"
              min="1"
              max="5"
              required
            />
          </div>

          <div>
            <label htmlFor="preferredFinishQuality" className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Finish Quality
            </label>
            <select
              id="preferredFinishQuality"
              name="preferredFinishQuality"
              value={formData.preferredFinishQuality}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="basic">Basic</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="includeExternalWorks"
                checked={formData.includeExternalWorks}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Include External Works (landscaping, fencing, etc.)</span>
            </label>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Calculating..." : "Get Cost Estimate"}
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
      <motion.section 
        className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-4">Calculating Your Estimate...</h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-200" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">Please wait while we analyze your project requirements.</p>
      </motion.section>
    );
  }

  if (error) {
    return (
      <motion.section 
        className="max-w-4xl mx-auto mt-6 bg-red-50 border border-red-200 p-6 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-red-800">Error</h2>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Try Again
        </button>
      </motion.section>
    );
  }

  if (!estimateData) {
    return null;
  }

  return (
    <motion.section 
      className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4">Cost Estimate</h2>
      {estimateData.totalCost && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
          <h3 className="text-lg font-medium text-blue-800">Total Estimated Cost</h3>
          <p className="text-2xl font-bold text-blue-900">
            ${estimateData.totalCost?.toLocaleString() || 'N/A'}
          </p>
        </div>
      )}
      
      {estimateData.breakdown && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Cost Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(estimateData.breakdown).map(([category, cost]) => (
              <div key={category} className="bg-gray-50 p-3 rounded">
                <span className="font-medium capitalize">{category.replace(/([A-Z])/g, ' $1')}</span>
                <span className="float-right">${cost?.toLocaleString() || 'N/A'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {estimateData.details && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Details</h3>
          <p className="text-gray-700">{estimateData.details}</p>
        </div>
      )}
    </motion.section>
  );
}

function App() {
  const [estimateData, setEstimateData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFormData, setLastFormData] = useState(null);

  useEffect(() => {
    // Initialize monitoring services
    monitoring.init();
    monitoring.trackPageView('/', 'Home Page');

    // Listen for GDPR consent changes
    const handleConsentUpdate = (event) => {
      const consent = event.detail;
      if (consent.analytics) {
        monitoring.analytics.init();
      }
    };

    window.addEventListener('gdpr-consent-updated', handleConsentUpdate);
    return () => window.removeEventListener('gdpr-consent-updated', handleConsentUpdate);
  }, []);

  const fetchEstimate = async (formData) => {
    setIsLoading(true);
    setError(null);
    
    const timer = monitoring.datadog.startTimer('estimate_request');
    
    try {
      monitoring.trackUserAction('estimate_request_started', {
        region: formData.region,
        project_type: formData.projectType
      });

      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const { data } = await axios.post(
        `${apiUrl}/api/estimate`,
        formData,
        { timeout: 15000 }
      );
      
      setEstimateData(data);
      monitoring.trackCostEstimate(data, formData);
      monitoring.trackFormSubmission('cost_estimate_form', true);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || "Failed to fetch estimate";
      setError(errorMessage);
      
      monitoring.captureError(err, {
        form_data: formData,
        api_url: import.meta.env.VITE_API_BASE_URL
      });
      
      monitoring.trackFormSubmission('cost_estimate_form', false, {
        error_message: errorMessage
      });
      
      setEstimateData(
        err.response?.data?.details
          ? { details: err.response.data.details }
          : null
      );
    } finally {
      timer.end();
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    setLastFormData(formData);
    await fetchEstimate(formData);
  };

  const handleRetry = () => {
    if (lastFormData) {
      monitoring.trackUserAction('estimate_retry', {
        region: lastFormData.region,
        project_type: lastFormData.projectType
      });
      fetchEstimate(lastFormData);
    }
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
      
      {/* GDPR Consent Banner */}
      <GDPRConsentBanner />
      <PrivacyPolicyLink />
    </div>
  );
}

export default App;