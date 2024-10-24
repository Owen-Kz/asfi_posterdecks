const { DeletePoster } = require("../routes/queries")

const deletePoster = async (req,res)=>{
    if(req.user){
    const posterId = req.params.posterID
    const presenterEmail = req.user.email
    console.log(posterId, presenterEmail)
    const DeletedPoster = await DeletePoster(posterId, presenterEmail)
    if(DeletedPoster.affectedRows > 0){
        res.render("success", {status:"Poster Deleted Succesfully", page:"/sessionDashboard"})
    }else{
        res.render("success", {status:"Could Not Delete Poster, Please try again", page:"/sessionDashboard"})
    }
   
    }
  }

module.exports = deletePoster
