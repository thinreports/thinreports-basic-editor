const { app, BrowserWindow, Menu, shell } = require('electron')
const path = require('path')
const url = require('url')

process.env.NODE_ENV = process.env.NODE_ENV || 'production'

let win

function createWindow () {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    icon: path.join(__dirname, 'assets/images/app-icon.png')
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.webContents.on('new-window', (e, url) => {
    e.preventDefault()
    shell.openExternal(url)
  })

  win.on('closed', () => win = null)

  setupMenu()
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

function setupMenu () {
  const menus = []

  if (process.platform === 'darwin') {
    menus.push({
      label: 'Application',
      submenu: [
        { role: 'quit' }
      ]
    })

    menus.push({
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' }
      ]
    })
  }

  if (process.env.NODE_ENV === 'development') {
    menus.push({
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => win.reload()
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => win.toggleDevTools()
        },
      ]
    })
  }

  if (menus.length > 0) {
    Menu.setApplicationMenu(Menu.buildFromTemplate(menus))
  }
}
