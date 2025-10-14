export const createBookingData = (contact, transferData, convert24to12Fn) => {
  return {
    name: contact.name,
    email: contact.email,
    phone: transferData.phone,
    service: transferData.service,
    branch: transferData.branch,
    date: transferData.date,
    time: convert24to12Fn(transferData.time),
    notes:
      transferData.notes ||
      `Transferred from contact inquiry: ${contact.message}`,
    contactId: contact.id,
  };
};

export const getInitialTransferData = () => ({
  phone: "",
  service: "consultation",
  branch: "villasis",
  date: "",
  time: "",
  notes: "",
});
