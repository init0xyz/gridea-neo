/*
 * @Date: 2023-02-09 10:19:12
 * @LastEditors: init0xyz laiyilong0@gmail.com
 * @LastEditTime: 2023-02-13 17:27:17
 * @FilePath: /gridea-neo/src/main/events/setting.ts
 */
import { ipcMain } from 'electron'
import type { IpcMainEvent } from 'electron'
import Setting from '../setting'
import type { ICommentSetting } from '../interfaces/setting'
import type { ISetting } from '../../interfaces/setting'

export default function initSettingEvents(appInstance: any) {
  const settingInstance = new Setting(appInstance)

  ipcMain.removeAllListeners('setting-save')
  ipcMain.removeAllListeners('setting-saved')
  ipcMain.removeAllListeners('comment-setting-save')
  ipcMain.removeAllListeners('comment-setting-saved')
  ipcMain.removeAllListeners('favicon-upload')
  ipcMain.removeAllListeners('favicon-uploaded')
  ipcMain.removeAllListeners('avatar-upload')
  ipcMain.removeAllListeners('avatar-uploaded')

  ipcMain.on('setting-save', async (event: IpcMainEvent, setting: ISetting) => {
    const data = await settingInstance.saveSetting(setting)
    event.sender.send('setting-saved', data)
  })

  ipcMain.on('comment-setting-save', async (event: IpcMainEvent, setting: ICommentSetting) => {
    const data = await settingInstance.saveCommentSetting(setting)
    event.sender.send('comment-setting-saved', data)
  })

  ipcMain.on('favicon-upload', async (event: IpcMainEvent, filePath: string) => {
    // eslint-disable-next-line no-console
    console.log('执行了上传图片', filePath)
    const data = await settingInstance.uploadFavicon(filePath)
    event.sender.send('favicon-uploaded', data)
  })

  ipcMain.on('avatar-upload', async (event: IpcMainEvent, filePath: string) => {
    // eslint-disable-next-line no-console
    console.log('执行了上传头像', filePath)
    const data = await settingInstance.uploadAvatar(filePath)
    event.sender.send('avatar-uploaded', data)
  })
}
