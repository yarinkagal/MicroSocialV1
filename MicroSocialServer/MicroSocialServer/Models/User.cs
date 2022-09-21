namespace MicroSocialServer.Models
{
    
    public class User
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public bool? CheckedIn { get; set; }
        public Dictionary<string, bool>? Preferences { get; set; }
        public Dictionary<string, object>? PushSubscription { get; set; }


    }
}
