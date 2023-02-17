/*
 * @Date: 2023-02-17 20:19:57
 * @LastEditors: init0xyz laiyilong0@gmail.com
 * @LastEditTime: 2023-02-17 22:18:37
 * @FilePath: /gridea-neo/src/renderer/src/store/index.ts
 */
import { defineStore } from 'pinia'
import type { IPost } from 'src/interfaces/post'
import type { ITag } from 'src/interfaces/tag'
import type { ITheme } from 'src/interfaces/theme'
import type { IMenu } from 'src/interfaces/menu'
import type { ICommentSetting, ISetting } from 'src/interfaces/setting'
import {
  DEFAULT_ARCHIVES_PAGE_SIZE,
  DEFAULT_ARCHIVES_PATH,
  DEFAULT_FEED_COUNT,
  DEFAULT_POST_PAGE_SIZE,
  DEFAULT_POST_PATH,
  DEFAULT_TAG_PATH
} from '../helpers/constants'

export interface Site {
  appDir: string
  config: any
  posts: IPost[]
  tags: ITag[]
  menus: IMenu[]
  themeConfig: ITheme
  themeCustomConfig: any
  currentThemeConfig: any
  themes: string[]
  setting: ISetting
  commentSetting: ICommentSetting
}

const siteState: Site = {
  appDir: '',
  config: {},
  posts: [],
  tags: [],
  menus: [],
  themeConfig: {
    themeName: '',
    postPageSize: DEFAULT_POST_PAGE_SIZE,
    archivesPageSize: DEFAULT_ARCHIVES_PAGE_SIZE,
    siteName: '',
    siteDescription: '',
    footerInfo: 'Powered by Gridea',
    showFeatureImage: true,
    postUrlFormat: 'SLUG',
    tagUrlFormat: 'SLUG',
    dateFormat: 'YYYY-MM-DD',
    feedCount: DEFAULT_FEED_COUNT,
    feedFullText: true,
    archivesPath: DEFAULT_ARCHIVES_PATH,
    postPath: DEFAULT_POST_PATH,
    tagPath: DEFAULT_TAG_PATH
  },
  themeCustomConfig: {},
  currentThemeConfig: {},
  themes: [],
  setting: {
    platform: 'github',
    domain: '',
    repository: '',
    branch: '',
    username: '',
    email: '',
    tokenUsername: '',
    token: '',
    cname: '',
    port: '22',
    server: '',
    password: '',
    privateKey: '',
    remotePath: '',
    proxyPath: '',
    proxyPort: '',
    enabledProxy: 'direct',
    netlifySiteId: '',
    netlifyAccessToken: ''
  },
  commentSetting: {
    showComment: false,
    commentPlatform: 'gitalk',
    gitalkSetting: {
      clientId: '',
      clientSecret: '',
      repository: '',
      owner: ''
    },
    disqusSetting: {
      api: '',
      apikey: '',
      shortname: ''
    }
  }
}

export const useSiteStore = defineStore('site', {
  state: () => siteState,
  actions: {
    updateSite(siteData: Site) {
      this.appDir = siteData.appDir
      this.posts = siteData.posts
      this.tags = siteData.tags
      this.menus = siteData.menus
      this.config = siteData.config
      this.themeConfig = siteData.themeConfig
      this.themeConfig.postUrlFormat = siteData.themeConfig.postUrlFormat || 'SLUG'
      this.themeConfig.tagUrlFormat = siteData.themeConfig.tagUrlFormat || 'SLUG'
      this.themeConfig.dateFormat = siteData.themeConfig.dateFormat || 'YYYY-MM-DD'
      this.themeConfig.postPageSize = siteData.themeConfig.postPageSize || DEFAULT_POST_PAGE_SIZE
      this.themeConfig.archivesPageSize =
        siteData.themeConfig.archivesPageSize || DEFAULT_ARCHIVES_PAGE_SIZE
      this.themeConfig.feedCount = siteData.themeConfig.feedCount || DEFAULT_FEED_COUNT
      this.themeConfig.feedFullText =
        typeof siteData.themeConfig.feedFullText === 'undefined'
          ? true
          : siteData.themeConfig.feedFullText // from > 0.8.0
      this.themes = siteData.themes
      this.setting = siteData.setting
      this.commentSetting = siteData.commentSetting
      this.themeCustomConfig = siteData.themeCustomConfig
      this.currentThemeConfig = siteData.currentThemeConfig
    },
    updatePosts(posts: IPost[]) {
      this.posts = posts
    }
  }
})
