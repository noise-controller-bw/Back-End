exports.seed = function(knex, Promise) {
  return knex('users').insert([
    {
      id: "1",
      name: "Ms. Angela's",
      grade: "1st",
    },
    {
      id: "2",
      name: "Mr. Nick's",
      grade: "4th",
    },
  ]);
};