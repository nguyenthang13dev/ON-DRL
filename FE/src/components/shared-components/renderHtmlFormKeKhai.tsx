import { ConfigFormKeyType } from "@/types/ConfigFormKey/ConfigFormKey";
import { SoLieuKeKhaiType, SoLieuKeKhaiUserDto, tableSoLieuKeKhaiCreateVMDataType } from "@/types/SoLieuKeKhai/soLieuKeKhai";
import { extractBodyWithStyle } from "@/utils/string";
import { Button, Form, Input } from "antd";
import parse from "html-react-parser";
import { SaveAllIcon } from "lucide-react";
import React from "react";

interface RenderHtmlWithKeKhaiProps {
    html: string;
    defaultValues?: SoLieuKeKhaiUserDto[];
    fieldConfig?: ConfigFormKeyType[];
    onSubmit?: (formData: SoLieuKeKhaiType) => void;
    loading?: boolean;
}

const renderHtmlWithSettings = (
    html: string,
    defaultValues?: SoLieuKeKhaiUserDto[],
    fieldConfig?: ConfigFormKeyType[],
    onSubmit?: (formData: SoLieuKeKhaiType) => void,
    form?: any,
    loading?: boolean
) =>
{
    
    console.log(defaultValues);
    

    if (!html) return null;
    const processedHtml = html?.replace(
        /\[\[([^\]]+)\]\]/g,
        (_, field) => `<span class="field-input" data-field="${field}"></span>`
    );
    const options = {
        replace: (domNode: any) => {
            if (
                domNode.type === "tag" &&
                domNode.name === "span" &&
                domNode.attribs?.["class"] === "field-input"
            )
            {
                const field = domNode.attribs["data-field"];
                const fieldConf = fieldConfig?.find((item) => item?.ktT_KEY === field);
                const value = defaultValues?.find((item) => item?.ktT_KEY?.ktT_KEY === field)?.ktT_VALUE ?? "";

                return (
                    <Form.Item
                        key={field}
                        name={field}
                        initialValue={value}
                        style={{ display: "inline-block", margin: "0 3px" }}
                    >
                        <Input
                            placeholder={field}
                            size="small"
                            style={{
                                width: "auto",
                                minWidth: 100,
                                fontSize: 13,
                            }}
                        />
                    </Form.Item>
                );
            }
        },
    } as const;

    const handleFormSubmit = (values: any) => {
        const formData: SoLieuKeKhaiType = {
            lst_KeKhai: [],
            formId: fieldConfig?.[0]?.formId?.id ?? "",
            UserId: null,
        };
        Object.keys(values).forEach((key) => {
            formData.lst_KeKhai.push({
                kTT_KEY: key,
                kTT_VALUE: values[key] as any,
            } as tableSoLieuKeKhaiCreateVMDataType);
        });
        if (onSubmit) {
            onSubmit(formData);
        }
    };

    return (
        <Form 
            form={form} 
            onFinish={handleFormSubmit} 
            layout="vertical"
            style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
        >
             <div style={{ 
                marginTop: 24, 
                textAlign: "center",
                borderTop: "1px solid #f0f0f0",
                paddingTop: 20
            }}>
                <Button
                    type="primary"
                    icon={<SaveAllIcon size={16} />}
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    disabled={loading}
                    style={{
                        borderRadius: 8,
                        height: 42,
                        paddingLeft: 24,
                        paddingRight: 24,
                        fontSize: 14,
                        fontWeight: 500,
                        minWidth: 120,
                    }}
                >
                    {loading ? "Đang lưu..." : "Lưu đánh giá"}
                </Button>
                
                {loading && (
                    <div style={{ 
                        marginTop: 8, 
                        color: "#1890ff", 
                        fontSize: 12 
                    }}>
                        Vui lòng đợi trong giây lát...
                    </div>
                )}
            </div>
            <div style={{ marginBottom: 16 }}>
                {parse(processedHtml, options)}
            </div>
            
           
        </Form>
    );
};

// Safe render component
const RenderHtmlWithInput: React.FC<RenderHtmlWithKeKhaiProps> = ({
    html,
    fieldConfig,
    onSubmit,
    defaultValues,
    loading = false,
}) => {
    const [form] = Form.useForm();
    const safeHtml = extractBodyWithStyle(html);
    
    return (
        <div className="safe-html-renderer" style={{ width: "100%" }}>
            {renderHtmlWithSettings(safeHtml, defaultValues, fieldConfig, onSubmit, form, loading)}
        </div>
    );
};

export default RenderHtmlWithInput;
