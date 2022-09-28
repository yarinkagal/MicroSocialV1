using Microsoft.AspNetCore.Mvc;
using MicroSocialServer.Models;
using Microsoft.AspNetCore.Cors;
using Azure.Storage.Blobs;
using Newtonsoft.Json;
using Azure.Storage.Blobs.Models;


namespace MicroSocialServer.Controllers
{
    [EnableCors("corspolicy")]
    [ApiController]
    [Route("[controller]")]
    public class EventsController : ControllerBase
    {
        
        private BlobServiceClient blobService;
        private BlobContainerClient EventsContainer;
        public BlobContainerClient usersContainer;
        private System.Timers.Timer aTimer;

        public EventsController()
        {
            //TODO : change the way we connect - key vault?
            string connectionString = "DefaultEndpointsProtocol=https;AccountName=microsocialsa;AccountKey=CHF8pltHJpzN46v+G2QXCyoxvG2PuonRf2RmOX72ZT4mFqGLqp6Jxsq3kjfHZ+uZ1+/2k3+kseIW+ASt/q19qQ==;EndpointSuffix=core.windows.net";
            string containerName = "events";
            blobService = new BlobServiceClient(connectionString);
            EventsContainer = blobService.GetBlobContainerClient(containerName);
            usersContainer = blobService.GetBlobContainerClient("users");

        }

        public async Task<Event> getBlobAsEvent(string blobName)
        {
            try
            {
                BlobClient blobClient = EventsContainer.GetBlobClient(blobName);
                BlobDownloadResult downloadResult = await blobClient.DownloadContentAsync();
                string downloadedData = downloadResult.Content.ToString();
                Event dbEvent = JsonConvert.DeserializeObject<Event>(downloadedData);
                return dbEvent;
            }
            catch
            {
                return null;
            }
        }
        public async Task<User> getBlobAsUser(string blobName)
        {
            try
            {
                BlobClient blobClient = usersContainer.GetBlobClient(blobName);
                BlobDownloadResult downloadResult = await blobClient.DownloadContentAsync();
                string downloadedData = downloadResult.Content.ToString();
                User dbUser = JsonConvert.DeserializeObject<User>(downloadedData);
                return dbUser;
            }
            catch
            {
                return null;
            }
        }

        public string getAlias(string mail)
        {

            int signInd = mail.IndexOf("@");
            return mail.Substring(0, signInd);

        }

        public double getTimerTime(string date, string time)
        {
            //date: 01102022
            DateTime now = DateTime.Now;

            int day =   Int32.Parse( date.Substring(0, 2));
            int month = Int32.Parse( date.Substring(2, 2));
            int year =  Int32.Parse( date.Substring(4, 4));
            int hour =  Int32.Parse( time.Substring(0, 2));
            int minute =Int32.Parse( time.Substring(2, 2));

            DateTime eventDate = new DateTime(year, month, day, hour, minute,0);
            TimeSpan ts = eventDate - now;
            return ts.TotalMilliseconds + 900000; // difference + 15 minutes

        }

        private void SetTimer(Event Event)
        {
            // Create a timer with a two second interval.
            aTimer = new System.Timers.Timer(getTimerTime(Event.Date,Event.Time));
            // Hook up the Elapsed event for the timer. 
            aTimer.Elapsed += (sender, e) => DeleteEvent(Event);
            aTimer.AutoReset = false;
            aTimer.Enabled = true;
        }


        // Get: Events/allEvents
        [HttpGet("allEvents")]
        public async Task<IActionResult> GetEventsByPreference()
        {
            List<Event> allEvents = new List<Event>();
            await foreach (BlobItem blobItem in EventsContainer.GetBlobsAsync())
            {
                Event dbEvent = await getBlobAsEvent(blobItem.Name);
                allEvents.Add(dbEvent); 
            }

            return Ok(allEvents);
        }

        // Get: Events/GetPreferences/{email}
        [HttpGet("GetEvent/{id}")]
        public async Task<IActionResult> GetEventsPreferences(string id)
        {
            try
            {
                Event dbEvent = await getBlobAsEvent(id);
                return Ok(dbEvent);
            }
            catch
            {
                return BadRequest(); 
            }
        }

