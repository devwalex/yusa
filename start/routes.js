"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", () => {
  return { greeting: "Hello world in JSON" };
});

Route.post("register", "UserController.register").validator("Register");
Route.post("login", "UserController.login");
Route.get("users", "UserController.allUser");
Route.post(
  "account/verify/:verification_token",
  "UserController.VerifyAccount"
);
Route.get("users/:id", "UserController.showUser");
Route.group(() => {
  Route.get("profile", "UserController.profile");
  Route.put("edit-profile", "UserController.editProfile");
})
  .prefix("account")
  .middleware(["auth"]);
