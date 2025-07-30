using System;
using System.Linq;
using APIt.Resources.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using APIt.Agent;

namespace APIt.Services
{
    public class DoorService : IDoorService
    {
        private readonly IMongoCollection<Door> _doorCollection;

        private readonly IAccessAgent _accessAgent;
        public DoorService(IMongoCollection<Door> doorCollection, IAccessAgent accessAgent)
        {
            _doorCollection = doorCollection;
            _accessAgent = accessAgent;

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

            door.RegisterFailedAccess(); 
            var update = Builders<Door>.Update
                .Set(d => d.SuccessfulAccesses, door.SuccessfulAccesses)
                .Set(d => d.FailedAccesses, door.FailedAccesses)
                .Set(d => d.LastResetDate, door.LastResetDate);

            await _doorCollection.UpdateOneAsync(d => d.DoorId == doorId, update);
        }

        public async Task<string> OpenDoor(string userIdList, string doorQR)
        {
            try
            {
                int[] personIds = string.IsNullOrWhiteSpace(userIdList)
                    ? Array.Empty<int>()
                    : userIdList
                        .Split(',', StringSplitOptions.RemoveEmptyEntries)
                        .Select(id => int.Parse(id.Trim()))
                        .ToArray();

                var response = await _accessAgent.OpenDoorAsync(doorQR, personIds);

                return "The door was opened successfully";
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error opening door:");
                Console.WriteLine(ex.Message);
                return null;
            }

        }

    }
}
