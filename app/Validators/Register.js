'use strict'

class Register {

  get validateAll() {
    return true
  }

  get rules() {
    return {
      // validation rules
      first_name: 'required|string',
      last_name: 'required|string',
      phone_no: 'required|unique:users',
      email: 'required|email|unique:users',
      password: 'required'
    }
  }

  get messages() {
    return {
      'first_name.required': 'Please provide your first name',
      'phone_no.required': 'Please provide a phone number',
      'phone_no.unique': 'This phone number is already registered',
      'email.required': 'Please provide an email address',
      'email.email': 'The email must be valid',
      'email.unique': 'This email has already been registered',
      'password.required': 'Please provide a good password'
    }
  }
}

module.exports = Register
