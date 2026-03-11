# AoxCon (Merkez Repo)

Bu repo; **arayüz (web)**, **backend (gateway/orchestrator)** ve **CLI** katmanlarını tek bir merkezde toplamak için hazırlandı.

> Hedef: EVM reposundaki arayüz + backend + CLI kodlarını ve diğer 2 depodaki servisleri tek yönetim noktası altında birleştirmek.

## Mimari

- `apps/backend`: Merkez API (servis yönlendirme, dispatch)
- `apps/web`: Basit yönetim paneli
- `apps/cli`: Operasyon komutları
- `config/services.json`: EVM ve diğer zincir servislerinin registry/config dosyası

## Hızlı Başlangıç

```bash
# 1) backend
node apps/backend/src/server.js

# 2) başka terminalde web
node apps/web/src/server.js

# 3) cli ile kontrol
node apps/cli/src/cli.js status
node apps/cli/src/cli.js dispatch evm wallet.balance '{"address":"0x123"}'
```

## EVM Deposunu Buraya Taşıma Planı (Full)

Aşağıdaki adımlar EVM kodunu bu merkeze taşımak için önerilen tam akıştır:

1. **Kod taşıma**
   - EVM backend kodunu `apps/backend/src/adapters/evm/` altına alın.
   - EVM CLI komutlarını `apps/cli/src/commands/evm/` altına alın.
   - EVM frontend ekranlarını `apps/web/src/modules/evm/` altına taşıyın.

2. **Adapter standardizasyonu**
   - Backend tarafında her dış servis için ortak bir interface kullanın:
     - `health()`
     - `dispatch(action, payload)`
     - `normalizeError(error)`

3. **Endpoint birleştirme**
   - Dış depolardaki dağınık endpointleri merkezde `POST /dispatch` ile normalize edin.
   - `target` alanı ile servis seçin (`evm`, `solana`, `btc` gibi).

4. **CLI birleştirme**
   - Her depodaki CLI komutlarını tek binary altında toplayın.
   - Örnek: `aoxcon dispatch evm wallet.balance --payload '{...}'`

5. **Config merkezileştirme**
   - Tüm servis URL/kimlik bilgilerini `config/services.json` + environment variable ile yönetin.

6. **Aşamalı geçiş**
   - Önce EVM’i taşıyın ve canlıya alın.
   - Sonra diğer iki depoyu aynı adapter kalıbı ile ekleyin.

## Not

Bu repoda şu an çalışan bir **iskelet entegrasyon** var. `dispatch` için gerçek upstream çağrıları yerine stub yanıt dönüyor.
EVM kodu eklendikçe `apps/backend/src/server.js` içinde stub bölümünü gerçek adapter çağrısına çevirebilirsiniz.
