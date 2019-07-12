exports.up = function(knex, Promise) {
  return knex.schema.createTable("sessions", tbl => {
    tbl
      .string("id", 128)
      .primary()
      .notNullable();

    tbl
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    tbl
      .integer("class_id")
      .unsigned()
      .references("id")
      .inTable("class")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    tbl.string("date", 120);
    // update date from front end or helper function

    tbl.integer("score").defaultTo(0); //Need front end or helper function on back end to update score

    tbl.string("lessonName"); //lesson Names
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("sessions");
};
