/*
 * @Date: 2023-02-09 11:53:34
 * @LastEditors: init0xyz laiyilong0@gmail.com
 * @LastEditTime: 2023-03-03 16:27:20
 * @FilePath: /gridea-neo/src/main/index.ts
 */
import { join } from 'path'
import { BrowserWindow, app, ipcMain, protocol, shell } from 'electron'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/app-icons/gridea.png?asset'
import initServer from './server'
import App from './app'

const s = initServer()
const httpServer = s.server

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])
function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minHeight: 642,
    minWidth: 1000,
    show: false,
    title: 'Gridea',
    // autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: true,
      sandbox: false,
      webSecurity: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  const setting = {
    mainWindow,
    app,
    baseDir: __dirname,
    previewServer: s.app
  }

  // Init app
  const appInstance = new App(setting)
  // eslint-disable-next-line no-console
  console.log('Main process runing...', appInstance.appDir) // DELETE ME
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  httpServer && httpServer.close()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('open-url', (_, url: string) => {
  shell.openExternal(url)
})
