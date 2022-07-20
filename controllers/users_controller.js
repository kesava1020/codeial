module.exports.profile=function(request,response){
    
    // return response.end('<h1>User profile!</h1>');

    return response.render('users',{
        title: "profile"
    });
};
