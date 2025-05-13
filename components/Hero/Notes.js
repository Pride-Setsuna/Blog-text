import { lang } from '@/lib/lang'
import { useRouter } from 'next/router'
import Social from '../Common/Social.js'
import Avatar from './NotionAvatar.js'
import { NotionRenderer } from 'react-notion-x'

const NotesHero = ({ blockMap }) => {
  const { locale } = useRouter()
  const t = lang[locale]

  // 当没有从Notion获取到内容时显示的静态内容
  const renderStaticContent = () => {
    if (locale === 'en') {
      return (
        <div>
          <h1 className="text-3xl font-bold mb-2">Notes</h1>
          <p className="mb-4">My learning notes and knowledge sharing</p>
          <ul className="list-disc ml-5 mb-4">
            <li className="mb-2">Technical tutorials</li>
            <li className="mb-2">Learning summaries</li>
            <li className="mb-2">Tips and tricks</li>
          </ul>
        </div>
      )
    } else if (locale === 'ja') {
      return (
        <div>
          <h1 className="text-3xl font-bold mb-2">ノート</h1>
          <p className="mb-4">私の学習ノートと知識共有</p>
          <ul className="list-disc ml-5 mb-4">
            <li className="mb-2">技術的なチュートリアル</li>
            <li className="mb-2">学習のまとめ</li>
            <li className="mb-2">ヒントとコツ</li>
          </ul>
        </div>
      )
    } else {
      return (
        <div>
          <h1 className="text-3xl font-bold mb-2">笔记</h1>
          <p className="mb-4">我的学习笔记和知识分享</p>
          <ul className="list-disc ml-5 mb-4">
            <li className="mb-2">技术教程</li>
            <li className="mb-2">学习总结</li>
            <li className="mb-2">技巧和窍门</li>
          </ul>
        </div>
      )
    }
  }

  return (
    <>
      <div className='container mx-auto flex px-5 py-2 mb-10 md:flex-row flex-col items-center'>
        <div className='flex flex-col md:w-3/5 md:items-start mb-6 md:mb-0 text-left'>
          {blockMap && Object.keys(blockMap).length > 0 ? (
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

export default NotesHero
