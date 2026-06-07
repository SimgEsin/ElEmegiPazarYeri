# El İşi Pazarı — Frontend (Client)

Bu klasör projenin **Next.js 16 + React 19 + TailwindCSS** ile yazılmış arayüz (frontend) kısmıdır.

> **Kurulumun tamamı (backend dahil) için kök dizindeki [`README.md`](../README.md) dosyasına bak.**
> Uygulamanın düzgün çalışması için backend'in (`Server/MarketPlace`) da çalışıyor olması gerekir.

## Hızlı çalıştırma

```powershell
npm install      # sadece ilk sefer
npm run dev
```

Tarayıcıda aç: **http://localhost:3000**

## API adresi

Frontend, backend'i varsayılan olarak `https://localhost:7204/api` adresinde arar (`lib/axios.ts`).
Değiştirmek için bu klasörde `.env.local` oluştur:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5085/api
```

## Kullanılabilir komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu (http://localhost:3000) |
| `npm run build` | Üretim derlemesi |
| `npm run start` | Derlenmiş sürümü çalıştırır |
| `npm run lint` | ESLint denetimi |
