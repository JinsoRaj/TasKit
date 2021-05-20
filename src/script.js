const electron = require('electron')
const { ipcRenderer } = electron

const form = document.getElementById('form1')
const item = document.getElementById('input1')
const list = document.querySelector('ol')

//Render Items to Screen
const render = (item,item2) => {
    //var anc = document.createElement("a")
    /*anc.innerHTML = item + " -> "*/
    var pre = document.createElement("code")
    pre.innerHTML = item+item2
    //anc.setAttribute('href', "./index.html");
    const li = document.createElement('li')
    /*li.appendChild(anc)*/
    li.appendChild(pre)
    list.appendChild(li)
   
}

let lis = document.getElementById('olid')
let rwin = document.querySelector('.rwindow')

lis.addEventListener('click', function(e) {
    // e.target is our targetted element.
    // try doing console.log(e.target.nodeName), it will result LI
    if(e.target && e.target.nodeName == "LI") {
        console.log(e.target.id + " was clicked");
        rwin.classList.toggle('open');
    }
})

//Get All Items After Starting 
window.addEventListener('load', () => ipcRenderer.send('loadAll'))
ipcRenderer.on('loaded', (e, items) => items.forEach(item => render(item.item, item.det)))

//Send Item to the server
form.addEventListener('submit', e => {
    e.preventDefault()
    const details = document.getElementById("input2").value;
    ipcRenderer.send('addItem', { item: item.value , det: details})
    /*const item2 = document.getElementsByTagName("input")[1].value;*/
    //console.log(item2);
    form.reset()
})

//Catches Add Item from server
ipcRenderer.on('added', (e, item) =>{
    render(item.item, item.det)
})

//Catches ClearAll from menu, sends the event to server to clear the db.
ipcRenderer.on('clearAll', () => ipcRenderer.send('clearAll'))
ipcRenderer.on('cleared', () => list.innerHTML = '')