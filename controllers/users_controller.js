const User = require("../models/user");

module.exports.profile=function(request,response){
    User.findById(request.params.id, function(err,user){
        return response.render('users_profile',{
            title: 'User Profile',
            profile_user: user
        });
    });

};

module.exports.update=function(request,response){
    if(request.user.id == request.params.id){
        User.findByIdAndUpdate(request.params.id, request.body, function(err, user){
            return response.redirect('back');
        });
    }else{
        return response.status(401).send('Unauthorized');
    }
}

//render the sign up page
module.exports.signUp = function(request,response){

    if(request.isAuthenticated()){
        return response.redirect('/users/profile');
    }

    return response.render('user_sign_up',{
        title:"Codeial | Sign Up"
    });
};

//render the sign in page
module.exports.signIn = function(request,response){

    if(request.isAuthenticated()){
        return response.redirect('/users/profile');
    }

    return response.render('user_sign_in',{
        title:"Codeial | Sign In"
    });
};

//get the sign up data
module.exports.create=function(request,response){
    if(request.body.password != request.body.confirm_password){
        return response.redirect('back');
    }

    User.findOne({email: request.body.email},function(err,user){
        if(err){console.log('error in finding user in signing up'); return;}

        if(!user){
            User.create(request.body,function(err,user){
                if(err){console.log('error in creating user while sigining up'); return;}

                return response.redirect('/users/sign-in');
            })
        }else{
            return response.redirect('back');
        }
    })

}

//sign in and create a session for user
module.exports.createSession=function(request,response){
    return response.redirect('/');
}

module.exports.destroySession=function(request,response){
    request.logout(function(err){
        if(err){console.log(err);}
    });

    return response.redirect('/');
}