# iOS17
Apple has done big change for iOS17, looks like they use some new servers instead of the lockdown for some of the services.

***

# using xcodebuild to runner WDA-Runner
We could support iOS17 on Mac, As we just need use xcode to do that.
* `xcodebuild test-without-building  -xctestrun  /Users/xiao/Desktop/iOS17/testFile/xcTestFile.xctestrun  -destination  id=000081-XXXXXXXXXXX`

## mount image
* the developer image for iOS is no longer at xcode folder `/Applications/Xcode-beta.app/Contents/Developer/Platforms/iPhoneOS.platform/DeviceSupport`. 
* instead, they put it at `~/Library/Developer/DeveloperDiskImages`
`/Applications/Xcode-beta.app/Contents/Resources/CoreDeviceDDIs/iOS_DDI.dmg`
* the iOS17 called 'personalized image mount' 



## screenshot


## idevicedebug


## idevicelauch & ideviceruntest


## remoteXPC
we still do not know too much about this one 

we only know there is a new CLI tool named '/usr/libexec/remotectl' at 

we only know there is a new framework at '/System/Library/PrivateFrameworks/RemoteXPC.framework'

## XPC request 
* request start with `42 37 13 42`
* response start with `92 0B B0 29`
 



## XPoCe2
* look like XPoCe2 code read some remote Message from Xcode.
* read this artic http://newosxbook.com/tools/XPoCe2.html
* 


##  new devicectl command
* `xcrun devicectl list devices`
* `xcrun devicectl list preferredDDI`




