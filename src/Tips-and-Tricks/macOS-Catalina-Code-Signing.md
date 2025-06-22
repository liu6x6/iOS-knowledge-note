On macOS Catalina, we need our application to go through a process to be allowed to run freely on any computer, here is this process :
 
1. We need to codesign our application, this is made on our side, using the codesign XCode tool, this must be run using XCode 11 or later. This means it does not require the build machine to be on Catalina, since XCode 11 is also released on macOS Mojave.

2. We need to then ask apple to validate our signed application, this step is called notarization, it takes around 15 minutes, we must send our codesigned application on Apple server, and we can follow the status of the notarization process through some terminal command, we won’t receive a notarized version of the application, basically, the codesigned application will then be valid on Apple Server, and will run directly when needed.

3. In order to allow our application to run even on computers without internet (pretty common amongst our customers), we must perform a last step called stapling. This basically will embed the notarization status within our binary.
 
**Now, one last thing :**
 
For mac applications that embed JAVA SDK like our DevAccess client for example, we must modify slightly the way we bundle the JRE/JDK to our application, by specifying some specific options to support the workflow shown above.
 
Here is a technical article that provides a nice tutorial to perform all these operations :

[http://www.zarkonnen.com/signing_notarizing_catalina](http://www.zarkonnen.com/signing_notarizing_catalina)