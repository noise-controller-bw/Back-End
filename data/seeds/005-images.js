exports.seed = function(knex, Promise) {
  return knex('images').insert([
    {
      id: 1,
      url: "https://dog",
      theme_id: 1
    },
    {
      id: 2,
      url: "https://cat",
      theme_id: 1
    },
    {
      id: 3,
      url: "https://zebra",
      theme_id: 1
    },
    {
      id: 4,
      url: "https://fish",
      theme_id: 1
    },
    {
      id: 5,
      url: "https://train",
      theme_id: 2
    },
    {
      id: 6,
      url: "https://car",
      theme_id: 2
    },
    {
      id: 7,
      url: "https://truck",
      theme_id: 2
    },
  ]);
};