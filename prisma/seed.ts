import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create test user
  const hashedPassword = await bcrypt.hash('TestPassword123', 10)

  const testUser = await prisma.user.upsert({
    where: { email: 'success@example.com' },
    update: {},
    create: {
      email: 'success@example.com',
      name: 'Test User',
      password: hashedPassword,
    },
  })

  console.log('Created test user:', testUser)

  // Create another test user
  const hashedPassword2 = await bcrypt.hash('password123', 10)

  const testUser2 = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Demo User',
      password: hashedPassword2,
    },
  })

  console.log('Created demo user:', testUser2)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
