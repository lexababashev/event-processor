-- CreateEnum
CREATE TYPE "Source" AS ENUM ('facebook', 'tiktok');

-- CreateEnum
CREATE TYPE "FunnelStage" AS ENUM ('top', 'bottom');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'non_binary');

-- CreateEnum
CREATE TYPE "FacebookReferrer" AS ENUM ('newsfeed', 'marketplace', 'groups');

-- CreateEnum
CREATE TYPE "ClickPosition" AS ENUM ('top_left', 'bottom_right', 'center');

-- CreateEnum
CREATE TYPE "Device" AS ENUM ('mobile', 'desktop');

-- CreateEnum
CREATE TYPE "Browser" AS ENUM ('Chrome', 'Firefox', 'Safari');

-- CreateEnum
CREATE TYPE "TiktokDevice" AS ENUM ('Android', 'iOS', 'Desktop');

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "source" "Source" NOT NULL,
    "funnelStage" "FunnelStage" NOT NULL,
    "eventType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facebook_event_data" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "locCountry" TEXT NOT NULL,
    "locCity" TEXT NOT NULL,
    "actionTime" TIMESTAMP(3),
    "referrer" "FacebookReferrer",
    "videoId" TEXT,
    "adId" TEXT,
    "campaignId" TEXT,
    "clickPosition" "ClickPosition",
    "device" "Device",
    "browser" "Browser",
    "purchaseAmount" DECIMAL(65,30),
    "eventId" TEXT NOT NULL,

    CONSTRAINT "facebook_event_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tiktok_event_data" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,
    "watchTime" INTEGER,
    "percentageWatched" INTEGER,
    "device" "TiktokDevice",
    "country" TEXT,
    "videoId" TEXT,
    "actionTime" TIMESTAMP(3),
    "profileId" TEXT,
    "purchasedItem" TEXT,
    "purchaseAmount" DECIMAL(65,30),
    "eventId" TEXT NOT NULL,

    CONSTRAINT "tiktok_event_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "events_timestamp_idx" ON "events"("timestamp");

-- CreateIndex
CREATE INDEX "events_source_idx" ON "events"("source");

-- CreateIndex
CREATE INDEX "events_funnelStage_idx" ON "events"("funnelStage");

-- CreateIndex
CREATE UNIQUE INDEX "facebook_event_data_eventId_key" ON "facebook_event_data"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "tiktok_event_data_eventId_key" ON "tiktok_event_data"("eventId");

-- AddForeignKey
ALTER TABLE "facebook_event_data" ADD CONSTRAINT "facebook_event_data_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tiktok_event_data" ADD CONSTRAINT "tiktok_event_data_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
