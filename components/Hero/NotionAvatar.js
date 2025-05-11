// https://react-svgr.com/playground/
import * as React from 'react'

const NotionAvatar = (props) => (
  <div className={props.className} style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <img
      src="/図2.png"
      alt="头像"
      style={{
        maxWidth: '100%',
        height: 'auto'
      }}
    />
  </div>
)

export default NotionAvatar
