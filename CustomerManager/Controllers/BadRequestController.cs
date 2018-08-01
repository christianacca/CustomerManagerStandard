using System.Web.Http;

namespace CustomerManager.Controllers
{
    public class BadRequestController : ApiController
    {
        [HttpGet]
        public object ReturnError()
        {
            ModelState.AddModelError("", "Example of client sending bad input");
            return BadRequest(ModelState);
        }
    }
}