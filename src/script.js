const electron = require('electron')
const { ipcRenderer } = electron

const form = document.getElementById('form1')
const item = document.getElementById('input1')
const list = document.querySelector('ol')
const form2 = document.getElementById('form2')

//Render Items to Screen
const render = (item,item2,itemid) => {
    //var anc = document.createElement("a")
    const li = document.createElement('li')
    const sp = document.createElement('span')
    sp.innerText = item + " - "
    //li.innerHTML = item + " - "
    sp.setAttribute('id', itemid)
    var pre = document.createElement("code")
    pre.innerHTML = item2
    /*li.appendChild(anc)*/
    li.appendChild(sp)
    li.appendChild(pre)
    list.appendChild(li)
   
}

let lis = document.getElementById('olid')
let rwin = document.querySelector('.rwindow')

lis.addEventListener('click', function(e) {
    // e.target is our targetted element.
    // try doing console.log(e.target.nodeName), it will result LI
    if(e.target && e.target.nodeName == "SPAN") {
        console.log(e.target.id + " was clicked");
        rwin.classList.toggle('open');
        var hidinp = document.getElementsByClassName('hidclass')
        
        hidinp[0].setAttribute('value', e.target.id)
        var elem = document.getElementById(e.target.id)
        var inpelhead = document.getElementById("rwinput1")
        var inpeldet = document.getElementById("rwinput2")
        var element = elem.nextSibling;
        //console.log(element);
        inpelhead.setAttribute('value', elem.innerText.slice(0, -3))
        inpeldet.setAttribute('value', element.innerText)
        //console.log(elem)
    }
})

//Get All Items After Starting 
window.addEventListener('load', () => ipcRenderer.send('loadAll'))
ipcRenderer.on('loaded', (e, items) => items.forEach(item => render(item.item, item.det, item._id)))

//Send Item to the server
form.addEventListener('submit', e => {
    e.preventDefault()
    const details = document.getElementById("input2").value;
    ipcRenderer.send('addItem', { item: item.value , det: details})
    /*const item2 = document.getElementsByTagName("input")[1].value;*/
    //console.log(item2);
    form.reset()
})
//update existing task
form2.addEventListener('submit', e => {
    e.preventDefault()
    const task = document.getElementById("rwinput1").value;
    const detail = document.getElementById("rwinput2").value;
    var hidvalue = document.getElementById("rwinput3").value;
    console.log(hidvalue)
    ipcRenderer.send('updateItem', { item: item.value , det: details})
    /*const item2 = document.getElementsByTagName("input")[1].value;*/
    //console.log(item2);
    form.reset()
})

//Catches Add Item from server
ipcRenderer.on('added', (e, item) =>{
    render(item.item, item.det, item._id)
})

//Catches ClearAll from menu, sends the event to server to clear the db.
ipcRenderer.on('clearAll', () => ipcRenderer.send('clearAll'))
ipcRenderer.on('cleared', () => list.innerHTML = '')