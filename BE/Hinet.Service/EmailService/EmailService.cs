using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;

using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.EmailService
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var emailSettings = _configuration.GetSection("Mail");

            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(emailSettings["Alias"], emailSettings["From"]));
            email.To.Add(new MailboxAddress("", toEmail));
            email.Subject = subject;

            email.Body = new TextPart("html") { Text = body };

            using var smtp = new SmtpClient();
            try
            {
                await smtp.ConnectAsync(emailSettings["Host"], int.Parse(emailSettings["Port"]), false);
                await smtp.AuthenticateAsync(emailSettings["Username"], emailSettings["Password"]);
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);

                _logger.LogInformation($"✅ Email gửi thành công đến: {toEmail}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Lỗi gửi email: {ex.Message}");
                throw new Exception($"Không thể gửi email đến {toEmail}. Vui lòng kiểm tra cấu hình email hoặc kết nối mạng.", ex);
            }
        }
    }
}
