## Thread Monitoring

### Description

In order to fix an 100% cpu usage in DevAccess, i've learnt how to monitor and sample threads of a java VM easily, it will help us quickly to pinpoint what class is responsible for the issue.

All you need, is having Java installed on your machine (JDK is preferable), it needs to be < Java 13, as Java 13 is not yet supported by the tool we are going to use, i'm myself using Java 11 from Oracle.

***

### Removing previous Java installs

In order to clean your macOS environment from any existing previous java environment :

`sudo rm -rf /Library/Internet\ Plug-Ins/JavaAppletPlugin.plugin`

`sudo rm -rf /Library/PreferencePanes/JavaControlPanel.prefPane`

`sudo rm -rf /Library/Application\ Support/Oracle/Java/`

`sudo rm -rf /Library/Java/JavaVirtualMachines`

***

### Retrieving Java 11 JDK

Retrieve the JDK 11 from oracle at that url :

_https://www.oracle.com/technetwork/java/javase/downloads/jdk11-downloads-5066655.html_

***

### Retrieving VisualVM

Retrieve VisualVM at that url :

_https://visualvm.github.io_

***

### Using VisualVM

1. Choose on the left panel, the job you want to analyze/sample.
2. Click on the sampler tab on the right panel.
3. Choose CPU/Memory, according to what consumption you want to monitor, for this example we will go on CPU sampling.
4. Click on thread CPU time, to retrieve the exact cpu consumption per thread.
5. Once the problematic thread identified, go back to the CPU samples tab, and check what class is used by that thread.
