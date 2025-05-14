import Container from '@/components/Container'
import BlogPost from '@/components/BlogPost'
import ProjectsHero from '@/components/Hero/Projects'
import { getAllPosts, getPostBlocks } from '@/lib/notion'
import BLOG from '@/blog.config'

export async function getStaticProps() {
  const posts = await getAllPosts({ onlyProjects: true })

  const heros = await getAllPosts({ onlyHidden: true })
  const hero = heros.find((t) => t.slug === 'projects')

  let blockMap
  try {
    blockMap = await getPostBlocks(hero.id)
  } catch (err) {
    console.error(err)
    // return { props: { post: null, blockMap: null } }
  }

  return {
    props: {
      posts,
      blockMap
    },
    revalidate: 1
  }
}

const projects = ({ posts, blockMap }) => {
  return (
    <Container title={BLOG.projects} description={BLOG.description}>
      <ProjectsHero blockMap={blockMap} />
      {posts.map((post) => (
        <BlogPost key={post.id} post={post} />
      ))}
    </Container>
  )
}

export default projects
