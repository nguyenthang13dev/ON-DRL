import utils from '@/utils'

export const ROW_GUTTER = 16
export const SIDE_NAV_WIDTH = 250
export const SIDE_NAV_COLLAPSED_WIDTH = 80
export const HEADER_HEIGHT = 70
export const FOOTER_HEIGHT = 60
export const TOP_NAV_HEIGHT = 55
export const NAV_TYPE_SIDE = 'SIDE'
export const NAV_TYPE_TOP = 'TOP'
export const CONTENT_MAX_WIDTH = 1400
export const CONTENT_HEIGHT_OFFSET = HEADER_HEIGHT + FOOTER_HEIGHT
export const HEADER_BG_DEFAULT_COLOR_LIGHT = '#ffffff'
export const LAYOUT_CONTENT_GUTTER = 12
export const LAYOUT_CONTENT_GUTTER_SM = 12
export const SIDE_NAV_DARK_BG_COLOR = '#001529'

export const BLUE_BASE = '#3e79f7'
export const PURPLE_BASE = '#a461d8'
export const CYAN_BASE = '#04d182'
export const GREEN_BASE = '#21B573'
export const MAGENTA_BASE = '#eb2f96'
export const PINK_BASE = '#eb2f96'
export const RED_BASE = '#de4436'
export const ORANGE_BASE = '#fa8c16'
export const YELLOW_BASE = '#fadb14'
export const VOLCANO_BASE = '#ff6b72'
export const GEEK_BLUE_BASE = '#17bcff'
export const LIME_BASE = '#a0d911'
export const GOLD_BASE = '#ffc542'

export const WHITE = '#ffffff'
export const DARK = '#000000'
export const GRAY_DARK = '#1a3353'
export const GRAY = '#455560'
export const GRAY_LIGHT = '#72849a'
export const GRAY_LIGHTER = '#ededed'
export const GRAY_LIGHTEST = '#f7f7f8'

export const BODY_BACKGROUND = '#fafafb'

export const FONT_SIZE_BASE = 12

export const TEMPLATE = {
  HEADER_HEIGHT,
  FOOTER_HEIGHT,
  TOP_NAV_HEIGHT,
  CONTENT_HEIGHT_OFFSET,
  SIDE_NAV_WIDTH,
  SIDE_NAV_COLLAPSED_WIDTH,
  SIDE_NAV_DARK_BG_COLOR,
  CONTENT_MAX_WIDTH,
  HEADER_BG_DEFAULT_COLOR_LIGHT,
  LAYOUT_CONTENT_GUTTER,
  LAYOUT_CONTENT_GUTTER_SM,
  NAV_TYPE_SIDE,
  NAV_TYPE_TOP,
}

export const GRAY_SCALE = {
  DARK,
  WHITE,
  GRAY_DARK,
  GRAY,
  GRAY_LIGHT,
  GRAY_LIGHTER,
  GRAY_LIGHTEST,
}

export const baseTheme = {
  borderRadius: 10,
  colorPrimary: BLUE_BASE,
  colorSuccess: CYAN_BASE,
  colorWarning: GOLD_BASE,
  colorError: VOLCANO_BASE,
  colorInfo: BLUE_BASE,
  colorText: GRAY_SCALE.GRAY,
  colorBorder: '#e6ebf1',
  colorBgBody: BODY_BACKGROUND,
  controlHeight: 40,
  controlHeightLG: 48,
  controlHeightSM: 36,
  fontFamily: `Open Sans`,
  fontSizeHeading2: 22,
  fontSizeHeading4: 17,
}

export const FONT_WEIGHT = {
  LIGHTER: 'lighter',
  LIGHT: 300,
  NORMAL: 400,
  SEMIBOLD: 500,
  BOLD: 'bold',
  BASE: 400,
  BOLDER: 'bolder',
}

export const FONT_SIZES = {
  BASE: FONT_SIZE_BASE,
  LG: FONT_SIZE_BASE + 2,
  SM: 12,
}

export const SPACER = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '1rem',
  4: '1.5rem',
  5: '3rem',
}

const BREAKPOINT = {
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1400px',
  xxl: '1600px',
}

