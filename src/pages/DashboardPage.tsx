import { useState } from 'react';
import { MailPieceCard } from '../components/MailPieceCard';
import { USPSWizard } from '../components/USPSWizard';
import { useMailPieces } from '../hooks/useMailPieces';
import type { MailPiece } from '../types';

// Mock data for demonstration
const MOCK_MAIL_PIECES: MailPiece[] = [
  {
    id: '046a09c35047f728',
    from_address: {
      name: 'Amazon Marketing',
      street: '410 Terry Ave N',
      city: 'Seattle',
      state: 'WA',
      zip: '98109',
      resolved: true,
    },
    to_address: null,
    mail_type: 'advertising',
    confidence: 0.95,
    postmark_date: '2026-06-20',
    mailer: {
      image: 'https://via.placeholder.com/150x200?text=Amazon+Mail',
    },
    content: {
      image: 'https://via.placeholder.com/150x200?text=Amazon+Content',
    },
  },
  {
    id: '1234567890abcdef',
    from_address: {
      name: 'Chase Bank',
      street: '100 Park Avenue',
      city: 'New York',
      state: 'NY',
      zip: '10017',
      resolved: true,
    },
    to_address: null,
    mail_type: 'financial',
    confidence: 0.98,
    postmark_date: '2026-06-19',
    mailer: {
      image: 'https://via.placeholder.com/150x200?text=Chase+Mail',
    },
    content: {
      image: 'https://via.placeholder.com/150x200?text=Chase+Statement',
    },
  },
  {
    id: 'abcdef1234567890',
    from_address: {
      name: 'Department of Motor Vehicles',
      street: '1100 Stockton St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      resolved: true,
    },
    to_address: null,
    mail_type: 'government',
    confidence: 0.92,
    postmark_date: '2026-06-18',
    mailer: {
      image: 'https://via.placeholder.com/150x200?text=DMV+Mail',
    },
    content: {
      image: 'https://via.placeholder.com/150x200?text=DMV+Notice',
    },
  },
];

export function DashboardPage() {
  const [mailPieces, setMailPieces] = useState<MailPiece[]>(MOCK_MAIL_PIECES);
  const [selectedMailType, setSelectedMailType] = useState<string>('');
  const [showUSPSWizard, setShowUSPSWizard] = useState(false);
  const { unsubscribe } = useMailPieces();

  const filteredPieces = selectedMailType
    ? mailPieces.filter((p) => p.mail_type === selectedMailType)
    : mailPieces;

  const handleUnsubscribe = async (mailPieceId: string, reason?: string) => {
    try {
      await unsubscribe(mailPieceId, reason);
      // Remove from local state
      setMailPieces((prev) => prev.filter((p) => p.id !== mailPieceId));
    } catch (error) {
      console.error('Unsubscribe failed:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Mail</h1>
              <p className="text-gray-600 mt-1">
                {filteredPieces.length} pieces · {MOCK_MAIL_PIECES.length} total
              </p>
            </div>
            <button
              onClick={() => setShowUSPSWizard(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              + Connect USPS
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedMailType('')}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
                !selectedMailType
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Mail
            </button>
            {['advertising', 'financial', 'personal', 'government', 'other'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedMailType(type)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition capitalize ${
                  selectedMailType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredPieces.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg">No mail pieces found</p>
            <p className="text-gray-400 text-sm mt-2">
              {selectedMailType
                ? 'Try selecting a different mail type'
                : 'Connect your USPS account to get started'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPieces.map((piece) => (
              <MailPieceCard
                key={piece.id}
                piece={piece}
                onUnsubscribe={handleUnsubscribe}
              />
            ))}
          </div>
        )}
      </div>

      {/* USPS Wizard Modal */}
      <USPSWizard
        isOpen={showUSPSWizard}
        onClose={() => setShowUSPSWizard(false)}
        onComplete={() => {
          setShowUSPSWizard(false);
          // Refresh mail pieces
        }}
      />
    </div>
  );
}
