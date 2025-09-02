import { NextRequest, NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Danh sách các route không cần authentication
  const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password'];
  
  // Danh sách các route cần authentication
  const protectedRoutes = ['/dashboard', '/DuAn'];
  
  // Kiểm tra xem route hiện tại có cần authentication không
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Lấy token từ cookie hoặc header
  const accessToken = request.cookies.get('AccessToken')?.value || 
                     request.headers.get('Authorization')?.replace('Bearer ', '');
  
  // Kiểm tra token có hợp lệ không (basic check)
  const isTokenValid = accessToken && accessToken.length > 0;
  
  // Nếu đang ở route được bảo vệ mà không có token
  if (isProtectedRoute && !isTokenValid) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Nếu đã đăng nhập mà vào trang login/register
  if (isPublicRoute && isTokenValid && pathname !== '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Xử lý route gốc "/"
  if (pathname === '/') {
    if (isTokenValid) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};



export default middleware;