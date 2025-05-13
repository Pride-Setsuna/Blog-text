import Container from '@/components/Container'
import BlogPost from '@/components/BlogPost'
import NotesHero from '@/components/Hero/Notes'
import Pagination from '@/components/Pagination'
import { getAllPosts, getPostBlocks } from '@/lib/notion'
import BLOG from '@/blog.config'

export async function getStaticProps({ locale }) {
  // 获取所有带有 tag:notes 标签的文章，并根据当前语言过滤
  const posts = await getAllPosts({ 
    onlyPost: true,
    tagFilter: 'notes', // 假设我们在Notion中用"notes"标签标记笔记类文章
    locale: locale || '' // 根据当前语言过滤
  })

  // 获取隐藏的笔记页面内容
  const heros = await getAllPosts({ onlyHidden: true })
  
  // 根据当前语言获取对应的笔记页面内容
  let hero
  if (locale === 'en') {
    // 英文笔记页面
    hero = heros.find((t) => t.slug === 'notes-en')
  } else if (locale === 'ja') {
    // 日文笔记页面
    hero = heros.find((t) => t.slug === 'notes-ja')
  } else {
    // 默认中文笔记页面
    hero = heros.find((t) => t.slug === 'notes')
  }

  // 如果找不到特定语言的笔记页面，则使用默认笔记页面
  if (!hero) {
    hero = heros.find((t) => t.slug === 'notes')
  }

  let blockMap = null
  try {
    // 添加额外的安全检查
    if (hero && hero.id) {
      blockMap = await getPostBlocks(hero.id)
    } else {
      console.warn('No hero page found for notes')
    }
  } catch (err) {
    console.error(err)
    // 发生错误时，尝试获取默认笔记页面
    const defaultHero = heros.find((t) => t.slug === 'notes')
    if (defaultHero && defaultHero.id) {
      try {
        blockMap = await getPostBlocks(defaultHero.id)
      } catch (error) {
        console.error('Failed to fetch default notes hero content', error)
      }
    }
  }

  // 分页处理
  const postsToShow = posts.slice(0, BLOG.postsPerPage)
  const totalPosts = posts.length
  const showNext = totalPosts > BLOG.postsPerPage
  
  return {
    props: {
      page: 1, // 当前是第1页
      postsToShow,
      showNext,
      blockMap // 可能为 null，但这是可以序列化的
    },
    revalidate: 1 // 启用ISR，每秒重新验证
  }
}

const Notes = ({ postsToShow, page, showNext, blockMap }) => {
  return (
    <Container title={`笔记 - ${BLOG.title}`} description="个人学习与成长的笔记集合">
      <NotesHero blockMap={blockMap} />
      {postsToShow.map((post) => (
        <BlogPost key={post.id} post={post} />
      ))}
      {showNext && <Pagination page={page} showNext={showNext} />}
    </Container>
  )
}

export default Notes
