export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface DeliveryDetails {
  senderName: string;
  senderEmail: string;
  // recipientName: string;
  // recipientEmail: string;
  message: string;
}

export const EMPTY_DETAILS: DeliveryDetails = {
  senderName: "",
  senderEmail: "",
  // recipientName: "",
  // recipientEmail: "",
  message: "",
};
