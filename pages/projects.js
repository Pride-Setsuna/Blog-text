import Container from '@/components/Container'
import BlogPost from '@/components/BlogPost'
import ProjectsHero from '@/components/Hero/Projects'
import Pagination from '@/components/Pagination'
import { getAllPosts, getPostBlocks } from '@/lib/notion'
import BLOG from '@/blog.config'

export async function getStaticProps({ locale }) {
  // 获取所有带有 type:Projects 类型的文章，并根据当前语言过滤
  const posts = await getAllPosts({ 
    onlyPost: true,
    tagFilter: 'projects', // 假设我们在Notion中用"projects"标签标记项目类文章
    locale: locale || '' // 根据当前语言过滤
  })

  // 获取隐藏的项目页面内容
  const heros = await getAllPosts({ onlyHidden: true })
  
  // 根据当前语言获取对应的项目页面内容
  let hero
  if (locale === 'en') {
    // 英文项目页面
    hero = heros.find((t) => t.slug === 'projects-en')
  } else if (locale === 'ja') {
    // 日文项目页面
    hero = heros.find((t) => t.slug === 'projects-ja')
  } else {
    // 默认中文项目页面
    hero = heros.find((t) => t.slug === 'projects')
  }

  // 如果找不到特定语言的项目页面，则使用默认项目页面
  if (!hero) {
    hero = heros.find((t) => t.slug === 'projects')
  }

  let blockMap
  try {
    blockMap = await getPostBlocks(hero.id)
  } catch (err) {
    console.error(err)
    // 发生错误时，尝试获取默认项目页面
    const defaultHero = heros.find((t) => t.slug === 'projects')
    if (defaultHero) {
      try {
        blockMap = await getPostBlocks(defaultHero.id)
      } catch (error) {
        console.error('Failed to fetch default projects hero content', error)
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
      blockMap
    },
    revalidate: 1 // 启用ISR，每秒重新验证
  }
}

const Projects = ({ postsToShow, page, showNext, blockMap }) => {
  return (
    <Container title={`项目 - ${BLOG.title}`} description="我的个人和专业项目集合">
      <ProjectsHero blockMap={blockMap} />
      {postsToShow.map((post) => (
        <BlogPost key={post.id} post={post} />
      ))}
      {showNext && <Pagination page={page} showNext={showNext} />}
    </Container>
  )
}

export default Projects 