"use strict";

const User = use("App/Models/User");

class UserController {
  async register({ response, request }) {
    try {
      // Getting the user input
      const {
        first_name,
        last_name,
        username,
        email,
        phone_no,
        password
      } = request.post();

      // Creating a new user object
      const user = new User();
      user.first_name = first_name;
      user.last_name = last_name;
      user.username = username;
      user.email = email;
      user.phone_no = phone_no;
      user.password = password;

      await user.save();

      response.status(200).json({
        message: "Registered a new user successfully",
        data: user
      });
    } catch (error) {
      response.status(401).json({
        message: "Unable to register user try again....",
        error
      });
    }
  }

  async login({ response, request, auth }) {
    try {
      // Getting the email and password from input field
      const { email, password } = request.all();
      // create a token and logging the user in.
      const token = await auth.attempt(email, password);
      // fetching the user details
      const user = await User.query()
        .where("email", email)
        .fetch();

      response.status(200).json({
        message: "User logged in",
        data: user,
        result: token
      });
    } catch (error) {
      response.status(401).json({
        message: "Unable to login user",
        error
      });
    }
  }

  async allUser({ response }) {
    try {
      // fetching all the registered user
      const users = await User.all();
      response.status(200).json({
        message: "All registered users",
        data: users
      });
    } catch (error) {
      response.status(401).json({
        message: "Users not found",
        error
      });
    }
  }

  async showUser({ response, params: { id } }) {
    try {
      // fetching user where id is equal to user id
      const user = await User.query()
        .where("id", id)
        .first();

      // check if user is found
      if (!user) {
        response.status(404).json({
          message: "User not found",
          error
        });
      } else {
        response.status(201).json({
          data: user
        });
      }
    } catch (error) {
      response.status(404).json({
        message: "User not found",
        error
      });
    }
  }

  async profile({ response, auth }) {
    try {
      const currentUser = await auth.current.user;
      const user = await User.query()
        .where("id", currentUser.id)
        .first();

      if (user) {
        response.status(201).json({
          message: `Welcome ${user.first_name}`,
          data: user
        });
      } else {
        response.status(400).json({
          message: "You must be logged In to view your profile"
        });
      }
    } catch (error) {
      response.status(401).json({
        message: "Unauthorized Request",
        error
      });
    }
  }

  async editProfile({ response, request, auth }) {
    try {
      const {
        first_name,
        last_name,
        username,
        gender,
        address
      } = request.post();

      const user = await auth.current.user;

      user.first_name = first_name;
      user.last_name = last_name;
      user.username = username;
      user.gender = gender;
      user.address = address;
      await user.save();

      response.status(201).json({
        message: "Updated profile successfully",
        data: user
      });
    } catch (error) {
      response.status(401).json({
        message: "Unauthorized",
        error
      });
    }
  }
}

module.exports = UserController;
