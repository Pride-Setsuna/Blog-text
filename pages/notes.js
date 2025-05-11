import Container from '@/components/Container'
import BlogPost from '@/components/BlogPost'
import NotesHero from '@/components/Hero/Notes'
import Pagination from '@/components/Pagination'
import { getAllPosts } from '@/lib/notion'
import BLOG from '@/blog.config'

export async function getStaticProps() {
  // 获取所有带有 tag:notes 标签的文章
  const posts = await getAllPosts({ 
    onlyPost: true,
    tagFilter: 'notes' // 假设我们在Notion中用"notes"标签标记笔记类文章
  })

  // 分页处理
  const postsToShow = posts.slice(0, BLOG.postsPerPage)
  const totalPosts = posts.length
  const showNext = totalPosts > BLOG.postsPerPage
  
  return {
    props: {
      page: 1, // 当前是第1页
      postsToShow,
      showNext
    },
    revalidate: 1 // 启用ISR，每秒重新验证
  }
}

const Notes = ({ postsToShow, page, showNext }) => {
  return (
    <Container title={`笔记 - ${BLOG.title}`} description="个人学习与成长的笔记集合">
      <NotesHero />
      {postsToShow.map((post) => (
        <BlogPost key={post.id} post={post} />
      ))}
      {showNext && <Pagination page={page} showNext={showNext} />}
    </Container>
  )
}

export default Notes
