// Email service utility for sending form data to roversmalaysia@gmail.com
export interface EmailFormData {
  name?: string;
  fullName?: string;
  email: string;
  phone?: string;
  country?: string;
  state?: string;
  userType?: string;
  sport?: string;
  sportCategory?: string;
  businessName?: string;
  formType?: string;
  message: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  messageId?: string;
}

export const sendEmail = async (
  formData: EmailFormData,
  formType: 'contact' | 'partners' | 'academy'
): Promise<EmailResponse> => {
  try {
    // Use the Jilani server API instead of separate server
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await fetch(`${API_URL}/api/rovers-website/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formData,
        formType
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to send email');
    }

    return result;
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
};
