using Hinet.Encrypt.Models;
using System.Security.Cryptography;
using System.Text;

namespace Hinet.Encrypt
{
    public class HinetEncrypt
    {
        private RSA? _rsaPublic;
        private RSA? _rsaPrivate;
        public HinetEncrypt()
        {

        }
        public void PublicKey(string publicPem)
        {
            if (string.IsNullOrEmpty(publicPem))
                throw new ArgumentNullException(nameof(publicPem));
            _rsaPublic = RSA.Create();
            _rsaPublic.ImportFromPem(publicPem);
        }
        public void PrivateKey(string privatePem)
        {
            if (string.IsNullOrEmpty(privatePem))
                throw new ArgumentNullException(nameof(privatePem));

            _rsaPrivate = RSA.Create();
            _rsaPrivate.ImportFromPem(privatePem);
        }
        // Decrypt
        public DecryptedResultByte DecryptByte(EncryptedResult encrypted)
        {
            if (_rsaPrivate is null)
            {
                throw new InvalidOperationException("Chưa cấu hình khóa Private để kiểm tra chữ ký");
            }
            var combinedKey = _rsaPrivate.Decrypt(encrypted.EncryptedAesKey, RSAEncryptionPadding.OaepSHA256);
            var aesKey = combinedKey.Take(32).ToArray();
            var aesIV = combinedKey.Skip(32).Take(16).ToArray();

            var plainBytes = DecryptWithAes(encrypted.EncryptedPayload, aesKey, aesIV);

            return new DecryptedResultByte
            {
                PlainByte = plainBytes,
                AesKey = aesKey,
                AesIV = aesIV
            };
        }
        // Decrypt
        public DecryptedResult Decrypt(EncryptedResult encrypted)
        {
            if (_rsaPrivate is null)
            {
                throw new InvalidOperationException("Chưa cấu hình khóa Private để kiểm tra chữ ký");
            }
            var combinedKey = _rsaPrivate.Decrypt(encrypted.EncryptedAesKey, RSAEncryptionPadding.OaepSHA256);
            var aesKey = combinedKey.Take(32).ToArray();
            var aesIV = combinedKey.Skip(32).Take(16).ToArray();

            var plainBytes = DecryptWithAes(encrypted.EncryptedPayload, aesKey, aesIV);
            var plainJson = Encoding.UTF8.GetString(plainBytes);

            return new DecryptedResult
            {
                PlainTextJson = plainJson,
                AesKey = aesKey,
                AesIV = aesIV
            };
        }
        public static byte[] EncryptWithAes(byte[] data, byte[] key, byte[] iv)
        {
            using var aes = Aes.Create();
            aes.Key = key;
            aes.IV = iv;


            aes.Mode = CipherMode.CBC;
            aes.Padding = PaddingMode.PKCS7;


            using var encryptor = aes.CreateEncryptor();
            return encryptor.TransformFinalBlock(data, 0, data.Length);
        }
        public static byte[] DecryptWithAes(byte[] data, byte[] key, byte[] iv)
        {
            using var aes = Aes.Create();
            aes.Key = key;
            aes.IV = iv;

            aes.Mode = CipherMode.CBC;
            aes.Padding = PaddingMode.PKCS7;

            using var decryptor = aes.CreateDecryptor();
            return decryptor.TransformFinalBlock(data, 0, data.Length);
        }


    }
}
