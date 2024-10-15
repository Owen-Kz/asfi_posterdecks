const { executeQuery } = require("../routes/dbQueries");
const { CreateSerials } = require("../routes/queries");

// Function to generate a random number between 111 and 211
function generateRandomNumber() {
    return Math.floor(Math.random() * (211 - 111 + 1)) + 111;
}

// Function to generate the code in the required format
function generateCode() {
    const randomNumber = generateRandomNumber();
    const code = `ASFI-2024-CB-${randomNumber}`;
    return code;
}

const generatePosterId = async (req,res) =>{
    try{
    const {id} = req.body 

    if(id && id !== "new"){
        await CreateSerials(id)
        return res.json({success:`Poster Id created `, posterID:id})
    }else{
       const PosterId = generateCode()
       await CreateSerials(PosterId)
       return res.json({success:`Poster Id created `, posterID:PosterId})
    }
}catch(error){
    return res.json({error:error})
}
}

module.exports = generatePosterId
