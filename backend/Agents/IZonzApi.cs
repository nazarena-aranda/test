using System.Threading.Tasks;

namespace APIt.Agent
{
    public interface IAccessAgent
    {
        Task<string> GenerateAccessAsync(string tipoDoc, string valorDoc, string pass);
        Task<string> OpenDoorAsync(string puerta, int[] personIds);
    }

}