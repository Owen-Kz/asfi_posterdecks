const setValue = async (req,res)=>{
    const DislpayName = "KilimanJaro"
    const valuesToSet = [DislpayName, 'en-us'];

    // Create the data object
    const dataObject = {
      token: null,
      displayName: valuesToSet[0],
      selectedLanguageCode: valuesToSet[1],
    };
    // Store the data object in local storage
    // localStorage.setItem('store', JSON.stringify(dataObject));
    
    return dataObject
}

module.exports = setValue
