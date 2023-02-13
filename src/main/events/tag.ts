/*
 * @Date: 2023-02-09 10:19:12
 * @LastEditors: init0xyz laiyilong0@gmail.com
 * @LastEditTime: 2023-02-12 20:33:47
 * @FilePath: /gridea-neo/src/main/events/tag.ts
 */
import { ipcMain } from 'electron'
import type { IpcMainEvent } from 'electron'
import Tags from '../tags'
import type { ITag } from '../interfaces/tag'

export default class TagEvents {
  constructor(appInstance: any) {
    const tags = new Tags(appInstance)

    ipcMain.removeAllListeners('tag-delete')
    ipcMain.removeAllListeners('tag-deleted')
    ipcMain.removeAllListeners('tag-save')
    ipcMain.removeAllListeners('tag-saved')

    ipcMain.on('tag-delete', async (event: IpcMainEvent, tagName: string) => {
      const data = await tags.deleteTag(tagName)
      event.sender.send('tag-deleted', data)
    })

    ipcMain.on('tag-save', async (event: IpcMainEvent, tag: ITag) => {
      const data = await tags.saveTag(tag)
      event.sender.send('tag-saved', data)
    })
  }
}
