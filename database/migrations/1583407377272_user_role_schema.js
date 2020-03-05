"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserRoleSchema extends Schema {
  up() {
    this.create("user_roles", table => {
      table.increments();
      table.string("user_role_label");
      table.timestamp("created_at").defaultTo(this.fn.now());
      table.timestamp("updated_at").defaultTo(this.fn.now());
    });
  }

  down() {
    this.drop("user_roles");
  }
}

module.exports = UserRoleSchema;
