const electron = require('electron')
const { ipcRenderer } = electron

const form = document.getElementById('form1')
const item = document.getElementById('input1')
const list = document.querySelector('ol')
const form2 = document.getElementById('form2')
const deleteb = document.getElementById('delet')

//Render Items to Screen
const render = (item,item2,itemid) => {
    const li = document.createElement('li')
    const sp = document.createElement('span')
    sp.innerText = item + " - "
    sp.setAttribute('id', itemid)
    var pre = document.createElement("code")
    pre.innerHTML = item2
    pre.setAttribute('id', itemid+6)
    li.appendChild(sp)
    li.appendChild(pre)
    list.appendChild(li) 
}

//Render edits on db
const render2 = (item,item2,itemid) => {
    console.log(itemid);
    const sp = document.getElementById(itemid)
    sp.innerText = item + " - "
    var pre = document.getElementById(itemid+6)
    pre.innerHTML = item2
}

const render3 = (itemid) => {
    const sp = document.getElementById(itemid)
    sp.parentElement.parentElement.removeChild(sp.parentElement)
}

let lis = document.getElementById('olid')
let rwin = document.querySelector('.rwindow')

lis.addEventListener('click', function(e) {
    // e.target is our targetted element.
    // try doing console.log(e.target.nodeName), it will result LI
    if(e.target && e.target.nodeName == "SPAN") {
        form2.reset()
        console.log(e.target.id + " was clicked");
        rwin.classList.add('open');
        var hidinp = document.getElementsByClassName('hidclass')
        
        hidinp[0].setAttribute('value', e.target.id)
        var elem = document.getElementById(e.target.id)
        var inpelhead = document.getElementById("rwinput1")
        var inpeldet = document.getElementById("rwinput2")
        var element = elem.nextSibling;
        //remove " - " from input1
        inpelhead.setAttribute('value', elem.innerText.slice(0, -3))
        inpeldet.setAttribute('value', element.innerText)
    }
})

function closeX() {
    rwin.classList.toggle('open');
}

//Get All Items After Starting 
window.addEventListener('load', () => ipcRenderer.send('loadAll'))
ipcRenderer.on('loaded', (e, items) => items.forEach(item => render(item.item, item.det, item._id)))

//Send Item to the server
form.addEventListener('submit', e => {
    e.preventDefault()
    const details = document.getElementById("input2").value;
    ipcRenderer.send('addItem', { item: item.value , det: details})
    form.reset()
})

//update existing task - perfect
form2.addEventListener('submit', e => {
    console.log(e.target.classList.value)
    if(e.target.classList.value == "rwindow open"){
        e.preventDefault()
        const task = document.getElementById("rwinput1").value;
        const detail = document.getElementById("rwinput2").value;
        var hidvalue = document.getElementById("rwinput3").value;
        ipcRenderer.send('updateItem', {_id: hidvalue},{ item: task , det: detail})
    }
})

//delete each selected Tasks
deleteb.addEventListener('click', e =>{
    var hid = e.target.form[3].defaultValue
    ipcRenderer.send('deleteItem', {_id: hid})
})

//Catches Add Item from server
ipcRenderer.on('added', (e, item) =>{
    render(item.item, item.det, item._id)
})

//Updates Item 
ipcRenderer.on('updated', (e, id,item) =>{
    render2(item.item, item.det, id._id)
})

//Deletes Item
ipcRenderer.on('deleted', (e, itemid) =>{
    render3(itemid._id)
})

//Catch ClearAll from menu, sends the event to server and clear DB.
ipcRenderer.on('clearAll', () => ipcRenderer.send('clearAll'))
ipcRenderer.on('cleared', () => list.innerHTML = '')