export const rules = {
    // Trường bắt buộc
    required: { required: true, message: "Vui lòng nhập thông tin này!" },

    // Không cho nhập HTML, JS
    htmlJs: {
        pattern: /^(?!.*(<\s*script|<\s*iframe|javascript:|vbscript:|data:text\/html|on\w+\s*=|<\/?\s*\w+\s*>)).*$/i,
        message: "Không được nhập mã HTML hoặc JavaScript!",
    },

    // Không cho nhập ký tự đặc biệt như $,&,*,%,#,!...
    specialCharacter: {
        pattern: /^[^$&*%#!]+$/,
        message: "Không được nhập ký tự đặc biệt như $,&,*,%,#,!...",
    },

    // Không được nhập toàn dấu cách
    onlySpaces: {
        pattern: /^(?!\s*$).+/,
        message: "Không được chỉ nhập khoảng trắng!",
    },

    // Không được có khoảng trắng ở giữa
    betweenSpaces: {
        pattern: /^\S+$/,
        message: "Không được có khoảng trắng ở giữa!",
    },

    // Không được chứa dấu tiếng Việt
    vietnamese: {
        pattern: /^[^\u0300-\u036fàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]+$/i,
        message: "Không được chứa dấu tiếng Việt!",
    },

    // Email hợp lệ
    email: {
        validator: (_, value) => {
            const trimmed = value?.trim?.() || ''; // Loại bỏ khoảng trắng trước/sau
            const errors = [];

            // Nếu có giá trị sau khi trim
            if (trimmed.length > 0) {
                // Kiểm tra HTML, JavaScript
                if (/(<\s*script|<\s*iframe|javascript:|vbscript:|data:text\/html|on\w+\s*=|<\/?\s*\w+\s*>)/i.test(trimmed)) {
                    errors.push("Nhập sai định dạng dữ liệu\n");
                }

                // Kiểm tra độ dài
                if (trimmed.length < 6 || trimmed.length > 30) {
                    errors.push("Độ dài từ 6 đến 30 ký tự!\n");
                }

                // Kiểm tra ký tự đặc biệt
                if (/[-&=_\',+,<>]/i.test(trimmed)) {
                    errors.push("Không được nhập ký tự đặc biệt như -, &, =, _, ', +, ,, <, >!\n");
                }

                // Kiểm tra khoảng trắng ở giữa
                if (/\s/.test(trimmed)) {
                    errors.push("Lỗi khoảng trắng\n");
                }

                // kiểm tra dấu tiếng việt
                if (/[\u0300-\u036fàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(trimmed)) {
                    errors.push("Không được nhập ký tự có dấu\n");
                }

                // Kiểm tra chữ hoa
                if (/[A-Z]/.test(trimmed)) {
                    errors.push("Không được nhập chữ hoa!\n");
                }

                // Kiểm tra dấu .
                if (trimmed.startsWith('.')) {
                    errors.push("Không được bắt đầu bằng dấu chấm!\n");
                }
                if (trimmed.endsWith('.')) {
                    errors.push("Không được kết thúc bằng dấu chấm!\n");
                }
                if (/\.\./.test(trimmed)) {
                    errors.push("Không được chứa nhiều dấu chấm liên tiếp!\n");
                }

                // Kiểm tra định dạng email cơ bản
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
                    if (!trimmed.includes('@')) {
                        errors.push("Phải chứa ký tự @\n");
                    }
                    if (!trimmed.includes('.')) {
                        errors.push("Phải chứa tên miền hợp lệ (ví dụ: .com)\n");
                    }
                    if (errors.length === 0) {
                        errors.push("Địa chỉ email không hợp lệ!\n");
                    }
                }
            }

            return errors.length ? Promise.reject(errors) : Promise.resolve();
        },
    },

    // Validator số điện thoại
    phone: {
        validator: (_, value) => {
            const trimmed = value?.trim?.() || '';

            const errors = [];

            if (trimmed.length > 0) {

                // Nếu không bắt đầu bằng '+' hoặc có dấu '+' nhưng xuất hiện ở vị trí khác
                if (!/^[+0]/.test(trimmed)) {
                    errors.push('Số điện thoại phải bắt đầu bằng số 0 hoặc dấu + \n');
                }

                if (
                    (!trimmed.startsWith('+') || trimmed.indexOf('+') > 0) &&
                    /[<>\/{}[\]'"`;]|script|alert|\(|\)|[@#$%^&*!~+]/i.test(trimmed)
                ) {
                    errors.push('Không được nhập ký tự đặc biệt \n');
                }

                // Khoảng trắng ở giữa
                if (/\s/.test(trimmed)) {
                    errors.push('Lỗi khoảng trắng \n');
                }

                // Ký tự không phải số
                if (!/^\+?\d*$/.test(trimmed)) {
                    errors.push('Chỉ được nhập số, trừ dấu + chỉ được phép nhập ở đầu');
                }

                // Tất cả là số 0
                if (/^0{10}$/.test(trimmed.replace(/^\+/, ''))) {
                    errors.push('Không được nhập toàn số 0)');
                }

                // Kiểm tra độ dài hợp lệ
                if (trimmed.startsWith('+')) {
                    const digitsOnly = trimmed.replace(/^\+/, '');
                    if (digitsOnly.length !== 11) {
                        errors.push('Số điện thoại có 10 chữ số \n');
                    }
                } else {
                    if (trimmed.length !== 10) {
                        errors.push('Số điện thoại có 10 chữ số \n');
                    }
                }
            }

            return errors.length ? Promise.reject(errors) : Promise.resolve();
        }
    }

    // Viết tiếp ở đây

};


//Ghi_Chu

// check tên: rules.required (nếu cần require), rules.onlySpaces, rules.htmlJs, rules.specialCharacter

// check mã:  rules.required (nếu cần require),
// rules.htmlJs,
// rules.onlySpaces,
// rules.specialCharacter,
// rules.betweenSpaces,
// rules.vietnamese,

// check email: rules.required (nếu cần require), rules.onlySpaces, rules.email

// check phone: (nếu cần require), rules.onlySpaces, rules.phone
