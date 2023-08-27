/* eslint-disable no-unused-vars */
const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  const result = blogs.reduce((sum, blog) => {
    return blog.likes + sum
  }, 0)
  return result
}

const favoriteBlog = blogs => {
  const result = blogs.length === 0 ? null :  blogs.reduce((max, blog) => {
    return max.likes > blog.likes ? max : blog
  }, blogs[0])
  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}