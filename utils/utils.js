const crypto = require('crypto');

/**
 * Generates a random alphanumeric string of a given length.
 * A modern, more secure replacement for the original CreateGUID function.
 * @param {number} length The desired length of the string.
 * @returns {string} The randomly generated string.
 */
const createGUID = (length) => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, length);   // return required number of characters
};

module.exports = {
    createGUID
}; 