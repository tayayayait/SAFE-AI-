export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Recipient {
  id: string;
  name: string;
  email: string;
  group: string;
}

export interface AlertHistory {
  id: string;
  sentAt: string;
  targetGroup: string;
  subject: string;
  status: 'success' | 'fail';
  failReason?: string;
  details?: {
    overview: string;
    legalBasis: string;
    penalty?: string;
    prevention: string;
    checklist: string[];
  };
}

export interface DisasterCase {
  id: string;
  date: string;
  title: string;
  analysisStatus: 'completed' | 'pending' | 'failed';
  location: string;
  cause: string;
  imageUrl?: string;
  ocrText?: string;
}

export interface Metric {
  label: string;
  value: number;
  unit: string;
  change?: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
}