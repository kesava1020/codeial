const Post=require('../models/post');
const User=require('../models/user');

module.exports.home=function(request,response){
    // console.log(request.cookies);
    // response.cookie('User_id',25);

    // Post.find({},function(err,posts){
    //     return response.render('home',{
    //         title: "Codeial | Home",
    //         posts: posts
    //     });
    // });

    //populate the suer of each post
    Post.find({})
    .populate('user')
    .populate({
        path:'comments',
        populate:{
            path:'user'
        }
    })
    .exec(function(err,posts){

        User.find({},function(err,users){
            return response.render('home',{
                title: "Codeial | Home",
                posts: posts,
                all_users: users
            });
        });

        // return response.render('home',{
        //     title: "Codeial | Home",
        //     posts: posts
        // });
    });
    // return response.render('home',{
    //     title: "Home"
    // });
};

//modules.exports.actionname= function(request,response){...};