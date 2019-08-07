using System;  
using System.Collections.Generic;  
using System.IO;  
using System.Linq;  
using System.Net.Http.Headers;  
using System.Threading.Tasks;  
using Microsoft.AspNetCore.Hosting;  
using Microsoft.AspNetCore.Mvc;  
  
  
namespace safetyportal.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class UploadController : Controller
    {
        private IHostingEnvironment _hostingEnvironment;

        public UploadController(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpPost, DisableRequestSizeLimit]
        public async Task<IActionResult> UploadFile()
        {
            try
            {
                var iname = Request.Form["iname"];
                var file = Request.Form.Files[0];
                string folderName = "Request_Image_Uploads";
                string webRootPath = _hostingEnvironment.ContentRootPath;
                webRootPath = webRootPath + "/ClientApp/dist/assets";
                string newPath = Path.Combine(webRootPath, folderName);
                if (!Directory.Exists(newPath))
                {
                    Directory.CreateDirectory(newPath);
                }
                if (file.Length > 0)
                {
                    string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    string ext = Path.GetExtension(fileName);
                    string newName = iname.ToString() + ext;
                    string fullPath = Path.Combine(newPath, newName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                     await   file.CopyToAsync(stream);
                    }
                }
                return Json("Upload Successful.");
            }
            catch (Exception ex)
            {
                return Json("Upload Failed: " + ex.Message);
            }
        }

    }
}