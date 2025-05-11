import { lang } from '@/lib/lang'
import { useRouter } from 'next/router'
import Social from '../Common/Social.js'
import Avatar from './NotionAvatar.js'

const NoteHero = () => {
  const { locale } = useRouter()
  const t = lang[locale]
  return (
    <>
      <div className='container mx-auto flex px-5 py-2 mb-10 md:flex-row flex-col items-center'>
        <div className='flex flex-col md:w-3/5 md:items-start mb-6 md:mb-0 text-left'>
          <h1 className='text-3xl font-bold mb-4'>笔记</h1>
          <p className='mb-8 leading-relaxed'>我的学习笔记和知识分享</p>
          <Social />
          <div className='text-gray-400 text-xs font-light py-4'>
            {t.HERO.NOTES.TEXT_FOOTER}
          </div>
        </div>
        <div className='w-2/5'>
          <Avatar className='text-gray-600 dark:text-gray-300' />
        </div>
      </div>
    </>
  )
}

export default NoteHero
