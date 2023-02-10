/*
 * @Date: 2023-02-09 10:19:12
 * @LastEditors: init0xyz laiyilong0@gmail.com
 * @LastEditTime: 2023-02-10 16:47:20
 * @FilePath: /gridea-neo/src/main/interfaces/application.ts
 */
import type { BrowserWindow } from 'electron'
import type { ISetting } from '../../interfaces/setting'
import type { IPostDb } from './post'
import type { ITag } from './tag'
import type { ITheme } from './theme'
import type { IMenu } from './menu'
import type { ICommentSetting } from './setting'

export interface IApplicationSetting {
  mainWindow: BrowserWindow
  app: any
  baseDir: string
  previewServer: any
}

export interface IApplicationDb {
  posts: IPostDb[]
  tags: ITag[]
  menus: IMenu[]
  themeConfig: ITheme
  themeCustomConfig: any
  themes: any[]
  setting: ISetting
  commentSetting: ICommentSetting
  currentThemeConfig: any[]
}

export interface IApplication {
  mainWindow: BrowserWindow
  app: any
  baseDir: string
  appDir: string
  buildDir: string
  db: IApplicationDb
}
