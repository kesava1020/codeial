const User = require("../models/user");
const fs=require('fs');
const path=require('path');

module.exports.profile=function(request,response){
    User.findById(request.params.id, function(err,user){
        return response.render('users_profile',{
            title: 'User Profile',
            profile_user: user
        });
    });

};

module.exports.update= async function(request,response){
    // if(request.user.id == request.params.id){
    //     User.findByIdAndUpdate(request.params.id, request.body, function(err, user){
    //         request.flash('success', 'Updated!');
    //         return response.redirect('back');
    //     });
    // }else{
    //     request.flash('error', 'Unauthorized!');
    //     return response.status(401).send('Unauthorized');
    // }

    if(request.user.id == request.params.id){
        try{
            let user=await User.findById(request.params.id);
            User.uploadedAvatar(request,response,function(err){
                if(err){console.log('*****Multer Error: ',err)};

                console.log(request.file);
                user.name=request.body.name;
                user.email=request.body.email;

                if(request.file){

                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                    //this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar=User.avatarPath + '/' + request.file.filename;
                }
                user.save();
                return response.redirect('back');
            });
        }catch{
            request.flash('error',err);
            return response.redirect('back');
        }
    }else{
        request.flash('error', 'Unauthorized!');
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
        request.flash('error', 'Passwords do not match');
        return response.redirect('back');
    }

    User.findOne({email: request.body.email},function(err,user){
        if(err){request.flash('error', err); return;}

        if(!user){
            User.create(request.body,function(err,user){
                if(err){request.flash('error', err); return;}

                return response.redirect('/users/sign-in');
            })
        }else{
            request.flash('success', 'You have signed up, login to continue!');
            return response.redirect('back');
        }
    });

}

//sign in and create a session for user
module.exports.createSession=function(request,response){
    request.flash('success','Logged in Successfully');
    return response.redirect('/');
}

module.exports.destroySession=function(request,response){
    request.logout(function(err){
        if(err){request.flash('error', err); return;}
        
        request.flash('success','You have logged out!');
        return response.redirect('/');
    });

    
}