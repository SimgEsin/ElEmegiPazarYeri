# El Emeği Pazar Yeri (El İşi Pazarı)

El emeği / el yapımı ürünlerin satıldığı bir pazaryeri uygulaması. Müşteri, zanaatkâr ve admin rolleri; ürün, sepet, sipariş, favori, mesajlaşma, değerlendirme ve admin paneli gibi özellikler içerir.

Proje iki parçadan oluşur:

| Katman | Klasör | Teknoloji |
|--------|--------|-----------|
| **Backend (API)** | `Server/MarketPlace` | .NET 9 · ASP.NET Core Web API · Clean Architecture · Entity Framework Core · SQL Server LocalDB · JWT · SignalR |
| **Frontend** | `Client` | Next.js 16 · React 19 · TypeScript · TailwindCSS 4 · shadcn/ui · Axios |

---

## 1. Gereksinimler (Kurulması Gerekenler)

Çalıştırmadan önce bilgisayarında şunların kurulu olması gerekir:

| Araç | Sürüm | İndirme |
|------|-------|---------|
| **.NET SDK** | 9.0 | https://dotnet.microsoft.com/download/dotnet/9.0 |
| **Node.js** | 20 veya üzeri (LTS önerilir) | https://nodejs.org |
| **SQL Server LocalDB** | — | Aşağıdaki nota bak |
| **Git** | — | https://git-scm.com |

> **SQL Server LocalDB nasıl gelir?**
> - **Visual Studio** kuruluysa genelde hazır gelir ("ASP.NET ve web geliştirme" ya da "Veri depolama ve işleme" iş yükü ile).
> - Yoksa: "SQL Server Express" kurulumundan **LocalDB** bileşenini seç → https://www.microsoft.com/sql-server/sql-server-downloads
> - Kurulu mu kontrol et: `sqllocaldb info` (çıktıda `MSSQLLocalDB` görünmeli).

Kurulumları doğrula:
```powershell
dotnet --version   # 9.x görmeli
node --version     # v20+ görmeli
npm --version
sqllocaldb info    # MSSQLLocalDB görmeli
```

---

## 2. Hızlı Başlangıç (Özet)

İki ayrı terminal aç. **Backend'i önce başlat.**

**Terminal 1 — Backend:**
```powershell
cd Server/MarketPlace
dotnet dev-certs https --trust      # SADECE İLK SEFER (HTTPS sertifikası güveni)
dotnet run --project Marketplace.API --launch-profile https
```

**Terminal 2 — Frontend:**
```powershell
cd Client
npm install                          # SADECE İLK SEFER
npm run dev
```

Sonra tarayıcıda aç: **http://localhost:3000**

> Ek bir yapılandırma (veritabanı oluşturma, `.env` vb.) **gerekmez**. Backend ilk çalıştığında veritabanını otomatik kurar ve test verilerini ekler.

---

## 3. Adım Adım Kurulum

### 3.1. Projeyi klonla
```powershell
git clone https://github.com/SimgEsin/ElEmegiPazarYeri.git
cd ElEmegiPazarYeri
```

> **Klonlama yarıda kopuyorsa** (yavaş/dalgalı internet — `early EOF`, `RPC failed` hataları), sadece son sürümü indiren sığ klonlamayı dene:
> ```powershell
> git clone --depth 1 https://github.com/SimgEsin/ElEmegiPazarYeri.git
> ```

### 3.2. Backend'i çalıştır
```powershell
cd Server/MarketPlace
dotnet dev-certs https --trust       # ilk seferde HTTPS sertifikasını güvenilir yap
dotnet run --project Marketplace.API --launch-profile https
```

