import { PrismaClient, Source, FunnelStage, Gender, FacebookReferrer, ClickPosition, Device, Browser, TiktokDevice } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  for (let i = 1; i <= 10; i++) {
    const eventFacebook = await prisma.event.create({
      data: {
        eventId: `facebook-event-${i}`,
        timestamp: new Date(),
        source: Source.facebook,
        funnelStage: FunnelStage.top,
        eventType: 'click',
        facebookEventData: {
          create: {
            userId: `fb-user-${i}`,
            name: `User ${i}`,
            age: 20 + i,
            gender: i % 2 === 0 ? Gender.male : Gender.female,
            locCountry: 'USA',
            locCity: `City-${i}`,
            actionTime: new Date(),
            referrer: FacebookReferrer.newsfeed,
            videoId: `video${i}`,
            adId: `ad${i}`,
            campaignId: `campaign${i}`,
            clickPosition: i % 3 === 0 ? ClickPosition.center : i % 2 === 0 ? ClickPosition.top_left : ClickPosition.bottom_right,
            device: i % 2 === 0 ? Device.mobile : Device.desktop,
            browser: i % 2 === 0 ? Browser.Chrome : Browser.Firefox,
            purchaseAmount: (Math.random() * 100).toFixed(2),
          },
        },
      },
    });

    console.log(`Facebook event ${eventFacebook.eventId} created`);
  }

  for (let i = 1; i <= 10; i++) {
    const eventTiktok = await prisma.event.create({
      data: {
        eventId: `tiktok-event-${i}`,
        timestamp: new Date(),
        source: Source.tiktok,
        funnelStage: FunnelStage.bottom,
        eventType: 'engagement',
        tiktokEventData: {
          create: {
            userId: `tiktok-user-${i}`,
            username: `TiktokUser${i}`,
            followers: 1000 + i * 10,
            watchTime: Math.floor(Math.random() * 1000),
            percentageWatched: Math.floor(Math.random() * 100),
            device: i % 2 === 0 ? TiktokDevice.Android : TiktokDevice.iOS,
            country: `Country-${i}`,
            videoId: `tiktok-video-${i}`,
            actionTime: new Date(),
            profileId: `profile-${i}`,
            purchasedItem: `item-${i}`,
            purchaseAmount: (Math.random() * 50).toFixed(2),
          },
        },
      },
    });

    console.log(`TikTok event ${eventTiktok.eventId} created`);
  }

  console.log('Seeding complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
