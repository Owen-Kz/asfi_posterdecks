const ChatPresenterPage = async (req,res) =>{
   
    if(req.cookies.posterUser){
    res.render("chatPresenterInterface", {email:req.params.email, _token:req.cookies.posterUser})
    }else{
        res.render("loginExternal")
    }
}

module.exports = ChatPresenterPage