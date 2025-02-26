import { PrismaClient, Source, Gender, FunnelStage, EventType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const usersData = [
    {
      userId: 'user1',
      source: Source.facebook,
      name: 'John Doe',
      age: 30,
      gender: Gender.male,
      location: 'New York, USA',
      followers: null,
    },
    {
      userId: 'user2',
      source: Source.tiktok,
      name: 'Jane Smith',
      age: 25,
      gender: Gender.female,
      location: 'Los Angeles, USA',
      followers: 1500,
    },
    {
      userId: 'user3',
      source: Source.facebook,
      name: 'Alice Johnson',
      age: 28,
      gender: Gender.female,
      location: 'Chicago, USA',
      followers: 500,
    },
    {
      userId: 'user4',
      source: Source.tiktok,
      name: 'Bob Brown',
      age: 35,
      gender: Gender.male,
      location: 'Miami, USA',
      followers: 2000,
    },
    {
      userId: 'user5',
      source: Source.facebook,
      name: 'Carol White',
      age: 22,
      gender: Gender.female,
      location: 'Seattle, USA',
      followers: 300,
    },
    {
      userId: 'user6',
      source: Source.tiktok,
      name: 'David Green',
      age: 27,
      gender: Gender.male,
      location: 'Austin, USA',
      followers: 1800,
    },
    {
      userId: 'user7',
      source: Source.facebook,
      name: 'Eve Black',
      age: 31,
      gender: Gender.female,
      location: 'Denver, USA',
      followers: 700,
    },
    {
      userId: 'user8',
      source: Source.tiktok,
      name: 'Frank Blue',
      age: 29,
      gender: Gender.male,
      location: 'San Francisco, USA',
      followers: 2500,
    },
    {
      userId: 'user9',
      source: Source.facebook,
      name: 'Grace Yellow',
      age: 24,
      gender: Gender.female,
      location: 'Boston, USA',
      followers: 900,
    },
    {
      userId: 'user10',
      source: Source.tiktok,
      name: 'Hank Red',
      age: 32,
      gender: Gender.male,
      location: 'Las Vegas, USA',
      followers: 2200,
    },
  ];

  const users = await prisma.user.createMany({
    data: usersData,
    skipDuplicates: true,
  });

  console.log(`${users.count} users created.`);

  const eventsData = await Promise.all(
    usersData.map(async (user, index) => {
      const foundUser = await prisma.user.findUnique({ where: { userId: user.userId } });
      if (!foundUser) {
        throw new Error(`User with userId ${user.userId} not found`);
      }
      return {
        eventId: `event${index + 1}`,
        source: user.source,
        funnelStage: index % 2 === 0 ? FunnelStage.top : FunnelStage.bottom,
        eventType: index % 2 === 0 ? EventType.ad_view : EventType.purchase,
        eventTime: new Date(),
        userId: foundUser.id,
      };
    })
  );

  const events = await prisma.event.createMany({
    data: eventsData,
    skipDuplicates: true,
  });

  console.log(`${events.count} events created.`);

  const engagementsData = eventsData.map((event, index) => ({
    eventId: event.eventId,
    referrer: index % 2 === 0 ? 'newsfeed' : null,
    videoId: `video${index + 1}`,
    device: index % 2 === 0 ? 'mobile' : 'desktop',
    browser: index % 2 === 0 ? 'Chrome' : null,
    profileId: index % 2 === 0 ? null : `profile${index + 1}`,
    purchaseAmount: index % 2 === 0 ? null : 100.00 * (index + 1),
  }));

  const engagements = await prisma.engagement.createMany({
    data: engagementsData,
    skipDuplicates: true,
  });

  console.log(`${engagements.count} engagements created.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });