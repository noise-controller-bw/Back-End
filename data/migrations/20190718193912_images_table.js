exports.up = function(knex, Promise) {
    return knex.schema.createTable("images", tbl => {

      tbl.increments("id");
  
      tbl.string("url").notNullable();

      tbl
        .integer("theme_id")
        .unsigned()
        .references("id")
        .inTable("themes")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
  
    });
};

exports.down = function(knex, Promise) {
return knex.schema.dropTableIfExists("images");
};  