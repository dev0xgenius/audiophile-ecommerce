-- CreateTable
CREATE TABLE "CategoryMedia" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "purpose" TEXT NOT NULL DEFAULT 'default',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoryMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CategoryMedia_categoryId_mediaAssetId_key" ON "CategoryMedia"("categoryId", "mediaAssetId");

-- CreateIndex
CREATE UNIQUE INDEX "MediaAsset_folder_filename_key" ON "MediaAsset"("folder", "filename");

-- CreateIndex
CREATE UNIQUE INDEX "ProductMedia_productId_mediaAssetId_purpose_variantId_key" ON "ProductMedia"("productId", "mediaAssetId", "purpose", "variantId");

-- AddForeignKey
ALTER TABLE "CategoryMedia" ADD CONSTRAINT "CategoryMedia_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryMedia" ADD CONSTRAINT "CategoryMedia_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
