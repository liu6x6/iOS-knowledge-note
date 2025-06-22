
# codesign
[resign-app-with-entitlements](https://stackoverflow.com/questions/36888535/how-do-i-resign-app-with-entitlements)



```
codesign -d --entitlements - Example.app/Example


$ codesign -d --entitlements entitlements.xml Example.app/Example
codesign --entitlements entitlements.xml   -f -s "iPhone Distribution: Company (UFAYDHAUP)" Payload/Example.app


codesign --preserve-metadata=entitlements --force --verbose --sign "Apple Development" MyApp.app


 # extra the info_plist
otool -X -s __TEXT __info_plist com.flexera.ia.helper | xxd -r
```