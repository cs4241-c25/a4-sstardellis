require('dotenv').config();

// required modules
const http = require("node:http"),
    fs = require("node:fs"),
    mime = require("mime"),
    dir = "public/",
    express = require('express'),
    MongoClient = require('mongodb').MongoClient,
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    GitHubStrategy = require('passport-github2').Strategy,
    expressSession = require('express-session'),
    app = express(),
    port = 3000,
    { ObjectId } = require('mongodb');

// mongoDB setup
const mongoUrl = process.env.MONGO_URL;
const database = "workoutLogger";
let db, workoutCollection, usersCollection;

// middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded request bodies
app.use(expressSession({
    secret: 'secret', // Secret for session encryption
    resave: false, // Don't resave sessions if not modified
    saveUninitialized: false // Don't save uninitialized sessions
}));

// passport setup for authentication
app.use(passport.initialize());
app.use(passport.session());


// cannot access index.html until authenticated
app.use(express.static(dir, {
    index: false }));

// setup MongoDB connection
MongoClient.connect(mongoUrl)
    .then(client => {
        console.log("MongoDB setup successful using database: " + database);
        db = client.db(database);

        // our collections to store our data
        workoutCollection = db.collection("workouts");
        usersCollection = db.collection("users");
    })
    .catch(error => console.error(error));


// setting up passport local strategy
passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            // find user by username
            const user = await usersCollection.findOne({ username: username });
            if (!user) {
                // user not found
                return done(null, false, {
                    message: 'Error: wrong username' });
            }
            if (user.password !== password) {
                /// wrong password
                return done(null, false, {
                    message: 'Error: wrong password' });
            }
            // authentication success
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// github strategy for authentication
passport.use(new GitHubStrategy({
    // variables from GitHub account
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    },

    async (accessToken, refreshToken, profile, done) => {
        try {
            // looking for user by GitHub ID
            let user = await usersCollection.findOne({ 
                githubID: profile.id
            });
            if (!user) {
                // if there isn't a GitHub user in the database
                const newUser = {
                    githubID: profile.id,
                    username: profile.username,
                    displayName: profile.displayName,
                    created: new Date()
                };
                
                // add new user to the collection
                const result = await usersCollection.insertOne(newUser);
                user = { ...newUser, _id: result.insertedId }; // create user ID
            }
            
            // success or error in authentication
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

// serializing user to store in session
passport.serializeUser((user, done) => done(null, user._id));

// deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        // looking for user and returning it
        const user = await usersCollection.findOne({ 
            _id: new ObjectId(id) 
        });
        done(null, user);
        // user cannot be found
    } catch (error) {
        done(error);
    }
});

// routes
    
// redirect to log in if not authenticated
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        // go to index.html if authenticated
        res.sendFile(__dirname + '/public/index.html');
    } else {

        // redirect to log in page if no valid credentials
        res.redirect('/login');
    }
});


// login page
app.get('/login', (req, res) => res.sendFile(__dirname + '/public/login.html'));

// login submission
app.post('/login', passport.authenticate('local', {
    // go to home page on success
    successRedirect: '/',

    // go to error login failed page
    failureRedirect: '/login?login-failed'
}));

// authenticate with github route
app.get('/auth/github', passport.authenticate('github'));

// callback route, similar to localp assport
app.get('/auth/github/callback',
    passport.authenticate('github', {
        successRedirect: '/',
        failureRedirect: '/login' // Redirect to login on failure
    })
);

// logout route
app.post('/logout', (req, res) => {
    req.logout(() => {

        // resets session
        req.session.destroy(() => res.redirect('/login'));
    });
});

// GET request for workouts
app.get("/workouts", isAuthenticated, async (req, res) => {
    try {
        // based on the user ID, get the workouts associated with that ID
        const workouts = await workoutCollection.find({ userId: req.user._id }).toArray();

        // return the json of the workout
        res.json(workouts);
    } catch (error) {
        console.error(error);
        res.status(500).send("GET request error");
    }
});

// POST requests for sending workouts to database
app.post("/workouts", isAuthenticated, async (req, res) => {
    try {

        // newWorkout is added based on the userID
        const newWorkout = { ...req.body, userId: req.user._id };
        // insert workout to database
        await workoutCollection.insertOne(newWorkout);

        // error messages
        res.status(201).send("Workout added successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("POST request error");
    }
});

// DELETE requests for deleting workouts
app.delete("/workouts/:id", isAuthenticated, async (req, res) => {
    try {

        // delete workout based on ID
        const result = await workoutCollection.deleteOne({
            _id: new ObjectId(req.params.id),
            userId: req.user._id
        });

        // error messages
        if (result.deletedCount === 1) {
            res.status(200).send("Workout deleted");
        } else {

            res.status(404).send("Workout ID not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("DELETE error");
    }
});


// PUT requests for updating workouts
app.put("/workouts/:id", isAuthenticated, async (req, res) => {
    try {
        // updating workout information from id
        const result = await workoutCollection.updateOne(
            { _id: new ObjectId(req.params.id), userId: req.user._id },
            { $set: req.body }
        );
        // messages to help know if update was successful or not
        if (result.modifiedCount === 1) {
            res.status(200).send("Workout updated");
        } else {
            // missing workout
            res.status(404).send("Workout ID not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("PUT request error");
    }
});

// checking if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).send("You are not authorized");
    }
}

// process.env.PORT references the port that Glitch uses
// the following line will either use the Glitch port or one that we provided
app.listen( process.env.PORT || port )