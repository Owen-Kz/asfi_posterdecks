const ChatPresenterPage = async (req,res) =>{
    res.render("chatPresenterInterface", {email:req.params.email})
}

module.exports = ChatPresenterPage