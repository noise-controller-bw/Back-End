exports.seed = function(knex, Promise) {
  return knex('class').insert([
    {
      id: "1",
      ref_id: 1,
      name: "Ms. Angela's",
      grade: "1st",
    },
    {
      id: "2",
      ref_id: 2,
      name: "Mr. Nick's",
      grade: "4th",
    },
  ]);
};