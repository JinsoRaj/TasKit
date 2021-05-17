const menuBar = [
    {
        label: 'options',
        submenu: [
            {
                label: '⚠️ Clear all Tasks !',
                accelerator: process.platform == 'darwin' ? 'Command+C' : 'Ctrl+C',
                click(item, mainWindow) { 
                    mainWindow.webContents.send('clearAll') 
                }
            }
        ]
    }, {
        label: 'DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, mainWindow) {
             mainWindow.toggleDevTools()
             }
    }
]
if (process.platform == 'darwin') mainMenuTemplate.unshift({})

module.exports = menuBar