        [HttpGet("GetUsersEvents/{email}")]
        public async Task<IActionResult> GetUsersEvents(string email)
        {
            try
            {
                List<Event> allEvents = new List<Event>();
                await foreach (BlobItem blobItem in EventsContainer.GetBlobsAsync())
                {
                    string alias = getAlias(email);
                    //User user = await getBlobAsUser(alias);

                    Event dbEvent = await getBlobAsEvent(blobItem.Name);

                    foreach(User user in dbEvent.ParticipantsList)
                    {
                        if(user.Email == email)
                        {
                            allEvents.Add(dbEvent);
                            break;
                        }
                    }

                    
                }

                return Ok(allEvents);
            }
            catch
            {
                return BadRequest();
            }
        }

        // POST: Events/addevent
        [HttpPost("addevent")]
        public async Task<IActionResult> AddEvent(Event Event)
        {
            try {

                string eventId = Guid.NewGuid().ToString();
                Event.Id = eventId;
                BlobClient blobClient = EventsContainer.GetBlobClient(eventId);

                if (blobClient.Exists() || Event.Owner == null || Event.Category == null || Event.Date == null || Event.Time == null)
                {
                    return Ok(null);
                }

                if (Event.MaxParticipants == null)
                {
                    Event.MaxParticipants = 100;
                }

                if (Event.ParticipantsList == null)
                {
                    User owner = await getBlobAsUser(getAlias(Event.Owner));
                    Event.ParticipantsList = new List<User>() { owner };
                }

                // TODO: Check if there is an event close to time of the new event


                string jsonString = JsonConvert.SerializeObject(Event);
                await blobClient.UploadAsync(BinaryData.FromString(jsonString),overwrite: true);
                SetTimer(Event);
                return Ok(eventId);
            }

            catch
            {
                return BadRequest();
            }  
        }

        // Put: Events/addParticipants
        [HttpPost("addParticipants")]
        public async Task<IActionResult> AddParticipants(Event Event)
        {
            try
            { 
                Event dbEvent = await getBlobAsEvent(Event.Id);
                BlobClient blobClient = EventsContainer.GetBlobClient(Event.Id);
                Dictionary<string, object> result = new Dictionary<string, object>();

                if(dbEvent.ParticipantsList.Count == dbEvent.MaxParticipants)
                {
                    result["added"] = false;
                    result["message"] = "event is full"; 
                }

                else
                {
                    foreach (User user in Event.ParticipantsList) {
                        User dbUser = await getBlobAsUser(getAlias(user.Email));
                        dbEvent.ParticipantsList.Add(dbUser);
                    }
                    string jsonString = JsonConvert.SerializeObject(dbEvent);
                    await blobClient.UploadAsync(BinaryData.FromString(jsonString), overwrite: true);

                    result["added"] = true;
                    User owner = await getBlobAsUser(getAlias(dbEvent.Owner));
                    result["owner"] = owner;
                }
                
                return Ok(result);
            }
            catch
            {
                return BadRequest();

            }
        }

        // Put: Events/removeParticipants
        [HttpPost("removeParticipants")]
        public async Task<IActionResult> RemoveParticipants(Event Event)
        {
            try
            {
                Event dbEvent = await getBlobAsEvent(Event.Id);
                BlobClient blobClient = EventsContainer.GetBlobClient(Event.Id);
                Dictionary<string, object> result = new Dictionary<string, object>();

                for (int i = Event.ParticipantsList.Count-1; i >= 0; i--)
                {
                    dbEvent.ParticipantsList.RemoveAt(i);
                }

                string jsonString = JsonConvert.SerializeObject(dbEvent);
                await blobClient.UploadAsync(BinaryData.FromString(jsonString), overwrite: true);

                result["removed"] = true;
                User owner = await getBlobAsUser(getAlias(dbEvent.Owner));
                result["owner"] = owner;

                return Ok(result);
            }
            catch
            {
                return BadRequest();

            }
        }


        // Delete: Events/deleteEvent
        [HttpDelete("deleteEvent")]
        public async Task<IActionResult> DeleteEvent(Event Event)
        {
            try
            {

                BlobClient blobClient = EventsContainer.GetBlobClient(Event.Id);
                await blobClient.DeleteAsync();

                return Ok();
            }

            catch
            {
                return BadRequest();
            }
        }



    }
}