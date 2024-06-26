import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
// System Under Test
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    // System Under Test
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    const email = 'johndoe@example.com'

    await usersRepository.create({
      name: 'John Doe',
      email,
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email,
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const email = 'johndoe@example.com'

    await expect(() =>
      sut.execute({
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const email = 'johndoe@example.com'

    await usersRepository.create({
      name: 'John Doe',
      email,
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email,
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
