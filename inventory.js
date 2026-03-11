const ADMIN_PASSWORD = "changeme";

const buffer = 5;

const minimum = {
"4-2 84":10,
"4-2 96":10,
"2 96":10,
"4 flat 96":10,
"4 flat 140":10,
"4-2 140":10,
"5-2.5 84":10,
"5-2.5 96":10,
"5-2.5 110":10,
"5-2 flat 96":10,
"5-2 flat 140":10,
"chan 140":15,
"chan 96":15,
"chan 84":15
};

let inventory = JSON.parse(localStorage.getItem("inventory")) || {};

Object.keys(minimum).forEach(k=>{
if(!inventory[k]) inventory[k]=0;
});

function login(){
let p=document.getElementById("password").value;
if(p===ADMIN_PASSWORD){
document.querySelectorAll("input").forEach(i=>i.disabled=false);
document.getElementById("saveBtn").style.display="block";
}
}

function createCard(container,name){

let card=document.createElement("div");
card.className="card";

card.innerHTML=`
<span>${name}</span>
<input disabled type="number" id="${name}" value="${inventory[name]}">
`;

container.appendChild(card);
}

function build(){

let foam=document.getElementById("foamList");
let channel=document.getElementById("channelList");

foam.innerHTML="";
channel.innerHTML="";

createCard(foam,"4-2 84");
createCard(foam,"4-2 96");
createCard(foam,"2 96");
createCard(foam,"4 flat 96");
createCard(foam,"4 flat 140");
createCard(foam,"4-2 140");
createCard(foam,"5-2.5 84");
createCard(foam,"5-2.5 96");
createCard(foam,"5-2.5 110");
createCard(foam,"5-2 flat 96");
createCard(foam,"5-2 flat 140");

createCard(channel,"chan 140");
createCard(channel,"chan 96");
createCard(channel,"chan 84");

calculate();
}

function saveInventory(){

document.querySelectorAll("input[type=number]").forEach(i=>{
inventory[i.id]=parseInt(i.value)||0;
});

localStorage.setItem("inventory",JSON.stringify(inventory));
localStorage.setItem("updated",new Date().toLocaleDateString());

calculate();
}

function calculate(){

let container=document.getElementById("recommendList");
container.innerHTML="";

Object.keys(inventory).forEach(item=>{

let current=inventory[item];
let min=minimum[item];
let recommend=Math.max(0,(min+buffer)-current);

let card=document.createElement("div");

card.className="card";

if(current<min){
card.classList.add("low");
}else{
card.classList.add("good");
}

card.innerHTML=`
<span>${item}</span>
<span>Buy: ${recommend}</span>
`;

container.appendChild(card);

});

let updated=localStorage.getItem("updated");
if(updated){
document.getElementById("lastUpdated").innerText="Last updated: "+updated;
}

}

function exportPO(){

let text="Purchase Order\n\n";

Object.keys(inventory).forEach(item=>{

let need=Math.max(0,(minimum[item]+buffer)-inventory[item]);

if(need>0){
text+=item+" - "+need+"\n";
}

});

let blob=new Blob([text],{type:"text/plain"});
let link=document.createElement("a");

link.href=URL.createObjectURL(blob);
link.download="purchase_order.txt";
link.click();

}

build();