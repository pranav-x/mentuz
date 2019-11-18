const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google',passport.authenticate('google',{scope:['profile','email']}));
router.get( '/google/callback',
    passport.authenticate( 'google', {
        failureRedirect: '/'}),function(req,res){
	res.redirect('/pdf');
});
router.get('/google/redirect',passport.authenticate('google'),(req,res)=>{
	res.redirect('/');
});

module.exports = router;