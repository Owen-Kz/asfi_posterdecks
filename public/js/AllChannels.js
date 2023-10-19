const ChannelsContainer = document.getElementById("eventTitle")
// const ChannelsContainerEdit = document.getElementById("eventTitleEdit")

fetch("/allchannels", ()=>{
    method: "GET"
}).then(res => res.json())
.then(data =>{
    const AllChannelsData = JSON.parse(data.ChannelData)

    if(AllChannelsData.length > 0){ 
        AllChannelsData.forEach(channel => { 
            const ChannelName = channel.channel_secret
            const ChannelTitle = channel.title 
            const ChannelMain = channel.channel_name
            const host_passphrase = channel.host_passphrase

            ChannelsContainer.innerHTML += `<option value='${ChannelName}'>${ChannelTitle}</option>`


            
            
        });
    }else{
        ChannelsContainer.innerHTML = `<option value=''>No available Meetings, Navigate to the "Session button" to create One</option>`
   
    }
}) 