# web.config modifies anonymousAuthentication section therefore this section needs unlocking
appcmd unlock config "Default Web Site/PartsUnlimited.Web" -section:system.webServer/security/authentication/anonymousAuthentication -commitpath:apphost

# Allow PartsUnlimited.Web to send perf counters to Application Insights
Add-LocalGroupMember 'Performance Monitor Users' -Member 'IIS AppPool\DefaultAppPool'