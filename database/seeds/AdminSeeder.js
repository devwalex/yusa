"use strict";

/*
|--------------------------------------------------------------------------
| AdminSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Database = use("Database");
const Hash = use("Hash");
class AdminSeeder {
  async run() {
    await Database.raw("SET FOREIGN_KEY_CHECKS = 0;");
    await Database.truncate("users");
    const encryptedPassword = await Hash.make("Yusa123");

    await Database.table("users").insert({
      first_name: "Yusa",
      last_name: "Admin",
      email: "dev@yusa.org",
      password: encryptedPassword,
      phone_no: "08105636337",
      gender: "Male",
      address: "24, Turner Eradiri, Lagos",
      username: "yusa",
      user_role_id: 1,
      is_verify: 1,
      is_login: 1
    });
    await Database.table("user_roles").insert([
      { user_role_label: "Admin" },
      { user_role_label: "User" }
    ]);
    await Database.raw("SET FOREIGN_KEY_CHECKS = 1;");
  }
}

module.exports = AdminSeeder;
