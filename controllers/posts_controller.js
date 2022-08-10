const Post=require('../models/post');
const Comment=require('../models/comment');

module.exports.create= async function(request,response){

    try{
    let post = await Post.create({
        content: request.body.content,
        user: request.user._id
    });

    if(request.xhr){

        // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
        // post = await post.populate('user', 'name').execPopulate();
        let post_detail = await Post.findById(post._id).populate("user");

        // request.flash('success','Post Published!');
        return response.status(200).json({
            data: {
                post: post_detail
            },
            message: "Post created!",
            
        });
    }

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

            if(request.xhr){
                return response.status(200).json({
                    data: {
                        post_id: request.params.id
                    },
                    message: "Post deleted"
                });
            }

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