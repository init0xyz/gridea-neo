/*
 * @Date: 2023-02-09 10:19:12
 * @LastEditors: init0xyz laiyilong0@gmail.com
 * @LastEditTime: 2023-02-12 20:34:02
 * @FilePath: /gridea-neo/src/main/events/theme.ts
 */
import { ipcMain } from 'electron'
import type { IpcMainEvent } from 'electron'
import type { ITheme } from '../interfaces/theme'
import Theme from '../theme'

export default class ThemeEvents {
  constructor(appInstance: any) {
    const theme = new Theme(appInstance)

    ipcMain.removeAllListeners('theme-save')
    ipcMain.removeAllListeners('theme-saved')
    ipcMain.removeAllListeners('theme-custom-config-save')
    ipcMain.removeAllListeners('theme-custom-config-saved')

    ipcMain.on('theme-save', async (event: IpcMainEvent, themeConfig: ITheme) => {
      const config = await theme.saveThemeConfig(themeConfig)
      event.sender.send('theme-saved', config)
    })

    ipcMain.on('theme-custom-config-save', async (event: IpcMainEvent, config: any) => {
      const result = await theme.saveThemeCustomConfig(config)
      event.sender.send('theme-custom-config-saved', result)
    })
  }
}
