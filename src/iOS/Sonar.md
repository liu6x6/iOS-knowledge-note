
# sonar analysis for iOS repos

### install rquirements
``` bash
  brew reinstall tailor
  brew install sonar-scanner
  brew install swiftlint 
```

### download the wrapper for OC/C++
* for C family we need this wrapper
``` url
https://sonar.uftmobile.admlabs.aws.swinfra.net/static/cpp/build-wrapper-macosx-x86.zip
```
download and unzip it, we need use the wrapper to execute the xcodebuild

``` bash
  ../sonar/build-wrapper-macosx-x86/build-wrapper-macosx-x86 --out-dir build xcodebuild test -workspace iOS_PROJECT.xcworkspace -scheme iOS-scheme -configuration Debug -enableCodeCoverage YES -destination "platform=iOS Simulator,id=CBBA84FF-5FAA-4293-91EB-43C806093E32" -destination-timeout 60

  ../sonar/build-wrapper-macosx-x86/build-wrapper-macosx-x86 --out-dir  ./build xcodebuild clean build -project 'iOS_PROJECT.xcodeproj' -scheme 'iOS-scheme '  -configuration 'Release' -sdk  iphonesimulator16.4 -arch x86_64
 

```

### update sonar-project.properties file

``` config
sonar.host.url=https://sonar.server.com 
#  use simulator to run the test
sonar.swift.simulator=platform=iOS Simulator,name=iPhone 14,OS=16.4
sonar.cfamily.build-wrapper-output=build


```


## upload the analysis
* need create the projectKey by Dev-Ops team 
 
``` bash
sonar-scanner -X
```


## test converage 

* runt the xcodebuid test will generate the test result
``` bash
xcodebuild -project swift-coverage-example.xcodeproj/ -scheme swift-coverage-example -derivedDataPath Build/ -enableCodeCoverage YES clean build test CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO
```
* change the converage to sonarQube's test format file

```bash
bash xccov-to-sonarqube-generic.sh Build/Logs/Test/Run-swift-coverage-example-2023.01.27_16-07-44-+0100.xcresult/ >Coverage.xml
sonar-scanner -Dsonar.coverageReportPaths=Coverage.xml
```


## pr (TBD)


## refrenece
* https://sonar.uftmobile.admlabs.aws.swinfra.net/dashboard?id=com.microfocus%3Aios-tools&codeScope=overall
* https://github.com/SonarSource/sonar-scanning-examples/tree/master/swift-coverage
* https://community.sonarsource.com/t/coverage-test-data-generate-reports-for-swift/9700

