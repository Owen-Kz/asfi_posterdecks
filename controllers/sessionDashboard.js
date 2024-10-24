const sessionDashboard =  async(req,res)=>{
    try{
    if(req.user){
    res.render("sessionDashboard")
    }else{
        res.render("loginExternal")
    }
    }catch(error){
        return res.json({error:error})
    }
}

module.exports = sessionDashboard