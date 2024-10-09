const loginPage = async (req,res) =>{
    if(req.cookies.posterUser){
        res.redirect("/uploadPoster")
    }else{
    res.render("loginExternal")
    }
}


module.exports = loginPage