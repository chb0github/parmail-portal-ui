import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function SettingsPage() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaveMessage('Settings saved successfully');
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <nav className="space-y-1">
              <a
                href="#account"
                className="block px-3 py-2 rounded-md bg-blue-50 text-blue-600 font-medium"
              >
                Account
              </a>
              <a href="#preferences" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                Preferences
              </a>
              <a href="#notifications" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                Notifications
              </a>
              <a href="#usps" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                USPS Integration
              </a>
              <a href="#privacy" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                Privacy & Security
              </a>
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Account Section */}
            <div id="account" className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Account</h2>

              {saveMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
                  {saveMessage}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Contact support to change your email address
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    defaultValue={user?.phone || ''}
                    placeholder="(555) 555-1234"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Change Password
                  </label>
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium">
                    Update Password
                  </button>
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div id="preferences" className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Preferences</h2>

              <div className="space-y-4">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                  <span className="ml-3 text-gray-700">
                    Show images in mail previews
                  </span>
                </label>

                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                  <span className="ml-3 text-gray-700">
                    Auto-update mail from USPS
                  </span>
                </label>

                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                  <span className="ml-3 text-gray-700">
                    Hide mail older than 30 days
                  </span>
                </label>
              </div>
            </div>

            {/* Notifications Section */}
            <div id="notifications" className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Notifications</h2>

              <div className="space-y-4">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                  <span className="ml-3 text-gray-700">
                    Email when new mail arrives
                  </span>
                </label>

                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                  <span className="ml-3 text-gray-700">
                    Notify when mail is undeliverable
                  </span>
                </label>

                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                  <span className="ml-3 text-gray-700">
                    Weekly digest of mail summary
                  </span>
                </label>
              </div>
            </div>

            {/* USPS Integration */}
            <div id="usps" className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">USPS Integration</h2>

              <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                <p className="text-sm text-blue-900">
                  <strong>Status:</strong> Not connected
                </p>
              </div>

              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
                Connect USPS Account
              </button>
            </div>

            {/* Privacy & Security */}
            <div id="privacy" className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Privacy & Security</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-700 font-medium mb-2">Data Retention</p>
                  <p className="text-sm text-gray-600">
                    Your mail data is retained for 12 months from the postmark date.
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-700 font-medium mb-2">Delete Account</p>
                  <p className="text-sm text-gray-600 mb-3">
                    Permanently delete your account and all associated data.
                  </p>
                  <button className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 font-medium">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
