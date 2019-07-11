exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", users => {
    users
      .string("id", 128)
      .primary()
      .notNullable();
    users.string("firstname", 128).notNullable();
    users.string("lastname", 128).notNullable();
    users
      .string("username", 130)
      .notNullable()
      .unique();
    users.string("password", 130).notNullable();
    users
      .string("email", 130)
      .notNullable()
      .unique();
    users
      .string("role", 128)
      .notNullable()
      .defaultTo("teacher");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("users");
};
