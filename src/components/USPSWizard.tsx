import { useState } from 'react';
import apiClient from '../api/client';

interface USPSWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

type WizardStep = 'confirm' | 'phone' | 'license' | 'review' | 'success';

export function USPSWizard({ isOpen, onClose, onComplete }: USPSWizardProps) {
  const [step, setStep] = useState<WizardStep>('confirm');
  const [phone, setPhone] = useState('');
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNext = async () => {
    setError(null);

    if (step === 'confirm') {
      setStep('phone');
    } else if (step === 'phone') {
      if (!phone.match(/^\d{10}$/)) {
        setError('Please enter a valid 10-digit phone number');
        return;
      }
      setStep('license');
    } else if (step === 'license') {
      setStep('review');
    } else if (step === 'review') {
      await handleEnroll();
    }
  };

  const handleEnroll = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.startUSPSEnrollment();
      // In a real app, open the USPS enrollment URL
      window.open(response.verification_url, '_blank');
      setStep('success');
    } catch (err) {
      setError(apiClient.getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('confirm');
    setPhone('');
    setLicenseFile(null);
    setError(null);
    onClose();
  };

  const handleComplete = () => {
    handleClose();
    onComplete?.();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <h2 className="text-xl font-bold">USPS Informed Delivery</h2>
          <p className="text-blue-100 text-sm mt-1">
            Step {step === 'confirm' ? 1 : step === 'phone' ? 2 : step === 'license' ? 3 : 4} of 4
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          {step === 'confirm' && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Verify USPS Account</h3>
              <p className="text-gray-600 mb-4">
                We'll help you verify your USPS account to automatically sync your Informed Delivery emails.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-gray-700">
                <p className="font-semibold mb-2">You'll need:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Phone number on file with USPS</li>
                  <li>Valid driver's license or state ID (optional)</li>
                </ul>
              </div>
            </div>
          )}

          {step === 'phone' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Phone Verification</h3>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="(555) 555-1234"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-2">Enter the phone number associated with your USPS account</p>
            </div>
          )}

          {step === 'license' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Driver's License (Optional)</h3>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Upload a photo of your ID
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLicenseFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="license-input"
                  disabled={isLoading}
                />
                <label htmlFor="license-input" className="cursor-pointer">
                  <p className="text-gray-600">
                    {licenseFile ? licenseFile.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-3">Your ID will be encrypted and used only for verification</p>
            </div>
          )}

          {step === 'review' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Review Information</h3>
              <div className="space-y-3 bg-gray-50 p-3 rounded">
                <div>
                  <p className="text-xs text-gray-500">Phone Number</p>
                  <p className="font-medium">{phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Driver's License</p>
                  <p className="font-medium">{licenseFile ? 'Attached' : 'Not provided'}</p>
                </div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center">
              <div className="mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl text-green-600">✓</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Enrollment Started</h3>
              <p className="text-gray-600 text-sm">
                USPS will send you a verification code. Once verified, we'll automatically sync your Informed Delivery emails.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex gap-3 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium disabled:opacity-50"
            disabled={isLoading}
          >
            {step === 'success' ? 'Done' : 'Cancel'}
          </button>
          {step !== 'success' && (
            <button
              onClick={handleNext}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Next'}
            </button>
          )}
          {step === 'success' && (
            <button
              onClick={handleComplete}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
