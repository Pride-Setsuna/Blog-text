import BLOG from '@/blog.config'
import { NotionAPI } from 'notion-client'
import { idToUuid } from 'notion-utils'
import dayjs from '@/lib/day'
import getAllPageIds from './getAllPageIds'
import getPageProperties from './getPageProperties'
import filterPublishedPosts from './filterPublishedPosts'
import { fetchNotionSmart } from './notionFetchHelper'

/**
 * @param {{ onlyNewsletter: boolean }} - false: all types / true: newsletter only
 * @param {{ onlyPost: boolean }} - false: all types / true: post only
 * @param {{ onlyHidden: boolean }} - false: all types / true: hidden only
 * @param {{ onlyNotes: boolean }} - false: all types / true: notes only
 * @param {{ onlyProjects: boolean }} - false: all types / true: projects only
 * @param {{ onlyBook: boolean }} - false: all types / true: book only
 * @param {{ tagFilter: string }} - 根据标签过滤文章
 * @param {{ locale: string }} - 根据语言过滤文章 (zh, en, ja)
 */
export async function getAllPosts({
  onlyNewsletter = false,
  onlyPost = false,
  onlyHidden = false,
  onlyNotes = false,
  onlyProjects = false,
  onlyBook = false,
  tagFilter = '',
  locale = ''
}) {
  let id = BLOG.notionPageId
  const authToken = BLOG.notionAccessToken || null
  const api = new NotionAPI({ authToken })
  // 用 fetchNotionSmart 包裹 getPage
  const response = await fetchNotionSmart(
    `getPage:${id}`,
    () => api.getPage(id),
    { retries: 5, delay: 2000, throttle: 400 }
  )

  id = idToUuid(id)
  const collection = Object.values(response.collection)[0]?.value
  const collectionQuery = response.collection_query
  const block = response.block
  const schema = collection?.schema

  const rawMetadata = block[id].value

  // Check Type
  if (
    rawMetadata?.type !== 'collection_view_page' &&
    rawMetadata?.type !== 'collection_view'
  ) {
    console.log(`pageId '${id}' is not a database`)
    return null
  } else {
    // Construct Data
    const pageIds = getAllPageIds(collectionQuery)
    const data = []
    for (let i = 0; i < pageIds.length; i++) {
      const id = pageIds[i]
      const properties = (await getPageProperties(id, block, schema)) || null

      // Add fullwidth to properties
      properties.fullWidth = block[id].value?.format?.page_full_width ?? false
      // Convert date (with timezone) to unix milliseconds timestamp
      properties.date = (
        properties.date?.start_date
          ? dayjs.tz(properties.date?.start_date)
          : dayjs(block[id].value?.created_time)
      ).valueOf()

      data.push(properties)
    }

    // remove all the the items doesn't meet requirements
    const posts = filterPublishedPosts({
      posts: data,
      onlyNewsletter,
      onlyPost,
      onlyHidden,
      onlyNotes,
      onlyProjects,
      onlyBook,
      tagFilter,
      locale
    })

    // Sort by date
    if (BLOG.sortByDate) {
      posts.sort((a, b) => b.date - a.date)
    }
    return posts
  }
}
