# web.config modifies anonymousAuthentication section therefore this section needs unlocking
appcmd unlock config "Default Web Site/CustomerManager" -section:system.webServer/security/authentication/anonymousAuthentication -commitpath:apphost

# Allow CustomerManager to send perf counters to Application Insights
Add-LocalGroupMember 'Performance Monitor Users' -Member 'IIS AppPool\DefaultAppPool'

# note: the sql server instance below must match the connection string used in web.config
sqlcmd -S 'localhost\SQL2016XP' -E -i .\Setup_Db.sql