"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserSchema extends Schema {
  up() {
    this.create("users", table => {
      table.increments();
      table.string("first_name");
      table.string("last_name");
      table
        .string("username", 80)
        .notNullable()
        .unique();
      table
        .string("email", 254)
        .notNullable()
        .unique();
      table.string("phone_no");
      table.string("gender");
      table.string("address");
      table.string("password", 60).notNullable();
      table.boolean("is_verify");
      table.string("verification_token");
      table.timestamps();
    });
  }

  down() {
    this.drop("users");
  }
}

module.exports = UserSchema;
