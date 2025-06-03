import Container from '@/components/Container'
import BlogPost from '@/components/BlogPost'
import Pagination from '@/components/Pagination'
import { getAllPosts } from '@/lib/notion'
import BLOG from '@/blog.config'

const Page = ({ postsToShow, page, showNext }) => {
  return (
    <Container>
      {postsToShow &&
        postsToShow.map((post) => <BlogPost key={post.id} post={post} />)}
      <Pagination page={page} showNext={showNext} />
    </Container>
  )
}

export async function getStaticProps(context) {
  const page = parseInt(context.params.page) || 1
  const posts = await getAllPosts({ onlyPost: true })

  // 假设语言标签在 post.tags 数组中
  const filteredPosts = posts.filter(post =>
    post.tags && post.tags.includes(BLOG.lang)
  )

  const postsToShow = filteredPosts.slice(
    BLOG.postsPerPage * (page - 1),
    BLOG.postsPerPage * page
  )
  const totalPosts = filteredPosts.length
  const showNext = page * BLOG.postsPerPage < totalPosts
  return {
    props: {
      page,
      postsToShow,
      showNext
    },
    revalidate: 1
  }
}

export async function getStaticPaths() {
  const posts = await getAllPosts({ onlyNewsletter: false })

  // 假设语言标签在 post.tags 数组中
  const filteredPosts = posts.filter(post =>
    post.tags && post.tags.includes(BLOG.lang)
  )

  const totalPosts = filteredPosts.length
  const totalPages = Math.ceil(totalPosts / BLOG.postsPerPage)
  return {
    paths: Array.from({ length: totalPages - 1 }, (_, i) => ({
      params: { page: '' + (i + 2) }
    })),
    fallback: true
  }
}

export default Page
