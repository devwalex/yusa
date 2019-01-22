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

        response.status(200).json({
            message: 'Registered a new user successfully',
            data: user
        })
    }

    async login({ response, request, auth }){
        try {

            const { email, password } = request.all()
            const token = await auth.attempt(email, password)
            const user = await User.query()
            .where('email', email)
            .fetch()

            response.status(200).json({
                message: "User logged in",
                data: user,
                result: token
            })
            
        } catch (error) {
            response.status(401).json({
                error: error
            })
        }
    }

}

module.exports = UserController
