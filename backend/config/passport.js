import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0]?.value;
        const existingUser = await User.findOne({email});
        //case 1: User exists with Google Provider ->..> login
        if(existingUser && existingUser.provider === "google") {
            return done(null,existingUser);
        }

        //case 2: User exists with localProvider -...> block google login
        if(existingUser && existingUser.provider === "local") {
            return done(null, false, {msg: "This email is already registered with email/password. Please use that method to log in.",})
        }

        //case 3: new EMAIL -> register with google
        const newUser = new User({
            googleId: profile.id,
            email,
            name: profile.displayName,
            provider: "google",
        })
        await newUser.save();
        return done(null, newUser);
    } catch(error) {
        return done(error, null);
    } 
}))

export default passport;

