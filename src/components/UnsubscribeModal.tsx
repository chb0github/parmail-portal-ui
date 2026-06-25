import { useState } from 'react';

interface UnsubscribeModalProps {
  isOpen: boolean;
  isLoading: boolean;
  senderName: string;
  onConfirm: (reason?: string) => Promise<void>;
  onCancel: () => void;
}

const UNSUBSCRIBE_REASONS = [
  'Not interested',
  'Unwanted duplicate',
  'Prefer digital',
  'Wrong recipient',
  'Other',
];

export function UnsubscribeModal({
  isOpen,
  isLoading,
  senderName,
  onConfirm,
  onCancel,
}: UnsubscribeModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');

  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm(selectedReason);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Unsubscribe</h2>
        <p className="text-gray-600 mb-4">
          Are you sure you want to unsubscribe from mail from <strong>{senderName}</strong>?
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Why are you unsubscribing? (optional)
          </label>
          <div className="space-y-2">
            {UNSUBSCRIBE_REASONS.map((reason) => (
              <label key={reason} className="flex items-center">
                <input
                  type="radio"
                  name="reason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                  disabled={isLoading}
                />
                <span className="ml-3 text-sm text-gray-700">{reason}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium disabled:opacity-50"
          >
            {isLoading ? 'Unsubscribing...' : 'Unsubscribe'}
          </button>
        </div>
      </div>
    </div>
  );
}
