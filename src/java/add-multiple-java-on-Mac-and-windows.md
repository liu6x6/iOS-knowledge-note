* As a dev, we need multiple java sdk on our mac and windows 

# Mac
1. down the SDK and put it to `/Library/Java/JavaVirtualMachines/`
2. use /usr/libexec/java_home -V to list the existing jdk on the Mac
```
Matching Java Virtual Machines (3):
    17.0.7 (x86_64) "Azul Systems, Inc." - "Zulu 17.42.19" /Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
    11.0.9.1 (x86_64) "Azul Systems, Inc." - "Zulu 11.43.55" /Library/Java/JavaVirtualMachines/zulu-11.jdk/Contents/Home
    1.8.0_312 (x86_64) "Azul Systems, Inc." - "Zulu 8.58.0.13" /Library/Java/JavaVirtualMachines/zulu-8.jdk/Contents/Home
/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
```
3. add the code below on your .zshrc or .bashrc
```
alias java8="export JAVA_HOME=`/usr/libexec/java_home -v 1.8.0_312`"
alias java11="export JAVA_HOME=`/usr/libexec/java_home -v 11.0.9.1`"
alias java17="export JAVA_HOME=`/usr/libexec/java_home -v 17.0.6`"
```
4. switch to java11 by execution java11




# Windows
1. same as Mac, install the java jdk first, better it to same folder
2. create a new folder(eg: c://User//youname//java), and export this folder to system path
3. create a bat file, like java8.bat, and put the blew content to the file
```
@echo off
echo Setting JAVA_HOME
set JAVA_HOME=C:\Program Files\Java\jdk1.8.0_131
echo setting PATH
set PATH=%JAVA_HOME%\bin;%PATH%
echo Display java version
java -version
```
4. create relate bat file with relate jave 
5. execute java20 if you want switch java20
