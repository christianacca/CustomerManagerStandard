using CustomerManager.App_Start;
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.Extensibility;

namespace CustomerManager.AppInsights
{
    public class VersionInfoTelemetryInitializer: ITelemetryInitializer
    {
        public void Initialize(ITelemetry telemetry)
        {
            telemetry.Context.Component.Version =
                typeof(WebApiConfig).Assembly.GetName().Version.ToString();
        }
    }
}