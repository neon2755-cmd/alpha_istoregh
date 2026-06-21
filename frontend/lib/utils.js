// frontend/lib/utils.js
import siteConfig from '../config';

/**
 * Formats a price number into a GH₵ string. Ghana prices are quoted in
 * whole cedis (no decimals), so we round and use locale grouping.
 * @param {number} price - The price to format.
 * @returns {string} Formatted price string (e.g., "GH₵9,499").
 */
export const formatPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) {
    return 'GH₵0';
  }
  return `GH₵${Math.round(price).toLocaleString('en-GH')}`;
};

/**
 * Generates a slug from a string, useful for URLs.
 * @param {string} str - The input string.
 * @returns {string} The generated slug.
 */
export const generateSlug = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The input string.
 * @returns {string} The capitalized string.
 */
export const capitalizeFirstLetter = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Checks if the current environment is the browser.
 * @returns {boolean} True if running in a browser environment, false otherwise.
 */
export const isBrowser = () => typeof window !== 'undefined';

/**
 * Safely access nested object properties.
 * @param {object} obj - The object to query.
 * @param {string[]} path - The path of properties to access (e.g., ['a', 'b', 'c']).
 * @param {*} [defaultValue=''] - The value to return if the path is not found.
 * @returns {*} The value at the given path or the default value.
 */
export const getNestedValue = (obj, path, defaultValue = '') => {
  return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue), obj);
};

/**
 * Truncates a string and adds ellipsis if it exceeds a maximum length.
 * @param {string} str - The string to truncate.
 * @param {number} maxLength - The maximum length of the string.
 * @returns {string} The truncated string.
 */
export const truncateString = (str, maxLength) => {
  if (!str || str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength) + '...';
};

/**
 * Validates an email address format.
 * @param {string} email - The email string to validate.
 * @returns {boolean} True if the email format is valid, false otherwise.
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validates a password strength (basic example).
 * @param {string} password - The password string to validate.
 * @returns {boolean} True if the password meets basic criteria, false otherwise.
 */
export const isValidPassword = (password) => {
  // Example: requires at least 8 characters
  return password.length >= 8;
};

/**
 * Dynamically applies Tailwind CSS classes based on theme colors.
 * Example usage: className={`text-primary hover:bg-primary-dark`}
 * This function is more for conceptual understanding; usually, you'd directly use
 * the config values in your JSX or a CSS module.
 */
export const getThemeColorClass = (colorKey, type = 'text') => {
  const color = siteConfig.colors.primary[colorKey] || siteConfig.colors.primary.DEFAULT;
  if (type === 'text') return `text-[${color}]`;
  if (type === 'bg') return `bg-[${color}]`;
  if (type === 'border') return `border-[${color}]`;
  return ''; // Default or handle other types
};

// Ghanaian phone number validation (basic example)
export const isValidGhanaianPhoneNumber = (phone) => {
  // Basic validation for common prefixes like 024, 020, 05x
  const phoneRegex = /^(?:0|\+233)\s?(?:20|23|24|26|27|28|50|54|55|56|57|59)\d{7}$/;
  return phoneRegex.test(phone);
};

export default {
  formatPrice,
  generateSlug,
  capitalizeFirstLetter,
  isBrowser,
  getNestedValue,
  truncateString,
  isValidEmail,
  isValidPassword,
  getThemeColorClass,
  isValidGhanaianPhoneNumber,
};