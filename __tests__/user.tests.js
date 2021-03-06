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

    it('should return 401 to unauthorized user', async () => {
        const res = await request(server).get('/users');
        expect(res.status).toBe(401);
    });

    it('should return error message to unauthorized user', async () => {
        const res = await request(server).get('/users');
        expect(res.body.error).toEqual("No token provided, must be set on the Authorization Header"); 
    });

    it('should return message to the user with "teacher" role', async () => {
        let res = await request(server)
        .post("/register")
        .send({
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "teacher"
        });
        let token = res.body.token;

        const res2 = await request(server).get('/users').set('authorization', `${token}`);
        expect(res2.body.message).toEqual("You're not authorized to perform this action"); 
    });

    it('should return all users in db to the admin', async () => {
        // register the "admin"
        let res = await request(server)
        .post("/register")
        .send({
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "admin"
        });
        let token = res.body.token;
        
        // add user
        // id should be a string!
        const user = [
            {
                id: "1",
                firstname: "Lisa",
                lastname: "Jones",
                username: "lijones",
                password: "test",
                email: "jones@gmail.com",
                role: "admin"
            }
        ];

        await db('users').insert(user);

        const res2 = await request(server).get('/users').set('authorization', `${token}`);
        expect(res2.status).toBe(200);
        expect(res2.body).toHaveLength(2);
    });

   
});

// GET by Id

describe('getUserById', () => {
    // cleanup for db
    afterEach(async () => {
        await db('users').truncate();
    });

    it('finds a user by id', async () => {

        let res = await request(server)
        .post("/register")
        .send({
          id: "1",
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "teacher"
        });

        let token = res.body.token;

        await db('users').insert([
            { 
                id: "2",
                firstname: "Lisa",
                lastname: "Jones",
                username: "lijones",
                password: "test",
                email: "jones@gmail.com",
                role: "teacher" 
            },
            { 
                id: "3",
                firstname: "Jack",
                lastname: "Jones",
                username: "jjones",
                password: "test",
                email: "jjones@gmail.com",
                role: "teacher"
            }
        ]);

        const res2 = await request(server).get('/users/2').set('authorization', `${token}`);

        expect(res2.body.email).toEqual("jones@gmail.com");
    });

    it('returns undefined of invalid id', async () => {
        
        const user = await Users.getUserById("2");

        expect(user).toBeUndefined();
    });

    it('should return error message to unauthorized user', async () => {

        await Users.addUser({ 
            id: "1",
            firstname: "Lisa",
            lastname: "Jones",
            username: "lijones",
            password: "test",
            email: "jones@gmail.com"
        });

        const res = await request(server).get('/users/1');
        expect(res.body.error).toEqual("No token provided, must be set on the Authorization Header"); 
    });
});

// GET sessions by user ID