İlk çalıştırmada otomatik olarak:
- LocalDB üzerinde **`ElEmegiDb`** veritabanını oluşturur (migration'ları uygular),
- Test kullanıcılarını ekler (aşağıdaki [Test Hesapları](#5-test-hesaplari)).

Şu satırları görünce backend hazırdır:
```
Now listening on: https://localhost:7204
Now listening on: http://localhost:5085
Application started.
```

### 3.3. Frontend'i çalıştır (yeni terminal)
```powershell
cd Client
npm install
npm run dev
```
`Ready in ...` yazınca tarayıcıda **http://localhost:3000** adresini aç.

---

## 4. Erişim Adresleri

| Ne | Adres |
|----|-------|
| **Uygulama (Frontend)** | http://localhost:3000 |
| **Giriş sayfası** | http://localhost:3000/login |
| **Backend API** | https://localhost:7204/api (ayrıca http://localhost:5085) |
| **API dokümanı (Scalar)** | https://localhost:7204/scalar/v1 |

---

## 5. Test Hesapları

Veritabanı ilk kurulduğunda otomatik eklenir. **Hepsinin şifresi: `Sifre123!`**

| E-posta | Şifre | Rol |
|---------|-------|-----|
| `admin@elemegi.com` | `Sifre123!` | Admin |
| `zanaatkar@elemegi.com` | `Sifre123!` | Zanaatkâr |
| `musteri@elemegi.com` | `Sifre123!` | Müşteri |

İstersen `/register` sayfasından yeni hesap da oluşturabilirsin.

---

## 6. Yapılandırma (İleri Düzey)

### Frontend → Backend bağlantısı
Frontend, varsayılan olarak backend'i **`https://localhost:7204/api`** adresinde arar (`Client/lib/axios.ts`). Bu yüzden backend'i **`https` profili** ile çalıştırmak gerekir (yukarıdaki komut öyle).

Adresi değiştirmek istersen `Client/` içinde **`.env.local`** dosyası oluştur:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5085/api
```
(Bu dosya git'e gönderilmez.)

### Veritabanı bağlantısı
`Server/MarketPlace/Marketplace.API/appsettings.json` içinde:
```
Server=(localdb)\mssqllocaldb;Database=ElEmegiDb;Trusted_Connection=True;MultipleActiveResultSets=true
```
Farklı bir SQL Server kullanacaksan bu satırı değiştir.

---

## 7. Sorun Giderme

**`dotnet dev-certs` / HTTPS sertifika hatası (tarayıcıda "güvenli değil" / giriş çalışmıyor)**
```powershell
dotnet dev-certs https --clean
dotnet dev-certs https --trust
```
Alternatif: Sertifikayla uğraşmamak için backend'i `http` profili ile çalıştır ve `Client/.env.local` içine `NEXT_PUBLIC_API_BASE_URL=http://localhost:5085/api` yaz:
```powershell
dotnet run --project Marketplace.API --launch-profile http
```

**LocalDB başlamıyor / veritabanına bağlanamıyor**
```powershell
sqllocaldb start MSSQLLocalDB
sqllocaldb info MSSQLLocalDB
```

**Veritabanını sıfırlamak istiyorum (baştan kurulsun)**
```powershell
sqllocaldb stop MSSQLLocalDB
# Visual Studio "SQL Server Object Explorer" ya da SSMS ile ElEmegiDb veritabanını sil,
# sonra backend'i tekrar çalıştır; otomatik yeniden oluşur.
```

**`npm install` takılıyor / zaman aşımı (IPv6 kaynaklı ağ sorunu)**
Node'u IPv4 önceliğiyle çalıştır:
```powershell
$env:NODE_OPTIONS="--dns-result-order=ipv4first"
npm install
```

**Port zaten kullanımda (3000 / 7204 / 5085)**
O portu kullanan işlemi kapat ya da farklı port ver:
```powershell
# Frontend'i farklı portta çalıştır:
npm run dev -- -p 3001
```

**Port çakışmasını yapan işlemi bulup kapatma**
```powershell
Get-Process node, dotnet | Stop-Process -Force   # tüm node/dotnet işlemlerini kapatır
```

---

## 8. Proje Yapısı

```
ElEmegiPazarYeri/
├─ Client/                         # Next.js frontend
│  ├─ app/                         # Sayfalar (login, products, cart, admin-panel, ...)
│  ├─ components/                  # UI bileşenleri (shadcn/ui)
│  ├─ lib/                         # axios, api çağrıları, yardımcılar
│  └─ package.json
└─ Server/
   └─ MarketPlace/                 # .NET çözümü (MarketPlace.sln)
      ├─ Marketplace.API/          # Controller'lar, Program.cs, appsettings
      ├─ Marketplace.Application/  # İş mantığı (CQRS / MediatR)
      ├─ Marketplace.Domain/       # Varlıklar (Entities), Enum'lar
      └─ Marketplace.Infrastructure/  # EF Core, Migrations, Seed, JWT, SignalR
```
