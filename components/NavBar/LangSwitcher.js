import { TranslateIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'

const LangSwitcher = ({ showLangMenu, setShowLangMenu, showMenu, setShowMenu }) => {
  const { locale, asPath } = useRouter()
  const menuRef = useRef(null)

  // 语言配置
  const languages = [
    { code: 'zh', name: '中文' },
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' }
  ]

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowLangMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuRef, setShowLangMenu])

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        aria-label='LangSwitcher'
        onClick={() => {
          setShowLangMenu((prev) => {
            if (!prev) setShowMenu(false)
            return !prev
          })
        }}
        className='p-2 ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer rounded-lg dark:text-gray-100'
      >
        <TranslateIcon className='h-5 w-5' />
      </button>
      
      {showLangMenu && (
        <div className="absolute right-0 mt-2 w-28 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="language-menu">
            {languages.map((lang) => (
              <Link 
                key={lang.code} 
                href={asPath} 
                locale={lang.code} 
                scroll={false}
                onClick={() => setShowLangMenu(false)}
              >
                <div 
                  className={`block px-4 py-2 text-sm cursor-pointer ${
                    locale === lang.code 
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  role="menuitem"
                >
                  {lang.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default LangSwitcher
