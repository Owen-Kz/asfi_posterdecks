const largeFilePage = async (req,res) =>{
    try{
    if(req.user){
        res.render("largeFilePreview", {file:req.params.fileName})
    }else{
        res.render("loginExternal")
    }
}catch(error){
    res.json({error:error})
}
}


module.exports = largeFilePage