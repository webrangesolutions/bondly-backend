import passport from "passport"





passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI,
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    console.log(request, accessToken, refreshToken, profile, done);
  }
));


const passportServices = {
    async test(){

    }
}

export default passportServices;