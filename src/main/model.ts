/*
 * @Date: 2023-02-10 16:39:22
 * @LastEditors: init0xyz laiyilong0@gmail.com
 * @LastEditTime: 2023-02-10 17:59:12
 * @FilePath: /gridea-neo/src/main/model.ts
 */
import path from 'path'
import type { BrowserWindow } from 'electron'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import type { IApplication, IApplicationDb } from './interfaces/application'
export default class Model {
  appDir: string
  buildDir: string
  $setting: any
  $posts: any
  $theme: any
  db: IApplicationDb
  mainWindow: BrowserWindow

  constructor(appInstance: IApplication) {
    this.appDir = appInstance.appDir
    this.buildDir = appInstance.buildDir
    this.db = appInstance.db
    this.mainWindow = appInstance.mainWindow

    this.initDataStore()
  }

  private initDataStore() {
    const settingAdapter = new FileSync(path.join(this.appDir, 'config/setting.json'))
    const setting = low(settingAdapter)
    this.$setting = setting

    const postsAdapter = new FileSync(path.join(this.appDir, 'config/posts.json'))
    const posts = low(postsAdapter)
    this.$posts = posts

    const themeAdapter = new FileSync(path.join(this.appDir, 'config/theme.json'))
    const theme = low(themeAdapter)
    this.$theme = theme
  }
}
