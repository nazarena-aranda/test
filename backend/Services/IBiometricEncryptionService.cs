public interface IBiometricEncryptionService
{
    string GenerateToken(string typeDocuments, string documents, bool isAdmin);
    
}