# 🎤 HƯỚNG DẪN THUYẾT TRÌNH DỰ ÁN

## 📋 MỤC LỤC

1. [Giới thiệu tổng quan](#1-giới-thiệu-tổng-quan)
2. [Công nghệ sử dụng](#2-công-nghệ-sử-dụng)
3. [Tính năng chính](#3-tính-năng-chính)
4. [Cấu trúc dự án](#4-cấu-trúc-dự-án)
5. [Flow thuyết trình](#5-flow-thuyết-trình)
6. [Demo cụ thể](#6-demo-cụ-thể)

---

## 1. GIỚI THIỆU TỔNG QUAN

### 🎯 Dự án là gì?

**"Ứng dụng Tìm kiếm Địa điểm Gần đây"** - Một ứng dụng web GIS (Geographic Information System) cho phép người dùng:

-   Tìm kiếm các địa điểm xung quanh vị trí hiện tại
-   Tìm kiếm địa điểm bằng tên (toàn cầu)
-   Xem bản đồ tương tác với các marker
-   Tính toán tuyến đường và khoảng cách

### 🎨 Giao diện

-   **Bản đồ tương tác** (React Leaflet)
-   **Danh sách địa điểm** với khoảng cách
-   **Tìm kiếm** với kết quả real-time
-   **UI hiện đại** với Tailwind CSS

---

## 2. CÔNG NGHỆ SỬ DỤNG

### Frontend Framework & Libraries

-   **React 18** + **TypeScript** - Framework chính
-   **Vite** - Build tool nhanh, hiện đại
-   **React Leaflet** - Tích hợp bản đồ Leaflet vào React
-   **Leaflet** - Thư viện bản đồ mã nguồn mở

### State Management & Data Fetching

-   **Zustand** - Quản lý state (nhẹ, đơn giản hơn Redux)
-   **React Query (TanStack Query)** - Quản lý data fetching, caching tự động

### Styling

-   **Tailwind CSS** - Utility-first CSS framework
-   **Flowbite** - UI component library
-   **Lucide React** - Icon library

### APIs & Services

-   **Overpass API** - Lấy dữ liệu địa điểm từ OpenStreetMap
-   **Nominatim API** - Tìm kiếm địa điểm (geocoding)   
-   **OSRM (Open Source Routing Machine)** - Tính toán tuyến đường

### Công nghệ khác

-   **Session Storage** - Cache dữ liệu tạm thời
-   **HTML5 Geolocation API** - Lấy vị trí người dùng

---

## 3. TÍNH NĂNG CHÍNH

### 🗺️ 1. Tìm kiếm địa điểm theo danh mục

-   **10+ danh mục**: Nhà hàng, Cafe, Thư viện, BBQ, Fast Food, Bakery, Food Court, Takeaway, Canteen, Kiosk...
-   Click vào icon danh mục → Hiển thị các địa điểm gần vị trí hiện tại
-   **Bán kính tìm kiếm**: 1.5km (có thể tùy chỉnh)
-   **Giới hạn kết quả**: 100 địa điểm (tối ưu performance)

### 🔍 2. Tìm kiếm địa điểm bằng tên

-   Tìm kiếm global với **Nominatim API**
-   Hỗ trợ tiếng Việt và nhiều ngôn ngữ
-   Hiển thị kết quả dưới dạng danh sách và marker trên bản đồ
-   Fly to vị trí khi chọn kết quả

### 📍 3. Quản lý vị trí

-   **Vị trí hiện tại**: Lấy từ Geolocation API
-   **Vị trí mặc định**: Có thể set sẵn
-   **Click trên bản đồ**: Di chuyển đến vị trí bất kỳ
-   **Lưu trữ vị trí**: Dùng Zustand store để persist

### 🎯 4. Marker và tương tác

-   **Marker tùy chỉnh**: Icon khác nhau cho từng danh mục
-   **Marker vị trí hiện tại**: "You are here"
-   **Click marker → Scroll card**: Tự động scroll đến card tương ứng
-   **Click card → Highlight marker**: Highlight marker trên bản đồ
-   **Popup chi tiết**: Thông tin giờ mở cửa, số điện thoại, website

### 🛣️ 5. Tính toán tuyến đường

-   Sử dụng **OSRM API** để tính toán tuyến đường
-   Hiển thị đường đi trên bản đồ (Polyline màu xanh)
-   Thông tin: **Khoảng cách (km)** và **Thời gian (phút)**
-   Tự động fit bounds để hiển thị toàn bộ tuyến đường

### ⚡ 6. Tối ưu hiệu năng

-   **React Query caching**: Tự động cache kết quả API
-   **Session Storage**: Cache dữ liệu Overpass
-   **Fallback mirrors**: Tự động chuyển sang server khác nếu server chính lỗi
-   **Lazy loading**: Chỉ render markers cần thiết
-   **Debounce**: Tối ưu tìm kiếm

### 🎨 7. UX/UI

-   **Loading state**: Hiển thị khi đang fetch data
-   **Error handling**: Xử lý lỗi graceful
-   **Responsive design**: Hoạt động tốt trên mobile và desktop
-   **Smooth animations**: Fly to, scroll animations
-   **Custom scrollbar**: UI đẹp hơn

---

## 4. CẤU TRÚC DỰ ÁN

```
src/
├── api/                    # API clients
│   ├── overpass.ts        # Overpass API - lấy địa điểm
│   ├── nominatim.ts       # Nominatim API - tìm kiếm
│   └── osrm.ts            # OSRM API - tuyến đường
├── components/            # React components
│   ├── MapLayout.tsx      # Component chính - bản đồ
│   ├── Navigation.tsx     # Thanh chọn danh mục
│   ├── SearchBox.tsx      # Ô tìm kiếm
│   ├── PlaceCard.tsx      # Card hiển thị địa điểm
│   ├── MapMarker.tsx      # Marker trên bản đồ
│   └── ...
├── store/                 # Zustand stores
│   ├── useMapStore.ts     # State cho map (vị trí, route, marker)
│   └── useQueryStore.ts   # State cho query (category, search)
├── libs/                  # Utilities & constants
│   ├── constants.ts       # Hằng số
│   ├── enums.ts           # Enums (Category, PositionType)
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Helper functions
└── App.tsx                # Entry point
```

---

## 5. FLOW THUYẾT TRÌNH

### 🎬 Bước 1: Giới thiệu (1-2 phút)

**Mở đầu:**

> "Xin chào thầy và các bạn, hôm nay em xin trình bày về dự án **Ứng dụng Tìm kiếm Địa điểm Gần đây** - một ứng dụng web GIS sử dụng React và các API của OpenStreetMap."

**Nêu vấn đề:**

> "Trong cuộc sống hàng ngày, chúng ta thường cần tìm các địa điểm như nhà hàng, cafe, thư viện xung quanh mình. Dự án này giúp giải quyết vấn đề đó một cách trực quan và dễ sử dụng."

### 🎬 Bước 2: Demo trực quan (3-4 phút)

#### Demo 1: Tìm kiếm theo danh mục

1. Mở ứng dụng
2. Click vào icon "Nhà hàng" → Hiển thị các nhà hàng gần đây
3. Chỉ vào các marker trên bản đồ
4. Click vào một marker → Card tương ứng được highlight và scroll vào view
5. Click vào một card → Map fly to vị trí đó

#### Demo 2: Tìm kiếm bằng tên

1. Nhập "Tháp Eiffel" hoặc "Hoàn Kiếm" vào ô tìm kiếm
2. Hiển thị kết quả dưới dạng danh sách
3. Click vào kết quả → Map fly to vị trí đó
4. Hiển thị marker trên bản đồ

#### Demo 3: Tính toán tuyến đường

1. Click vào một địa điểm trên bản đồ
2. Click vào card → Hiển thị popup "Xem chi tiết"
3. (Nếu có tính năng) Click tính tuyến đường → Hiển thị đường đi và thông tin khoảng cách/thời gian

#### Demo 4: Quản lý vị trí

1. Click nút "Vị trí hiện tại" → Map fly to vị trí GPS
2. Click vào bất kỳ đâu trên bản đồ → Map di chuyển đến đó
3. Giải thích: Vị trí được lưu trong Zustand store

### 🎬 Bước 3: Giới thiệu công nghệ (2-3 phút)

**Frontend:**

> "Dự án sử dụng **React 18 với TypeScript** để đảm bảo type safety và code quality. **Vite** được dùng làm build tool để tối ưu tốc độ development và build."

**Bản đồ:**

> "Để hiển thị bản đồ, em sử dụng **React Leaflet** - một wrapper của **Leaflet.js**, cho phép tích hợp bản đồ tương tác một cách dễ dàng vào React."

**State Management:**

> "Em dùng **Zustand** để quản lý state - một thư viện nhẹ và đơn giản hơn Redux. **React Query** được dùng để quản lý data fetching và caching tự động, giúp tối ưu performance."

**APIs:**

> "Dự án tích hợp 3 API chính từ hệ sinh thái OpenStreetMap:
>
> -   **Overpass API**: Lấy dữ liệu địa điểm theo vị trí và danh mục
> -   **Nominatim API**: Tìm kiếm địa điểm bằng tên (geocoding)
> -   **OSRM**: Tính toán tuyến đường và khoảng cách"

### 🎬 Bước 4: Giải thích kỹ thuật (3-4 phút)

#### Cách hoạt động của Overpass API

> "Khi người dùng chọn một danh mục, ứng dụng gửi query Overpass với:
>
> -   Bán kính tìm kiếm: 1.5km
> -   Vị trí: lat/lon hiện tại
> -   Loại địa điểm: amenity, shop, tourism
>     Kết quả được cache trong Session Storage để tối ưu performance."

#### Tối ưu hiệu năng

> "Để tối ưu, em đã implement:
>
> -   **React Query caching**: Tự động cache kết quả API trong 10 giây
> -   **Session Storage**: Cache dữ liệu Overpass để tránh gọi API lại
> -   **Fallback mirrors**: Nếu server chính lỗi, tự động chuyển sang server khác
> -   **Limit results**: Chỉ hiển thị 100 địa điểm đầu tiên để tránh quá tải"

#### Tương tác Map-Card

> "Khi click vào marker, em sử dụng **useRef** để lưu danh sách các card elements, sau đó dùng **scrollIntoView** để tự động scroll đến card tương ứng. Ngược lại, khi click card, em set state `selectedPosition` và highlight marker tương ứng."

### 🎬 Bước 5: Điểm mạnh & Điểm nổi bật (1-2 phút)

**Điểm mạnh:**

-   ✅ Tích hợp nhiều API của OpenStreetMap
-   ✅ UI/UX hiện đại, responsive
-   ✅ Performance tốt nhờ caching
-   ✅ Code clean, type-safe với TypeScript
-   ✅ Tự động fallback khi API lỗi

**Điểm nổi bật:**

-   🌟 Tìm kiếm global (không chỉ gần vị trí)
-   🌟 Tính toán tuyến đường và khoảng cách
-   🌟 Tương tác 2 chiều giữa map và card
-   🌟 Nhiều danh mục địa điểm (10+ loại)

### 🎬 Bước 6: Kết luận (1 phút)

> "Tóm lại, dự án này là một ứng dụng web GIS hoàn chỉnh với đầy đủ tính năng tìm kiếm, hiển thị và tương tác địa điểm. Em đã học được nhiều về:
>
> -   Làm việc với GIS APIs
> -   State management với Zustand
> -   Data fetching với React Query
> -   Tích hợp bản đồ vào React
>
> Cảm ơn thầy và các bạn đã lắng nghe!"

---

## 6. DEMO CỤ THỂ

### 📝 Checklist trước khi thuyết trình:

-   [ ] Test ứng dụng trên trình duyệt
-   [ ] Chuẩn bị một số địa điểm demo sẵn (ví dụ: "Nhà hàng", "Cafe", "Thư viện")
-   [ ] Đảm bảo kết nối internet ổn định (cần gọi API)
-   [ ] Chuẩn bị màn hình lớn để trình chiếu
-   [ ] Test tính năng GPS (nếu có)

### 🎯 Demo Script chi tiết:

#### Scenario 1: Tìm nhà hàng gần đây

1. "Bây giờ em sẽ demo tìm các nhà hàng gần đây"
2. Click icon "Nhà hàng" → Giải thích: "Đang gọi Overpass API để lấy dữ liệu"
3. Chờ loading → "React Query đang fetch data và cache lại"
4. Hiển thị kết quả → "Có X nhà hàng trong bán kính 1.5km"
5. Click marker → "Tương tác 2 chiều: click marker sẽ scroll đến card"
6. Click card → "Click card sẽ highlight marker và fly to vị trí"

#### Scenario 2: Tìm kiếm địa điểm

1. "Bây giờ em demo tính năng tìm kiếm global"
2. Nhập "Tháp Eiffel" → "Đang gọi Nominatim API"
3. Hiển thị kết quả → "Có thể tìm kiếm địa điểm bất kỳ trên thế giới"
4. Click kết quả → "Map tự động fly to vị trí đó"

#### Scenario 3: Tính toán tuyến đường

1. "Em sẽ demo tính năng tính toán tuyến đường"
2. Click vào một địa điểm
3. (Nếu có) Click "Tính tuyến đường" → "Đang gọi OSRM API"
4. Hiển thị đường đi → "Khoảng cách: X km, Thời gian: Y phút"

---

## 💡 TIPS KHI THUYẾT TRÌNH

1. **Tự tin**: Nắm rõ code và cách hoạt động
2. **Giải thích đơn giản**: Tránh dùng thuật ngữ quá kỹ thuật nếu không cần
3. **Tương tác**: Hỏi thầy/các bạn có muốn xem tính năng nào khác không
4. **Xử lý lỗi**: Nếu API lỗi, giải thích về fallback mechanism
5. **Nhấn mạnh điểm mạnh**: Tối ưu performance, UX tốt, code clean

---

## ❓ CÂU HỎI THƯỜNG GẶP

**Q: Tại sao dùng Zustand thay vì Redux?**
A: Zustand nhẹ hơn, API đơn giản hơn, phù hợp với dự án vừa và nhỏ.

**Q: Làm sao đảm bảo performance khi có nhiều marker?**
A: Em giới hạn chỉ hiển thị 100 địa điểm đầu tiên, và dùng React Query để cache kết quả.

**Q: Tại sao dùng Overpass API?**
A: Overpass API miễn phí, mã nguồn mở, và có dữ liệu phong phú từ OpenStreetMap.

**Q: Có thể mở rộng thêm tính năng gì?**
A: Có thể thêm: lọc theo khoảng cách, đánh giá địa điểm, lưu favorite, share vị trí...

---

**Chúc bạn thuyết trình thành công! 🎉**
