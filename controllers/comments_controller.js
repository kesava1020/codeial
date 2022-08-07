const Comment=require('../models/comment');
const Post=require('../models/post');

module.exports.create=async function(request,response){

    try{

        let post = await Post.findById(request.body.post);
        
        if(post){
            let comment = await Comment.create({
                content: request.body.content,
                post: request.body.post,
                user: request.user._id
            });
            post.comments.push(comment);
            post.save();
            request.flash('success', 'Comment published!');

            response.redirect('/');
        }

    }catch(err){
        request.flash('error', err);
        return;
    }
    
};

module.exports.destroy=async function(request,response){
    try{
        let comment = await Comment.findById(request.params.id);

        if(comment.user==request.user.id){
            let postId=comment.post;

            comment.remove();

            let post = await Post.findByIdAndUpdate(postId, { $pull: {comments : request.params.id}});
            request.flash('success', 'Comment deleted!');
            return response.redirect('back');
        }else{
            request.flash('error', 'Unauthorized');
            return response.redirect('back');  
        }
    }catch(err){
        request.flash('error', err);
        return;
    }
    
}