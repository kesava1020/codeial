const Comment=require('../models/comment');
const Post=require('../models/post');
const commentsMailer= require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');

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

            let comment_detail = await Comment.findById(comment._id).populate("user", 'name email').populate("post");
            // commentsMailer.newComment(comment_detail);
            let job = queue.create('emails', comment_detail).save(function(err){
                if(err){
                    console.log('Error in sending to the queue',err);
                    return;
                }

                console.log('job enqueued', job.id);
            });

            if (request.xhr){
                // Similar for comments to fetch the user's id!
                // comment = await comment.populate('user', 'name').execPopulate();
                
    
                return response.status(200).json({
                    data: {
                        comment: comment_detail
                    },
                    message: "Post created!"
                });
            }
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

            // send the comment id which was deleted back to the views
            if (request.xhr){
                return response.status(200).json({
                    data: {
                        comment_id: comment._id
                    },
                    message: "Post deleted"
                });
            }
            
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