describe('getSessionsByUserId', () => {
    // cleanup for db
    afterEach(async () => {
        await db('users').truncate();
        await db('sessions').truncate();
        await db('class').truncate();
    });

    it('should return error message to unauthorized user', async () => {

        const res = await request(server).get('/users/1/sessions');
        expect(res.body.error).toEqual("No token provided, must be set on the Authorization Header"); 
    });

    it('should return 200 to authorized user', async () => {

        let res = await request(server)
        .post("/register")
        .send({
          id: "1",
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "admin"
        });

        let token = res.body.token;

        const res2 = await request(server).get('/users/1/sessions').set('authorization', `${token}`);
        expect(res2.status).toBe(200);
    });

    it('should return an empty array when there\'s no sessions for this user in the db to authorized user', async () => {

        let res = await request(server)
        .post("/register")
        .send({
          id: "1",
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "admin"
        });

        let token = res.body.token;


        const res2 = await request(server).get('/users/1/sessions').set('authorization', `${token}`);
        expect(res2.body).toEqual([]);
    });

    it('should return all sessions for the user in the db if authorized', async () => {
        let res = await request(server)
        .post("/register")
        .send({
          id: "2",
          ref_id: 2,
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "admin"
        });

        let token = res.body.token;

        // id should be a string!
        const user = [
            {
                id: "1",
                ref_id: 1,
                firstname: "Kasia",
                lastname: "Bondarava",
                username: "kbondarava",
                password: "test1",
                email: "kbondarava@email.me",
              },
        ];

        await db('users').insert(user);

        const sessions = [
            {
                id: "1",
                user_id: 1,
                class_id: 1,
                date: "",
                score: "100",
                lessonName: "Math",
            },
            {
                id: "2",
                user_id: 1,
                class_id: 2,
                date: "",
                score: "0",
                lessonName: "Science",
            },
            {
                id: "3",
                user_id: 1,
                class_id: 1,
                date: "",
                score: "10",
                lessonName: "Art",
            },
            {
                id: "4",
                user_id: 1,
                class_id: 2,
                date: "",
                score: "5",
                lessonName: "Handwriting",
            }
        ];

        await db('sessions').insert(sessions);

        const classes = [
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
            }
        ];

        await db('class').insert(classes);

        const res2 = await request(server).get('/users/1/sessions').set('authorization', `${token}`);
        expect(res2.status).toBe(200);
        expect(res2.body).toHaveLength(4);
    });
});

// GET classes by user ID

describe('getClassesByUserId', () => {
    // cleanup for db
    afterEach(async () => {
        await db('users').truncate();
        await db('sessions').truncate();
        await db('class').truncate();
    });

    it('should return 401 to unauthorized user', async () => {

        await Users.addUser({ 
            id: "1",
            firstname: "Lisa",
            lastname: "Jones",
            username: "lijones",
            password: "test",
            email: "jones@gmail.com",
            role: "teacher" 
        });

        const res = await request(server).get('/users/1/classes');
        expect(res.status).toBe(401);
    });

    it('should return 200 to authorized user', async () => {

        let res = await request(server)
        .post("/register")
        .send({
          id: "1",
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "admin"
        });
        
        let token = res.body.token;

        const res2 = await request(server).get('/users/1/classes').set('authorization', `${token}`);

        expect(res2.status).toBe(200);
    });

    it('should return an empty array when there\'s no classes for this user in the db to authorized user', async () => {

        let res = await request(server)
        .post("/register")
        .send({
          id: "1",
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "admin"
        });

        let token = res.body.token;

        const res2 = await request(server).get('/users/1/classes').set('authorization', `${token}`);

        expect(res2.body).toEqual([]);
    });

    it('should return all classes for the user in the db', async () => {

        let res = await request(server)
        .post("/register")
        .send({
          id: "2",
          ref_id: 2,
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "admin"
        });

        let token = res.body.token;

        // id should be a string!
        const user = [
            {
                id: "1",
                ref_id: 1,
                firstname: "Kasia",
                lastname: "Bondarava",
                username: "kbondarava",
                password: "test1",
                email: "kbondarava@email.me",
              },
        ];

        await db('users').insert(user);

        const sessions = [
            {
                id: "1",
                user_id: 1,
                class_id: 1,
                date: "",
                score: "100",
                lessonName: "Math",
            },
            {
                id: "2",
                user_id: 1,
                class_id: 2,
                date: "",
                score: "0",
                lessonName: "Science",
            },
            {
                id: "3",
                user_id: 1,
                class_id: 1,
                date: "",
                score: "10",
                lessonName: "Art",
            },
            {
                id: "4",
                user_id: 1,
                class_id: 2,
                date: "",
                score: "5",
                lessonName: "Handwriting",
            }
        ];

        await db('sessions').insert(sessions);

        const classes = [
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
            }
        ];

        await db('class').insert(classes);

        const res2 = await request(server).get('/users/1/classes').set('authorization', `${token}`);
        expect(res2.status).toBe(200);
        expect(res2.body).toHaveLength(2);
    });
});