export const MEDIA_QUERIES = {
  DESKTOP: `(min-width: ${BREAKPOINT.xl})`,
  LAPTOP: `(max-width: ${BREAKPOINT.xxl})`,
  LAPTOP_ABOVE: `(min-width: ${BREAKPOINT.xxl})`,
  TABLET: `(max-width: ${BREAKPOINT.lg})`,
  MOBILE: `(max-width: ${BREAKPOINT.md})`,
}

const getBaseComponentThemeConfig = ({
  Button = {},
  Menu = {},
  Card = {},
  Table = {},
  Select = {},
  DatePicker = {},
  Layout = {},
  Input = {},
  Dropdown = {},
  Calendar = {},
} = {}) => {
  return {
    Button: {
      ...Button,
    },
    Dropdown: {
      controlPaddingHorizontal: 20,
      controlHeight: 37,
      borderRadiusLG: 10,
      paddingXXS: 4,
      paddingVertical: 0,
      ...Dropdown,
    },
    Calendar: {
      ...Calendar,
    },
    Checkbox: {
      lineWidth: 2,
      borderRadiusSM: 4,
    },
    Card: {
      colorTextHeading: GRAY_SCALE.GRAY_DARK,
      paddingLG: 20,
      ...Card,
    },
    Layout: {
      bodyBg: BODY_BACKGROUND,
      headerBg: GRAY_SCALE.WHITE,
      ...Layout,
    },
    Breadcrumb: {
      colorTextDescription: GRAY_SCALE.GRAY_LIGHT,
      colorText: baseTheme.colorPrimary,
      colorBgTextHover: 'transparent',
    },
    Menu: {
      itemBg: 'transparent',
      colorActiveBarHeight: 0,
      activeBarWidth: 3,
      horizontalItemSelectedColor: baseTheme.colorPrimary,
      itemHoverColor: baseTheme.colorPrimary,
      itemSelectedColor: baseTheme.colorPrimary,
      itemSelectedBg: utils.rgba(baseTheme.colorPrimary, 0.1),
      itemHoverBg: 'transparent',
      radiusItem: 0,
      subMenuItemBg: 'transparent',
      itemMarginInline: 0,
      controlHeightLG: 40,
      controlHeightSM: 22,
      ...Menu,
    },
    Input: {
      ...Input,
    },
    Pagination: {
      paginationItemSize: 30,
      borderRadius: '50%',
      colorBgContainer: baseTheme.colorPrimary,
      colorPrimary: GRAY_SCALE.WHITE,
      colorPrimaryHover: GRAY_SCALE.WHITE,
    },
    Steps: {
      wireframe: true,
      controlHeight: 32,
      waitIconColor: GRAY_SCALE.GRAY_LIGHT,
    },
    DatePicker: {
      controlHeight: 40,
      controlHeightSM: 26,
      borderRadiusSM: 6,
      lineWidthBold: 0,
      ...DatePicker,
    },
    Radio: {
      fontSizeLG: 18,
    },
    Slider: {
      colorPrimaryBorder: utils.rgba(baseTheme.colorPrimary, 0.8),
      colorPrimaryBorderHover: baseTheme.colorPrimary,
    },
    Select: {
      paddingXXS: 4,
      paddingVertical: 0,
      controlHeight: 40,
      controlHeightSM: 30,
      controlItemBgActive: utils.rgba(baseTheme.colorPrimary, 0.1),
      ...Select,
    },
    TreeSelect: {
      controlHeightSM: 24,
    },
    Tooltip: {
      colorBgDefault: utils.rgba(GRAY_SCALE.DARK, 0.75),
      controlHeight: 32,
    },
    Timeline: {
      lineType: 'dashed',
    },
    Tag: {
      lineHeight: 2.1,
    },
    Table: {
      colorText: GRAY_SCALE.GRAY,
      tableHeaderBg: 'transparent',
      ...Table,
    },
  }
}

export const lightTheme: any = {
  token: {
    ...baseTheme,
    colorTextBase: GRAY_SCALE.GRAY,
  },
  components: getBaseComponentThemeConfig(),
}
