const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const { userExtractor } = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', {
    username: 1,
    name: 1,
  });

  if (blog) {
    response.json(blog);
  } else {
    response.status(400).end();
  }
});

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { body } = request;

  const { user } = request;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id,
    likes: 0,
    comments: [],
  });

  const savedBlog = await blog.save();
  const blogWithUser = await savedBlog.populate('user', {
    username: 1,
    name: 1,
  });
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(blogWithUser);
});

blogsRouter.post('/:id/comments', async (request, response) => {
  const { body } = request;

  if (!body.comment) {
    return response.status(400).json({ error: 'comment must not be empty' });
  }
  const { comment } = body;

  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(400).json({ error: 'blog was not found.' });
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    {
      $push: { comments: comment },
    },
    {
      new: true,
      runValidators: true,
      context: 'query',
    },
  );

  const updatedBlogWithUser = await updatedBlog.populate('user', {
    username: 1,
    name: 1,
  });
  return response.json(updatedBlogWithUser);
});

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const { user } = request;

  const blogToDelete = await Blog.findById(request.params.id);

  if (!user.blogs.some((id) => blogToDelete.id.toString() === id.toString())) {
    return response
      .status(401)
      .json({ error: 'you are not authorized to remove this blog' });
  }
  await Blog.findByIdAndRemove(request.params.id);
  return response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const { body } = request;

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body, {
    new: true,
    runValidators: true,
    context: 'query',
  });
  const updatedBlogWithUser = await updatedBlog.populate('user', {
    username: 1,
    name: 1,
  });
  response.json(updatedBlogWithUser);
});

module.exports = blogsRouter;
