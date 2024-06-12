import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
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
    const { token } = await createAndAuthenticateUser(app)

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user.email).toEqual(email)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email,
      }),
    )
  })

  it('should be not able to autenticate with token invalid', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}invalid`)

    expect(profileResponse.statusCode).toEqual(401)
    expect(profileResponse.body.message).toEqual('Unauthorized.')
  })
})
