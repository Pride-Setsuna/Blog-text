import Container from '@/components/Container'
import BlogPost from '@/components/BlogPost'
import NotesHero from '@/components/Hero/Notes'
import { getAllPosts, getPostBlocks } from '@/lib/notion'
import BLOG from '@/blog.config'
import { useRouter } from 'next/router'

export async function getStaticProps({ locale }) {
  // 与newsletter保持一致的获取方式
  const posts = await getAllPosts({ 
    onlyNewsletter: true,
    locale: locale || ''
  })

  const heros = await getAllPosts({ onlyHidden: true })
  
  // 根据当前语言获取对应的notes页面内容
  let hero
  if (locale === 'en') {
    // 英文notes页面
    hero = heros.find((t) => t.slug === 'notes-en')
  } else if (locale === 'ja') {
    // 日文notes页面
    hero = heros.find((t) => t.slug === 'notes-ja')
  } else {
    // 默认中文notes页面
    hero = heros.find((t) => t.slug === 'notes')
  }

  // 如果找不到特定语言的notes页面，则使用默认notes页面
  if (!hero) {
    hero = heros.find((t) => t.slug === 'notes')
  }

  let blockMap
  try {
    blockMap = await getPostBlocks(hero.id)
  } catch (err) {
    console.error(err)
  }

  return {
    props: {
      posts,
      blockMap
    },
    revalidate: 1
  }
}

const notes = ({ posts, blockMap }) => {
  const router = useRouter()
  const locale = router.locale || BLOG.lang
  
  return (
    <Container title={BLOG.notes} description={BLOG.description}>
      <NotesHero blockMap={blockMap} />
      {posts.map((post) => (
        <BlogPost key={post.id} post={post} />
      ))}
    </Container>
  )
}

export default notes
