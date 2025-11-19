const { config } = require("dotenv")

const CreateDeckChatRoom = async (req,title,description, id) =>{
    try{
        const data = {
            spaceTitle:title,
            shortDescription:description,
            bufferSpace:id,
            privateSpace:"no",
        }
     
        return fetch(`${process.env.ASFISCHOLAR_ENDPOINT}/external/api/createSpace?fromPosters=true&token=${req.cookies.posterUser}`,{
            method:"POST",
            body: JSON.stringify(data),
            headers:{
                "Content-type":"application/json"
            }
        }).then(res =>res.json())
        .then(data =>{
            return true
        })
    }catch(error){
        console.log(error)
       return false
    }
}

module.exports = CreateDeckChatRoom