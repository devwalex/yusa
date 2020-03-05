"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class YusaAdmin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, response, auth }, next) {
    // call next to advance the request
    const authenticatedUser = await auth.getUser();
    if (authenticatedUser.user_role_id === 1) {
      await next();
    } else {
      response.status(401).json({
        success: false,
        message: "Unauthorized Access"
      });
    }
  }
}

module.exports = YusaAdmin;
