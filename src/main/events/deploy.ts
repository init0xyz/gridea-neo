/*
 * @Date: 2023-02-09 10:19:12
 * @LastEditors: init0xyz laiyilong0@gmail.com
 * @LastEditTime: 2023-02-13 16:42:08
 * @FilePath: /gridea-neo/src/main/events/deploy.ts
 */
import { ipcMain } from 'electron'
import type { IpcMainEvent } from 'electron'
import Deploy from '../deploy'
import Renderer from '../renderer'
import SftpDeploy from '../plugins/deploys/sftp'
import NetlifyDeploy from '../plugins/deploys/netlify'

export default class DeployEvents {
  constructor(appInstance: any) {
    const { platform } = appInstance.db.setting

    const deploy = new Deploy(appInstance)
    const sftp = new SftpDeploy(appInstance)
    const renderer = new Renderer(appInstance)
    const netlify = new NetlifyDeploy(appInstance)

    ipcMain.removeAllListeners('site-publish')
    ipcMain.removeAllListeners('site-published')
    ipcMain.removeAllListeners('remote-detect')
    ipcMain.removeAllListeners('remote-detected')

    ipcMain.on('site-publish', async (event: IpcMainEvent, params: any) => {
      // eslint-disable-next-line no-console
      console.log(platform)
      const client = (
        {
          github: deploy,
          coding: deploy,
          gitee: deploy,
          sftp,
          netlify
        } as any
      )[platform]

      // render
      renderer.db.themeConfig.domain = renderer.db.setting.domain
      await renderer.renderAll()

      // publish
      const result = await client.publish()
      event.sender.send('site-published', result)
    })

    ipcMain.on('remote-detect', async (event: IpcMainEvent, params: any) => {
      const client = (
        {
          github: deploy,
          coding: deploy,
          gitee: deploy,
          sftp,
          netlify
        } as any
      )[platform]

      const result = await client.remoteDetect()
      event.sender.send('remote-detected', result)
    })
  }
}
