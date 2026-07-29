export interface ColdEmailFormData {
  recipientName: string;
  recipientEmail?: string;
  recipientCompany?: string;
  recipientRole?: string;
  senderName: string;
  senderEmail?: string;
  jobTitle: string;
  experience?: string;
  skills?: string;
  personalNote?: string;
}

export interface SavedColdEmail extends ColdEmailFormData {
  _id: string;
  userId: string;
  content: string;
  createdAt: string;
}
