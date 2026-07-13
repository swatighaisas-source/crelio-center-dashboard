export type PasswordDeliveryMethod = "manual" | "email";

const PASSWORD_MIN_LENGTH = 8;

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password.trim()) {
    return { valid: false, error: "Password is required." };
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { valid: false, error: "Password must be at least 8 characters long." };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain at least 1 lowercase letter." };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least 1 uppercase letter." };
  }
  if (!/\d/.test(password)) {
    return { valid: false, error: "Password must contain at least 1 digit." };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, error: "Password must contain at least 1 special character." };
  }
  return { valid: true };
}

export function validateEmail(email: string): { valid: boolean; error?: string } {
  const trimmed = email.trim();
  if (!trimmed) {
    return { valid: false, error: "Email is required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { valid: false, error: "Enter a valid email address." };
  }
  return { valid: true };
}

export function generateSecurePassword(): string {
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const upper = "ABCDEFGHJKMNPQRSTUVWXYZ";
  const digits = "23456789";
  const special = "!@#$%&*";
  const all = lower + upper + digits + special;

  const pick = (chars: string) => chars[Math.floor(Math.random() * chars.length)];
  const required = [pick(lower), pick(upper), pick(digits), pick(special)];
  const rest = Array.from({ length: 8 }, () => pick(all));
  const combined = [...required, ...rest];

  for (let i = combined.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  return combined.join("");
}
