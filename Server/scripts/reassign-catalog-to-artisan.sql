-- Tek seferlik veri tasima scripti.
-- Tum urunlerin (ve onlara bagli hikayeler/gorseller/yorumlarin) sahipligini
-- seed edilen zanaatkar hesabina (zanaatkar@elemegi.com) tasir.
-- Idempotent: birden fazla kez calistirilabilir.
SET NOCOUNT ON;
SET XACT_ABORT ON;

DECLARE @ArtisanEmail nvarchar(256) = N'zanaatkar@elemegi.com';
DECLARE @ArtisanId uniqueidentifier = (SELECT TOP 1 Id FROM Users WHERE Email = @ArtisanEmail);

IF @ArtisanId IS NULL
BEGIN
    RAISERROR(N'Zanaatkar hesabi bulunamadi. Once API''yi bir kez calistirip seeder''in hesaplari olusturmasini saglayin.', 16, 1);
    RETURN;
END

BEGIN TRANSACTION;

-- 1) Tum urunleri zanaatkar hesabina bagla (hikayeler/gorseller ProductId uzerinden otomatik takip eder).
UPDATE Products
SET ArtisanId = @ArtisanId,
    UpdatedAt = SYSUTCDATETIME()
WHERE ArtisanId <> @ArtisanId;

DECLARE @MovedProducts int = @@ROWCOUNT;

-- 2) Zanaatkar hesabinin bir ArtisanProfile'i yoksa olustur (urun detay sayfasi bu profilden beslenir).
IF NOT EXISTS (SELECT 1 FROM ArtisanProfiles WHERE UserId = @ArtisanId AND IsDeleted = 0)
BEGIN
    INSERT INTO ArtisanProfiles
        (Id, UserId, Slug, DisplayName, Craft, City, Bio, RatingAvg, FollowerCount, ProductCount, IsVerified, CreatedAt, UpdatedAt, IsDeleted)
    SELECT
        NEWID(),
        @ArtisanId,
        N'zanaatkar-hesabi',
        u.FullName,
        N'El Sanatlari',
        N'Istanbul',
        N'El emegi urunlerini bir araya getiren zanaatkar hesabi.',
        0, 0, 0, 1,
        SYSUTCDATETIME(), NULL, 0
    FROM Users u
    WHERE u.Id = @ArtisanId;
END

-- 3) ProductCount'u guncel urun sayisina esitle.
UPDATE ap
SET ProductCount = (SELECT COUNT(*) FROM Products p WHERE p.ArtisanId = @ArtisanId AND p.IsDeleted = 0),
    UpdatedAt = SYSUTCDATETIME()
FROM ArtisanProfiles ap
WHERE ap.UserId = @ArtisanId;

COMMIT TRANSACTION;

DECLARE @FinalCount int = (SELECT COUNT(*) FROM Products WHERE ArtisanId = @ArtisanId AND IsDeleted = 0);
PRINT N'Tasinan urun sayisi: ' + CAST(@MovedProducts AS nvarchar(10));
PRINT N'Zanaatkar urun sayisi: ' + CAST(@FinalCount AS nvarchar(10));
