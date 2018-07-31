AngularJS + Application Insights
===============

This demo is a fork of [Dan Wahlin's](https://github.com/DanWahlin) [CustomerManagerStandard](https://github.com/DanWahlin/CustomerManager) git repo.

This repo modifies the original as follows:
* Adds [MS Application Insights](https://azure.microsoft.com/en-gb/services/application-insights/) (App Insights) instrumentation
* Seperates out the SPA into a standalone static website
* Uses SQL Sever Express or higher and hosts the site in full version of IIS

Notes that seperating the SPA and hosting using full IIS and SQL Server was not neccessary to do just to add App Insights. However, it was useful to show that App Insights in a more advanced/realistic setup.

## Getting started

### If you're using Visual Studio and .NET:

The following is required to support the backend services:

* Visual Studio 2015 Community (free version) - https://www.visualstudio.com

* ASP.NET MVC and Web API are used for the back-end services along with Entity Framework for database access (included if you have VS 2015 community installed with the LocalDB option selected)

* SQL Server express or above

* Local IIS (ie NOT IIS express but full version)

To get started:
* Open CustomManager\web.config and adjust the db connection string to use your installation of SQL Server
* Open setup.ps1 adjust the name of the SQL server instance on line 2
* Run setup.ps1 in an elevated powershell prompt
* Add CustomerManager.Spa as a child application under the Default website in IIS
* Double-click the CustomerManager.sln file located at the root of the CustomerManager repository and compile the solution

### If you're using Node.js/Express/MongoDB

**TODO**: the source code needs to be modified in the server folder to just serve the api. Then instructions need to be provided to run say [http-server](https://www.npmjs.com/package/http-server) to serve the SPA

## E2E tests using Protractor:

_E2E tests using Protractor for .NET, and Selenium's WebDriver wrapper for Angular_

Tests are written with [NUnit](http://nunit.org/) but feel free to change it.
(Tests use `http://localhost/CustomerManager.Spa/` so make sure IIS Express is running the app)

There are several ways to execute these tests:

* Using NUnit TestAdapter for Visual Studio 2012/2013 from the [NUnitTestAdapter](https://www.nuget.org/packages/NUnitTestAdapter) NuGet package.
* Using Visual Studio extensions like [ReSharper](http://www.jetbrains.com/resharper/) or [TestDriven.net](http://www.testdriven.net/).
* Using the command line or GUI provided by the [NUnit.Runners](https://www.nuget.org/packages/NUnit.Runners) NuGet package.

Thanks to [Bruno Baia](https://github.com/bbaia) for the contribution
