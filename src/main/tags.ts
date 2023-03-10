/*
 * @Date: 2023-02-11 22:27:23
 * @LastEditors: init0xyz laiyilong0@gmail.com
 * @LastEditTime: 2023-02-11 22:47:04
 * @FilePath: /gridea-neo/src/main/tags.ts
 */
import { nanoid } from 'nanoid'
import { UrlFormats } from './helpers/enums'
import slug from './helpers/slug'
import type { ITag } from './interfaces/tag'
import Model from './model'

export default class Tags extends Model {
  public async saveTags() {
    const posts = this.$posts.get('posts').value()
    let list: any = []
    posts.forEach((post) => {
      if (Array.isArray(post.data.tags)) {
        list = list.concat(post.data.tags)
      }
    })
    list = Array.from(new Set([...list]))

    const themeConfig = await this.$theme.get('config').value()
    const tagUrlFormat = themeConfig.tagUrlFormat || UrlFormats.Slug

    let existUsedTags = this.$posts.get('tags').filter({ used: true }).value()

    // If you delete an article after using a tag, there may be a tag unused state.
    existUsedTags = existUsedTags.map((tag: ITag) => {
      return {
        ...tag,
        used: list.includes(tag.name)
      }
    })

    const unusedTags = this.$posts.get('tags').filter({ used: false }).value()

    // The tag of the imported article is newly used
    const newUsedTags = list
      .filter((item: any) => !existUsedTags.find((tag: ITag) => tag.name === item))
      .map((item: any) => {
        const foundItem = unusedTags.find((tag: ITag) => tag.name === item)
        if (foundItem) {
          // remove from unusedTags
          const foundItemIndex = unusedTags.indexOf(foundItem)
          unusedTags.splice(foundItemIndex, 1)

          return {
            ...foundItem,
            used: true
          }
        }

        return {
          name: item,
          slug: tagUrlFormat === UrlFormats.Slug ? slug(item) : nanoid(7),
          used: true
        }
      })

    const tags = [...newUsedTags, ...existUsedTags, ...unusedTags]

    this.$posts.set('tags', tags).write()
  }

  async list() {
    await this.saveTags()
    const tags = await this.$posts.get('tags').value()
    return tags
  }

  public async saveTag(tag: ITag) {
    const tags = await this.$posts.get('tags').value()
    if (typeof tag.index === 'number' && tag.index >= 0) {
      tags[tag.index] = tag
    } else {
      tags.push(tag)
    }
    await this.$posts.set('tags', tags).write()
    return tags
  }

  public async deleteTag(tagValue: string) {
    const tag = await this.$posts.get('tags').remove({ name: tagValue }).write()
    return tag
  }
}
