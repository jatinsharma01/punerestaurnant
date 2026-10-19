/**
 * Customer and Booking input validation utilities.
 */

export function validateIndianMobileNumber(phone: string): {
  valid: boolean;
  sanitized: string;
  error?: string;
} {
  const digits = phone.replace(/[^0-9]/g, "");
  // If user entered +91, remove the leading 91 if length is 12
  let cleanDigits = digits;
  if (digits.length === 12 && digits.startsWith("91")) {
    cleanDigits = digits.slice(2);
  }

  if (cleanDigits.length !== 10) {
    return {
      valid: false,
      sanitized: cleanDigits,
      error: "Please enter a valid 10-digit Indian mobile number.",
    };
  }

  // Must begin with 6, 7, 8, or 9
  if (!/^[6-9]\d{9}$/.test(cleanDigits)) {
    return {
      valid: false,
      sanitized: cleanDigits,
      error: "Indian mobile numbers must begin with 6, 7, 8, or 9.",
    };
  }

  return {
    valid: true,
    sanitized: cleanDigits,
  };
}

export function validateEmail(email: string): boolean {
  if (!email || email.trim() === "") return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

export function validateCustomerName(name: string): {
  valid: boolean;
  error?: string;
} {
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return { valid: false, error: "Name must be at least 2 characters." };
  }
  if (trimmed.length > 50) {
    return { valid: false, error: "Name cannot exceed 50 characters." };
  }
  return { valid: true };
}
