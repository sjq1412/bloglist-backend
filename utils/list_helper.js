/* eslint-disable no-unused-vars */
const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  const result = blogs.reduce((sum, blog) => blog.likes + sum, 0);
  return result;
};

const favoriteBlog = (blogs) => {
  const mostLikedBlog = () =>
    blogs.reduce(
      (max, blog) => (max.likes > blog.likes ? max : blog),
      blogs[0],
    );

  const result = blogs.length === 0 ? null : mostLikedBlog();
  return result;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
