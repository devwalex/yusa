'use strict'

class Register {
  get rules () {
    return {
      // validation rules
      first_name: 'required|string',
      last_name: 'required|string',
      phone_no: 'required|unique:users',
      email: 'required|email|unique:users',
    }
  }

  get messages() {
    return {
      'first_name.required': 'You must provide your first name',
      'phone_no.required': 'You must provide a phone number',
      'phone_no.unique': 'This phone number is already registered',
      'email.required': 'Please provide an email address',
      'email.email': 'The email must be valid',
      'email.unique': 'This email has already been registered'
    }
  }
}

module.exports = Register
