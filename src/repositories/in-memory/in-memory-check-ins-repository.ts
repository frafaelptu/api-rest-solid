import { Prisma, CheckIn } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  private checkInsInMemory: CheckIn[] = []

  async findByUserOnDate(userId: string, date: Date) {
    const checkOnSameDate = this.checkInsInMemory.find((checkIn) => {
      return checkIn.user_id === userId
      // checkIn.user_id === userId &&
      // checkIn.created_at.toDatetring() === date.toDateString()
    })

    if (!checkOnSameDate) {
      return null
    }

    return checkOnSameDate
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.checkInsInMemory.push(checkIn)

    return checkIn
  }
}
