/**
 * Checks if the input string follows the time format (HH:MM).
 * @param input - The input string to validate.
 * @returns True if the input is a valid time format, false otherwise.
 */
 export function isValidTimeFormat(input: string): boolean {
  const timeRegex = /^(?:[0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(input);
}