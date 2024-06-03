import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import { prisma } from '@/lib/prisma'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-foud-error'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async save(data: CheckIn) {
    const checkIn = await prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data,
    })

    return checkIn
  }

  async findById(id: string) {
    return await prisma.checkIn.findUnique({
      where: {
        id,
      },
    })
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIn = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      skip: (page - 1) * 20,
      take: 20,
    })

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    return checkIn
  }

  async findByUserOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    return await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    })
  }

  async countByUserId(userId: string) {
    return await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({ data })

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    return checkIn
  }
}
