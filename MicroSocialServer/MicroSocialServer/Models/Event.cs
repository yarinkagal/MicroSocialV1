namespace MicroSocialServer.Models
{
    
    public class Event
    {
        public string? Id { get; set; }
        public string? Owner { get; set; }
        public string? Category { get; set; }
        public string? Date { get; set; }
        public string? Time { get; set; }
        public int? MaxParticipants { get; set; }
        public List<User>? ParticipantsList { get; set; }


    }
}
