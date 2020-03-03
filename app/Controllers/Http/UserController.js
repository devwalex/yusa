"use strict";

const User = use("App/Models/User");
const Mail = use("Mail");
const Encryption = use("Encryption");
const randomString = require("random-string");
const Database = use("Database");
const sendSms = use("App/HelperFunctions/SendSms");

class UserController {
  async register({ response, request }) {
    const trx = await Database.beginTransaction();
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
      user.verification_token = randomString({ length: 20 });

      await user.save(trx);

      // Send Mail
      await Mail.raw(
        `<h1>
          <center> Verify Your Account</center>
        </h1>

        <p>Dear ${user.first_name}</p><br>
        <p>You have successfully register your acount with us at yusaapi.org. Click on the link below to verify your account.</p>
        <a href=localhost:3335/account/verify/${user.verification_token}>Verify</a>`,
        message => {
          message.from("api@yusa.com");
          message.to(user.email);
          message.subject("Account Verification Link - Yusa");
        }
      );

      // Send SMS
      sendSms(
        "Yusa",
        user.phone_no,
        "Thanks for registering with us at yusa. Check your email to verify account."
      );

      trx.commit();
      response.status(201).json({
        success: true,
        message: "Registered a new user successfully"
      });
    } catch (error) {
      console.log("User Registration Error >>>>", error);
      await trx.rollback();
      response.status(500).json({
        success: false,
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
        .first();
      user.is_login = 1;
      await user.save();

      response.status(200).json({
        success: true,
        message: "User Logged In Successfully",
        token
      });
    } catch (error) {
      console.log("User Login Error >>>>", error);
      if (error.authScheme === "jwt") {
        return response.status(400).json({
          success: false,
          message: "Incorrect Email Or password"
        });
      }
      response.status(500).json({
        success: false,
        message: "Internal Server Error",
        error
      });
    }
  }

  async viewAllUser({ response }) {
    try {
      // fetching all the registered user
      const users = await User.all();
      response.status(200).json({
        success: true,
        message: "All registered users",
        data: users
      });
    } catch (error) {
      console.log("All Users Error >>>", error);
      response.status(500).json({
        success: false,
        message: "Internal Server Error",
        error
      });
    }
  }

  async viewSingleUser({ response, params: { id } }) {
    try {
      // fetching user where id is equal to user id
      const user = await User.query()
        .where("id", id)
        .first();

      // check if user is found
      if (!user) {
        return response.status(404).json({
          success: false,
          message: "User Not Found"
        });
      }

      response.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.log("View Single User Error >>>", error);
      response.status(500).json({
        success: false,
        message: "Internal Server Error",
        error
      });
    }
  }

  async viewProfile({ response, auth }) {
    try {
      const authenticatedUser = await auth.current.user;
      const user = await User.query()
        .where("id", authenticatedUser.id)
        .first();

      if (!user) {
        return response.status(400).json({
          success: false,
          message: "You must be logged In to view your profile"
        });
      }
      response.status(200).json({
        success: true,
        message: `Welcome ${user.first_name}`,
        data: user
      });
    } catch (error) {
      console.log("View Profile Error >>>", error);
      response.status(500).json({
        success: false,
        message: "Internal Server Error",
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
        success: true,
        message: "Updated profile successfully"
      });
    } catch (error) {
      console.log("Edit Profile Error >>>", error);
      response.status(500).json({
        success: false,
        message: "Internal Server Error",
        error
      });
    }
  }

  async VerifyAccount({ response, params: { verification_token } }) {
    try {
      const user = await User.findByOrFail(
        "verification_token",
        verification_token
      );
      user.is_verify = 1;
      user.verification_token = null;
      await user.save();

      response.status(200).json({
        message: "Your account have been verified",
        data: user
      });
    } catch (error) {
      response.status(404).json({
        message: "Your account has been verified already.",
        error
      });
    }
  }

  async logOut({ response, auth }) {
    const user = await auth.current.user;

    // get the current user's token
    const token = auth.getAuthHeader();

    // revoke the token
    await user
      .tokens()
      .where("type", "api_token")
      .where("is_revoked", false)
      .where("token", Encryption.decrypt(token))
      .update({
        is_revoked: true
      });

    user.is_login = false;
    await user.save();

    return response.send({
      message: "Successfully logged out",
      data: user
    });
  }
}

module.exports = UserController;
