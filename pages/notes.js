import Container from '@/components/Container'
import BlogPost from '@/components/BlogPost'
import NotesHero from '@/components/Hero/Notes'
import { getAllPosts, getPostBlocks } from '@/lib/notion'
import BLOG from '@/blog.config'

export async function getStaticProps({ locale }) {
  const posts = await getAllPosts({ onlyNotes: true })

  const heros = await getAllPosts({ onlyHidden: true })
  let hero
  if (locale === 'en') {
    hero = heros.find((t) => t.slug === 'notes-en')
  } else if (locale === 'ja') {
    hero = heros.find((t) => t.slug === 'notes-ja')
  } else {
    hero = heros.find((t) => t.slug === 'notes')
  }

  let blockMap
  try {
    blockMap = hero ? await getPostBlocks(hero.id) : null
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

const notes = ({ posts, blockMap }) => {
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