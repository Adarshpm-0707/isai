export function validateEmail(email) {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export function validatePhone(phone) {
  if (!phone) return false;
  // Standard Indian 10-digit mobile number pattern
  const re = /^[6-9]\d{9}$/;
  return re.test(String(phone).replace(/[\s-+]/g, ''));
}

export function validatePincode(pin) {
  if (!pin) return false;
  // Standard Indian 6-digit postal code
  const re = /^\d{6}$/;
  return re.test(String(pin).trim());
}

export function validateRequired(value) {
  if (value === null || value === undefined) return false;
  return String(value).trim().length > 0;
}
