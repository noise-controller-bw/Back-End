# BACK END FOR THE NOISE CONTROLLER PROJECT

**API:** https://noise-controller-buildweek.herokuapp.com/

## Table of Contents

- [Description](#Description)
- [MVP](#MVP)
- [Stretch](#Stretch)
- [Resources](#Resources)
   - [Authentication](#Authentication)
        - [Register](#Register)
        - [Login](#Login)
   - [Users](#Users)
        - [GET all users](#GET-all-users)
        - [GET user by id](#GET-user-by-id)
        - [GET sessions by user id)](#GET_sessions_by_user_id)
        - [GET classes by user id](#GET_classes_by_user_id)
        - [POST /users](#AddNewUser)
        - [DELETE /users/:id](#DeleteUser)
        - [PUT /users/:id](#EditUser)
   - [Sessions](#Sessions)
   - [Classes](#Classes)

# DESCRIPTION

_**Pitch:**_ As a teacher, it can be hard to control the noise level in your classroom! You need an app that holds kids attention, and is sensitive to the noise level in the room to motivate them to stay quiet. While some exist, they seem to encourage kids to yell (like balls that bounce higher if you yell louder). This app will reveal unique animals (choose a theme for this app) only if it's quiet enough, keeping the kids quiet.

# MVP

* Onboarding process for new teacher to sign up, including their class name.
* Main page: Every 'x' number of seconds a new creature comes out if it's quiet enough. If the noise level in the room reaches a certain point, the animals are all scared away. This will involve a listener to detect sound.
* Ability for the user to set how sensitive they want the microphone to be. Ability for user to set how many seconds they want between a new animal coming out (could also be random).
* Show a live score on the page, and final score page at the end of each day. (ie start at 100 and -10 every time they scare the animals.  You choose how to score)
* Page for the class to view their daily score records over time

# Stretch

* Show a 'streak counter' to track how many days the class goes without scaring off the fish.
* Create additional visual effects/themes for the class to choose from. (forest, ocean, desert, spiders, dinos, etc.)
* Ability for a teacher to have multiple classes, and a page to view a list of their classes.

# Endpoinds

## Authentication

### Register

**[POST]**

**URL:** `/register`

**Payload:**
```js
{
    "firstname": "Alan",
    "lastname": "Turing",
    "username": "Enigma",
    "password": "super%password",
    "email": "turing@email.me",
    "role": "teacher" // optional, default to teacher
}
```
**Returns:** a user object and the authentication token.

Example:
```js
{
    "user": {
        "id": "774a744d-6cb3-4a41-b45d-0ef94b9d2af7",
        "firstname": "Alan",
        "lastname": "Turing",
        "username": "Enigma",
        "email": "turing@email.me",
        "role": "teacher"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoiNzc0YTc0NGQtNmNiMy00YTQxLWI0NWQtMGVmOTRiOWQyYWY3IiwidXNlcm5hbWUiOiJNdGgiLCJyb2xlcyI6InRlYWNoZXIiLCJpYXQiOjE1NjMzMTQ4NzQsImV4cCI6MTU2MzQwMTI3NH0.UFGfIRyHym3sVwi9xkfOmQ9QdjJ9OQehFr00Hl9ZwYw"
}
```

### Login

**[POST]**

**URL:** `/login`

**Payload:**
```js
{
    "username": "Enigma",
    "password": "super%password"
}
```

**Returns:**
Example:
```js
{
    "message": "Welcome Enigma!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoiNGRhYTFhMmYtMDdhNi00NWQ0LTkxMWQtYzQyNjJlNmM1NmZmIiwidXNlcm5hbWUiOiJFbmlnbWEiLCJyb2xlcyI6InRlYWNoZXIiLCJpYXQiOjE1NjMzMjI2MDksImV4cCI6MTU2MzQwOTAwOX0.hqB2hZ9HJjEiwbZpZXYfPTgDmjAfzE2MpJFLJlVKeJM",
    "user": {
        "id": "4daa1a2f-07a6-45d4-911d-c4262e6c56ff",
        "firstname": "Alan",
        "lastname": "Turing",
        "username": "Enigma",
        "email": "turing@email.me",
        "role": "teacher"
    }
}
```

## Users

### [GET] all users

**URL:** /users

**Returns:** an array of user objects

Example:
```js
{
    "id": "1",
    "firstname": "Kasia",
    "lastname": "Bondarava",
    "username": "kbondarava",
    "email": "kbondarava@email.me",
    "role": "teacher"
}
```

### [GET] user by id

**URL:** /users/:id

**Returns:** a user object

Example:
```js
{
    "id": "2",
    "firstname": "Levi",
    "lastname": "Simpson",
    "username": "levisimpson",
    "email": "levisimpson@email.me",
    "role": "teacher"
}
```

### [GET] sessions by user id

**URL:**  /users/:id/sessions

**Returns:** an array of session objects for particular user

Example:
```js
    {
        "id": "1",
        "date": "",
        "score": 100,
        "lessonName": "Math",
        "name": "Ms. Angela's",
        "grade": "1st"
    }
```



### [GET] classes by user id

**URL:**  /users/:id/classes

**Returns:** an array of session objects for particular user

```js
{
    "id": "1",
    "name": "Ms. Angela's",
    "grade": "1st"
}
```

### [POST /users] create new user

### [DELETE /users/:id] delete user

### [PUT /users/:id] edit user information

## Sessions

## Classes