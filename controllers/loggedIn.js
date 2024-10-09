const loggedIn = async (req,res, next) =>{
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
                return res.redirect("/login")
            }

        })
    }else{
        return res.redirect("/login")
    }
}


module.exports = loggedIn