// POST

describe('addUser', () => {
    // cleanup for db
    afterEach(async () => {
       await db('users').truncate();
    });

    it('should insert users into the db', async () => {
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

    it('should return 401 to unauthorized user', async () => {

        const res = await request(server).post('/users').send({ id: "1",
        firstname: "Lisa",
        lastname: "Jones",
        username: "lijones",
        password: "test",
        email: "jones@gmail.com",
        role: "teacher" });

        expect(res.status).toBe(401);
    });

    it('should return a status code of 201', async () => {

        let res = await request(server)
        .post("/register")
        .send({
          id: "2",
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "teacher"
        });

        let token = res.body.token;

        let response = await request(server).post('/users').set('authorization', `${token}`).send({ id: "1",
        firstname: "Lisa",
        lastname: "Jones",
        username: "lijones",
        password: "test",
        email: "jones@gmail.com",
        role: "teacher" });

        expect(response.status).toBe(201);
    });

    it('should return the new user on insert', async () => {
        const user = await Users.addUser({ 
            id: "1",
            ref_id: 1,
            firstname: "Lisa",
            lastname: "Jones",
            username: "lijones",
            password: "test",
            email: "jones@gmail.com",
            role: "teacher" 
        });

        expect(user).toEqual({ 
            id: "1",
            ref_id: 1,
            firstname: "Lisa",
            lastname: "Jones",
            username: "lijones",
            email: "jones@gmail.com",
            role: "teacher" 
        });
    });

    it('should return a `422` status code if firstname, lastname, username, password, email, role fields are not included inside the body', async () => {

        let res = await request(server)
        .post("/register")
        .send({
          id: "1",
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "teacher"
        });

        let token = res.body.token;

        let response = await request(server).post('/users').set('authorization', `${token}`).send({ role: "teacher" });

        expect(response.status).toBe(422);
    });
});

// PUT

describe('updateUser', () => {
    // cleanup for db
    afterEach(async () => {
        await db('users').truncate();
    });

    it('should return 401 to unauthorized user', async () => {

        await Users.addUser({ 
            id: "1",
            firstname: "Lisa",
            lastname: "Jones",
            username: "lijones",
            password: "test",
            email: "jones@gmail.com",
            role: "teacher" 
        });

        const updatedUser = {
            firstname: "Li",
            lastname: "Jo",
            username: "lijones",
            password: "test",
            email: "jones@gmail.com"
        }

        const res = await request(server).put("/users/1").send(updatedUser);

        expect(res.status).toBe(401);
    });

    it('should return 200 to authorized user', async () => {

        let res = await request(server)
        .post("/register")
        .send({
          id: "2",
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "admin"
        });

        let token = res.body.token;

        const user = await Users.addUser({
            id: "1",
            firstname: "Lisa",
            lastname: "Jones",
            username: "lijones",
            password: "test",
            email: "jones@gmail.com"
        });

        const updatedUser = {
            firstname: "Li",
            lastname: "Jo",
            username: "lijones",
            password: "test",
            email: "jones@gmail.com"
        }

        let response = await request(server).put("/users/1").set('authorization', `${token}`).send(updatedUser);
        expect(response.status).toBe(200);
    });

    it('should return `The user has been updated` to authorized user', async () => {

        let res = await request(server)
        .post("/register")
        .send({
          id: "2",
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "admin"
        });

        let token = res.body.token;

        const user = await Users.addUser({
            id: "1",
            firstname: "Lisa",
            lastname: "Jones",
            username: "lijones",
            password: "test",
            email: "jones@gmail.com"
        });

        const updatedUser = {
            id: "1",
            firstname: "Li",
            lastname: "Jo",
            username: "lijones",
            password: "test",
            email: "jones@gmail.com"
        }

        let response = await request(server).put("/users/1").set('authorization', `${token}`).send(updatedUser);

        expect(response.body.message).toEqual('The user has been updated');
    });

    it('should return 404 if there\'s no user with provided id to authorized user', async () => {

        let res = await request(server)
        .post("/register")
        .send({
          id: "2",
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "admin"
        });

        let token = res.body.token;

        const updatedUser = {
            firstname: "Li",
            lastname: "Jo",
            username: "lijones",
            password: "test",
            email: "jones@gmail.com",
            role: "teacher"
        }

        let response = await request(server).put("/users/1").set('authorization', `${token}`).send(updatedUser);
        expect(response.status).toBe(404);
    });

    it('should return "The user could not be found" if there\'s no user with provided id', async () => {

        let res = await request(server)
        .post("/register")
        .send({
          id: "2",
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "admin"
        });

        let token = res.body.token;

        const updatedUser = {
            firstname: "Li",
            lastname: "Jo",
            username: "lijones",
            password: "test",
            email: "jones@gmail.com",
            role: "teacher"
        }

        let response = await request(server).put("/users/1").set('authorization', `${token}`).send(updatedUser);

        expect(response.body).toEqual({ message: 'The user could not be found' });
    });
});

// DELETE

describe('deleteUser', () => {
    // cleanup for db
    afterEach(async () => {
        await db('users').truncate();
    });

    it('should return 200 for admin', async () => {
        let res = await request(server)
        .post("/register")
        .send({
          id: "1",
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "admin"
        });
        let token = res.body.token;

        let response = await request(server).delete('/users/1').set('authorization', `${token}`);
        expect(response.status).toBe(200);
    });

    it('should return `The user has been deleted` for admin', async () => {
        let res = await request(server)
        .post("/register")
        .send({
          id: "1",
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "admin"
        });
        let token = res.body.token;

        let response = await request(server).delete('/users/1').set('authorization', `${token}`);

        expect(response.body.message).toEqual('The user has been deleted');
    });

    it('should return 404 if there\'s no user with provided id for admin', async () => {
        let res = await request(server)
        .post("/register")
        .send({
          id: "1",
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "admin"
        });
        let token = res.body.token;

        let response = await request(server).delete('/users/2').set('authorization', `${token}`);

        expect(response.status).toBe(404);
    });

    it('should return "The user could not be found" if there\'s no user with provided id', async () => {

        let res = await request(server)
        .post("/register")
        .send({
          id: "1",
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "admin"
        });

        let token = res.body.token;

        let response = await request(server).delete('/users/2').set('authorization', `${token}`);

        expect(response.body).toEqual({ message: 'The user could not be found' });
    });

    it('should return 401 to unauthorized user', async () => {

        await Users.addUser({ 
            id: "1",
            firstname: "Lisa",
            lastname: "Jones",
            username: "lijones",
            password: "test",
            email: "jones@gmail.com",
            role: "teacher" 
        });

        const res = await request(server).delete('/users/1');
        expect(res.status).toBe(401);
    });

    it('should return error message to unauthorized user', async () => {

        await Users.addUser({ 
            id: "1",
            firstname: "Lisa",
            lastname: "Jones",
            username: "lijones",
            password: "test",
            email: "jones@gmail.com",
            role: "teacher" 
        });

        const res = await request(server).delete('/users/1');
        expect(res.body.error).toEqual("No token provided, must be set on the Authorization Header"); 
    });

    it('should return message to the user with "teacher" role', async () => {

        let res = await request(server)
        .post("/register")
        .send({
          id: "1",
          firstname: "Matt",
          lastname: "Smith",
          username: "Msmith9",
          password: "test",
          email: "smith5w@gmail.com",
          role: "teacher"
        });

        let token = res.body.token;

        const res2 = await request(server).delete('/users/1').set('authorization', `${token}`);

        expect(res2.body.message).toEqual("You're not authorized to perform this action"); 
    });
});