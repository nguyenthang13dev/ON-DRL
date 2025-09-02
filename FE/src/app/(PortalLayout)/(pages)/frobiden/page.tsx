// pages/403.tsx

export default function AccessDenied() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center">
                <h1 className="text-4xl font-bold text-red-500 mb-4">403</h1>
                <p className="text-xl font-semibold mb-2">Bạn không có quyền truy cập</p>
                <p className="text-gray-600 mb-6">
                    Trang bạn đang cố gắng truy cập yêu cầu quyền mà bạn không có.
                </p>
            </div>
        </div>
    );
}