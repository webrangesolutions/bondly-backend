import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/main.routes.js";
import http from "http";
import mongoose from "mongoose";
import expressSession from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createTransporter } from "./utils/mailer.js";
import GoogleStrategy from "passport-google-oauth2";
import passport from "passport";

// Required for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class App {
  constructor() {  
    dotenv.config()
    this.app = express();
    this.app.use(express.json());
    this.http = new http.Server(this.app);
    this.PORT = process.env.PORT || 8000;
    this.initMiddleware();
    this.connectToMongoDB();
    this.initRoutes();
    this.initPassport();

  }

  initPassport(){
    // Initialize Passport Google OAuth2 Strategy
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
      passReqToCallback: true
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        // Here you can check if the user exists in your database
        console.log(profile);
        // For example: const user = await User.findOrCreate({ googleId: profile.id });
        const user = { id: profile.id, displayName: profile.displayName, accessToken:accessToken }; // Example user object
        return done(null, user); // Pass user to serializeUser
      } catch (error) {
        return done(error, null); // Handle errors
      }
    }
    ));

    // Serialize the user into the session
    passport.serializeUser((user, done) => {
    done(null, user.id); // Store only the user ID in the session
    });

    // Deserialize the user from the session
    passport.deserializeUser(async (id, done) => {
    try {
      // Find the user by ID (this is where you typically query your database)
      // For example: const user = await User.findById(id);
      const user = { id, displayName: "John Doe" }; // Example user object
      done(null, user); // Pass the user object to the next middleware
    } catch (error) {
      done(error, null); // Handle errors
    }
    });
  }

  initMiddleware() {
    this.app.use(expressSession({
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false } // Set to true if using HTTPS
    }))
    this.app.use(cors());
    this.app.use(express.json());
     // Initialize Passport middleware
     this.app.use(passport.initialize());
     this.app.use(passport.session()); // Persist login sessions
  }

  connectToMongoDB() {
    const db = process.env.MONGODB_URI;
    mongoose.connect(
      db
    ).then((result)=>{
      console.log("database successfully connected");
    }).catch((err)=>{
      console.log(err)
      console.log("An error starting database occurred");
    });
  }

  initRoutes() {
    const publicPath = path.join(__dirname, "..", "public");
    this.app.use(express.static(publicPath));
    this.app.use("/", router);
  }

  createServer() {
    this.http.listen(this.PORT, () => {
      console.log("Server started at port 8000");
    });
  }
}