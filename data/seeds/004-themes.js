exports.seed = function(knex, Promise) {
  return knex('themes').insert([
    {
      id: 1,
      name: "animals"
    },
    {
      id: 2,
      name: "vehicles"
    },
  ]);
};