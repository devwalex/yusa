'use strict'

const User = use('App/Models/User')

class UserController {
    async register({ response, request }){
        const { username, email, password } = request.post()
        const user = new User()
        user.username = username,
        user.email = email,
        user.password = password
        
        await user.save()
    }
}

module.exports = UserController
