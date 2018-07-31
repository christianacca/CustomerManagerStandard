using System.Web.Http;

namespace CustomerManager.Controllers
{
    public class BadRequestController : ApiController
    {
        public IHttpActionResult Get()
        {
            ModelState.AddModelError("", "Example of client sending bad input");
            return BadRequest(ModelState);
        }
    }
}