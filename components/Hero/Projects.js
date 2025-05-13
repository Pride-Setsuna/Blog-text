import { lang } from '@/lib/lang'
import { useRouter } from 'next/router'
import Social from '../Common/Social.js'
import Avatar from './NotionAvatar.js'
import { NotionRenderer } from 'react-notion-x'

const ProjectsHero = ({ blockMap }) => {
  const { locale } = useRouter()
  const t = lang[locale]

  // 当没有从Notion获取到内容时显示的静态内容
  const renderStaticContent = () => {
    if (locale === 'en') {
      return (
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="mb-4">Collection of my personal and professional projects</p>
          <ul className="list-disc ml-5 mb-4">
            <li className="mb-2">Web development</li>
            <li className="mb-2">Mobile applications</li>
            <li className="mb-2">Open source contributions</li>
          </ul>
        </div>
      )
    } else if (locale === 'ja') {
      return (
        <div>
          <h1 className="text-3xl font-bold mb-2">プロジェクト</h1>
          <p className="mb-4">個人やプロフェッショナルなプロジェクトのコレクション</p>
          <ul className="list-disc ml-5 mb-4">
            <li className="mb-2">ウェブ開発</li>
            <li className="mb-2">モバイルアプリケーション</li>
            <li className="mb-2">オープンソースへの貢献</li>
          </ul>
        </div>
      )
    } else {
      return (
        <div>
          <h1 className="text-3xl font-bold mb-2">项目</h1>
          <p className="mb-4">我的个人和专业项目集合</p>
          <ul className="list-disc ml-5 mb-4">
            <li className="mb-2">网页开发</li>
            <li className="mb-2">移动应用</li>
            <li className="mb-2">开源贡献</li>
          </ul>
        </div>
      )
    }
  }

  return (
    <>
      <div className='container mx-auto flex px-5 py-2 mb-10 md:flex-row flex-col items-center'>
        <div className='flex flex-col md:w-3/5 md:items-start mb-6 md:mb-0 text-left'>
          {blockMap ? (
            <NotionRenderer
              className='md:ml-0'
              blockMap={blockMap}
              frontMatter={{}}
              subPageTitle={null}
            />
          ) : (
            renderStaticContent()
          )}
          <Social />
        </div>
        <div className='w-2/5'>
          <Avatar className='text-gray-600 dark:text-gray-300' />
        </div>
      </div>
    </>
  )
}

export default ProjectsHero 