using System.Threading.Tasks;

namespace APIt.Agent
{
    public interface IExternalAccessAgent
    {
        Task<string> OpenDoorAsync(string qrCode, int[] personIds);
    }
}