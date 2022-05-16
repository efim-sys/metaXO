document.getElementById("roomID").value = Math.floor(Math.random() * 100)
let roomID = document.getElementById("roomID").value
let playerID = ""
let tmr
document.getElementById("connect").onclick = () => {
  let xhr = new XMLHttpRequest()
  xhr.open('GET', 'http://127.0.0.1:8000/join?roomID='+document.getElementById("roomID").value+"&playerID="+document.getElementById("playerID").value)
  playerID = document.getElementById("playerID").value
  roomID = document.getElementById("roomID").value
  xhr.send()
  xhr.onload = () => {
    let obj = JSON.parse(xhr.response)
    console.log(obj.status)
    if(obj.status === "full") return
    $("input").prop("disabled", true)
    tmr = setInterval(function() {
      update()
    }, 200)
  }
}
s = ['X', 'O']
c = ['#ccccff', '#a8ffd2']

$(".grid-item").click(function() {
  const ind = $(this).index()
  console.log(ind)
  let xhr = new XMLHttpRequest()
  xhr.open('GET', 'http://127.0.0.1:8000/step?roomID='+roomID+"&playerID="+playerID+"&cellID="+ind)
  xhr.send()
  xhr.onload = () => {
    let obj = JSON.parse(xhr.response)
    console.log(obj)
    update()
  }
})

function update() {
  let xhr = new XMLHttpRequest()
  xhr.open('GET', 'http://127.0.0.1:8000/get?roomID='+roomID)
  xhr.send()
  xhr.onload = () => {
    let obj = JSON.parse(xhr.response)
    console.log(obj)
    myID = obj.game.players.indexOf(playerID)
    if(obj.status === "win") {
      clearInterval(tmr)
      alert(obj.winner+" выйграл!")
      $("input").prop("disabled", false)
    }
    obj.game.grid.forEach(function(e, i) {
      if(e != null) {
        $($(".grid-container").children()[i]).text(s[obj.game.players.indexOf(e)])
        $(".grid-container").children()[i].setAttribute('style', 'background-color: ' + c[obj.game.players.indexOf(e)]);
      }
    })
  }
}
