const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./key');
const passport = require('passport');
const knex = require('knex')({
	client: 'mysql',
	connection: {
		host: '127.0.0.1',
		user: 'root',
		password: '',
		database : 'mem'
	}
});
passport.serializeUser((user,done)=>{
    done(null,user.id);
  });
passport.deserializeUser((id,done)=>{
	knex.select('*').from('users').where({
  		id: id
		}).then((user)=>{
		done(null,user);
	});
     
  });

// module.exports = function(passport)
// {
// 	passport.use(
// 	new GoogleStrategy({
// 		clientID:keys.googleClientID,
// 		clientSecret:keys.googleClientSecret,
// 		callbackURL:'/auth/google/redirect',
// 		proxy:true
// 	},(accessToken,refreshToken,profile,done)=>{
// passport.serializeUser((user,done)=>{
// 	done(null,true);
// 	});
// 	passport.deserializeUser((id,done)=>{
// 	done(null,true);
// 		// console.log(profile);
		
// 		const newUser = {
// 			name: profile.displayName,
// 			email: profile.emails[0].value,
// 			picture: profile.photos[0].value,
			
// 		};
		
// 		// knex('users').where({
// 		// email: profile.emails[0].value
// 		// })
// 		knex.select('*').from('users').where({
//   		email: profile.emails[0].value
// 		})
// 		.then((data)=> {
// 			if(!data.length){
// 				knex('users')
// 				.returning('id')
// 				.insert(newUser)
// 				.then((user)=>{console.log(user);
// 					 done(null,user);})
// 			}
// 			else{
// 				console.log("User exist" + JSON.stringify((data)));
// 				done(null,data);
// 			}
// 		});
		
// 		//done(null,true);
// 	});
	
// 	passport.serializeUser((user,done)=>{
// 	done(null,true);
// 	});
// 	passport.deserializeUser((id,done)=>{
// 	done(null,true);
// 	});
//   });
		
// 		module.exports = function(passport){
//   passport.use(
//     new GoogleStrategy({
//       clientID: keys.googleClientID,
//       clientSecret: keys.googleClientSecret,
//       callbackURL: '/auth/google/callback',
//       proxy: true
//     },(accessToken,refreshToken,profile,done)=>{
//       // console.log(accessToken);
//       // console.log(profile)

       
//       const newUser = {
//         googleID: profile.id,
//         firstName: profile.name.givenName,
//         lastName: profile.name.familyName,
//         email: profile.emails[0].value,
//         image: profile.photos[0].value
//       }
//       //Check for existing user
//       User.findOne({
//         googleID: profile.id
//       }).then(user => {
//         if(user){
//           //return user
//           done(null,user);
//         } else {
//           //Create User
//           new User(newUser)
//           .save()
//           .then(user => done(null,user));
//         }
//       })
//     })
//   );
//   passport.serializeUser((user,done)=>{
//     done(null,user.id);
//   });
//   passport.deserializeUser((id,done)=>{
//     User.findById(id).then(user=> done(null,user));
//   });
// }
	
		module.exports = function(passport){
  passport.use(
    new GoogleStrategy({
      clientID:keys.googleClientID,
		clientSecret:keys.googleClientSecret,
		callbackURL:'/auth/google/redirect',
		proxy:true
    },(accessToken,refreshToken,profile,done)=>{
      // console.log(accessToken);
      // console.log(profile)

       
      // const newUser = {
      //   googleID: profile.id,
      //   firstName: pro((file.name.givenName,
      //   lastName: profile.name.familyName,
      //   email: profile.emails[0].value,
      //   image: profile.photos[0].value
      // }
      //Check for existing user
      const newUser = { 
			name: profile.displayName,
			email: profile.emails[0].value,
			picture: profile.photos[0].value,
		  	id: profile.id
			
		};
  //     User.findOne({
  //       googleID: profile.id
  //     }).then(user => {
  //       if(user){
  //         //return user
  //         done(null,user);
  //       } else {
  //         //Create User
  //         new User(newUser)
  //         .save()
  //         .then(user => done(null,user));
  //       }
  //     })
  //   })
  // );
  knex.select('*').from('users').where({
  		email: profile.emails[0].value
		})
		.then((data)=> {
			if(!data.length){
				knex('users')
				.insert(newUser)
				.then((user)=>{console.log("yooo" + user);
							   console.log(newUser);
					 done(null,newUser);})
			}
			else{
				console.log("User exist" + JSON.stringify((data[0])));
				done(null,data[0]);
			}
		});
		
//   passport.serializeUser((user,done)=>{
//     done(null,true);
//   });
//   passport.deserializeUser((id,done)=>{
// done(null,true);
//   });
}))}
	
