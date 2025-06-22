## Kill process
#### linux/Mac 
* killall iproxy
* will kill all of the iproxy 

### windows
* taskkill /IM iproxy.exe /F

## use xargs for 
### restart all device
./idevice_id -l | xargs -i ./idevicediagnostics -u {} restart 

### uninstall the wda-runner for all of the device
./idevice_id -l | xargs  -i ./ideviceinstaller -u {} -U com.apple.test.WebDriverAgentRunner-Runner

## use curl to send the post request to wda-runner
* on mac and windws we can use postman
* on the linux we need curl. you copy the curl form the postman
* 1.using iproxy 8100 8100 uuid
```
 curl --location --request POST 'http:/localhost:8100/session/MC-Session/mc/launchApplication' --header 'Content-Type: text/plain' --data '{
"bundleId":"com.apple.mobilesafari",
"arguments": ["-u","https://www.bing.com"],
"restartApp":true }'
```

## Remove UFTM manually
### Mac
* sudo rm -rf /opt/UFTM
* sudo pkill -9 java
* sudo pkill -9 nginx
* sudo rm -rf /Library/LaunchDaemons/mobilecenter.plist
* sudo rm -rf /Library/Preferences/.com.zerog.registry.xml
* sudo rm -rf /Users/mc
* sudo rm -rf /opt/UFTM

### Linux
* sudo pkill -9 java
* sudo pkill -9 nginx
* sudo rm -rf /opt/UFTM
* echo "" > /var/.com.zerog.registry.xml

## start & stop usbmuxd on Mac os
### stop the usbmuxd daemon on Mac
```
 $ sudo launchctl unload /System/Library/LaunchDaemons/com.apple.usbmuxd.plist
Catalina:
$ sudo launchctl unload /Library/Apple/System/Library/LaunchDaemons/com.apple.usbmuxd.plist
```
### start the usbmuxd 
```
$ sudo launchctl load -w /System/Library/LaunchDaemons/com.apple.usbmuxd.plist
Catalina:
$ sudo launchctl load -w /Library/Apple/System/Library/LaunchDaemons/com.apple.usbmuxd.plist
```

