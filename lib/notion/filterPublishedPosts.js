export default function filterPublishedPosts({
  posts,
  onlyNewsletter,
  onlyPost,
  onlyHidden,
  tagFilter = ''
}) {
  if (!posts || !posts.length) return []
  return posts
    .filter((post) =>
      onlyNewsletter
        ? post?.type?.[0] === 'Newsletter'
        : post
    )
    .filter((post) =>
      onlyPost
        ? post?.type?.[0] === 'Post'
        : post
    )
    .filter((post) =>
      onlyHidden
        ? post?.type?.[0] === 'Hidden'
        : post?.type?.[0] !== 'Hidden'
    )
    .filter((post) => {
      return (
        post.title &&
        post.slug &&
        post?.status?.[0] === 'Published' &&
        post.date <= new Date()
      )
    })
    .filter((post) => {
      if (tagFilter && (!post.tags || !post.tags.includes(tagFilter))) {
        return false
      }
      return true
    })
}
