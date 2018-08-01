using System;
using System.Web.Http;

namespace CustomerManager.Controllers
{
    public class ControllerConstructorErrorController : ApiController
    {
        public ControllerConstructorErrorController()
        {
            throw new InvalidOperationException("Error in controller constructor");
        }

        [HttpGet]
        public object ReturnError()
        {
            // this method will never be executed due to constructor exception
            return null;
        }
    }
}