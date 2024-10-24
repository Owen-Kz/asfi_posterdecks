const loggedIn = async (req,res, next) =>{
    try{
    if(req.cookies.posterUser){
        await fetch(`${process.env.ASFISCHOLAR_ENDPOINT}/external/api/validateLogin`,{
            method:"POST",
            body:JSON.stringify({token:req.cookies.posterUser}),
            headers:{
                "Content-type": "application/json"
            }
        }).then(res =>res.json())
        .then(data =>{
            if(data.userInfo){
                req.user = data.userInfo
                next()
            }else{
                console.log(data.error)
                return res.render("loginExternal")
                next();
            }

        })
    }else{
        return res.render("loginExternal")
    }
}catch(error){
    return res.json({error:error.message, message:"Could not establish connection with server"})
}
}


module.exports = loggedIn