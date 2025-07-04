using System.Threading.Tasks;

public interface IExternalAccessAgent
{
    Task<string> OpenDoorAsync(string qrCode, int[] personIds);
}
