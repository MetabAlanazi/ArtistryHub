import { PrismaClient, ProductType, ProductStatus, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@artistryhub.com' },
    update: {},
    create: {
      email: 'admin@artistryhub.com',
      name: 'Admin User',
      role: Role.admin,
    },
  })

  const operatorUser = await prisma.user.upsert({
    where: { email: 'operator@artistryhub.com' },
    update: {},
    create: {
      email: 'operator@artistryhub.com',
      name: 'Operator User',
      role: Role.operator,
    },
  })

  // Create artists
  const artists = await Promise.all([
    prisma.user.upsert({
      where: { email: 'artist1@artistryhub.com' },
      update: {},
      create: {
        email: 'artist1@artistryhub.com',
        name: 'Sarah Ahmed',
        role: Role.artist,
      },
    }),
    prisma.user.upsert({
      where: { email: 'artist2@artistryhub.com' },
      update: {},
      create: {
        email: 'artist2@artistryhub.com',
        name: 'Mohammed Al-Rashid',
        role: Role.artist,
      },
    }),
    prisma.user.upsert({
      where: { email: 'artist3@artistryhub.com' },
      update: {},
      create: {
        email: 'artist3@artistryhub.com',
        name: 'Fatima Zahra',
        role: Role.artist,
      },
    }),
    prisma.user.upsert({
      where: { email: 'artist4@artistryhub.com' },
      update: {},
      create: {
        email: 'artist4@artistryhub.com',
        name: 'Ahmed Hassan',
        role: Role.artist,
      },
    }),
    prisma.user.upsert({
      where: { email: 'artist5@artistryhub.com' },
      update: {},
      create: {
        email: 'artist5@artistryhub.com',
        name: 'Layla Al-Mansouri',
        role: Role.artist,
      },
    }),
  ])

  // Create artist refs
  const artistRefs = await Promise.all([
    prisma.artistRef.create({
      data: {
        displayName: 'Sarah Ahmed',
        bio: 'Contemporary Saudi artist specializing in abstract expressionism',
        country: 'Saudi Arabia',
        handle: 'sarah-ahmed',
      },
    }),
    prisma.artistRef.create({
      data: {
        displayName: 'Mohammed Al-Rashid',
        bio: 'Traditional calligraphy and modern Islamic art',
        country: 'Saudi Arabia',
        handle: 'mohammed-al-rashid',
      },
    }),
    prisma.artistRef.create({
      data: {
        displayName: 'Fatima Zahra',
        bio: 'Landscape painter capturing the beauty of Arabian deserts',
        country: 'Saudi Arabia',
        handle: 'fatima-zahra',
      },
    }),
    prisma.artistRef.create({
      data: {
        displayName: 'Ahmed Hassan',
        bio: 'Contemporary furniture designer blending tradition with modernity',
        country: 'Saudi Arabia',
        handle: 'ahmed-hassan',
      },
    }),
    prisma.artistRef.create({
      data: {
        displayName: 'Layla Al-Mansouri',
        bio: 'Mixed media artist exploring cultural identity',
        country: 'Saudi Arabia',
        handle: 'layla-al-mansouri',
      },
    }),
  ])

  // Create artist profiles
  await Promise.all(
    artists.map((artist, index) =>
      prisma.artist.create({
        data: {
          userId: artist.id,
          displayName: artistRefs[index].displayName,
          bio: artistRefs[index].bio,
          portfolio: {
            website: `https://${artistRefs[index].handle}.com`,
            instagram: `@${artistRefs[index].handle}`,
          },
          publicProfile: true,
        },
      })
    )
  )

  // Create paintings
  const paintings = await Promise.all(
    Array.from({ length: 20 }, (_, i) =>
      prisma.product.create({
        data: {
          sku: `PNT-2025-${String(i + 1).padStart(4, '0')}`,
          type: ProductType.PAINTING,
          title: `Abstract Harmony ${i + 1}`,
          description: `A stunning abstract painting that captures the essence of modern Saudi art.`,
          images: [`https://example.com/painting-${i + 1}.jpg`],
          colorPalette: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
          tags: ['abstract', 'contemporary', 'modern'],
          status: ProductStatus.PUBLISHED,
          artistRefId: artistRefs[i % 5].id,
          variants: {
            create: {
              name: 'Original',
              priceCents: 1500000, // 15,000 SAR
              currency: 'SAR',
              barcode: `PNT-2025-${String(i + 1).padStart(4, '0')}-V01`,
              weightGr: 2000,
              inventory: {
                create: {
                  qtyOnHand: 1,
                  qtyReserved: 0,
                  lowStockThreshold: 1,
                },
              },
            },
          },
          paintingDetail: {
            create: {
              style: 'Abstract Expressionism',
              medium: 'Oil on Canvas',
              surface: 'Canvas',
              sizeCm: '100x120',
              framed: true,
              signed: true,
              hasCertificate: true,
              yearCreated: 2024,
              countryOfOrigin: 'Saudi Arabia',
            },
          },
        },
      })
    )
  )

  // Create posters
  const posters = await Promise.all(
    Array.from({ length: 20 }, (_, i) =>
      prisma.product.create({
        data: {
          sku: `PST-2025-${String(i + 1).padStart(4, '0')}`,
          type: ProductType.POSTER,
          title: `Desert Sunset ${i + 1}`,
          description: `High-quality poster featuring stunning desert landscapes.`,
          images: [`https://example.com/poster-${i + 1}.jpg`],
          colorPalette: ['#FF8C42', '#FF6B35', '#F7931E'],
          tags: ['landscape', 'desert', 'sunset'],
          status: ProductStatus.PUBLISHED,
          artistRefId: artistRefs[i % 5].id,
          variants: {
            create: {
              name: 'Standard',
              priceCents: 15000, // 150 SAR
              currency: 'SAR',
              barcode: `PST-2025-${String(i + 1).padStart(4, '0')}-V01`,
              weightGr: 200,
              inventory: {
                create: {
                  qtyOnHand: 50,
                  qtyReserved: 0,
                  lowStockThreshold: 5,
                },
              },
            },
          },
          posterDetail: {
            create: {
              sizeCm: '50x70',
              paperType: 'Premium Matte',
              finish: 'MATTE',
              stock: 50,
            },
          },
        },
      })
    )
  )

  // Create furniture
  const furniture = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.product.create({
        data: {
          sku: `FRN-2025-${String(i + 1).padStart(4, '0')}`,
          type: ProductType.FURNITURE,
          title: `Arabian Nights Table ${i + 1}`,
          description: `Handcrafted wooden table with traditional Arabian motifs.`,
          images: [`https://example.com/furniture-${i + 1}.jpg`],
          colorPalette: ['#8B4513', '#D2691E', '#CD853F'],
          tags: ['furniture', 'wooden', 'traditional'],
          status: ProductStatus.PUBLISHED,
          artistRefId: artistRefs[i % 5].id,
          variants: {
            create: {
              name: 'Standard',
              priceCents: 250000, // 2,500 SAR
              currency: 'SAR',
              barcode: `FRN-2025-${String(i + 1).padStart(4, '0')}-V01`,
              weightGr: 15000,
              inventory: {
                create: {
                  qtyOnHand: 5,
                  qtyReserved: 0,
                  lowStockThreshold: 2,
                },
              },
            },
          },
          furnitureDetail: {
            create: {
              material: 'Solid Oak Wood',
              dimensionsCm: '120x60x75',
              weightKg: 15.0,
            },
          },
        },
      })
    )
  )

  // Create price rules
  await Promise.all([
    prisma.priceRule.create({
      data: {
        name: 'New Customer Discount',
        type: 'PERCENT',
        value: 10,
        active: true,
      },
    }),
    prisma.priceRule.create({
      data: {
        name: 'Bulk Purchase Discount',
        type: 'PERCENT',
        value: 15,
        active: true,
      },
    }),
  ])

  // Create sample orders
  const customers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'customer1@example.com' },
      update: {},
      create: {
        email: 'customer1@example.com',
        name: 'Ahmed Al-Zahra',
        role: Role.customer,
      },
    }),
    prisma.user.upsert({
      where: { email: 'customer2@example.com' },
      update: {},
      create: {
        email: 'customer2@example.com',
        name: 'Noor Al-Sabah',
        role: Role.customer,
      },
    }),
  ])

  // Create orders in different states
  const orderStatuses = ['PENDING', 'PAID', 'ALLOCATED', 'SHIPPED', 'DELIVERED'] as const
  
  // Create a simple order without complex relationships for now
  const orders = await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      prisma.order.create({
        data: {
          userId: customers[i % 2].id,
          email: customers[i % 2].email,
          status: orderStatuses[i % orderStatuses.length],
          currency: 'SAR',
          totalCents: 150000, // 1,500 SAR
          placedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // Different dates
        },
      })
    )
  )

  // Create payments for paid orders
  await Promise.all(
    orders
      .filter((order) => order.status === 'PAID' || order.status === 'ALLOCATED' || order.status === 'SHIPPED' || order.status === 'DELIVERED')
      .map((order) =>
        prisma.payment.create({
          data: {
            orderId: order.id,
            provider: 'STRIPE',
            status: 'PAID',
            amountCents: order.totalCents,
            intentId: `pi_${order.id}`,
            chargeId: `ch_${order.id}`,
          },
        })
      )
  )

  // Create fulfillments for shipped/delivered orders
  await Promise.all(
    orders
      .filter((order) => order.status === 'SHIPPED' || order.status === 'DELIVERED')
      .map((order) =>
        prisma.fulfillment.create({
          data: {
            orderId: order.id,
            status: order.status === 'SHIPPED' ? 'SHIPPED' : 'DELIVERED',
            pickedByUserId: operatorUser.id,
            packedByUserId: operatorUser.id,
          },
        })
      )
  )

  // Create support tickets
  await Promise.all([
    prisma.supportTicket.create({
      data: {
        orderId: orders[0].id,
        userId: customers[0].id,
        channel: 'EMAIL',
        subject: 'Order tracking inquiry',
        status: 'OPEN',
        priority: 'MEDIUM',
      },
    }),
    prisma.supportTicket.create({
      data: {
        orderId: orders[1].id,
        userId: customers[1].id,
        channel: 'CHAT',
        subject: 'Delivery date question',
        status: 'RESOLVED',
        priority: 'LOW',
      },
    }),
  ])

  // Create social channels
  await Promise.all([
    prisma.channel.create({
      data: {
        provider: 'INSTAGRAM',
        name: 'ArtistryHub Instagram',
        handle: '@artistryhub',
        credentialsEncrypted: 'encrypted_credentials_here',
      },
    }),
    prisma.channel.create({
      data: {
        provider: 'TWITTER',
        name: 'ArtistryHub Twitter',
        handle: '@artistryhub',
        credentialsEncrypted: 'encrypted_credentials_here',
      },
    }),
  ])

  console.log('✅ Database seeded successfully!')
  console.log(`📊 Created:`)
  console.log(`   - ${artists.length} artists`)
  console.log(`   - ${paintings.length} paintings`)
  console.log(`   - ${posters.length} posters`)
  console.log(`   - ${furniture.length} furniture items`)
  console.log(`   - ${orders.length} orders`)
  console.log(`   - Support tickets and social channels`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
