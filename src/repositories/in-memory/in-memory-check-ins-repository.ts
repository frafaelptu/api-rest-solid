import { Prisma, CheckIn } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public checkInsInMemory: CheckIn[] = []

  async findById(id: string) {
    return this.checkInsInMemory.find((checkIn) => checkIn.id === id) || null
  }

  async countByUserId(userId: string) {
    return this.checkInsInMemory.filter((checkIn) => checkIn.user_id === userId)
      .length
  }

  async findManyByUserId(userId: string, page: number) {
    return this.checkInsInMemory
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async findByUserOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDate = this.checkInsInMemory.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)
      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDate) {
      return null
    }

    // Clonar objeto para não afetar o objeto no array quando alterado fora por referência
    return structuredClone(checkInOnSameDate)
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

    return { ...checkIn }
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.checkInsInMemory.findIndex(
      (checkInMemory) => checkInMemory.id === checkIn.id,
    )

    if (checkInIndex >= 0) {
      this.checkInsInMemory[checkInIndex] = checkIn
    }

    return checkIn
  }
}
