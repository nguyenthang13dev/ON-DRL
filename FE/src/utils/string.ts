import { v4 as uuidv4 } from 'uuid';

function createSlug(title: string): string {
  const uniqueId =
    uuidv4().slice(0, 8) + Math.floor(1000 + Math.random() * 9000);

  const slug = title
    .normalize('NFD') // Tách dấu khỏi chữ cái
    .replace(/[\u0300-\u036f]/g, '') // Xóa dấu thanh (`̀ ́ ̣ ̉ ̃`)
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D') // Chuyển "đ" thành "d"
    .replace(/[^\w\s-]/g, '') // Xóa ký tự đặc biệt, giữ lại chữ, số, dấu cách, dấu '-'
    .replace(/\s+/g, '-') // Thay khoảng trắng bằng '-'
    .replace(/-+/g, '-') // Xóa dấu '-' dư thừa
    .toLowerCase(); // Chuyển về chữ thường

  // Gắn ID tự động vào cuối slug
  return `${slug}-${uniqueId}`;
}

function createSlugPage(title: string): string {
  const slug = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Xóa dấu thanh (`̀ ́ ̣ ̉ ̃`)
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D') // Chuyển "đ" thành "d"
    .replace(/[^\w\s-]/g, '') // Xóa ký tự đặc biệt, giữ lại chữ, số, dấu cách, dấu '-'
    .replace(/\s+/g, '-') // Thay khoảng trắng bằng '-'
    .replace(/-+/g, '-') // Xóa dấu '-' dư thừa
    .toLowerCase();

  return slug;
}

export const extractBodyWithStyle = (htmlContent: string) => {
    if ( !htmlContent ) return "";
    try
    {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, "text/html");
        const styles = Array.from(doc.querySelectorAll("style"))
      .map((el) => el.outerHTML)
      .join("\n");
        const body = doc.body ? doc.body.innerHTML : htmlContent;
        return `<style>${styles}</style>\n${body}`;
    } catch ( error )
    {
        return "";
    }
}


function createCode(title: string): string {
  const uniqueId = uuidv4().slice(0, 4);

  const code = title
    .normalize('NFD') // Tách dấu khỏi chữ cái
    .replace(/[\u0300-\u036f]/g, '') // Xóa dấu thanh (`̀ ́ ̣ ̉ ̃`)
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D') // Chuyển "đ" thành "d"
    .replace(/[^\w\s-]/g, '') // Xóa ký tự đặc biệt, giữ lại chữ, số, dấu cách, dấu '-'
    .replace(/\s+/g, '') // Thay khoảng trắng bằng '-'
    .replace(/-+/g, '-') // Xóa dấu '-' dư thừa
    .toUpperCase() // Chuyển về chữ thường
    .slice(0, 20); // Giới hạn độ dài tối đa của mã là 20 ký tự

  // Gắn ID tự động vào cuối slug
  return `${code}-${uniqueId.toUpperCase()}`;
}

const removeVietnameseTones = (str: string) => {
  return str
    .normalize('NFD') // tách chữ cái và dấu
    .replace(/[\u0300-\u036f]/g, '') // xóa các dấu
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

const highlightText = (text: string, keyword: string) => {
  if (!keyword) return text;

  const normalizedText = removeVietnameseTones(text).toLowerCase();
  const normalizedKeyword = removeVietnameseTones(keyword).toLowerCase();

  const index = normalizedText.indexOf(normalizedKeyword);
  if (index === -1) return text;

  const before = text.slice(0, index);
  const match = text.slice(index, index + keyword.length);
  const after = text.slice(index + keyword.length);

  return `${before}<mark style="background-color:#ffe58f">${match}</mark>${after}`;
};

const formatLowerFirst = (text: string) => {
  return text ? text.charAt(0).toLowerCase() + text.slice(1) : '';
};

const GUIDConverterRaw16 = (guidId: string) => {
  const cleanGuid = guidId.replace(/-/g, '');

  if (cleanGuid.length !== 32) {
    throw new Error('Invalid GUID format');
  }

  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = parseInt(cleanGuid.substr(i * 2, 2), 16);
  }

  return bytes;
};

class StringBuilder {
  private parts: string[] = [];

  append(text: string): StringBuilder {
    this.parts.push(text);
    return this;
  }

  toString(joinedCharacter: string = ''): string {
    return this.parts.join(joinedCharacter);
  }

  toReverseString(joinedCharacter: string = ''): string {
    return this.parts.reverse().join(joinedCharacter);
  }
}

export
{
  createCode,
  createSlug,
  createSlugPage, formatLowerFirst,
  GUIDConverterRaw16, highlightText, removeVietnameseTones, StringBuilder
};

