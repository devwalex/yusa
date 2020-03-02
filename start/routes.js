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
  return { docs: "Yusa API Documentation" };
});

Route.post("register", "UserController.register").validator("Register");
Route.post("login", "UserController.login");
Route.post("logout", "UserController.logOut").middleware(["auth"]);
Route.get("users", "UserController.viewAllUser");
Route.get("account/verify/:verification_token", "UserController.VerifyAccount");
Route.get("users/:id", "UserController.viewSingleUser");
Route.group(() => {
  Route.get("profile", "UserController.viewProfile");
  Route.put("edit-profile", "UserController.editProfile");
})
  .prefix("account")
  .middleware(["auth"]);
