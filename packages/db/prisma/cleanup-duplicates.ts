import { prisma } from '@artistry-hub/db'

async function main() {
  console.log('🧹 Cleaning up duplicate users...')

  try {
    // Remove users without passwords (these were created by the basic seed)
    const usersWithoutPasswords = await prisma.user.findMany({
      where: {
        hashedPassword: null
      }
    })

    console.log(`Found ${usersWithoutPasswords.length} users without passwords:`)
    usersWithoutPasswords.forEach(user => {
      console.log(`- ${user.email} (${user.role})`)
    })

    if (usersWithoutPasswords.length > 0) {
      // Delete users without passwords (handle foreign key constraints)
      for (const user of usersWithoutPasswords) {
        try {
          // Delete related records first
          await prisma.address.deleteMany({
            where: { userId: user.id }
          })
          
          await prisma.auditLog.deleteMany({
            where: { actorUserId: user.id }
          })
          
          await prisma.account.deleteMany({
            where: { userId: user.id }
          })
          
          await prisma.session.deleteMany({
            where: { userId: user.id }
          })
          
          await prisma.serviceToken.deleteMany({
            where: { userId: user.id }
          })
          
          await prisma.wishlistItem.deleteMany({
            where: { userId: user.id }
          })
          
          // Now delete the user
          await prisma.user.delete({
            where: { id: user.id }
          })
          
          console.log(`✅ Deleted user: ${user.email}`)
        } catch (error) {
          console.error(`❌ Failed to delete user ${user.email}:`, error)
        }
      }
      console.log('✅ Cleanup of users without passwords completed')
    }

    // Show remaining users
    const remainingUsers = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        role: true,
        status: true
      }
    })

    console.log('\n📋 Remaining users:')
    remainingUsers.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - ${user.status}`)
    })

    console.log('\n✅ Cleanup completed successfully!')
  } catch (error) {
    console.error('❌ Cleanup failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
