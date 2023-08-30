// npm run test tests/blog_api.js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    'title': 'My First Blog',
    'author': 'Sarah',
    'url': 'https://www.google.com',
    'likes': 3
  },
  {
    'title': 'My Second Blog',
    'author': 'Sarah',
    'url': 'https://www.google.com',
    'likes': 23
  },
  {
    'title': 'My Third Blog',
    'author': 'Sarah',
    'url': 'https://www.google.com',
    'likes': 12
  }
]

beforeEach(async () => {

  await Blog.deleteMany({})

  const blogObjects = initialBlogs.map(blog => new Blog(blog))

  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
}, 50000)

describe('blogs api', () => {
  test('all blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogs = response.body
    expect(blogs).toHaveLength(initialBlogs.length)
  })

  test('a blog has "id" property and not "_id"', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogs = response.body
    const blog = blogs[0]

    expect(blog.id).toBeDefined()
    expect(blog._id).not.toBeDefined()
  })

  test('can create a new blog', async () => {
    const newBlog = {
      title: 'made from test',
      author: 'Sarah',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await Blog.find({})
    const blogsAtEnd = blogs.map(blog => blog.toJSON())

    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)

    const contents = blogsAtEnd.map(blog => blog.title)

    expect(contents).toContain('made from test')
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogs = await Blog.find({})
    const blogsAtStart = blogs.map(blog => blog.toJSON())
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogs2 = await Blog.find({})
    const blogsAtEnd = blogs2.map(blog => blog.toJSON())

    expect(blogsAtEnd).toHaveLength(
      initialBlogs.length - 1
    )

    const contents = blogsAtEnd.map(blog => blog.title)
    expect(contents).not.toContain(blogToDelete.title)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})