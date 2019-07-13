exports.up = function(knex, Promise) {
  return knex.schema.createTable("class", tbl => {
    tbl
      .string("id", 128)
      .primary()
      .notNullable();

    tbl
      .string("name", 128)
      .notNullable()
      .unique();

    tbl.string("grade", 128);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("class");
};
