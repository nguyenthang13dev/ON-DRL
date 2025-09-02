// Link Account Types
export enum AccountType {
  TELEGRAM = 'telegram',
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
  MICROSOFT = 'microsoft',
  GITHUB = 'github'
}

export enum LinkingStatus {
  IDLE = 'idle',
  GENERATING_TOKEN = 'generating_token',
  TOKEN_GENERATED = 'token_generated',
  LINKING = 'linking',
  SUCCESS = 'success',
  FAILED = 'failed'
}

export interface AccountProvider {
  type: AccountType;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  available: boolean;
  comingSoon?: boolean;
}

export interface TelegramLinkToken {
  token: string;
  expiresAt?: string;
  createdAt: string;
}

export interface LinkingStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  icon?: string;
}

export interface TelegramLinkingState {
  status: LinkingStatus;
  token: TelegramLinkToken | null;
  steps: LinkingStep[];
  error: string | null;
  retryCount: number;
  maxRetries: number;
}

export interface LinkAccountPageState {
  selectedProvider: AccountProvider | null;
  showProviderSelection: boolean;
  telegramLinking: TelegramLinkingState;
}

// API Response Types
export interface GenerateTelegramTokenResponse {
  token: string;
}

export interface TelegramLinkStatusResponse {
  isLinked: boolean;
  telegramUsername?: string;
  linkedAt?: string;
}

// Default providers configuration
export const DEFAULT_PROVIDERS: AccountProvider[] = [
  {
    type: AccountType.TELEGRAM,
    name: 'Telegram',
    description: 'Liên kết với Telegram để nhận thông báo và tương tác qua bot',
    icon: 'telegram',
    color: '#0088cc',
    bgColor: '#e3f2fd',
    available: true
  },
  {
    type: AccountType.FACEBOOK,
    name: 'Facebook',
    description: 'Liên kết với Facebook để đăng nhập nhanh chóng',
    icon: 'facebook',
    color: '#1877f2',
    bgColor: '#e3f2fd',
    available: false,
    comingSoon: true
  },
  {
    type: AccountType.GOOGLE,
    name: 'Google',
    description: 'Liên kết với Google để đồng bộ dữ liệu và đăng nhập',
    icon: 'google',
    color: '#db4437',
    bgColor: '#ffebee',
    available: false,
    comingSoon: true
  },
  {
    type: AccountType.MICROSOFT,
    name: 'Microsoft',
    description: 'Liên kết với Microsoft để tích hợp Office 365',
    icon: 'microsoft',
    color: '#00a1f1',
    bgColor: '#e1f5fe',
    available: false,
    comingSoon: true
  },
  {
    type: AccountType.GITHUB,
    name: 'GitHub',
    description: 'Liên kết với GitHub để quản lý code và projects',
    icon: 'github',
    color: '#333',
    bgColor: '#f5f5f5',
    available: false,
    comingSoon: true
  }
];

// Default Telegram linking steps
export const DEFAULT_TELEGRAM_STEPS: LinkingStep[] = [
  {
    id: 1,
    title: 'Lấy mã xác thực',
    description: 'Nhấn nút "Lấy token liên kết" để tạo mã xác thực',
    status: 'pending',
    icon: 'key'
  },
  {
    id: 2,
    title: 'Tìm kiếm bot',
    description: 'Tìm kiếm @HiNET_Service_bot hoặc đường dẫn https://t.me/HiNET_Service_bot trên Telegram',
    status: 'pending',
    icon: 'search'
  },
  {
    id: 3,
    title: 'Khởi động bot',
    description: 'Nhấn /start để khởi động bot',
    status: 'pending',
    icon: 'play-circle'
  },
  {
    id: 4,
    title: 'Gửi mã xác thực',
    description: 'Gửi mã xác thực (LINK:<token>) cho bot',
    status: 'pending',
    icon: 'message'
  },
  {
    id: 5,
    title: 'Xác nhận liên kết',
    description: 'Đợi bot phản hồi xác nhận liên kết thành công',
    status: 'pending',
    icon: 'check-circle'
  }
];

// Constants
export const TELEGRAM_BOT_USERNAME = '@HiNET_Service_bot';
export const TOKEN_EXPIRY_MINUTES = 15;
export const MAX_RETRY_ATTEMPTS = 3;
export const POLLING_INTERVAL = 5000; // 5 seconds

// Utility functions
export const formatLinkToken = (token: string): string => {
  return `${token}`;
};

export const isTokenExpired = (createdAt: string, expiryMinutes: number = TOKEN_EXPIRY_MINUTES): boolean => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMinutes = (now.getTime() - created.getTime()) / (1000 * 60);
  return diffMinutes > expiryMinutes;
};

export const getStepStatus = (stepId: number, currentStatus: LinkingStatus): LinkingStep['status'] => {
  switch (currentStatus) {
    case LinkingStatus.IDLE:
      return stepId === 1 ? 'active' : 'pending';
    case LinkingStatus.GENERATING_TOKEN:
      return stepId === 1 ? 'active' : 'pending';
    case LinkingStatus.TOKEN_GENERATED:
      return stepId === 1 ? 'completed' : stepId === 2 ? 'active' : 'pending';
    case LinkingStatus.LINKING:
      return stepId <= 4 ? 'completed' : stepId === 5 ? 'active' : 'pending';
    case LinkingStatus.SUCCESS:
      return 'completed';
    case LinkingStatus.FAILED:
      return stepId === 1 ? 'error' : 'pending';
    default:
      return 'pending';
  }
}; 