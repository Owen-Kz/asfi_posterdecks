const login = async (req,res) =>{
    const {user, pass} = req.body

    const response = await fetch(`${process.env.ASFISCHOLAR_ENDPOINT}/api/login`, {
        method:"POST",
        body:JSON.stringify({user:user, pass:pass}),
        headers:{
            "Content-type": "application/json"
        }
    }).then(res=>res.json())
    .then(data =>{
        return data
    })

    const responseData = response
    const cookieOptions = {
        expiresIn: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    if(responseData.success){
        res.cookie("posterUser", responseData.userToken, cookieOptions)
        res.json({status: "success", success: "User Logged in",})
    }else{
        return res.json({status:"error", error:responseData.error})
    }
}

module.exports = login