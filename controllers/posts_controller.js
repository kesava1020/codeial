const { request, response } = require('express');
const Post=require('../models/post');
const Comment=require('../models/comment');

module.exports.create= async function(request,response){

    try{
    await Post.create({
        content: request.body.content,
        user: request.user._id
    });

    request.flash('success','Post Published!');
    return response.redirect('back');

    }catch(err){
        request.flash('error',err);
        return response.redirect('back');
    }
};

module.exports.destroy= async function(request,response){

    try{
        let post = await Post.findById(request.params.id);

        //.id means convering the object id into string
        if(post.user == request.user.id){
            post.remove();

            await Comment.deleteMany({post: request.params.id});
            request.flash('success','Post and associated comments deleted!');
            return response.redirect('back');
        }else{
            request.flash('error','You cannnot delete this post!');
            return response.redirect('back');
        }
    }catch(err){
        request.flash('error',err);
        return response.redirect('back');
    }
};