const { config } = require("dotenv")

const CreateDeckChatRoom = async (title,description, id) =>{
    try{
        const data = {
            spaceTitle:title,
            shortDescription:description,
            Buffer:id
        }
        console.log(JSON.stringify(data))
        return fetch(`${process.env.ASFISCHOLAR_ENDPOINT}/external/api/createSpace?fromPosters=true`,{
            method:"POST",
            body: JSON.stringify(data),
            headers:{
                "Content-type":"application/json"
            }
        }).then(res =>res.json())
        .then(data =>{
            console.log(data)
            return true
        })
    }catch(error){
        console.log(error)
       return false
    }
}

module.exports = CreateDeckChatRoom