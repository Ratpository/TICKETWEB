let currentTab = "inventory"

const materials=[
"4-2 84","4-2 96","2 96","4 flat 96","4 flat 140",
"4-2 140","5-2.5 84","5-2.5 96","5-2.5 110",
"5-2 flat 96","5-2 flat 140",
"chan 140","chan 96","chan 84"
]

let selectedFilter = null

function setTab(tab){
currentTab = tab
render()
}

/* INVENTORY FILTER */
function toggleFilter(){

let menu = document.getElementById("filterMenu")

menu.style.display = menu.style.display === "block" ? "none" : "block"

menu.innerHTML=""

materials.forEach(m=>{
let btn = document.createElement("button")
btn.innerText = m
btn.style.width="100%"
btn.style.padding="10px"
btn.onclick=()=>{
selectedFilter = m
menu.style.display="none"
render()
}
menu.appendChild(btn)
})

}

/* RENDER SCREEN */
function render(){

const screen = document.getElementById("screen")
screen.innerHTML=""

/* INVENTORY */
if(currentTab === "inventory"){

let filterBtn = document.createElement("button")
filterBtn.innerText = selectedFilter || "All Materials"
filterBtn.onclick = toggleFilter
filterBtn.style.width="100%"
filterBtn.style.padding="15px"

screen.appendChild(filterBtn)

materials
.filter(m => !selectedFilter || m === selectedFilter)
.forEach(m=>{

let card = document.createElement("div")
card.className="card"

card.innerHTML=`<span>${m}</span><span>0</span>`

screen.appendChild(card)

})

}

/* PURCHASE ORDER */
if(currentTab === "po"){

screen.innerHTML = "<h2>Purchase Orders</h2>"

}

/* UPDATES */
if(currentTab === "updates"){

screen.innerHTML = "<h2>Recent Updates</h2>"

}

/* USERS */
if(currentTab === "users"){

screen.innerHTML = "<h2>User Management</h2>"

}

/* RUSH ORDERS */
if(currentTab === "rush"){

screen.innerHTML = `
<h2>Rush Orders</h2>

<input placeholder="Ticket Name">
<input placeholder="Size">
<input placeholder="Color">

<button style="margin-top:10px;padding:15px;width:100%;">Add Rush Order</button>
`

}

}

render()