module.exports.home=function(request,response){
    console.log(request.cookies);
    response.cookie('User_id',25);
    return response.render('home',{
        title: "Home"
    });
};

//modules.exports.actionname= function(request,response){...};