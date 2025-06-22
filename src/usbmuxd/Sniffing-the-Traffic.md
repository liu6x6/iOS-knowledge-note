
# Purpose

Reading the USBMUXD traffic will allow us to create tools that will do what Xcode and iTunes is able to do. Using libimobiledevice as the base ground for communication, it is possible to build tools that would send/read the messages in the same way that Apple does from his desktop Apps. 

# Tools to Read the Traffic

 

## DTrace

[DTrace](http://dtrace.org/guide/chp-intro.html#chp-intro) is a comprehensive dynamic tracing framework created by Sun Microsystems for troubleshooting kernel and application problems on production systems in real time. 

DTrace can be used to get a global overview of a running system, such as the amount of memory, CPU time, filesystem and network resources used by the active processes. It can also provide much more fine-grained information, such as a log of the arguments with which a specific function is being called, or a list of the processes accessing a specific file.

DTrace is a deep subject, the more you know about it the better for you.


# Using DTrace

**Get deeper into DTrace : http://dtrace.org/guide/chp-intro.html#chp-intro**

## The Basics of DTrace

Here we are going to concentrate in the DTrace that we need to trace calls that will tell us about the traffic of usbmuxd. As we already explained, idevicesniff is sitting on the usbmuxd UNIX FD and parsing the messages through it, with the inconvenience that at such point the traffic could be SSL encrypted. With DTrace we want to capture those messages before they are encrypted.

DTrace calls "probes" to those points (functions) in the whole system that have been subscribed by the developer (Provider) as "traceable". Those probes are therefore enabled by the programmer, for people like us, to be able to trace their status at runtime.

If you want to see something impressive do :

``` $ sudo dtrace -l```

You will see the list of half a million probes of all possible providers in your system at this moment. That is not the number of "functions" in the system, they are duplicated by processes. Every process is a provider of the probes separately. They are not all the probes either, there are more that are not "signed" in the system because the probes are recognised when the module that provides is loaded.

Each of those probes can be inspected at runtime. We can for instance request to print the values of their arguments. **Having access to log the arguments we could select functions that "send" or "read" data to the usbmuxd and get the values before they are encrypted.**

You may have a quick introduction to fun stuff here:

https://wiki.freebsd.org/DTrace/One-Liners

http://www.brendangregg.com/dtrace.html

## What Probes to Use

If we have half a million probes which one are relevant for us ? Here we have to use intuition and knowledge of programming. We know that we are looking in the direction of Xcode, xcodebuild and network sockets. 

We know as well about the MobileDevice.framework https://www.theiphonewiki.com/wiki/MobileDevice_Library which is Apple's framework for in-house Apps (Xcode, iTunes ..) to reach to iDevices via the USBMUXD. We can have a look at the probes that this framework provides (module MobileDevice):

```sudo dtrace -l -m MobileDevice```

Indeed there are probes in it, 2347 exactly. We know that the StartService messages are encrypted. Let's see what we can get related to Services in those probes.


```sudo dtrace -l -m MobileDevice | grep StartService```

The result is a large list of Providers, which is just a reputation for 2 probes:

```
 3681 MobileDevice67773      MobileDevice        AMDeviceSecureStartService end
 3727 MobileDevice67773      MobileDevice        AMDeviceSecureStartService startservice-start
```

The Provider in _MobileDevice67773_ and the module is _MobileDevice_. The provider identifier is the name of the module + the pid of the process that runs it, in this case 67773.

The probe we are interested in is the function ```AMDeviceSecureStartService``` which has two points of "hook" usually _entry_ and the _end_. This is very handy because in that way you can inspect the probe at the beginning of function before any change happens and at the end, on return, which will allow you to check what the function is returning of what are the changes it made.

If we access a reverse engineered API of MobileDevice.Framework we will see that such function exists. Here in https://github.com/samdmarshall/SDMMobileDevice/blob/master/SDM_MD_Tests/MobileDevice.h  we can see the header of the functions:

```
mach_error_t AMDeviceStartService(struct am_device *device, CFStringRef service_name, service_conn_t *handle, unsigned int *unknown);
mach_error_t AMDeviceSecureStartService(struct am_device *device, CFStringRef service_name, service_conn_t *handle, unsigned int *unknown);
```

Using a trace on AMDeviceSecureStartService we could dump the argument (2) _service_name_ and print log line to tell us that a StartService request is about to begin. Any sort of indications are very helpful in the massive logs that we get.

Still we we need to dump the messages that go to the USBMUXD. We know that TCP communication is done with connect, read, write, ssl_read, ssl_write etc. Let's see what probes do we have related to those functions:

```
sudo dtrace -l -P syscall | grep read
sudo dtrace -l -P syscall | grep write
sudo dtrace -l -P syscall | grep send
sudo dtrace -l -P syscall | grep recv
```

We can see that we have those probes, but we don't see probes for SSL_read or write. This doesn't mean that the probes do not exists, it means that at this moment the system doesn't have them available. If a module using those SSL probes will be loaded then they will be available.

Now we have an idea of what direction we can take with DTrace to log the sockets data.

## The D Language

Dtrace comes from the letter D which is the name of the "language/script". D is the language to create DTrace scripts. It looks very much like C.  

https://docs.oracle.com/cd/E53394_01/html/E53395/gkwpo.html

The more you would know about tit the better. Here we will concentrate exactly in what we need it for.

## DTrace Examples

Have a look and try some very quick Dtrace examples to experience the power of the tool. https://wiki.freebsd.org/DTrace/One-Liners

Let's do some examples on our own in the direction of sniffing the usbmuxd traffic. Here are our examples:

../Resource/dtrace-scripts/DTRACE-Solution/Simple-Scripts

### Tracing "StartService"

We are dealing with DTrace because some messages are encrypted, and one of them is _StartService_. Let see how could we know when Xcode wants to start an iOS service. As explained earlier the function "AMDeviceSecureStartService" of MobileDevice.framework sounds promising, so we want to create a D script that will log the name of the service. Which is the CFString second argument.

This is how "hooking" to probes is done:

```
provider:module:function:name {
  // script body
}
```

In the case of AMDeviceSecureStartService would be:

```
typedef long long ptr_t;

pid$target:MobileDevice:AMDevice*StartService:entry {
	this->str = *(ptr_t*) copyin( arg1 + 2 * sizeof(ptr_t), sizeof(ptr_t) );
	printf("service: %s", copyinstr(this->str));
}
```

Notice the wildcard in "AMDevice*StartService" to "capture" _AMDeviceStartService_ and _AMDeviceSecureStartService_.

The script body wants to access the point in memory where the string starts. We know we want arg1. If arg 1  would be a *char then arg1 would be the start of the string buffer. But since arg2 is a CFString, we have to go to the offset where the string buffer starts inside a CFString, and that is "2 * sizeof(ptr_t)". 

How do we know all those offsets ? Have to google and find the direct answers on Dtrace related issues or get information about CFString structure.

Finally we print the string that we copied into _this->str_.

To run DTrace scripts type:

```$ sudo dtrace -Z -p PID -s service-name.d  ```

-Z is to instruct DTrace that even if there is no probe at this very moment, do not consider it an error because the probe may come during execution.

The -p PID is to set the value of "$target" for the "pid" provider. This will activate the "probe" "entry" which is not active by default in the MobileDevice. 

### Tracing sockets payloads

The next example to get closer to sniffing usbmuxd is to get the payloads of sockets. As we said earlier we are interested in the ssl_read ssl_write, which in OSX the real functions are ssl3_read/write.

Are example will try to log when ssl function is being called. The D script looks like this:

```
ssl3_write_bytes:entry,
ssl3_read_bytes:entry
{
printf(" ******** ssl3_ ! %s %s ********", probefunc, probename);
}
```

Running this Dtrace script is actually successful and finds all the calls of Xcode to those functions.

$ sudo dtrace -Z -p PID -s ./ssl-read-write.d

From here we can understand that we could log the arguments or return values to get the data unencrypted.




 