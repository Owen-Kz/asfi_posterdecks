const ChatPresenterPage = async (req,res) =>{
   
    if(req.cookies.posterUser){
    res.render("chatPresenterInterface", {email:req.params.spaceID, _token:req.cookies.posterUser, endPoint:process.env.ASFISCHOLAR_ENDPOINT})
    }else{
        res.render("loginExternal")
    }
}

module.exports = ChatPresenterPage