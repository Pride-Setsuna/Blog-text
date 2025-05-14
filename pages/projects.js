import Container from '@/components/Container'
import BlogPost from '@/components/BlogPost'
import ProjectsHero from '@/components/Hero/Projects'
import { getAllPosts, getPostBlocks } from '@/lib/notion'
import BLOG from '@/blog.config'

export async function getStaticProps() {
  try {
    // 尝试获取文章
    const posts = await getAllPosts({ onlyProjects: true });
    
    // 尝试获取hero内容
    let hero = null;
    let blockMap = null;
    
    try {
      const heros = await getAllPosts({ onlyHidden: true });
      hero = heros.find((t) => t.slug === 'projects');
      
      if (hero) {
        blockMap = await getPostBlocks(hero.id);
      }
    } catch (heroError) {
      console.error('获取hero内容时出错:', heroError);
      // 继续执行，不中断构建
    }
    
    // 确保返回有效数据
    return {
      props: {
        posts: posts || [],
        blockMap: blockMap || null
      },
      revalidate: 1
    };
  } catch (error) {
    console.error('getStaticProps整体错误:', error);
    // 返回最小有效数据，确保构建不会失败
    return {
      props: {
        posts: [],
        blockMap: null
      },
      revalidate: 1
    };
  }
}

const projects = ({ posts, blockMap }) => {
  return (
    <Container title={BLOG.projects} description={BLOG.description}>
      <ProjectsHero blockMap={blockMap} />
      {posts?.map((post) => (
        <BlogPost key={post.id} post={post} />
      ))}
    </Container>
  )
}

export default projects
