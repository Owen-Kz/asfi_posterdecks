const uploadPosterPage =  async(req,res)=>{
    if(req.cookies.posterUser && req.user){
      res.render("uploadPoster", {firstname:req.user.first_name, lastname:req.user.last_name, email:req.user.email, prefix:req.user.prefix})
    }else{
      res.render("loginExternal")
    }
  }

module.exports = uploadPosterPage