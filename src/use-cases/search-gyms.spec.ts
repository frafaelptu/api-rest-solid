import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-respository'
import { SearchGymsUseCase } from './search-gyms'
import { title } from 'process'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'TypeScript Gym',
      description: null,
      phone: null,
      latitude: -22.7516499,
      longitude: -51.3742822,
    })

    await gymsRepository.create({
      title: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: -22.7516499,
      longitude: -51.3742822,
    })

    const { gyms } = await sut.execute({
      query: 'TypeScript',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'TypeScript Gym' })])
  })

  it('should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `TypeScript Gym ${i}`,
        description: null,
        phone: null,
        latitude: -22.7516499,
        longitude: -51.3742822,
      })
    }

    const { gyms } = await sut.execute({
      query: 'TypeScript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'TypeScript Gym 21' }),
      expect.objectContaining({ title: 'TypeScript Gym 22' }),
    ])
  })
})
