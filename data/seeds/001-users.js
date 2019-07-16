exports.seed = function(knex, Promise) {
  return knex('users').insert([
    {
      id: "1",
      firstname: "Kasia",
      lastname: "Bondarava",
      username: "kbondarava",
      password: "test1",
      email: "kbondarava@email.me",
    },
    {
      id: "2",
      firstname: "Levi",
      lastname: "Simpson",
      username: "levisimpson",
      password: "test2",
      email: "levisimpson@email.me",
    },
    {
      id: "3",
      firstname: "Douglas",
      lastname: "Campbell",
      username: "douglascampbell",
      password: "test3",
      email: "douglascampbell@email.me",
    },
  ]);
};