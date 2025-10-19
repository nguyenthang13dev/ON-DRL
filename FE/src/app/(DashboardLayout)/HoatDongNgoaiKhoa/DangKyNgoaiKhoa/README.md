# Component Đăng ký Hoạt động Ngoại khóa

## Mô tả
Component này cung cấp giao diện cho người dùng xem và đăng ký tham gia các hoạt động ngoại khóa. Được thiết kế với UI card-based hiện đại và trực quan.

## Tính năng chính

### 🎯 **Hiển thị hoạt động**
- ✅ Grid layout responsive với card design đẹp mắt
- ✅ Hiển thị thông tin cơ bản: tên, trạng thái, thời gian, địa điểm
- ✅ Badge hiển thị trạng thái đăng ký
- ✅ Gradient background cho các card
- ✅ Hover effects và animations

### 🔎 **Tìm kiếm và lọc**
- ✅ Bộ lọc theo tên hoạt động
- ✅ Lọc theo trạng thái (Active/Pending)
- ✅ Lọc theo trạng thái đăng ký (Đã đăng ký/Chưa đăng ký)
- ✅ Reset filters

### 📝 **Quản lý đăng ký**
- ✅ Đăng ký tham gia hoạt động
- ✅ Hủy đăng ký
- ✅ Modal xác nhận trước khi thực hiện
- ✅ Hiển thị thông tin chi tiết hoạt động

### 📱 **Responsive Design**
- ✅ Mobile-first approach
- ✅ Adaptive grid: 1 cột (mobile) → 4 cột (desktop)
- ✅ Touch-friendly buttons
- ✅ Optimized typography

## Cấu trúc Files

### 1. Main Component (`page.tsx`)
```typescript
// Tính năng chính:
- Grid hiển thị hoạt động với card layout
- Search và filter functionality  
- Đăng ký/hủy đăng ký với confirmation
- Pagination
- Empty state khi không có dữ liệu
```

### 2. Detail Modal (`ActivityDetailModal.tsx`)
```typescript
// Tính năng:
- Modal hiển thị thông tin chi tiết
- QR Code display
- Thông tin đăng ký
- Action buttons (Đăng ký/Hủy)
```

### 3. Styles (`page.module.css`)
```css
/* Styles chính: */
- .activityCard: Card styling với hover effects
- .cardCover: Gradient background
- .registeredBadge: Badge đã đăng ký
- .emptyState: Empty state styling
- Responsive breakpoints
- Animation keyframes
```

## UI/UX Features

### 🎨 **Visual Design**
- **Card Layout**: Clean card design với gradient headers
- **Status Tags**: Color-coded status với custom styling
- **Typography**: Hierarchy rõ ràng với proper font sizes
- **Colors**: Consistent color scheme theo Ant Design
- **Spacing**: Consistent spacing system

### ⚡ **Interactions**
- **Hover Effects**: Card elevation và color changes
- **Loading States**: Loading overlays và skeletons
- **Animations**: Fade-in animations với staggered delays
- **Micro-interactions**: Button hover states, icon animations

### 📐 **Layout**
- **Grid System**: Responsive grid với proper gutters
- **Breakpoints**: 
  - Mobile (xs): 1 column
  - Tablet (sm): 2 columns  
  - Desktop (lg): 3 columns
  - Large (xl): 4 columns

## Responsive Breakpoints

```css
/* Mobile First */
@media (max-width: 576px) {
  - Single column layout
  - Reduced padding
  - Compact typography
}

@media (max-width: 768px) {
  - 2 column layout
  - Adjusted card heights
  - Mobile-friendly buttons
}

@media (max-width: 1200px) {
  - 3 column layout
  - Optimized content spacing
}

/* Desktop */
@media (min-width: 1200px) {
  - 4 column layout
  - Full feature set
}
```

## Component Props & State

### State Management
```typescript
interface ComponentState {
  hoatDongList: HoatDongDangKyType[]     // Danh sách hoạt động
  dataPage: ResponsePageInfo              // Thông tin phân trang
  searchValues: SearchHoatDongDangKyData  // Giá trị tìm kiếm
  selectedActivity: HoatDongDangKyType    // Hoạt động được chọn
  confirmModal: ConfirmModalState         // Trạng thái modal xác nhận
}
```

### API Integration
```typescript
// Service methods used:
- getHoatDongDeDangKy()  // Lấy danh sách hoạt động
- dangKyThamGia()        // Đăng ký tham gia
- huyDangKy()            // Hủy đăng ký
```

## Styling System

### CSS Classes
```css
.activityCard         // Main card styling
.cardCover           // Card header với gradient
.statusTag           // Status badge
.registeredBadge     // Đã đăng ký badge
.activityTitle       // Tên hoạt động
.activityDescription // Mô tả và thông tin
.filterCard          // Search filter card
.emptyState          // Empty state container
.paginationContainer // Pagination wrapper
```

### Color Scheme
```css
/* Status Colors */
--status-active: #52c41a (Green)
--status-pending: #fa8c16 (Orange)  
--status-inactive: #ff4d4f (Red)

/* UI Colors */
--primary: #40a9ff
--success: #52c41a
--warning: #fa8c16
--error: #ff4d4f
--text: #262626
--text-secondary: #666666
```

## Performance Optimizations

### 🚀 **Rendering**
- React.memo cho components không thay đổi
- useCallback cho event handlers
- Efficient re-renders với proper dependencies

### 📦 **Loading**
- Skeleton loading states
- Progressive image loading
- Lazy loading cho large lists

### 🎯 **UX**
- Debounced search input
- Optimistic UI updates
- Smooth transitions

## Accessibility (A11y)

### ♿ **Features**
- Semantic HTML structure
- ARIA labels cho screen readers
- Keyboard navigation support
- High contrast colors
- Focus indicators

### 🎹 **Keyboard Support**
- Tab navigation
- Enter/Space for actions
- Escape to close modals

## Browser Support

### ✅ **Supported**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### ⚠️ **Fallbacks**
- CSS Grid fallback cho older browsers
- Flexbox backup layouts
- Polyfills cho unsupported features

## Usage Example

```typescript
// Route: /HoatDongNgoaiKhoa/DangKyNgoaiKhoa
import DangKyNgoaiKhoa from './DangKyNgoaiKhoa/page';

// Component sử dụng:
<DangKyNgoaiKhoa />
```

## API Requirements

### Backend Endpoints
```csharp
POST /HoatDongNgoaiKhoa/GetHoatDongDeDangKy  // Danh sách để đăng ký
POST /HoatDongNgoaiKhoa/DangKyThamGia        // Đăng ký
POST /HoatDongNgoaiKhoa/HuyDangKy            // Hủy đăng ký
```

### Data Structure
```typescript
interface HoatDongDangKyType {
  id: string
  tenHoatDong: string
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING'
  isRegistered?: boolean
  canRegister?: boolean
  moTa?: string
  thoiGianBatDau?: string
  diaDiem?: string
  soLuongToiDa?: number
  // ... other fields
}
```

## Development Notes

### 🛠️ **Setup**
1. Component được tích hợp sẵn authorization
2. Sử dụng Redux cho state management
3. Toast notifications cho user feedback
4. TypeScript cho type safety

### 🧪 **Testing**
- Unit tests cho utility functions
- Integration tests cho API calls
- Visual regression tests cho UI
- Accessibility tests

### 📈 **Performance Monitoring**
- Bundle size optimization
- Render performance tracking
- API response times
- User interaction metrics

Component này sẵn sàng sử dụng và cung cấp trải nghiệm người dùng tuyệt vời cho việc đăng ký hoạt động ngoại khóa! 🎉