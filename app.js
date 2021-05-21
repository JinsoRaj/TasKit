const electron = require('electron')
const Datastore = require('nedb')
const url = require('url')
const path = require('path')
const menuBar = require('./src/components/MenuBar')

const { app, BrowserWindow, Menu, ipcMain } = electron

let mainWindow


app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
          }
    })
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'src/index.html'),
        protocol: 'file:',
        slashes: true
    }))
    mainWindow.on('closed', () => app.quit())

    const mainMenu = Menu.buildFromTemplate(menuBar)
    Menu.setApplicationMenu(mainMenu)
})

const db = new Datastore({
    filename: './items.db',
    autoload: true
})

//Get all items from db and send them to the client
ipcMain.on('loadAll', () => db.find({}, (err, items) => mainWindow.webContents.send('loaded', items)))

//Saves item and returns it to client
ipcMain.on('addItem', (e, item) => {
    db.insert(item, (err,doc) => {
        if (err) throw new Error(err)
        mainWindow.webContents.send('added', doc)
    })
})

//Updates each item and returns it to client
ipcMain.on('updateItem', (e, id,item) => {
    db.update(id, item,(err) => {
        if (err) throw new Error(err)
        mainWindow.webContents.send('updated', id,item)
    })
})

//Deletes each item and return deleted itemID
ipcMain.on('deleteItem', (e, itemid) => {
    db.remove(itemid, (err,num) => {
        if (err) throw new Error(err)
        mainWindow.webContents.send('deleted', itemid)
    })
})

//Clears database and send event to client if successful
ipcMain.on('clearAll', () => {
    db.remove({}, { multi: true }, (err) => {
        if (err) throw new Error(err)
        mainWindow.webContents.send('cleared')
    })
})