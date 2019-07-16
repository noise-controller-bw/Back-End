exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", tbl => {
    tbl.string("id", 128).notNullable();

    tbl.increments("ref_id");

    tbl.string("firstname", 128).notNullable();

    tbl.string("lastname", 128).notNullable();

    tbl
      .string("username", 130)
      .notNullable()
      .unique();

    tbl.string("password", 130).notNullable();

    tbl
      .string("email", 130)
      .notNullable()
      .unique();

    tbl
      .string("role", 128)
      .notNullable()
      .defaultTo("teacher");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("users");
};
