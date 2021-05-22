const electron = require('electron')
const Datastore = require('nedb')
const url = require('url')
const path = require('path')
const menuBar = require('./src/components/MenuBar')

const { app, BrowserWindow, Menu, ipcMain, Notification } = electron

let mainWindow

const loadMainWindow = () => {
    mainWindow = new BrowserWindow({
        width : 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    mainWindow.loadFile(path.join(__dirname, "src/index.html"));
}
app.on('ready', () => {

    loadMainWindow();
    mainWindow.on('closed', () => app.quit())

    const mainMenu = Menu.buildFromTemplate(menuBar)
    Menu.setApplicationMenu(mainMenu)

})

//mac-os fix
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
});

//if other windows active?
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        loadMainWindow();
    }
});

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

//Notifications for add update  delete and clear
ipcMain.handle('show-add-notification', (event, ...args) => {
    const notification = {
        title: 'New Task',
        body: `Added: ${args[0]} to list`
    }

    new Notification(notification).show()
});

ipcMain.handle('show-update-notification', (event, ...args) => {
    const notification = {
        title: 'Edit Task',
        body: `Updated: ${args[0]}`
    }

    new Notification(notification).show()
});

ipcMain.handle('show-delete-notification', (event, ...args) => {
    const notification = {
        title: 'Remove Task',
        body: `Deleted: ${args[0]} from list`
    }

    new Notification(notification).show()
});

ipcMain.handle('show-clear-notification', (event, ...args) => {
    const notification = {
        title: 'Clear List',
        body: `Deleted whole database!`
    }

    new Notification(notification).show()
});