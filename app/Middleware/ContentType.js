'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class ContentType {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request }, next) {
    // Forces the server to display JSON for the validator instead of raw text
    // Added this because custom validation messages were not showing
    let headers = request.headers()
    headers.accept = 'application/json'

    // call next to advance the request
    await next()
  }
}

module.exports = ContentType
