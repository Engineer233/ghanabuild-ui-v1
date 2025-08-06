import React, { useState, useEffect } from 'react';

export function GDPRConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem('gdpr-consent');
    if (!consent) {
      setShowBanner(true);
    } else {
      try {
        const savedPreferences = JSON.parse(consent);
        setPreferences(prev => ({ ...prev, ...savedPreferences }));
      } catch {
        setShowBanner(true);
      }
    }
  }, []);

  const saveConsent = (prefs) => {
    const consentData = {
      ...prefs,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    localStorage.setItem('gdpr-consent', JSON.stringify(consentData));
    setPreferences(prefs);
    setShowBanner(false);

    // Initialize monitoring based on consent
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gdpr-consent-updated', {
        detail: consentData
      }));
    }
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    });
  };

  const rejectOptional = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    });
  };

  const handleCustomize = () => {
    saveConsent(preferences);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg z-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">We value your privacy</h3>
            <p className="text-sm text-gray-300 mb-4 lg:mb-0">
              We use cookies and similar technologies to provide, protect and improve our services. 
              Some are necessary for our website to work. For optional cookies, we need your consent. 
              You can change your preferences at any time.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
            <button
              onClick={rejectOptional}
              className="px-4 py-2 text-sm border border-gray-600 rounded hover:bg-gray-800 transition-colors"
            >
              Reject Optional
            </button>
            
            <details className="relative">
              <summary className="px-4 py-2 text-sm border border-gray-600 rounded hover:bg-gray-800 transition-colors cursor-pointer list-none">
                Customize
              </summary>
              
              <div className="absolute bottom-full left-0 right-0 bg-gray-800 border border-gray-600 rounded p-4 mb-2 min-w-80">
                <h4 className="font-semibold mb-3">Cookie Preferences</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Necessary</label>
                      <p className="text-xs text-gray-400">Required for basic website functionality</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="ml-2"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Analytics</label>
                      <p className="text-xs text-gray-400">Help us understand how you use our website</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                      className="ml-2"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Functional</label>
                      <p className="text-xs text-gray-400">Remember your preferences and settings</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(e) => setPreferences(prev => ({ ...prev, functional: e.target.checked }))}
                      className="ml-2"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Marketing</label>
                      <p className="text-xs text-gray-400">Personalize ads and content</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                      className="ml-2"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleCustomize}
                  className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </details>
            
            <button
              onClick={acceptAll}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-400">
          <p>
            By continuing to use our website, you consent to our use of cookies. 
            Learn more in our{' '}
            <a href="/privacy-policy" className="text-blue-400 hover:text-blue-300 underline">
              Privacy Policy
            </a>{' '}
            and{' '}
            <a href="/cookie-policy" className="text-blue-400 hover:text-blue-300 underline">
              Cookie Policy
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export function PrivacyPolicyLink() {
  return (
    <div className="fixed bottom-4 left-4">
      <button
        onClick={() => {
          localStorage.removeItem('gdpr-consent');
          window.location.reload();
        }}
        className="text-xs text-gray-500 hover:text-gray-700 underline"
      >
        Cookie Settings
      </button>
    </div>
  );
}