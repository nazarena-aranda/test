using System;
using System.Security.Cryptography;
using System.Text;
using System.IO;
using System.Text.Json;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using FaceAiSharp;
using FaceAiSharp.Detection;
using FaceAiSharp.Recognition;
using FaceAiSharp.Models;
public class BiometricService
{

    private const string FaceDetectorModelPath = "Models/scrfd_2.5g_kps.onnx";
    private const string FaceRecognizerModelPath = "Models/arcfaceresnet100-11-int8.onnx";
    // private const string OpenClosedEyeModelPath = "Models/open_closed_eye.onnx"; // Si lo necesitas más adelante

    // Instancias de los detectores y reconocedores
    // Se recomienda inicializarlos una vez y reutilizarlos para evitar sobrecarga de carga de modelos
    private static FaceDetector _faceDetector;
    private static FaceRecognizer _faceRecognizer;

    // Puedes añadir un constructor estático para inicializar los modelos una sola vez
    static BiometricService()
    {
        // Esto cargará los modelos la primera vez que se use BiometricService
        // Considera envolver esto en un try-catch si las rutas de los modelos pueden fallar
        try
        {
            _faceDetector = new FaceDetector(FaceDetectorModelPath);
            _faceRecognizer = new FaceRecognizer(FaceRecognizerModelPath);
        }
        catch (Exception ex)
        {
            // Aquí puedes loggear el error, por ejemplo:
            // Console.WriteLine($"Error al inicializar modelos ONNX: {ex.Message}");
            // throw; // O relanzar la excepción para que sea manejada por el sistema
        }
    }

























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
