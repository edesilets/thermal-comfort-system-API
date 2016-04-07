'use strict';

module.exports = require('express/lib/wiring/routes')

// create routes

// what to run for `GET /`
.root('root#root')

// standards RESTful routes
.resources('rules', { only: ['create', 'destroy']})


// users of the app have special requirements
.post('/sign-up', 'users#signup')
.post('/sign-in', 'users#signin')
.delete('/sign-out/:id', 'users#signout')
.patch('/change-password/:id', 'users#changepw')
.resources('users', { only: ['index', 'show'] })
// .resources('rules', { only: ['index', 'show', 'create','update','destroy'] });

// all routes created
;
