export const getEmailTemplates = (contactName) => ({
  general: `Dear ${contactName},

Thank you for contacting us. We have received your message and will get back to you as soon as possible.

Best regards,
Diego Dental Clinic`,

  booking: `Dear ${contactName},

Thank you for your booking inquiry! We have received your request and will confirm your appointment details shortly.

Best regards,
Diego Dental Clinic`,

  support: `Dear ${contactName},

Thank you for reaching out. We're here to help and will respond to your inquiry soon.

Best regards,
Diego Dental Clinic`,
});

export const getEmailSubject = (templateKey) => {
  const subjects = {
    booking: "Booking Confirmation",
    support: "Support Response",
    general: "Re: Your Message",
  };
  return subjects[templateKey] || "Re: Your Message";
};
