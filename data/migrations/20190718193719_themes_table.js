exports.up = function(knex, Promise) {
    return knex.schema.createTable("themes", tbl => {

      tbl.increments("id");
  
      tbl.string("name", 128).notNullable();
  
    });
};

exports.down = function(knex, Promise) {
return knex.schema.dropTableIfExists("themes");
};