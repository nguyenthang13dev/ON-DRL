# Hệ thống Loading Components

## Tổng quan

Hệ thống loading đã được tối ưu hóa để sử dụng chung cho toàn bộ ứng dụng với các component và hook tùy chỉnh.

## Components

### 1. LoadingWrapper
Component wrapper để thêm loading spinner cho bất kỳ component nào.

```tsx
import { LoadingWrapper } from "@/components/shared-components/Loading";

<LoadingWrapper spinning={isLoading} size="large" tip="Đang tải...">
  <YourComponent />
</LoadingWrapper>
```

**Props:**
- `spinning`: boolean - Hiển thị loading hay không
- `size`: "small" | "default" | "large" - Kích thước loading spinner
- `tip`: string - Text hiển thị bên dưới spinner
- `children`: React.ReactNode - Component con được wrap

### 2. Loading
Component loading standalone cho hiển thị ở các vị trí khác nhau.

```tsx
import Loading from "@/components/shared-components/Loading";

// Loading ở giữa màn hình
<Loading content="page" size="large" />

// Loading ở giữa container
<Loading content="content" size="default" />

// Loading inline
<Loading content="inline" size="small" />
```

## Hook

### useLoading
Custom hook để quản lý multiple loading states.

```tsx
import useLoading from "@/hooks/useLoading";

const MyComponent = () => {
  const { isLoading, withLoading } = useLoading();

  const fetchData = async () => {
    await withLoading('api-call', async () => {
      const result = await apiService.getData();
      setData(result);
    });
  };

  return (
    <LoadingWrapper spinning={isLoading('api-call')}>
      <div>Your content</div>
    </LoadingWrapper>
  );
};
```

**Các method của useLoading:**
- `isLoading(key)`: Kiểm tra trạng thái loading của một key
- `withLoading(key, asyncFn)`: Wrap async function với loading state
- `startLoading(key)`: Bắt đầu loading cho key
- `stopLoading(key)`: Dừng loading cho key
- `isAnyLoading()`: Kiểm tra có bất kỳ loading nào đang chạy
- `resetLoading()`: Reset tất cả loading states

## Global CSS

CSS để tùy chỉnh UI đã được thêm vào `src/app/assets/css/global.css`:

```css
/* Custom Ant Design Tab Icon Margin */
.ant-tabs .ant-tabs-tab-btn .anticon:not(:last-child) {
  margin-inline-end: 5px !important;
}

/* Loading Overlay Styles */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
```

## Ví dụ sử dụng trong dự án

### 1. Chi tiết dự án (detail.tsx)
```tsx
const { isLoading, withLoading } = useLoading();

// Loading cho API calls
const loadData = async () => {
  await withLoading('keHoach', async () => {
    const res = await dA_KeHoachThucHienService.getFormByDuAn(item.id, true);
    setCurrentItemKeHoach(res.data?.keHoachThucHienList || []);
  });
};

// UI với loading
<LoadingWrapper spinning={isLoading('keHoach')} size="large">
  <Card title="Kế hoạch triển khai">
    {/* Content */}
  </Card>
</LoadingWrapper>
```

### 2. Multiple loading states
```tsx
const { isLoading, withLoading } = useLoading();

// Các API calls khác nhau
await withLoading('users', () => loadUsers());
await withLoading('roles', () => loadRoles());
await withLoading('files', () => loadFiles());

// UI với loading riêng biệt
<LoadingWrapper spinning={isLoading('users')}>
  <UserList />
</LoadingWrapper>

<LoadingWrapper spinning={isLoading('files')}>
  <FileList />
</LoadingWrapper>
```

## Lợi ích

1. **Tái sử dụng**: Một bộ component và hook cho toàn bộ ứng dụng
2. **Quản lý tập trung**: Multiple loading states được quản lý bởi một hook
3. **Hiệu suất**: Tránh re-render không cần thiết
4. **Bảo trì dễ dàng**: CSS và logic loading được tập trung
5. **Linh hoạt**: Có thể tùy chỉnh size, tip text, và vị trí hiển thị
6. **Type safe**: Full TypeScript support

## Migration từ loading states cũ

Thay vì:
```tsx
const [isLoading, setIsLoading] = useState(false);
const [isLoadingFiles, setIsLoadingFiles] = useState(false);

const fetchData = async () => {
  setIsLoading(true);
  try {
    await apiCall();
  } finally {
    setIsLoading(false);
  }
};
```

Sử dụng:
```tsx
const { isLoading, withLoading } = useLoading();

const fetchData = async () => {
  await withLoading('data', async () => {
    await apiCall();
  });
};
```
