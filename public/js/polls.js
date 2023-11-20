const MeetingID = document.getElementById("meetingID")
// const pollContainer = document.getElementById('poll-container');
const mainQuestionContainer = document.getElementById("mainQuestionContainer")
const mainBody = document.getElementById("mainBody")
const hoursToKeep = 1;  // Desired duration in hours
const daysToKeep = hoursToKeep / 24;  // Convert hours to days
const expirationDays = daysToKeep > 0 ? daysToKeep : 1;  // Ensure a minimum of 1 day

function setCookie(name, value, daysToExpire) {
  const date = new Date();
  date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
  const expires = 'expires=' + date.toUTCString();
  document.cookie = name + '=' + value + '; ' + expires + '; path=/';
}

function getCookie(cookieName) {
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) == ' ') {
          cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) == 0) {
          return cookie.substring(name.length, cookie.length);
      }
  }
  return null; // Cookie not found
}

const Voted = getCookie("votedAlready")

// Usage
 // Access the encryption secret value
// const cookieValue = getCookie('meetingId');
const cookieValue = MeetingID.value;

fetch(`/polls/poll/question/${cookieValue}`, ()=>{
  method: "GET"
}).then(res =>res.json())
.then(data => {
  const question = JSON.parse(data.question)
  if(question.length > 0){
  question.forEach(one =>{
    const MainQUestion = one.question
    const questionId = one.buffer


    let PollsContainerCreated = `<div id="poll-container">
    <h2 id="mainQuestionContainer">${MainQUestion}</h2>
   <div class="TotalVotes">
    <b> Total Votes</b>
    <button id="totalVotes" value="0">0</button>
   </div>`

   

    fetch(`/polls/poll/question/options/${questionId}`, ()=>{
      method: "GET"
    }).then(res => res.json())
    .then(data => {
      const Options = JSON.parse(data.options)

      Options.forEach(choice =>{
        const voteCount = choice.number_of_votes
        const Option = choice.options
        const optionId = choice.question_id
 
        PollsContainerCreated += `
        <button class="pollCounts" value="${voteCount}" id="${optionId}">${voteCount}</button>
        <div class="option">
        <input type="radio" name="color" value="${optionId}"> ${Option}
        <progress value="" max="100"></progress>
        </div>`

      })

      mainBody.innerHTML += PollsContainerCreated



  const options = document.querySelectorAll('.option input');
  const progressBars = document.querySelectorAll('progress');
  const totalVotes = document.getElementById("totalVotes")
  const pollCounts = document.querySelectorAll(".pollCounts")


  if(Voted){
    console.log("Already Voted")
  }else{


  options.forEach((option, index) => {
    option.addEventListener('click', function() {

      setCookie('votedAlready', "UserAlreadyVoted", hoursToKeep)
    //   progressBars[index].value += 1;

      const TotalCountMain = Math.floor(new Number(totalVotes.value) + 1)

      const ActualCount = Math.floor(new Number(pollCounts[index].value) + 1)

      const optionID = pollCounts[index].id
      const OptionValue = pollCounts[index].value

      pollCounts[index].value = ActualCount
      totalVotes.value = `${TotalCountMain}`
      const PollsCountMain =  Math.floor(((new Number(pollCounts[index].value) * 100) / new Number(TotalCountMain)))

      pollCounts[index].innerHTML = `<span>${PollsCountMain}%</span>`
      totalVotes.innerHTML = `<span>${TotalCountMain}</span>`


      fetch(`/polls/increasePollsCount/${optionID}/${OptionValue}`, () =>{
        method : "GET"
      }).then(res => res.json())
      .then(data =>[
        console.log("Voted")
      ])

    progressBars[index].max = 100
    progressBars[index].value = PollsCountMain
    
    ChangeProgessBar(TotalCountMain, index)
    });
  });
}

function ChangeProgessBar(TotalCountMain, index){

  
      for(i=0; i<progressBars.length; i++){
        if(progressBars[i] != progressBars[index]){
            const NewCount =  Math.floor(((new Number(pollCounts[i].value) * 100) / new Number(TotalCountMain)))
            progressBars[i].value = NewCount
            pollCounts[i].innerHTML = `<span>${NewCount}%</span>`
        }
    }
}

    options.forEach((option, index) => {

      const TotalCountMain = Math.floor(new Number(totalVotes.value) + 1)
      const PollsCountMain =  Math.floor(((new Number(pollCounts[index].value) * 100) / new Number(TotalCountMain)))

      const ActualCount = Math.floor(new Number(pollCounts[index].value) + 1)
    
      const optionID = pollCounts[index].id
      const OptionValue = pollCounts[index].value
    
      pollCounts[index].value = ActualCount
      totalVotes.value = `${TotalCountMain}`

      ChangeProgessBar(TotalCountMain, index)
      
      progressBars[index].max = 100
      progressBars[index].value = PollsCountMain
    
    })
})

})


}else{
  mainBody.innerHTML = `<div class="noDataMessage">No Polls available at the moment</div>`
}
})
