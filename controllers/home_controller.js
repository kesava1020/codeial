const Post=require('../models/post');
const User=require('../models/user');

module.exports.home= async function(request,response){
    

    try{

        //populate the user of each post
        let posts = await Post.find({})
        .populate('user')
        .populate({
            path:'comments',
            populate:{
                path:'user'
            }
        });
    
        let users = await User.find({});

        return response.render('home',{
            title: "Codeial | Home",
            posts: posts,
            all_users: users
        });

    }catch(err){
        console.log('Error',err);
        return;
    }

    

};

//modules.exports.actionname= function(request,response){...};