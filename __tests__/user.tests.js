const request = require('supertest');
const server = require('../api/server.js');

const db = require('../data/dbConfig.js');
const Users = require('../api/helpers/usersHelper.js');

// GET
describe('GET /users', () => {
    // cleanup for db
    afterEach(async () => {
        await db('users').truncate();
    });

    it('should return 200', async () => {
        const res = await request(server).get('/users');
        expect(res.status).toBe(200);
    });

    it('should return users', async () => {
        const res = await request(server).get('/users');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]); 
    });

    it('should return all users in db', async () => {
        // id should be a string!
        const user = [
            {
                id: "1",
                firstname: "Lisa",
                lastname: "Jones",
                username: "lijones",
                password: "test",
                email: "jones@gmail.com",
                role: "teacher"
            }
        ];

        await db('users').insert(user);

        const res = await request(server).get('/users');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(user);
    });
});

// GET by Id
describe('getUserById', () => {
    // cleanup for db
    afterEach(async () => {
        await db('users').truncate();
    });

    it('finds a user by id', async () => {
        await db('users').insert([
            { 
                id: "1",
                firstname: "Lisa",
                lastname: "Jones",
                username: "lijones",
                password: "test",
                email: "jones@gmail.com",
                role: "teacher" 
            },
            { 
                id: "2",
                firstname: "Jack",
                lastname: "Jones",
                username: "jjones",
                password: "test",
                email: "jjones@gmail.com",
                role: "teacher"
            }
        ]);

        const user = await Users.getUserById("2");

        expect(user.email).toEqual("jjones@gmail.com");
    });

    it('returns undefined of invalid id', async () => {
        const user = await Users.getUserById("2");

        expect(user).toBeUndefined();
    });
});

// POST
describe('addUser', () => {
    // cleanup for db
    afterEach(async () => {
       await db('users').truncate();
    });

    it('should insert users into the db', async () => {
        // await db('users').truncate();
        await Users.addUser({ 
            firstname: "Lisa",
            lastname: "Jones",
            username: "lijones",
            password: "test",
            email: "jones@gmail.com",
            role: "teacher" 
        });
        await Users.addUser({ 
            firstname: "Jack",
            lastname: "Jones",
            username: "jjones",
            password: "test",
            email: "jjones@gmail.com",
            role: "teacher"
        });

        const users = await db('users');

        expect(users).toHaveLength(2);
        expect(users[0].firstname).toBe("Lisa");
    });

    it('should return a status code of 201', async () => {
        let response = await request(server).post('/users').send({ id: "1",
        firstname: "Lisa",
        lastname: "Jones",
        username: "lijones",
        password: "test",
        email: "jones@gmail.com",
        role: "teacher" });

        expect(response.status).toBe(201);
    });

    it('should return the new user on insert', async () => {
        const user = await Users.addUser({ id: "1",
        firstname: "Lisa",
        lastname: "Jones",
        username: "lijones",
        password: "test",
        email: "jones@gmail.com",
        role: "teacher" });

        expect(user).toEqual({ id: "1",
        firstname: "Lisa",
        lastname: "Jones",
        username: "lijones",
        password: "test",
        email: "jones@gmail.com",
        role: "teacher" });
    });

    it('should return a `422` status code if firstname, lastname, username, password, email, role fields are not included inside the body', async () => {
        let response = await request(server).post('/users').send({ role: "teacher" });

        expect(response.status).toBe(422);
    });
});

// PUT

// DELETE