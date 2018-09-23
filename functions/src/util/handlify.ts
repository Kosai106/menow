import { RequestHandler } from 'express';

/**
 * Converts request handlers that possibly return promises to something that is
 * compatible with expressjs' way of error handling.
 *
 * @param {RequestHandler} handler the method handler to execute.
 * @returns {RequestHandler} a new request handler that handles any promise errors that might occur.
 */
export function handlify(handler: RequestHandler): RequestHandler {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}
