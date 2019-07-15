exports.seed = function(knex, Promise) {
  return knex('users').insert([
    {
      firstname: "Kasia",
      lastname: "Bondarava",
      username: "kbondarava",
      password: "test1",
      email: "kbondarava@email.me",
    },
    {
      firstname: "Levi",
      lastname: "Simpson",
      username: "levisimpson",
      password: "test2",
      email: "levisimpson@email.me",
    },
    {
      firstname: "Douglas",
      lastname: "Campbell",
      username: "douglascampbell",
      password: "test3",
      email: "douglascampbell@email.me",
    },
  ]);
};