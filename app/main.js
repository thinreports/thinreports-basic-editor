const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')
const url = require('url')

process.env.NODE_ENV = process.env.NODE_ENV || 'production'

let win

function createWindow () {
  win = new BrowserWindow({width: 1000, height: 700})

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  const template = [
    {
      label: 'Application',
      submenu: [
        { label: 'Quit', accelerator: 'Command+Q', click: () => { app.quit() } }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
      ]
    }
  ]

  if (process.env.NODE_ENV === 'development') {
    template.push({
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: (_, activeWin) => activeWin.reload()
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: (_, activeWin) => activeWin.toggleDevTools()
        },
      ]
    })
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  win.on('closed', () => win = null)
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
