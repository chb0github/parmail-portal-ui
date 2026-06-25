import { useState } from 'react';
import type { MailPiece } from '../types';
import { UnsubscribeModal } from './UnsubscribeModal';

interface MailPieceCardProps {
  piece: MailPiece;
  onUnsubscribe?: (id: string, reason?: string) => Promise<void>;
}

const MAIL_TYPE_COLORS: Record<MailPiece['mail_type'], string> = {
  advertising: 'bg-blue-100 text-blue-800',
  financial: 'bg-green-100 text-green-800',
  personal: 'bg-purple-100 text-purple-800',
  government: 'bg-red-100 text-red-800',
  other: 'bg-gray-100 text-gray-800',
};

export function MailPieceCard({ piece, onUnsubscribe }: MailPieceCardProps) {
  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);

  const handleUnsubscribe = async (reason?: string) => {
    if (!onUnsubscribe) return;

    setIsUnsubscribing(true);
    try {
      await onUnsubscribe(piece.id, reason);
      setShowUnsubscribeModal(false);
    } catch (error) {
      console.error('Unsubscribe failed:', error);
    } finally {
      setIsUnsubscribing(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row">
          {/* Images */}
          <div className="md:w-1/3 bg-gray-100 flex gap-2 p-4">
            {piece.mailer?.image && (
              <img
                src={piece.mailer.image}
                alt="Mailer"
                className="w-1/2 h-48 object-cover rounded cursor-pointer hover:opacity-75 transition"
              />
            )}
            {piece.content?.image && (
              <img
                src={piece.content.image}
                alt="Content"
                className="w-1/2 h-48 object-cover rounded cursor-pointer hover:opacity-75 transition"
              />
            )}
          </div>

          {/* Details */}
          <div className="md:w-2/3 p-4 flex flex-col justify-between">
            <div>
              {/* From Address */}
              <div className="mb-3">
                <h3 className="font-semibold text-lg text-gray-900">
                  {piece.from_address?.name || 'Unknown Sender'}
                </h3>
                {piece.from_address?.street && (
                  <p className="text-sm text-gray-600">
                    {piece.from_address.street}
                    {piece.from_address.city && `, ${piece.from_address.city}`}
                    {piece.from_address.state && ` ${piece.from_address.state}`}
                    {piece.from_address.zip && ` ${piece.from_address.zip}`}
                  </p>
                )}
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    MAIL_TYPE_COLORS[piece.mail_type]
                  }`}
                >
                  {piece.mail_type}
                </span>
                <span className="text-xs text-gray-500">
                  Confidence: {Math.round(piece.confidence * 100)}%
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(piece.postmark_date)}
                </span>
              </div>

              {/* Address Resolution Status */}
              {piece.from_address && (
                <div className="text-xs text-gray-500 mb-2">
                  {piece.from_address.resolved ? (
                    <span className="text-green-600">✓ Address resolved</span>
                  ) : (
                    <span className="text-yellow-600">⚠ Address unresolved</span>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => setShowUnsubscribeModal(true)}
                className="flex-1 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition"
              >
                Unsubscribe
              </button>
              <button className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {showUnsubscribeModal && (
        <UnsubscribeModal
          isOpen={showUnsubscribeModal}
          isLoading={isUnsubscribing}
          senderName={piece.from_address?.name || 'this sender'}
          onConfirm={handleUnsubscribe}
          onCancel={() => setShowUnsubscribeModal(false)}
        />
      )}
    </>
  );
}
