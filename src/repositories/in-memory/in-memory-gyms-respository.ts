import { Gym } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public gymsInMemory: Gym[] = []

  async findById(id: string) {
    const gym = this.gymsInMemory.find((gym) => gym.id === id)

    if (!gym) return null

    return gym
  }
}
