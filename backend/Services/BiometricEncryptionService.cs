using System;
using System.Security.Cryptography;
using System.Text;
using System.IO;
using System.Text.Json;

public class BiometricEncryptionHelper
{

    private static readonly byte[] _aesKey = Encoding.UTF8.GetBytes("estaEsMiClaveSecretaDe32BytesParaAES256!");
    //esto puedo tengo que ponerlo en app settings
    private const int IvSize = 16;

    public static string EncryptBiometricData(float[] BiometricDataFloat)
    {

        if (BiometricDataFloat == null)
        {
            throw new ArgumentNullException(nameof(BiometricDataFloat), "biometric data is null.");
        }


        string jsonString = JsonSerializer.Serialize(BiometricDataFloat);


        byte[] plainBytes = Encoding.UTF8.GetBytes(jsonString);


        return EncryptBytes(plainBytes);
    }

    private static string EncryptBytes(byte[] plainBytes)
    {
        using (Aes aesAlg = Aes.Create())
        {
            //esto lo pongo despues en el settings
            aesAlg.Key = _aesKey;
            aesAlg.Mode = CipherMode.CBC;
            aesAlg.Padding = PaddingMode.PKCS7;

            aesAlg.GenerateIV();
            byte[] iv = aesAlg.IV;

            ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

            using (MemoryStream msEncrypt = new MemoryStream())
            {
                msEncrypt.Write(iv, 0, iv.Length);

                using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                {
                    csEncrypt.Write(plainBytes, 0, plainBytes.Length);
                    csEncrypt.FlushFinalBlock();
                }
                return Convert.ToBase64String(msEncrypt.ToArray());
            }
        }
    }


}
