fetch("/screenCaptureFunction", ()=>{
    method: "GET"
}).then(res => res.json())
.then(data =>{
    const dataObject = JSON.parse(data.data)
localStorage.setItem('store', JSON.stringify(dataObject));
})