export interface User {
  id: string;
  email: string;
  phone?: string;
  created_at: string;
  verified: boolean;
}

export interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  resolved: boolean;
}

export interface MailImage {
  image: string;
}

export interface MailPiece {
  id: string;
  from_address: Address;
  to_address: Address | null;
  mail_type: 'advertising' | 'financial' | 'personal' | 'government' | 'other';
  confidence: number;
  postmark_date: string;
  mailer: MailImage;
  content: MailImage;
}

export interface EmailManifest {
  id: string;
  model_id: string;
  processed_at: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
  mail_pieces: MailPiece[];
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface UnsubscribeRequest {
  mail_piece_id: string;
  reason?: string;
}
