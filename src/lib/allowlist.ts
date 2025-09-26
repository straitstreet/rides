/**
 * Email allowlist system for Naija Rides
 * Controls who can access the application during initial launch
 */

// Define allowed email addresses and domains
const ALLOWED_EMAILS = [
  'straitstreetco@gmail.com',
  'oluwasanya.awe@gmail.com',
  // Add more specific emails here
];

const ALLOWED_DOMAINS = [
  // Add allowed domains here if needed
  // 'company.com',
];

/**
 * Check if an email address is allowed to access the application
 */
export function isEmailAllowed(email: string): boolean {
  if (!email) return false;

  const normalizedEmail = email.toLowerCase().trim();

  // Check specific emails
  if (ALLOWED_EMAILS.includes(normalizedEmail)) {
    return true;
  }

  // Check allowed domains
  const domain = normalizedEmail.split('@')[1];
  if (domain && ALLOWED_DOMAINS.includes(domain)) {
    return true;
  }

  return false;
}

/**
 * Add an email to the allowlist (for admin use)
 */
export function addEmailToAllowlist(email: string): boolean {
  const normalizedEmail = email.toLowerCase().trim();

  if (!ALLOWED_EMAILS.includes(normalizedEmail)) {
    ALLOWED_EMAILS.push(normalizedEmail);
    return true;
  }

  return false; // Already exists
}

/**
 * Remove an email from the allowlist (for admin use)
 */
export function removeEmailFromAllowlist(email: string): boolean {
  const normalizedEmail = email.toLowerCase().trim();
  const index = ALLOWED_EMAILS.indexOf(normalizedEmail);

  if (index > -1) {
    ALLOWED_EMAILS.splice(index, 1);
    return true;
  }

  return false; // Not found
}

/**
 * Get all allowed emails (for admin use)
 */
export function getAllowedEmails(): string[] {
  return [...ALLOWED_EMAILS];
}

/**
 * Get all allowed domains (for admin use)
 */
export function getAllowedDomains(): string[] {
  return [...ALLOWED_DOMAINS];
}