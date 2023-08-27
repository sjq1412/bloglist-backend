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

module.exports = {
  dummy,
  totalLikes
}