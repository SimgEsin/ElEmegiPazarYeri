using Marketplace.Application.Features.Auth;
using Marketplace.Domain.Entities;
using Marketplace.Domain.Enums;
using Marketplace.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Infrastructure.Seed;

public static class DbSeeder
{
    private const string DefaultPassword = "Sifre123!";

    public static async Task SeedAsync(MarketplaceDbContext dbContext, CancellationToken cancellationToken = default)
    {
        var seedUsers = new[]
        {
            (Email: "musteri@elemegi.com", FullName: "Musteri Hesabi", Role: Role.Customer),
            (Email: "zanaatkar@elemegi.com", FullName: "Zanaatkar Hesabi", Role: Role.Artisan),
            (Email: "admin@elemegi.com", FullName: "Admin Hesabi", Role: Role.Admin),
        };

        foreach (var seed in seedUsers)
        {
            var alreadyExists = await dbContext.Users
                .AnyAsync(user => user.Email == seed.Email, cancellationToken);

            if (alreadyExists)
            {
                continue;
            }

            var user = new AppUser
            {
                Email = seed.Email,
                FullName = seed.FullName,
                PasswordHash = PasswordHasher.HashPassword(DefaultPassword),
                IsActive = true,
            };

            user.UserRoles.Add(new UserRole { UserId = user.Id, Role = seed.Role });

            await dbContext.Users.AddAsync(user, cancellationToken);
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        await SeedMehmetUstaProductAsync(dbContext, cancellationToken);
        await SeedAdditionalProductsAsync(dbContext, cancellationToken);
    }

    // Mevcut zanaatkar (Mehmet Usta) hesabina, mutabakat (siparise ozel uretim)
    // akisini deneyebilmek icin tum alanlari dolu MadeToOrder bir urun baglar.
    private static async Task SeedMehmetUstaProductAsync(MarketplaceDbContext dbContext, CancellationToken cancellationToken)
    {
        const string artisanEmail = "zanaatkar@elemegi.com";
        const string productSlug = "mehmet-usta-siparise-ozel-ahsap-sandik";

        var productExists = await dbContext.Products
            .AnyAsync(p => p.Slug == productSlug, cancellationToken);

        if (productExists)
        {
            return;
        }

        var artisan = await dbContext.Users
            .Include(u => u.ArtisanProfile)
            .FirstOrDefaultAsync(u => u.Email == artisanEmail, cancellationToken);

        if (artisan is null)
        {
            return;
        }

        if (artisan.ArtisanProfile is null)
        {
            var artisanProfile = new ArtisanProfile
            {
                UserId = artisan.Id,
                Slug = "mehmet-usta",
                DisplayName = "Mehmet Usta",
                Craft = "Ahsap Oyma Ustasi",
                City = "Konya",
                Bio = "Kirk yildir babadan ogrenme tekniklerle, her parcayi siparise ozel olarak elde oyan bir ahsap ustasiyim. Once konusur, mutabik kalir, sonra agaci sekillendiririm.",
                AvatarUrl = "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=400&q=80",
                RatingAvg = 4.9m,
                FollowerCount = 320,
                ProductCount = 1,
                IsVerified = true,
            };

            await dbContext.ArtisanProfiles.AddAsync(artisanProfile, cancellationToken);
        }

        var hasSalesSettings = await dbContext.ArtisanSalesSettings
            .AnyAsync(s => s.UserId == artisan.Id, cancellationToken);

        if (!hasSalesSettings)
        {
            await dbContext.ArtisanSalesSettings.AddAsync(new ArtisanSalesSettings
            {
                UserId = artisan.Id,
                CompanyTitle = "Mehmet Usta El Sanatlari",
                TaxNumber = "1234567890",
                TaxOffice = "Konya Selcuklu",
                AccountHolder = "Mehmet Usta",
                Iban = "TR00 0000 0000 0000 0000 0000 00",
                BankName = "Ziraat Bankasi",
                ShippingCompany = "Yurtici Kargo",
            }, cancellationToken);
        }

        var category = await dbContext.Categories
            .FirstOrDefaultAsync(c => c.Slug == "ahsap-oyma", cancellationToken);

        if (category is null)
        {
            category = new Category
            {
                Slug = "ahsap-oyma",
                Name = "Ahsap Oyma",
                Description = "Elde oyulmus, siparise ozel uretilen ahsap eserler.",
                Mood = "Sicak, dogal ve zamansiz",
                ImageUrl = "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80",
            };
            await dbContext.Categories.AddAsync(category, cancellationToken);
        }

        var product = new Product
        {
            ArtisanId = artisan.Id,
            CategoryId = category.Id,
            Slug = productSlug,
            Name = "Siparise Ozel El Oymasi Ahsap Sandik",
            Summary = "Olculeri ve motifleri sizinle mutabik kalinarak belirlenen, tamamen el oymasi ceyiz sandigi.",
            StoryTitle = "Her sandik bir anlasmayla baslar",
            StoryContentHtml = "<p>Bu sandik hazir bir urun degildir. Once sizinle konusur, kullanacaginiz mekani, motif tercihinizi ve olculeri birlikte belirleriz. Mutabik kaldiktan sonra agaci secer ve oymaya baslarim.</p>",
            Material = "Birinci sinif ceviz ve gurgen masif ahsap",
            Technique = "Geleneksel el oymasi (kalem ve tokmak)",
            ProductionDurationText = "Mutabakat sonrasi 3-5 hafta",
            HandcraftDurationText = "Yaklasik 120 saat el iscligi",
            Quote = "Acele ise ahsap gelmez; once anlasiriz, sonra oyariz.",
            ProductionStepsText = "1) Mutabakat gorusmesi ve olcu/motif onayi\n2) Agac secimi ve kurutma kontrolu\n3) Kaba kesim ve govde montaji\n4) El oymasi motif islemesi\n5) Zimpara, dogal yag ve cila\n6) Son kontrol ve ozenli paketleme",
            DeliveryInfoText = "Mutabakat ve uretim tamamlandiktan sonra sigortali olarak kargolanir. Buyuk olculer icin ozel ambalaj uygulanir.",
            Price = 8500m,
            Stock = 0,
            Status = ProductStatus.Published,
            SalesMode = SalesMode.MadeToOrder,
            HeightText = "60 cm (talebe gore degisir)",
            WidthText = "110 cm (talebe gore degisir)",
            WeightText = "Yaklasik 24 kg",
            IsSoldOut = false,
        };

        product.ProductImages.Add(new ProductImage
        {
            ProductId = product.Id,
            Type = ProductImageType.Hero,
            Name = "Ana gorsel",
            Url = "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80",
            AltText = "El oymasi ahsap ceyiz sandigi",
            SortOrder = 0,
        });
        product.ProductImages.Add(new ProductImage
        {
            ProductId = product.Id,
            Type = ProductImageType.Gallery,
            Name = "Motif detayi",
            Url = "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=80",
            AltText = "Oyma motif detayi",
            SortOrder = 1,
        });

        await dbContext.Products.AddAsync(product, cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    // Vitrini zenginlestirmek icin farkli kategorilerde, hem hazir (ReadyToShip)
    // hem de siparise ozel (MadeToOrder) 10 urunu Mehmet Usta hesabina ekler.
    private static async Task SeedAdditionalProductsAsync(MarketplaceDbContext dbContext, CancellationToken cancellationToken)
    {
        const string artisanEmail = "zanaatkar@elemegi.com";

        var artisan = await dbContext.Users
            .FirstOrDefaultAsync(u => u.Email == artisanEmail, cancellationToken);

        if (artisan is null)
        {
            return;
        }

        var seeds = BuildAdditionalProductSeeds();

        foreach (var seed in seeds)
        {
            // Kategori cozumlemesini urun kontrolunden once yapariz; boylece daha once
            // seed edilmis (genel/bos gorselli) kategoriler de dogru gorsele guncellenir.
            var category = await GetOrCreateCategoryAsync(dbContext, seed.CategorySlug, seed.CategoryName, seed.CategoryImageUrl, cancellationToken);

            var productExists = await dbContext.Products
                .AnyAsync(p => p.Slug == seed.Slug, cancellationToken);

            if (productExists)
            {
                continue;
            }

            var product = new Product
            {
                ArtisanId = artisan.Id,
                CategoryId = category.Id,
                Slug = seed.Slug,
                Name = seed.Name,
                Summary = seed.Summary,
                StoryTitle = seed.StoryTitle,
                StoryContentHtml = $"<p>{seed.StoryContent}</p>",
                Material = seed.Material,
                Technique = seed.Technique,
                ProductionDurationText = seed.ProductionDurationText,
                HandcraftDurationText = seed.HandcraftDurationText,
                Quote = seed.Quote,
                ProductionStepsText = seed.ProductionStepsText,
                DeliveryInfoText = seed.DeliveryInfoText,
                Price = seed.Price,
                Stock = seed.SalesMode == SalesMode.MadeToOrder ? 0 : seed.Stock,
                Status = ProductStatus.Published,
                SalesMode = seed.SalesMode,
                HeightText = seed.HeightText,
                WidthText = seed.WidthText,
                WeightText = seed.WeightText,
                IsSoldOut = false,
            };

            product.ProductImages.Add(new ProductImage
            {
                ProductId = product.Id,
                Type = ProductImageType.Hero,
                Name = "Ana gorsel",
                Url = seed.HeroImageUrl,
                AltText = seed.Name,
                SortOrder = 0,
            });
            product.ProductImages.Add(new ProductImage
            {
                ProductId = product.Id,
                Type = ProductImageType.Gallery,
                Name = "Detay gorsel",
                Url = seed.GalleryImageUrl,
                AltText = $"{seed.Name} detay",
                SortOrder = 1,
            });

            await dbContext.Products.AddAsync(product, cancellationToken);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static async Task<Category> GetOrCreateCategoryAsync(
        MarketplaceDbContext dbContext,
        string slug,
        string name,
        string imageUrl,
        CancellationToken cancellationToken)
    {
        // Onceki seed'de tum kategorilere verilen genel placeholder gorsel.
        const string legacyPlaceholderImageUrl =
            "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?auto=format&fit=crop&w=800&q=80";

        var category = await dbContext.Categories
            .FirstOrDefaultAsync(c => c.Slug == slug, cancellationToken);

        if (category is not null)
        {
            if (string.IsNullOrWhiteSpace(category.ImageUrl) || category.ImageUrl == legacyPlaceholderImageUrl)
            {
                category.ImageUrl = imageUrl;
            }

            return category;
        }

        category = new Category
        {
            Slug = slug,
            Name = name,
            Description = $"{name} kategorisinde el emegiyle uretilen ozel parcalar.",
            Mood = "El emegi, ozgun ve samimi",
            ImageUrl = imageUrl,
        };

        await dbContext.Categories.AddAsync(category, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        return category;
    }

    private static IReadOnlyList<AdditionalProductSeed> BuildAdditionalProductSeeds() => new[]
    {
        new AdditionalProductSeed
        {
            Slug = "el-yapimi-seramik-kahve-kupasi",
            Name = "El Yapimi Seramik Kahve Kupasi",
            CategorySlug = "seramik",
            CategoryName = "Seramik",
            CategoryImageUrl = "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
            Summary = "Carkta sekillendirilip sirlanmis, her biri kendine ozgu desenli stok seramik kupa.",
            StoryTitle = "Sabah kahvenize sicaklik",
            StoryContent = "Carkta tek tek sekillendirdigim bu kupalar firinda yuksek isida pisirilip gida ile temasa uygun sirla kaplanir. Stoktan ayni gun gonderilir.",
            Material = "Stoneware kil, gida uyumlu sir",
            Technique = "Carkta sekillendirme ve sirli firinlama",
            ProductionDurationText = "Stoktan ayni gun hazirlanir",
            HandcraftDurationText = "Adet basina yaklasik 4 saat",
            Quote = "Elde sekillenen her kupa, fabrikadan cikan binlercesinden farklidir.",
            ProductionStepsText = "1) Kilin yogrulmasi\n2) Carkta sekillendirme\n3) Kurutma ve biskuvi pisirimi\n4) Sirlama\n5) Sirli pisirim ve kontrol",
            DeliveryInfoText = "Kirilabilir urun olarak ozel kabarcikli ambalajla 1-2 is gununde kargolanir.",
            Price = 320m,
            Stock = 25,
            SalesMode = SalesMode.ReadyToShip,
            HeightText = "11 cm",
            WidthText = "9 cm",
            WeightText = "350 gr",
            HeroImageUrl = "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1200&q=80",
            GalleryImageUrl = "https://images.unsplash.com/photo-1493857671505-72967e2e2760?auto=format&fit=crop&w=1200&q=80",
        },
        new AdditionalProductSeed
        {
            Slug = "kisiye-ozel-el-yapimi-deri-cuzdan",
            Name = "Kisiye Ozel El Yapimi Deri Cuzdan",
            CategorySlug = "deri",
            CategoryName = "Deri Isleri",
            CategoryImageUrl = "https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=800&q=80",
            Summary = "Isim baskisi ve renk secimi sizinle belirlenen, el dikisi bitkisel tabaklanmis deri cuzdan.",
            StoryTitle = "Yillanan bir parca",
            StoryContent = "Bu cuzdan siparise ozeldir. Renk, ic gozenek duzeni ve isim baskisini birlikte belirleriz; ardindan deriyi keser ve el dikisiyle birlestiririm.",
            Material = "Bitkisel tabaklanmis hakiki dana derisi",
            Technique = "El dikisi (saddle stitch) ve kenar cila",
            ProductionDurationText = "Mutabakat sonrasi 1-2 hafta",
            HandcraftDurationText = "Yaklasik 9 saat el iscligi",
            Quote = "Iyi deri eskimez, guzellesir.",
            ProductionStepsText = "1) Renk ve isim mutabakati\n2) Deri secimi ve kesim\n3) Kenar inceltme\n4) El dikisi\n5) Kenar cilasi ve isim baskisi",
            DeliveryInfoText = "Hediye kutusunda, mutabakat ve uretim tamamlandiktan sonra kargolanir.",
            Price = 950m,
            Stock = 0,
            SalesMode = SalesMode.MadeToOrder,
            HeightText = "9.5 cm",
            WidthText = "11 cm",
            WeightText = "120 gr",
            HeroImageUrl = "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80",
            GalleryImageUrl = "https://images.unsplash.com/photo-1606503825008-909a67e63c3d?auto=format&fit=crop&w=1200&q=80",
        },
        new AdditionalProductSeed
        {
            Slug = "dogal-zeytinyagli-sabun-seti",
            Name = "Dogal Zeytinyagli Sabun Seti",
            CategorySlug = "dogal-kozmetik",
            CategoryName = "Dogal Kozmetik",
            CategoryImageUrl = "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800&q=80",
            Summary = "Soguk pres yontemiyle uretilmis, 4 parcalik hazir dogal zeytinyagli sabun seti.",
            StoryTitle = "Cilde dogal dokunus",
            StoryContent = "Lavanta, defne, kekik ve sade zeytinyagli sabunlardan olusan bu seti soguk pres yontemiyle hazirlar, 6 hafta dinlendirip stoga alirim.",
            Material = "Sizma zeytinyagi, defne yagi, dogal esans",
            Technique = "Soguk pres sabun yapimi",
            ProductionDurationText = "Stoktan ayni gun hazirlanir",
            HandcraftDurationText = "Parti basina 6 hafta dinlendirme",
            Quote = "Dogadan gelen, cilde dogal doner.",
            ProductionStepsText = "1) Yaglarin tartilmasi\n2) Karistirma ve esans ekleme\n3) Kaliplama\n4) Kesim\n5) 6 hafta dinlendirme",
            DeliveryInfoText = "Geri donusumlu kraft kutuda 1-2 is gununde kargolanir.",
            Price = 280m,
            Stock = 40,
            SalesMode = SalesMode.ReadyToShip,
            HeightText = "6 cm",
            WidthText = "Kutu 20x20 cm",
            WeightText = "Set 480 gr",
            HeroImageUrl = "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=1200&q=80",
            GalleryImageUrl = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80",
        },
        new AdditionalProductSeed
        {
            Slug = "isme-ozel-gumus-kolye",
            Name = "Isme Ozel Gumus Kolye",
            CategorySlug = "taki",
            CategoryName = "Taki ve Aksesuar",
            CategoryImageUrl = "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
            Summary = "Istediginiz isim veya tarihin elle islenecegi 925 ayar gumus kolye.",
            StoryTitle = "Adiniz gumuste",
            StoryContent = "Bu kolye siparise ozeldir. Isim, font ve zincir boyunu belirledikten sonra plakayi elle keser ve harfleri tek tek islerim.",
            Material = "925 ayar gumus",
            Technique = "El isi metal kesim ve harf damgalama",
            ProductionDurationText = "Mutabakat sonrasi 1 hafta",
            HandcraftDurationText = "Yaklasik 5 saat el iscligi",
            Quote = "Bir isim, dogru islendiginde takiya ruh katar.",
            ProductionStepsText = "1) Isim ve font mutabakati\n2) Plaka kesimi\n3) Harf damgalama\n4) Parlatma\n5) Zincir montaji",
            DeliveryInfoText = "Sertifikali kuyumcu kutusunda, uretim sonrasi kargolanir.",
            Price = 780m,
            Stock = 0,
            SalesMode = SalesMode.MadeToOrder,
            HeightText = "Plaka 2 cm",
            WidthText = "Zincir 45 cm",
            WeightText = "8 gr",
            HeroImageUrl = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
            GalleryImageUrl = "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80",
        },
        new AdditionalProductSeed
        {
            Slug = "el-orgusu-bebek-battaniyesi",
            Name = "El Orgusu Bebek Battaniyesi",
            CategorySlug = "orgu",
            CategoryName = "Orgu ve Tekstil",
            CategoryImageUrl = "https://images.unsplash.com/photo-1604335398980-ededcadcc37e?auto=format&fit=crop&w=800&q=80",
            Summary = "Yumusak organik pamuk iplikten orulmus, stokta hazir bebek battaniyesi.",
            StoryTitle = "Ilmek ilmek sefkat",
            StoryContent = "Organik pamuk iplikten, bebek cildine zarar vermeyen yumusaklikta ordugum bu battaniye stokta hazir bekliyor.",
            Material = "Organik pamuk ip",
            Technique = "El orgusu (tig isi)",
            ProductionDurationText = "Stoktan ayni gun hazirlanir",
            HandcraftDurationText = "Adet basina yaklasik 20 saat",
            Quote = "Her ilmek bir iyi dilek.",
            ProductionStepsText = "1) Ip secimi\n2) Desen orgusu\n3) Birlestirme\n4) Yikama ve yumusatma\n5) Paketleme",
            DeliveryInfoText = "Kurdeleli kraft kutuda 1-2 is gununde kargolanir.",
            Price = 540m,
            Stock = 15,
            SalesMode = SalesMode.ReadyToShip,
            HeightText = "90 cm",
            WidthText = "90 cm",
            WeightText = "400 gr",
            HeroImageUrl = "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1200&q=80",
            GalleryImageUrl = "https://images.unsplash.com/photo-1576697012923-9a2eb1f3a4f2?auto=format&fit=crop&w=1200&q=80",
        },
        new AdditionalProductSeed
        {
            Slug = "siparise-ozel-ahsap-besik",
            Name = "Siparise Ozel Ahsap Besik",
            CategorySlug = "ahsap-oyma",
            CategoryName = "Ahsap Oyma",
            CategoryImageUrl = "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80",
            Summary = "Olculeri ve oyma motifi mutabik kalinan, masif ahsap el yapimi besik.",
            StoryTitle = "Bebeginiz icin ozel bir yuva",
            StoryContent = "Bu besik tamamen siparise ozeldir. Sallanir ya da sabit secenegini, motifi ve olculeri birlikte belirler, ardindan masif ahsabi isleriz.",
            Material = "Masif kayin ahsap, su bazli dogal vernik",
            Technique = "Geleneksel ahsap birlestirme ve el oymasi",
            ProductionDurationText = "Mutabakat sonrasi 4-6 hafta",
            HandcraftDurationText = "Yaklasik 90 saat el iscligi",
            Quote = "Bir besik, yillarca tasinacak bir miras olabilir.",
            ProductionStepsText = "1) Olcu ve motif mutabakati\n2) Ahsap secimi\n3) Kesim ve montaj\n4) El oymasi\n5) Zimpara ve dogal vernik\n6) Guvenlik kontrolu",
            DeliveryInfoText = "Buyuk olcu nedeniyle ozel ambalajla, mutabakat ve uretim sonrasi sigortali kargolanir.",
            Price = 6200m,
            Stock = 0,
            SalesMode = SalesMode.MadeToOrder,
            HeightText = "85 cm (talebe gore)",
            WidthText = "120 cm (talebe gore)",
            WeightText = "Yaklasik 18 kg",
            HeroImageUrl = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
            GalleryImageUrl = "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80",
        },
        new AdditionalProductSeed
        {
            Slug = "cam-fuzyon-servis-tabagi",
            Name = "Cam Fuzyon Servis Tabagi",
            CategorySlug = "cam",
            CategoryName = "Cam Sanati",
            CategoryImageUrl = "https://images.unsplash.com/photo-1525909002-1b05e0c869d8?auto=format&fit=crop&w=800&q=80",
            Summary = "Renkli cam katmanlarinin firinda eritilmesiyle olusan, stokta hazir servis tabagi.",
            StoryTitle = "Isikla dans eden cam",
            StoryContent = "Farkli renklerdeki cam parcalarini katmanlayip firinda eriterek olusturdugum bu tabak stokta hazir bekliyor.",
            Material = "Fuzyon cami",
            Technique = "Cam fuzyon (firinda eritme)",
            ProductionDurationText = "Stoktan ayni gun hazirlanir",
            HandcraftDurationText = "Adet basina yaklasik 14 saat (firin dahil)",
            Quote = "Cam, isikla bulustugunda yeniden dogar.",
            ProductionStepsText = "1) Renk secimi ve kesim\n2) Katmanlama\n3) Firinda fuzyon\n4) Sekillendirme firini\n5) Sogutma ve kontrol",
            DeliveryInfoText = "Kirilabilir urun olarak cift katli ambalajla 1-2 is gununde kargolanir.",
            Price = 460m,
            Stock = 18,
            SalesMode = SalesMode.ReadyToShip,
            HeightText = "3 cm",
            WidthText = "28 cm",
            WeightText = "900 gr",
            HeroImageUrl = "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=80",
            GalleryImageUrl = "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80",
        },
        new AdditionalProductSeed
        {
            Slug = "kisiye-ozel-yagliboya-portre",
            Name = "Kisiye Ozel Yagliboya Portre",
            CategorySlug = "resim",
            CategoryName = "Resim ve Illustrasyon",
            CategoryImageUrl = "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80",
            Summary = "Gonderdiginiz fotograftan, tuval uzerine elle calisilan yagliboya portre.",
            StoryTitle = "Aninizi tuvale tasiyorum",
            StoryContent = "Bu portre siparise ozeldir. Fotografi, tuval olcusunu ve kompozisyonu birlikte belirledikten sonra eseri tamamen elle yagliboyayla calisirim.",
            Material = "Pamuk tuval, profesyonel yagliboya",
            Technique = "Klasik yagliboya teknigi",
            ProductionDurationText = "Mutabakat sonrasi 2-3 hafta",
            HandcraftDurationText = "Yaklasik 40 saat el iscligi",
            Quote = "Bir portre, anin durdurulmus halidir.",
            ProductionStepsText = "1) Fotograf ve olcu mutabakati\n2) Eskiz ve onay\n3) Alt boya\n4) Detay calismasi\n5) Vernikleme ve kuruma",
            DeliveryInfoText = "Tam kurudugunda, ahsap rulo veya cerceveli olarak ozel ambalajla kargolanir.",
            Price = 3400m,
            Stock = 0,
            SalesMode = SalesMode.MadeToOrder,
            HeightText = "50 cm (talebe gore)",
            WidthText = "40 cm (talebe gore)",
            WeightText = "Cerceveli yaklasik 2 kg",
            HeroImageUrl = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80",
            GalleryImageUrl = "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80",
        },
        new AdditionalProductSeed
        {
            Slug = "el-yapimi-dogal-cicek-bali",
            Name = "El Yapimi Dogal Cicek Bali",
            CategorySlug = "gida",
            CategoryName = "Dogal Gida",
            CategoryImageUrl = "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
            Summary = "Yayla ciceklerinden, katkisiz olarak suzulmus 850 gr stok cam kavanoz bal.",
            StoryTitle = "Yaylanin tatli emegi",
            StoryContent = "Kendi kovanlarimdan, yayla ciceklerinden elde edilen bu bal hicbir islemden gecirilmeden suzulup cam kavanoza alinir, stokta hazir bekler.",
            Material = "Saf cicek bali",
            Technique = "Dogal suzme (isi islemi yok)",
            ProductionDurationText = "Stoktan ayni gun hazirlanir",
            HandcraftDurationText = "Sezonluk hasat",
            Quote = "Iyi bal, beklemeyi bilen kovandan cikar.",
            ProductionStepsText = "1) Hasat\n2) Suzme\n3) Dinlendirme\n4) Cam kavanoza alma\n5) Etiketleme",
            DeliveryInfoText = "Cam kavanoz koruyucu ambalajla 1-2 is gununde kargolanir.",
            Price = 390m,
            Stock = 50,
            SalesMode = SalesMode.ReadyToShip,
            HeightText = "12 cm",
            WidthText = "8 cm",
            WeightText = "Net 850 gr",
            HeroImageUrl = "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=80",
            GalleryImageUrl = "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1200&q=80",
        },
        new AdditionalProductSeed
        {
            Slug = "siparise-ozel-makrome-duvar-susu",
            Name = "Siparise Ozel Makrome Duvar Susu",
            CategorySlug = "makrome",
            CategoryName = "Makrome",
            CategoryImageUrl = "https://images.unsplash.com/photo-1582582494705-f8ce0b0c24f0?auto=format&fit=crop&w=800&q=80",
            Summary = "Olculeri ve desenini sizinle belirledigim, el dugumu makrome duvar susu.",
            StoryTitle = "Dugum dugum bir doku",
            StoryContent = "Bu makrome siparise ozeldir. Duvar olcunuze ve renk tercihinize gore deseni belirler, ardindan ipleri tek tek elle dugumlerim.",
            Material = "Dogal pamuk halat, ahsap cubuk",
            Technique = "El dugumu makrome",
            ProductionDurationText = "Mutabakat sonrasi 1-2 hafta",
            HandcraftDurationText = "Yaklasik 16 saat el iscligi",
            Quote = "Sabir, en guzel dugumu atar.",
            ProductionStepsText = "1) Olcu ve desen mutabakati\n2) Halat hazirligi\n3) Dugumleme\n4) Sekillendirme\n5) Ahsap cubuga montaj",
            DeliveryInfoText = "Katlanmis halde koruyucu ambalajla, uretim sonrasi kargolanir.",
            Price = 720m,
            Stock = 0,
            SalesMode = SalesMode.MadeToOrder,
            HeightText = "100 cm (talebe gore)",
            WidthText = "60 cm (talebe gore)",
            WeightText = "Yaklasik 700 gr",
            HeroImageUrl = "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=1200&q=80",
            GalleryImageUrl = "https://images.unsplash.com/photo-1522444195799-478538b28823?auto=format&fit=crop&w=1200&q=80",
        },
    };

    private sealed class AdditionalProductSeed
    {
        public required string Slug { get; init; }
        public required string Name { get; init; }
        public required string CategorySlug { get; init; }
        public required string CategoryName { get; init; }
        public required string CategoryImageUrl { get; init; }
        public required string Summary { get; init; }
        public required string StoryTitle { get; init; }
        public required string StoryContent { get; init; }
        public required string Material { get; init; }
        public required string Technique { get; init; }
        public required string ProductionDurationText { get; init; }
        public required string HandcraftDurationText { get; init; }
        public required string Quote { get; init; }
        public required string ProductionStepsText { get; init; }
        public required string DeliveryInfoText { get; init; }
        public required decimal Price { get; init; }
        public required int Stock { get; init; }
        public required SalesMode SalesMode { get; init; }
        public required string HeightText { get; init; }
        public required string WidthText { get; init; }
        public required string WeightText { get; init; }
        public required string HeroImageUrl { get; init; }
        public required string GalleryImageUrl { get; init; }
    }
}
