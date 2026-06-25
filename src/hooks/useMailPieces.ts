import { useState, useEffect } from 'react';
import type { MailPiece } from '../types';
import apiClient from '../api/client';

interface UseMailPiecesOptions {
  page?: number;
  limit?: number;
  mailType?: string;
  dateRange?: [string, string];
}

export function useMailPieces(options: UseMailPiecesOptions = {}) {
  const [pieces, setPieces] = useState<MailPiece[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPieces();
  }, [options.page, options.limit, options.mailType]);

  const fetchPieces = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getMailPieces(options.page, options.limit, {
        mail_type: options.mailType,
        date_range: options.dateRange,
      });
      setPieces(response.pieces);
      setTotal(response.total);
    } catch (err) {
      setError(apiClient.getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribe = async (mailPieceId: string, reason?: string) => {
    try {
      await apiClient.unsubscribe(mailPieceId, reason);
      // Remove from local state
      setPieces((prev) => prev.filter((p) => p.id !== mailPieceId));
      setTotal((prev) => Math.max(0, prev - 1));
    } catch (err) {
      throw new Error(apiClient.getErrorMessage(err));
    }
  };

  return {
    pieces,
    total,
    isLoading,
    error,
    refetch: fetchPieces,
    unsubscribe,
  };
}
