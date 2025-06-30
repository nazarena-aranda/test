#nullable enable
using System;

namespace APIt.Resources.Models
{
    public class Door
    {
        public string DoorId { get; set; }

        public int SuccessfulAccesses { get; private set; } = 0;

        public int FailedAccesses { get; private set; } = 0;

        public DateTime LastResetDate { get; private set; } = DateTime.UtcNow;

        public Door(string doorId)
        {
            DoorId = doorId;
        }

        public void RegisterSuccessfulAccess()
        {
            ResetIfDue();
            SuccessfulAccesses++;
        }

        public void RegisterFailedAccess()
        {
            ResetIfDue();
            FailedAccesses++;
        }

        private void ResetIfDue()
        {
            if ((DateTime.UtcNow - LastResetDate).TotalDays >= 30)
            {
                SuccessfulAccesses = 0;
                FailedAccesses = 0;
                LastResetDate = DateTime.UtcNow;
            }
        }
    }
}
