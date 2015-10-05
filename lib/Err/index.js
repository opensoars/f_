/**
 * Initialize or call this function to throw an error.
 * @module Err
 * @param {string} msg - Error message
 * @example
 * // Throw an error with the message `Something failed`
 * new Err('Something failed');
 * // Or like this
 * Err('Something failed');
 */
module.exports = function Err(msg) {
  throw new Error(msg || '');
};