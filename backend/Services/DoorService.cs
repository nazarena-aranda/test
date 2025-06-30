using APIt.Resources.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace APIt.Services
{
    public class DoorService : IDoorService
    {
        private readonly IMongoCollection<Door> _doorCollection;

        public DoorService(IMongoCollection<Door> doorCollection)
        {
            _doorCollection = doorCollection;
        }

        public async Task<List<Door>> GetAllDoorsAsync()
        {
            return await _doorCollection.Find(_ => true).ToListAsync();
        }

        public async Task<Door?> GetDoorByIdAsync(string doorId)
        {
            return await _doorCollection.Find(d => d.DoorId == doorId).FirstOrDefaultAsync();
        }

       public async Task RegisterSuccessfulAccessAsync(string doorId)
        {
            var door = await GetDoorByIdAsync(doorId);
            if (door is null) return;

            door.RegisterSuccessfulAccess(); // aplica lógica de reseteo si pasaron 30 días

            var update = Builders<Door>.Update
                .Set(d => d.SuccessfulAccesses, door.SuccessfulAccesses)
                .Set(d => d.FailedAccesses, door.FailedAccesses)
                .Set(d => d.LastResetDate, door.LastResetDate);

            await _doorCollection.UpdateOneAsync(d => d.DoorId == doorId, update);
        }

        public async Task RegisterFailedAccessAsync(string doorId)
        {
            var door = await GetDoorByIdAsync(doorId);
            if (door is null) return;

            door.RegisterFailedAccess(); // aplica lógica de reseteo si pasaron 30 días

            var update = Builders<Door>.Update
                .Set(d => d.SuccessfulAccesses, door.SuccessfulAccesses)
                .Set(d => d.FailedAccesses, door.FailedAccesses)
                .Set(d => d.LastResetDate, door.LastResetDate);

            await _doorCollection.UpdateOneAsync(d => d.DoorId == doorId, update);
        }
    }
}
