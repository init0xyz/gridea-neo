/*
 * @Date: 2023-02-13 17:16:39
 * @LastEditors: init0xyz laiyilong0@gmail.com
 * @LastEditTime: 2023-02-13 17:16:53
 * @FilePath: /gridea-neo/src/main/setting.ts
 */
import * as path from 'path'
import * as fse from 'fs-extra'
import type { ISetting } from '../interfaces/setting'
import Model from './model'
import type { ICommentSetting } from './interfaces/setting'

export default class Setting extends Model {
  getSetting() {
    const setting = this.$setting.get('config').value()
    return setting
  }

  getGitalkSetting() {
    const setting = this.$setting.get('gitalk').value()
    return setting
  }

  getCommentSetting() {
    const setting = this.$setting.get('comment').value()
    return setting
  }

  public async saveSetting(setting: ISetting) {
    await this.$setting.set('config', setting).write()
    return true
  }

  public async saveCommentSetting(setting: ICommentSetting) {
    await this.$setting.set('comment', setting).write()
    return true
  }

  async uploadFavicon(filePath: string) {
    const faviconPath = path.join(this.appDir, 'favicon.ico')
    fse.copySync(filePath, faviconPath)
  }

  async uploadAvatar(filePath: string) {
    const avatarPath = path.join(this.appDir, 'images/avatar.png')
    fse.copySync(filePath, avatarPath)
  }
}
