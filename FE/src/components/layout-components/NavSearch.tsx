import { useSelector } from '@/store/hooks';
import { MenuDataType } from '@/types/menu/menu';
import * as Icons from '@ant-design/icons';
import { Form, Input } from 'antd';
import React, { useMemo, useState, useRef, useEffect } from 'react';
import debounce from 'lodash/debounce';
import Link from 'next/link';
import { highlightText, removeVietnameseTones } from '@/utils/string';
import { useRouter } from 'next/navigation';

type menuSearch = {
  classCss: string;
  name: string;
  url: string;
};

const getAntdIconByName = (iconString: string) => {
  if (!iconString) return <Icons.SettingOutlined />;
  const match = iconString.match(/<(\w+)\s*\/>/);
  const iconName = match ? match[1] : null;
  if (!iconName) return <Icons.SettingOutlined />;
  const IconComponent = (Icons as any)[iconName];
  return IconComponent ? <IconComponent /> : <Icons.QuestionOutlined />;
};

const listMenuSearch: menuSearch[] = [];

const NavSearch = ({ className }: { className?: string }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [listMenuFilter, setListMenuFilter] = useState<menuSearch[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const menuData: MenuDataType[] | null = useSelector(
      (state) => state.menu.menuData
  );

  useMemo(() => {
    menuData?.forEach(({ classCss, name: prefixName, listMenu, isAccess }) => {
      listMenu?.forEach(({ name, url }) => {
        if (isAccess && isAccess == true) {
          listMenuSearch.push({
            classCss: classCss ?? '',
            name: prefixName ? prefixName + (name ? '>' + name : '') : '',
            url: url ?? '',
          });
        }
      });
    });
  }, [menuData]);

  const debounceSearch = useMemo(
      () =>
          debounce((value: string) => {
            if (value) {
              const keyword = removeVietnameseTones(value.toLowerCase());
              const filtered = listMenuSearch.filter((item) => {
                const itemName = removeVietnameseTones(item.name.toLowerCase());
                return itemName.includes(keyword);
              });
              setListMenuFilter(filtered);
            } else {
              setListMenuFilter([]);
            }
          }, 300),
      []
  );

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchKeyword(searchValue);
    debounceSearch(searchValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && listMenuFilter.length > 0) {
      router.push(listMenuFilter[0].url);
      resetSearch();
    }
  };

  const resetSearch = () => {
    setSearchKeyword('');
    setListMenuFilter([]);
    form.resetFields();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setListMenuFilter([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
      <div className={`relative w-full ${className}`} ref={searchRef}>
        <Form form={form} className="w-full" autoComplete="off">
          <Form.Item name="keyWord" className="mb-0">
            <Input
                placeholder="Thông tin tìm kiếm"
                suffix={<Icons.SearchOutlined />}
                onChange={handleOnchange}
                onKeyDown={handleKeyDown}
                value={searchKeyword}
                allowClear={{
                  clearIcon: <Icons.CloseCircleFilled
                      className="text-gray-400 hover:text-gray-600"
                      onClick={resetSearch}
                  />
                }}
            />
          </Form.Item>
        </Form>
        {listMenuFilter.length > 0 && (
            <div
                className="absolute rounded-sm bg-white top-full left-0 w-full border border-gray-400 translate-y-2 z-[1001] p-2
          max-h-[300px] overflow-y-auto shadow-lg"
            >
              {listMenuFilter.map((item, index) => {
                return (
                    <div key={index} className="p-0 m-0 h-[50px] flex items-center hover:bg-gray-100">
                      <Link
                          href={item.url}
                          onClick={resetSearch}
                          prefetch={false}
                          className="w-full px-3 flex items-center gap-2"
                      >
                        {getAntdIconByName(item.classCss)}
                        <span
                            dangerouslySetInnerHTML={{
                              __html: highlightText(item.name, searchKeyword),
                            }}
                        />
                      </Link>
                    </div>
                );
              })}
            </div>
        )}
      </div>
  );
};

export default NavSearch;