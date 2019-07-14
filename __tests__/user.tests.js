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

// POST


// PUT

// DELETE