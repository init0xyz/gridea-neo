/*
 * @Date: 2023-02-09 10:19:12
 * @LastEditors: init0xyz laiyilong0@gmail.com
 * @LastEditTime: 2023-02-13 17:27:50
 * @FilePath: /gridea-neo/src/main/events/site.ts
 */
import { ipcMain } from 'electron'
import type { IpcMainEvent } from 'electron'

export default function initSiteEvents(appInstance: any) {
  /**
   * load site config and data
   */
  ipcMain.removeAllListeners('app-site-reload')
  ipcMain.removeAllListeners('app-site-loaded')
  ipcMain.removeAllListeners('app-source-folder-setting')
  ipcMain.removeAllListeners('app-source-folder-set')
  ipcMain.removeAllListeners('app-preview-server-port-get')
  ipcMain.removeAllListeners('app-preview-server-port-got')

  ipcMain.on('app-site-reload', async (event: IpcMainEvent) => {
    const result = await appInstance.loadSite()
    event.sender.send('app-site-loaded', result)
  })

  ipcMain.on('app-source-folder-setting', async (event: IpcMainEvent, params: string) => {
    const result = await appInstance.saveSourceFolderSetting(params)
    event.sender.send('app-source-folder-set', result)
  })

  ipcMain.on('app-preview-server-port-get', async (event: IpcMainEvent) => {
    const port = await appInstance.previewServer.get('port')
    event.sender.send('app-preview-server-port-got', port)
  })
}
