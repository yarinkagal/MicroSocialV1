using Microsoft.AspNetCore.Mvc;
using MicroSocialServer.Models;
using Microsoft.AspNetCore.Cors;
using System.Net.Mail;
using System.Text;
using System.Net;
using Azure.Storage.Blobs;
using Newtonsoft.Json;
using Azure.Storage.Blobs.Models;

namespace MicroSocialServer.Controllers
{
    [EnableCors("corspolicy")]
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private SmtpClient smtpClient;
        private BlobServiceClient blobService;
        public BlobContainerClient usersContainer;
        public List<string> PreferencesNames;
        
        public UsersController()
        {
            //TODO : change the way we connect - key vault?
            string connectionString = "DefaultEndpointsProtocol=https;AccountName=microsocialsa;AccountKey=CHF8pltHJpzN46v+G2QXCyoxvG2PuonRf2RmOX72ZT4mFqGLqp6Jxsq3kjfHZ+uZ1+/2k3+kseIW+ASt/q19qQ==;EndpointSuffix=core.windows.net";
            string containerName = "users";
            blobService = new BlobServiceClient(connectionString);
            usersContainer = blobService.GetBlobContainerClient(containerName);
            PreferencesNames = new List<string>() { "Game_Room_3B", "Basketball", "Play_Date", "Music_Session","Workout","Sea_Walking","Bike_Ride","Car_Pool","Dog_Date" };
            //Thread t = new Thread(new ThreadStart(checkOutAllUsers));
            //t.Start();

            smtpClient =
             new SmtpClient
             {
                 Host = "Smtp.Gmail.com",
                 Port = 587,
                 EnableSsl = true,
                 Timeout = 10000,
                 DeliveryMethod = SmtpDeliveryMethod.Network,
                 UseDefaultCredentials = false,
                 Credentials = new NetworkCredential("hackmsocial@Gmail.com", "iccoabdqkoqfcjog")
             };

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

        public async void checkOutAllUsers()
        {
            while (true)
            {
                DateTime now = DateTime.Now;
                while (now.Hour != 19)
                {
                    int hours = 19 - now.Hour;
                    int minutes = 60 - now.Minute;


                    Thread.Sleep(1000 * 60 * minutes * hours);
                }

                try
                {
                    await foreach (BlobItem blobItem in usersContainer.GetBlobsAsync())
                    {
                        User dbUser = await getBlobAsUser(blobItem.Name);
                        dbUser.CheckedIn = false;
                        SetUser(dbUser, true);
                    }
                }
                catch
                {

                }
            }
        }
        // Get: Users/GetUser/{email}
        [HttpGet("GetUser/{email}")]
        public async Task<IActionResult> GetUsersPreferences(string email)
        {
            try
            {
                string blobName = getAlias(email);
                User dbUser = await getBlobAsUser(blobName);
                return Ok(dbUser);
            }
            catch
            {
                return BadRequest();
            }
        }

        // Get: Users/preference
        [HttpGet("getUsers/{preference}")]
        public async Task<IActionResult> GetUsersByPreference(string preference)
        {
            List<User> checkedInUsers = new List<User>();
            bool getAll=(preference.IndexOf("/all") != -1);
            List<String> onPreferences = new List<string>();


            await foreach (BlobItem blobItem in usersContainer.GetBlobsAsync())
            {
                User dbUser = await getBlobAsUser(blobItem.Name);
                foreach( KeyValuePair<string, bool> entry in dbUser.Preferences)
                {
                    if (entry.Value)
                    {
                        onPreferences.Add(entry.Key);
                    }
                }
                if (((bool)dbUser.CheckedIn || getAll) && onPreferences.Contains(preference))
                {
                    checkedInUsers.Add(dbUser); 
                }
            }

            return Ok(checkedInUsers);
        }


        // POST: Users/sendVerificationMail
        [HttpPost("sendVerificationMail")]
        public async Task<IActionResult> sendVerificationMail(Verification details)
        {
            int g = 0;
            try
            {
                smtpClient.Send(new MailMessage
                {
                    From = new MailAddress("hackmsocial@Gmail.com", "Micro Social App"),
                    To = { details.Email },
                    Subject = "Verification Mail From Micro Social",
                    Body =
                            "Hi :)\n\n" +

                            $"We are happy that you choose our service.\n\n" +

                            $"Please enter this value as confirmation code: {details.VerificationCode}. \n\n " +

                            "Have a nice day, \n\n" +

                            "Micro Social team.",

                    BodyEncoding = Encoding.UTF8
                });

                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        // POST: Users/signup
        [HttpPost("signup")]
        public async Task<IActionResult> SetUser(User user, bool overrite = false)
        {
            try {
                

                string blobName = getAlias(user.Email);
                BlobClient blobClient = usersContainer.GetBlobClient(blobName);
                if (blobClient.Exists() && !overrite)
                {
                    return Ok(false);
                }

                if (user.CheckedIn == null)
                {
                    user.CheckedIn = false;
                }

                if (user.Preferences == null)
                {
                    user.Preferences = new Dictionary<string, bool>();
                    foreach (string name in PreferencesNames)
                    {
                        user.Preferences[name] = false;
                    }
                }
                if (user.PushSubscription == null)
                {
                    user.PushSubscription = new Dictionary<string, object>();
                }

                string jsonString = JsonConvert.SerializeObject(user);
                await blobClient.UploadAsync(BinaryData.FromString(jsonString),overwrite: true);

                return Ok(true);
            }

            catch
            {
                return BadRequest();
            }  
        }

        // Post: Users/signIn
        [HttpPost("signIn")]
        public async Task<IActionResult> signIn(User user)
        {
            try
            {
                string blobName = getAlias(user.Email);
                User dbUser = await getBlobAsUser(blobName);
                if (dbUser!= null && dbUser.Password != null && dbUser.Password == user.Password)
                {
                    return Ok(true);
                }


                return Ok(false);
            }
            catch
            {
                return BadRequest();

            }
        }


        // Post: Users/checkInOut
        [HttpPost("checkInOut")]
        public async Task<IActionResult> checkInOut(User user)
        {
            try
            {
                string blobName = getAlias(user.Email);

                User dbUser = await getBlobAsUser(blobName);
                dbUser.CheckedIn = user.CheckedIn;
                SetUser(dbUser,true);

                return Ok();
            }
            catch
            {
                return BadRequest();

            }
        }

        // Put: Users/setPushSubscription
        [HttpPut("setPushSubscription")]
        public async Task<IActionResult> SetPushSubscription(User user)
        {
            try
            {
                string blobName = getAlias(user.Email);

                User dbUser = await getBlobAsUser(blobName);
                dbUser.PushSubscription = user.PushSubscription;
                SetUser(dbUser, true);

                return Ok();
            }
            catch
            {
                return BadRequest();

            }
        }


        // Put: Users/setPreferences
        [HttpPut("setPreferences")]
        public async Task<IActionResult> SetPreferences(User user)
        {
            try
            {
                string blobName = getAlias(user.Email);

                User dbUser = await getBlobAsUser(blobName);
                dbUser.Preferences = user.Preferences;
                SetUser(dbUser, true);

                return Ok();
            }
            catch
            {
                return BadRequest();

            }
        }

        // Delete: Users/deleteuser
        [HttpDelete("deleteuser")]
        public async Task<IActionResult> DeleteUser(User user)
        {
            try
            {

                string blobName = getAlias(user.Email);
                BlobClient blobClient = usersContainer.GetBlobClient(blobName);
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