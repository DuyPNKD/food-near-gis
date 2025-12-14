# 🗺️ Ứng dụng Tìm kiếm Địa điểm Gần đây

Một ứng dụng web GIS (Geographic Information System) hiện đại được xây dựng với React và TypeScript, cho phép người dùng tìm kiếm và khám phá các địa điểm xung quanh vị trí hiện tại hoặc bất kỳ đâu trên thế giới.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-4.4.5-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.3-38B2AC?logo=tailwind-css)

---

## 📋 Mục lục

-   [Giới thiệu](#-giới-thiệu)
-   [Tính năng chính](#-tính-năng-chính)
-   [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
-   [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
-   [Cài đặt](#-cài-đặt)
-   [Cách sử dụng](#-cách-sử-dụng)
-   [Cấu trúc dự án](#-cấu-trúc-dự-án)
-   [APIs và Dịch vụ](#-apis-và-dịch-vụ)
-   [Tối ưu hiệu năng](#-tối-ưu-hiệu-năng)
-   [Hướng dẫn phát triển](#-hướng-dẫn-phát-triển)
-   [Troubleshooting](#-troubleshooting)
-   [Đóng góp](#-đóng-góp)
-   [Giấy phép](#-giấy-phép)

---

## 🎯 Giới thiệu

**Ứng dụng Tìm kiếm Địa điểm Gần đây** là một ứng dụng web GIS cho phép người dùng:

-   🔍 **Tìm kiếm địa điểm theo danh mục**: Nhà hàng, Cafe, Thư viện, BBQ, Fast Food, Bakery, Food Court, và nhiều hơn nữa
-   🌍 **Tìm kiếm địa điểm toàn cầu**: Tìm kiếm bất kỳ địa điểm nào trên thế giới bằng tên
-   📍 **Hiển thị bản đồ tương tác**: Sử dụng OpenStreetMap với React Leaflet
-   🛣️ **Tính toán tuyến đường**: Xem khoảng cách và thời gian di chuyển đến địa điểm
-   💫 **Tương tác hai chiều**: Click marker → scroll đến card, click card → highlight marker

Ứng dụng sử dụng dữ liệu từ OpenStreetMap thông qua Overpass API, Nominatim API và OSRM để cung cấp trải nghiệm người dùng phong phú và chính xác.

---

## ✨ Tính năng chính

### 1. 🗺️ Tìm kiếm địa điểm theo danh mục

-   **10+ danh mục địa điểm**:

    -   🍽️ Nhà hàng (Restaurant)
    -   ☕ Cafe
    -   📚 Thư viện (Library)
    -   🍖 BBQ
    -   🍔 Fast Food
    -   🥐 Bakery
    -   🏪 Food Court
    -   🥡 Takeaway
    -   🍱 Canteen
    -   🏪 Kiosk
    -   🐾 Animal

-   **Tính năng**:
    -   Tìm kiếm trong bán kính **1.5km** từ vị trí hiện tại
    -   Giới hạn tối đa **100 địa điểm** để tối ưu hiệu năng
    -   Icon marker tùy chỉnh cho từng danh mục
    -   Hiển thị khoảng cách từ vị trí hiện tại

### 2. 🔍 Tìm kiếm địa điểm bằng tên

-   Tìm kiếm toàn cầu với **Nominatim API**
-   Hỗ trợ nhiều ngôn ngữ (tiếng Việt, tiếng Anh, v.v.)
-   Kết quả hiển thị dưới dạng danh sách và marker trên bản đồ
-   Tự động fly to vị trí khi chọn kết quả

### 3. 📍 Quản lý vị trí

-   **Vị trí hiện tại**: Lấy tự động từ Geolocation API
-   **Vị trí mặc định**: Hà Nội, Việt Nam (21.0277644, 105.8341598)
-   **Click trên bản đồ**: Di chuyển đến vị trí bất kỳ trên thế giới
-   **Lưu trữ vị trí**: Sử dụng Zustand store để persist state

### 4. 🎯 Marker và tương tác

-   **Marker tùy chỉnh**:

    -   Icon khác nhau cho từng danh mục
    -   Màu sắc phân biệt theo loại địa điểm
    -   Marker "You are here" cho vị trí hiện tại

-   **Tương tác**:
    -   Click marker → Tự động scroll đến card tương ứng
    -   Click card → Highlight marker và fly to vị trí
    -   Popup hiển thị thông tin chi tiết (giờ mở cửa, số điện thoại, website)

### 5. 🛣️ Tính toán tuyến đường

-   Sử dụng **OSRM API** để tính toán tuyến đường
-   Hiển thị đường đi trên bản đồ (Polyline màu xanh)
-   Thông tin chi tiết:
    -   **Khoảng cách** (km)
    -   **Thời gian di chuyển** (phút)
-   Tự động fit bounds để hiển thị toàn bộ tuyến đường

### 6. ⚡ Tối ưu hiệu năng

-   **React Query caching**: Tự động cache kết quả API
-   **Session Storage**: Cache dữ liệu Overpass để tránh gọi API lại
-   **Fallback mirrors**: Tự động chuyển sang server khác nếu server chính lỗi
-   **Lazy loading**: Chỉ render markers cần thiết
-   **Debounce**: Tối ưu tìm kiếm để giảm số lần gọi API

### 7. 🎨 UX/UI

-   **Loading state**: Hiển thị spinner khi đang fetch data
-   **Error handling**: Xử lý lỗi một cách graceful với toast notifications
-   **Responsive design**: Hoạt động tốt trên mobile và desktop
-   **Smooth animations**: Fly to animation, scroll animations
-   **Custom scrollbar**: UI đẹp hơn với tailwind-scrollbar

---

## 🛠️ Công nghệ sử dụng

### Frontend Framework & Libraries

| Công nghệ         | Phiên bản | Mục đích                          |
| ----------------- | --------- | --------------------------------- |
| **React**         | 18.2.0    | Framework JavaScript cho UI       |
| **TypeScript**    | 5.0.2     | Type safety và code quality       |
| **Vite**          | 4.4.5     | Build tool nhanh, hiện đại        |
| **React Leaflet** | 4.2.1     | Tích hợp bản đồ Leaflet vào React |
| **Leaflet**       | 1.9.4     | Thư viện bản đồ mã nguồn mở       |

### State Management & Data Fetching

| Công nghệ          | Phiên bản | Mục đích                       |
| ------------------ | --------- | ------------------------------ |
| **Zustand**        | 4.4.1     | Quản lý state (nhẹ, đơn giản)  |
| **TanStack Query** | 4.35.0    | Data fetching, caching tự động |

### Styling

| Công nghệ        | Phiên bản | Mục đích                    |
| ---------------- | --------- | --------------------------- |
| **Tailwind CSS** | 3.3.3     | Utility-first CSS framework |
| **Flowbite**     | 1.8.1     | UI component library        |
| **Lucide React** | 0.552.0   | Icon library                |

### APIs & Services

| API               | Mục đích                              |
| ----------------- | ------------------------------------- |
| **Overpass API**  | Lấy dữ liệu địa điểm từ OpenStreetMap |
| **Nominatim API** | Tìm kiếm địa điểm (geocoding)         |
| **OSRM**          | Tính toán tuyến đường                 |

### Công nghệ khác

-   **Session Storage**: Cache dữ liệu tạm thời
-   **HTML5 Geolocation API**: Lấy vị trí người dùng

---

## 💻 Yêu cầu hệ thống

-   **Node.js**: >= 16.0.0
-   **npm**: >= 7.0.0 (hoặc yarn >= 1.22.0)
-   **Trình duyệt**: Chrome, Firefox, Edge, Safari (phiên bản gần đây)
-   **Kết nối Internet**: Cần thiết để gọi các API (Overpass, Nominatim, OSRM)

---

## 🚀 Cài đặt

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd nearby-places-react-leaflet-overpass-api
```

### Bước 2: Cài đặt dependencies

Sử dụng npm:

```bash
npm install
```

Hoặc sử dụng yarn:

```bash
yarn install
```

### Bước 3: Chạy ứng dụng

**Development mode:**

```bash
npm run dev
```

hoặc

```bash
yarn dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173` (hoặc port khác nếu 5173 đã được sử dụng).

**Build cho production:**

```bash
npm run build
```

**Preview production build:**

```bash
npm run preview
```

**Linting:**

```bash
npm run lint
```

---

## 📖 Cách sử dụng

### Tìm kiếm địa điểm theo danh mục

1. Mở ứng dụng trong trình duyệt
2. Cho phép truy cập vị trí của bạn (nếu được hỏi)
3. Click vào một icon danh mục (ví dụ: Nhà hàng, Cafe) trên thanh navigation
4. Các địa điểm trong bán kính 1.5km sẽ hiển thị trên bản đồ và trong danh sách bên phải

### Tìm kiếm địa điểm bằng tên

1. Nhập tên địa điểm vào ô tìm kiếm (ví dụ: "Tháp Eiffel", "Hoàn Kiếm")
2. Chọn một kết quả từ danh sách
3. Bản đồ sẽ tự động fly to vị trí đó

### Xem chi tiết địa điểm

-   Click vào một marker trên bản đồ để xem popup với thông tin chi tiết
-   Click vào một card trong danh sách để highlight marker tương ứng
-   Card sẽ tự động scroll vào view khi bạn click marker

### Tính toán tuyến đường

1. Click vào một địa điểm trên bản đồ
2. Chọn "Xem chi tiết" hoặc tương tự trong popup
3. Tuyến đường sẽ được tính toán và hiển thị trên bản đồ
4. Xem khoảng cách và thời gian di chuyển

### Di chuyển đến vị trí khác

-   **Vị trí hiện tại**: Click nút "Vị trí hiện tại" để quay về vị trí GPS
-   **Click trên bản đồ**: Click vào bất kỳ đâu trên bản đồ để di chuyển đến đó
-   **Vị trí mặc định**: Sử dụng nút "Vị trí mặc định" để quay về Hà Nội

---

## 📁 Cấu trúc dự án

```
nearby-places-react-leaflet-overpass-api/
├── public/                    # Tài nguyên tĩnh
│   ├── *.svg                 # Icons cho markers
│   └── vite.svg              # Logo Vite
│
├── src/
│   ├── api/                  # API clients
│   │   ├── overpass.ts       # Overpass API - lấy địa điểm
│   │   ├── nominatim.ts      # Nominatim API - tìm kiếm
│   │   └── osrm.ts           # OSRM API - tuyến đường
│   │
│   ├── components/           # React components
│   │   ├── MapLayout.tsx     # Component chính - bản đồ
│   │   ├── Navigation.tsx    # Thanh chọn danh mục
│   │   ├── SearchBox.tsx     # Ô tìm kiếm
│   │   ├── PlaceCard.tsx     # Card hiển thị địa điểm
│   │   ├── MapMarker.tsx     # Marker trên bản đồ
│   │   ├── CustomMapMarker.tsx
│   │   ├── PlaceContainer.tsx
│   │   ├── SearchResultList.tsx
│   │   ├── ChangePositionButton.tsx
│   │   ├── ChangePositionContainer.tsx
│   │   ├── Loading.tsx
│   │   ├── Toast.tsx
│   │   └── *.ts              # Type definitions
│   │
│   ├── store/                # Zustand stores
│   │   ├── useMapStore.ts    # State cho map (vị trí, route, marker)
│   │   └── useQueryStore.ts  # State cho query (category, search)
│   │
│   ├── libs/                 # Utilities & constants
│   │   ├── constants.ts      # Hằng số (default position, marker icons)
│   │   ├── enums.ts          # Enums (Category, PositionType)
│   │   ├── types.ts          # TypeScript types
│   │   └── utils.ts          # Helper functions
│   │
│   ├── App.tsx               # Entry point component
│   ├── App.css               # Global styles
│   ├── main.tsx              # React entry point
│   ├── index.css             # Tailwind CSS imports
│   ├── queryProvider.tsx     # React Query provider setup
│   └── vite-env.d.ts         # Vite type definitions
│
├── .eslintrc.cjs             # ESLint configuration
├── .gitignore                # Git ignore rules
├── index.html                # HTML template
├── package.json              # Dependencies & scripts
├── postcss.config.js         # PostCSS configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── tsconfig.node.json        # TypeScript config for Node
├── vite.config.ts            # Vite configuration
├── LICENSE                   # License file
└── README.md                 # File này
```

### Giải thích các thư mục chính

-   **`src/api/`**: Chứa các hàm gọi API (Overpass, Nominatim, OSRM)
-   **`src/components/`**: Các React components có thể tái sử dụng
-   **`src/store/`**: Zustand stores để quản lý global state
-   **`src/libs/`**: Utilities, constants, types, và enums
-   **`public/`**: Tài nguyên tĩnh (icons, images)

---

## 🔌 APIs và Dịch vụ

### 1. Overpass API

**Mục đích**: Lấy dữ liệu địa điểm từ OpenStreetMap

**Endpoint**: `https://overpass-api.de/api/interpreter`

**Cách sử dụng**:

-   Query Overpass QL để tìm các địa điểm theo:
    -   Vị trí (latitude, longitude)
    -   Bán kính tìm kiếm (mặc định: 1500m)
    -   Loại địa điểm (amenity, shop, tourism)

**Ví dụ query**:

```
[out:json];
(node[amenity=restaurant](around:1500, 21.0277644, 105.8341598););
out body;
```

### 2. Nominatim API

**Mục đích**: Tìm kiếm địa điểm bằng tên (Geocoding)

**Endpoint**: `https://nominatim.openstreetmap.org/search`

**Cách sử dụng**:

-   Tìm kiếm theo tên địa điểm
-   Trả về danh sách kết quả với lat/lon
-   Hỗ trợ nhiều ngôn ngữ

### 3. OSRM API

**Mục đích**: Tính toán tuyến đường và khoảng cách

**Endpoint**: `http://router.project-osrm.org/route/v1`

**Cách sử dụng**:

-   Tính toán tuyến đường giữa 2 điểm
-   Trả về polyline và thông tin khoảng cách/thời gian

---

## ⚡ Tối ưu hiệu năng

### React Query Caching

-   Tự động cache kết quả API trong 10 giây
-   Giảm số lần gọi API không cần thiết
-   Tự động refetch khi data stale

### Session Storage

-   Cache dữ liệu Overpass để tránh gọi API lại
-   Key format: `overpass-{category}-{lat}-{lon}`
-   Tự động clear khi session kết thúc

### Fallback Mirrors

-   Nếu server Overpass chính lỗi, tự động chuyển sang server khác
-   Danh sách mirrors: overpass-api.de, overpass.kumi.systems, v.v.

### Giới hạn kết quả

-   Chỉ hiển thị 100 địa điểm đầu tiên
-   Tránh quá tải UI và performance issues

### Debounce

-   Tìm kiếm được debounce 300ms
-   Giảm số lần gọi Nominatim API

---

## 🔧 Hướng dẫn phát triển

### Thêm danh mục mới

1. Thêm category vào `src/libs/enums.ts`:

```typescript
export enum Category {
    // ... existing categories
    new_category = "new_category",
}
```

2. Thêm icon vào `public/` (file SVG)

3. Thêm marker icon props vào `src/libs/constants.ts`:

```typescript
export const markerIconPropsDict: {[key: string]: MarkerIconProps} = {
    // ... existing
    [Category.new_category]: {
        imagePath: "/new_category.svg",
        backgroundColor: "#COLOR",
    },
};
```

4. Cập nhật navigation trong `src/components/Navigation.tsx`

### Thay đổi bán kính tìm kiếm

Chỉnh sửa trong `src/api/overpass.ts`:

```typescript
const radius = 1500; // thay đổi giá trị này (đơn vị: mét)
```

### Customize marker icons

Chỉnh sửa `markerIconPropsDict` trong `src/libs/constants.ts`:

-   `imagePath`: Đường dẫn đến file SVG
-   `backgroundColor`: Màu nền của marker

### Thêm tính năng mới

1. Tạo component mới trong `src/components/`
2. Thêm types nếu cần trong `src/libs/types.ts`
3. Update store nếu cần state management
4. Import và sử dụng trong `MapLayout.tsx` hoặc `App.tsx`

---

## 🐛 Troubleshooting

### Bản đồ không hiển thị

**Vấn đề**: Leaflet map không render đúng

**Giải pháp**:

1. Đảm bảo đã import CSS của Leaflet trong `index.html`:

```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
```

2. Kiểm tra z-index trong `App.css`:

```css
.leaflet-container {
    z-index: 0 !important;
}
```

### API không hoạt động

**Vấn đề**: Overpass/Nominatim API trả về lỗi

**Giải pháp**:

-   Kiểm tra kết nối Internet
-   API có rate limiting, đợi một chút và thử lại
-   Kiểm tra console để xem lỗi chi tiết

### Vị trí GPS không hoạt động

**Vấn đề**: Không lấy được vị trí hiện tại

**Giải pháp**:

-   Cho phép truy cập vị trí trong trình duyệt
-   Sử dụng HTTPS (Geolocation API yêu cầu HTTPS)
-   Kiểm tra cài đặt quyền trình duyệt

### Performance chậm với nhiều markers

**Vấn đề**: Ứng dụng lag khi có nhiều địa điểm

**Giải pháp**:

-   Giảm `displayedPlaceCount` trong `constants.ts`
-   Giảm bán kính tìm kiếm
-   Sử dụng clustering markers (cần implement thêm)

### TypeScript errors

**Vấn đề**: Lỗi type khi build

**Giải pháp**:

```bash
npm run lint
```

Sửa các lỗi được báo cáo.

---

## 🤝 Đóng góp

Đóng góp cho dự án này rất được hoan nghênh! Vui lòng làm theo các bước sau:

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

### Coding Standards

-   Sử dụng TypeScript cho type safety
-   Tuân thủ ESLint rules
-   Viết code dễ đọc và có comments khi cần
-   Test các tính năng mới trước khi commit

---

## 📝 License

Dự án này được phân phối dưới giấy phép được định nghĩa trong file `LICENSE`.

---

## 🙏 Lời cảm ơn

-   [OpenStreetMap](https://www.openstreetmap.org/) - Dữ liệu bản đồ
-   [Overpass API](https://overpass-api.de/) - API truy vấn dữ liệu
-   [Nominatim](https://nominatim.org/) - Geocoding service
-   [OSRM](http://project-osrm.org/) - Routing engine
-   [Leaflet](https://leafletjs.com/) - Bản đồ library
-   [React](https://reactjs.org/) - UI framework
-   [Vite](https://vitejs.dev/) - Build tool

---

## 📧 Liên hệ

Nếu có câu hỏi hoặc đề xuất, vui lòng mở một issue trên GitHub repository.

---

**Chúc bạn sử dụng ứng dụng vui vẻ! 🎉**
