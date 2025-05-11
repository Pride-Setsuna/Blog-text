// https://react-svgr.com/playground/
import * as React from 'react'
import BLOG from '@/blog.config'

const Logo = (props) => (
  <img src={`${BLOG.link}/favicon.png`} width="30" height="30" alt="Logo" />
)

export default Logo
