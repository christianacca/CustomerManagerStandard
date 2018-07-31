using System;
using System.Web.Http;

namespace CustomerManager.Controllers
{
    public class InternalServerErrorController : ApiController
    {
        [HttpGet]
        public object ReturnError()
        {
            Exception ex;
            try
            {
                throw new InvalidOperationException("Example of a thrown exception that is wrapped in an InternalServerError action result");
            }
            catch (Exception e)
            {
                ex = e;
            }

            return InternalServerError(ex);
        }

        [HttpGet]
        public object ThrowError()
        {
            throw new InvalidOperationException("Example of a thrown unhandled exception");
        }
    }
}
