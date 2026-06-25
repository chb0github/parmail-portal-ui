import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type { AuthResponse, UnsubscribeRequest, VerifyEmailRequest, MailPiece, User } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle 401 errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(email: string, password: string, phone: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/register', {
      email,
      password,
      phone,
    });
    return response.data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  async verifyEmail(email: string, code: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/verify', {
      email,
      code,
    } as VerifyEmailRequest);
    return response.data;
  }

  async sendVerificationEmail(email: string): Promise<{ message: string }> {
    const response = await this.client.post('/auth/send-verification', { email });
    return response.data;
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
  }

  // User endpoints
  async getUser(): Promise<User> {
    const response = await this.client.get<User>('/user/profile');
    return response.data;
  }

  async updateUser(updates: Partial<User>): Promise<User> {
    const response = await this.client.patch<User>('/user/profile', updates);
    return response.data;
  }

  // Mail pieces endpoints
  async getMailPieces(
    page?: number,
    limit?: number,
    filters?: { mail_type?: string; date_range?: [string, string] }
  ): Promise<{ pieces: MailPiece[]; total: number }> {
    const response = await this.client.get('/user/mail', {
      params: {
        page: page || 1,
        limit: limit || 20,
        ...filters,
      },
    });
    return response.data;
  }

  async unsubscribe(mailPieceId: string, reason?: string): Promise<{ message: string }> {
    const response = await this.client.post('/user/mail/unsubscribe', {
      mail_piece_id: mailPieceId,
      reason,
    } as UnsubscribeRequest);
    return response.data;
  }

  async getMailPieceDetails(mailPieceId: string): Promise<MailPiece> {
    const response = await this.client.get<MailPiece>(`/user/mail/${mailPieceId}`);
    return response.data;
  }

  // USPS enrollment
  async startUSPSEnrollment(): Promise<{ session_id: string; verification_url: string }> {
    const response = await this.client.post('/user/usps/enroll');
    return response.data;
  }

  async completeUSPSEnrollment(sessionId: string, code: string): Promise<{ message: string }> {
    const response = await this.client.post('/user/usps/complete', {
      session_id: sessionId,
      code,
    });
    return response.data;
  }

  async checkUSPSStatus(): Promise<{ enrolled: boolean; last_sync?: string }> {
    const response = await this.client.get('/user/usps/status');
    return response.data;
  }

  // Error handling helper
  getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || error.message || 'An error occurred';
    }
    return 'An unexpected error occurred';
  }
}

export default new ApiClient();
