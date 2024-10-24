const ProfileDetails = async (email) =>{

    try{
  return fetch(`${process.env.ASFISCHOLAR_ENDPOINT}/p/s/v/details/${email}`,{
        method:"GET"
    }).then(res => res.json())
    .then(data =>{
        return data
    })
}catch(error){
    console.log(error)
    return []
}
} 


module.exports = ProfileDetails