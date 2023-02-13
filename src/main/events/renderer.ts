/*
 * @Date: 2023-02-09 10:19:12
 * @LastEditors: init0xyz laiyilong0@gmail.com
 * @LastEditTime: 2023-02-13 17:26:37
 * @FilePath: /gridea-neo/src/main/events/renderer.ts
 */
import { ipcMain } from 'electron'
import type { IpcMainEvent } from 'electron'
import Renderer from '../renderer'

export default function initRendererEvents(appInstance: any) {
  const renderer = new Renderer(appInstance)

  ipcMain.removeAllListeners('html-render')
  ipcMain.removeAllListeners('html-rendered')

  ipcMain.on('html-render', async (event: IpcMainEvent) => {
    if (renderer.db.themeConfig.themeName) {
      await renderer.preview()
    }
    event.sender.send('html-rendered', null)
  })
}
