// npm run test tests/blog_api.js
// const mongoose = require('mongoose')
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

describe('blogs api', () => {
  beforeEach(async () => {

    await Blog.deleteMany({})

    const blogObjects = initialBlogs.map(blog => new Blog(blog))

    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  }, 50000)

  test('all blogs are returned', async () => {
    const blogs = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(blogs.body).toHaveLength(initialBlogs.length)
  })
})