import { getAllPosts, getAllTagsFromPosts } from '@/lib/notion'
import SearchLayout from '@/layouts/search'

export default function search({ tags, posts }) {
  return <SearchLayout tags={tags} posts={posts} />
}
export async function getStaticProps({ locale }) {
  const posts = await getAllPosts({ onlyNewsletter: false, locale: locale || '' })
  // 随机打乱所有文章顺序
  const shuffledPosts = posts.sort(() => Math.random() - 0.5)
  const limitedPosts = shuffledPosts.slice(0, 10)
  const tags = getAllTagsFromPosts(posts)
  return {
    props: {
      tags,
      posts: limitedPosts
    },
    revalidate: 1
  }
}
