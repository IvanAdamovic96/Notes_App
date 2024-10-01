const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');




passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/google/callback"
},
async function(accessToken, refreshToken, profile, done){
    
    const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profileImage: profile.photos[0].value
    }

    try {
        
        let user =await User.findOne({ googleId: profile.id });
        
        if(user){
            done(null, user);
        }else{
            user = await User.create(newUser);
            done(null, user);
        }
    } catch (error) {
        console.log(error);
    }

}
));


router.get('/auth/google', passport.authenticate('google', {scope: ['email', 'profile']}));

router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/', successRedirect: '/dashboard'}));


//Close session
router.get('/logout', (req, res) =>{
    req.session.destroy(error => {
        if(error){
            console.log(error);
            res.send('Error logging out');
        }else{
            res.redirect('/');
        }
    });
});


//Router if something goes wrong
router.get('/login-failure', (req, res)=>{
    res.send('Something went wrong...');
})


//Successful auth
passport.serializeUser(function(user, done){
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });






module.exports = router;