import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {})

  it('should be able to get profile with upon token valid', async () => {
    const email = 'johndoe@example.com'
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email,
      password: '123456',
    })

    const response = await request(app.server).post('/sessions').send({
      email,
      password: '123456',
    })

    const token = response.body.token
    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user.email).toEqual(email)
    expect(profileResponse.body.user.name).toEqual('John Doe')
  })

  it('should be not able to autenticate with token invalid', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${response.body.token}invalid`)

    expect(profileResponse.statusCode).toEqual(401)
    expect(profileResponse.body.message).toEqual('Unauthorized.')
  })
})
