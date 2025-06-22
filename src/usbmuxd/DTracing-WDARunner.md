# Video Lessons

On DTrace:

**Get deeper into DTrace : http://dtrace.org/guide/chp-intro.html#chp-intro**

# DTracing WDARunner

Our sniffing and Tracing efforts are to be able create an mctool to launch apps and run the WDARunner. Here we are going to see how to DTrace the WDARunner:

[](../Resource/dtrace-scripts/DTRACE-Solution/wda-run.Tracer)

Sniffing the WDARunner launch can be done easily with idevicesniff. (But some messages are encrypted).

# xcodebuild to Launch WDARunner

We already have a way to launch WDARunner with xcodebuild.

```
xcodebuild test-without-building -xctestrun ./fullpath.xctestrun -destination 'id=f53cbc27f27aa5d8f127b58e9033be07796894c3'
```

[fullpath.xctestrun](../Resource/dtrace-scripts/DTRACE-Solution/wda-run.Tracer) is the plist that defines the location of the WDARunner.

We need to trace the usbmuxd traffic of that command until WDA starts up. 
_**We are not interested in the installation of WDARunner, therefore have WDARunner installed before.**_


# D Script to Log usbmuxd Traffic

The D Script that we need to build has to hook socket read write functions and log the arguments that they receive. The arguments will hold the pointers to the buffers with the encrypted data.

## Printing the SSL-Writes

We know that a program using openSSL or LibreSSL will use _ssl3_write_bytes_ to send bytes.

`ssl3_write_bytes(SSL *s, int type, const void *buf_, int len)`

The payload, before encryption, that is going to be sent is in argument but with length len. That is what we want to print.

See in the script bellow how we are going to keep arg2 and arg3 to print the payload later. The previous values are to get a better login information.
  

```
pid$target::ssl3_write_bytes:entry
 {
    this->ssl_wbio = *(ptr_t*) copyin(arg0+0x18, 0x8);
    self->ssl_fd = *(int*) copyin(this->ssl_wbio+0x28, 0x4);
    self->ssl_rw = "W";

    self->ssl_buf = arg2;
    self->ssl_size = arg3;

    self->encrypted_comms = 1;
 }
```

This is to print the buffer:

```
 pid$target::ssl3_write_bytes:entry,
 pid$target::ssl3_read_bytes:return
 /self->ssl_fd && self->ssl_size/
 {
    /* Print header */
    printf("%-17s %5s %6s %-12s %1s %7s %s\n", "TIMESTAMP", "UID", "PID", "CMD", "D", "BYTES", "SOCKET (SSL)");

    /* Print metadata */
    printf("%-17d %5d %6d %-12.12s %1s %7d %d (%s)", walltimestamp / 1000, uid, pid, execname, self->ssl_rw, (int)self->ssl_size, self->ssl_fd, sockets[self->ssl_fd]);
    /* Print actual buffer */
    this->data = copyin(self->ssl_buf, self->ssl_size);
    tracemem(this->data, 0x10000, self->ssl_size);
 }
```

## Printing the SSL-Reads

The function to red SSL is

```
int ssl3_read_bytes(SSL * s,int type,unsigned char * buf,int len,int peek )	
```

Argument third and fourth is what we need. In the D script bellow, in the _entry_ point we will get the pointer to the buffer that is going to be filled with the payload already unencrypted. The size of the buffer once the payload is read can only be known at the on the function. That is why there is probe for the "return" point. 

How do we know the size of the buffer ? Why do we use arg1 ? We have to read the documentation for the function and find out how the caller knows the size of the buffer.

From http://dtrace.org/guide/chp-fbt.html :

> If the function has a return value, the return value is stored in args[1]. If a function does not have a return value, args[1] is not defined.


```
pid$target::ssl3_read_bytes:entry
 {
    this->ssl_wbio = *(ptr_t*) copyin(arg0+0x18, 0x8);
    self->ssl_fd = *(int*) copyin(this->ssl_wbio+0x28, 0x4);
    self->ssl_rw = "R";

    self->ssl_buf = arg2;
    self->encrypted_comms = 1;
 }

 pid$target::ssl3_read_bytes:return
 /self->ssl_buf && (probefunc == "ssl3_read_bytes")/
 {
    self->ssl_size = arg1;
 }
```

The print is done by the same function print D code we have seen just above.

## Printing Non SSL Reads/Writes

The non SSL payloads will follow the same logic and will be based on the following probes:

```
syscall::*read:return,
syscall::read_*:return,
syscall::*write*:entry,
syscall::*send*:entry
```

# Wrapping it all in a Python Script

We will wrap the launching of xcodebuild and the posterior Dtrace command in a Python script:

[](../Resource/dtrace-scripts/DTRACE-Solution/wda-run.Tracer/wda-run-tracer.py)

In this way we can get the PID of xcodebuild and execute DTrace with that PID. We will specify the output file of the log as well. The information is here:

[](../Resource/dtrace-scripts/DTRACE-Solution/wda-run.Tracer)

# The Logs Format

Unfortunately the log from D use tracemem which are not ideal to read.

```
TIMESTAMP           UID    PID CMD          D   BYTES SOCKET
1587362450626080    502  70296 xcodebuild   W       4 20 ()
             0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f  0123456789abcdef
         0: 00 00 01 4b                                      ...K
TIMESTAMP           UID    PID CMD          D   BYTES SOCKET
1587362450626106    502  70296 xcodebuild   W     331 20 ()
             0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f  0123456789abcdef
         0: 3c 3f 78 6d 6c 20 76 65 72 73 69 6f 6e 3d 22 31  <?xml version="1
        10: 2e 30 22 20 65 6e 63 6f 64 69 6e 67 3d 22 55 54  .0" encoding="UT
        20: 46 2d 38 22 3f 3e 0a 3c 21 44 4f 43 54 59 50 45  F-8"?>.<!DOCTYPE
        30: 20 70 6c 69 73 74 20 50 55 42 4c 49 43 20 22 2d   plist PUBLIC "-
        40: 2f 2f 41 70 70 6c 65 2f 2f 44 54 44 20 50 4c 49  //Apple//DTD PLI
        50: 53 54 20 31 2e 30 2f 2f 45 4e 22 20 22 68 74 74  ST 1.0//EN" "htt
        60: 70 3a 2f 2f 77 77 77 2e 61 70 70 6c 65 2e 63 6f  p://www.apple.co
        70: 6d 2f 44 54 44 73 2f 50 72 6f 70 65 72 74 79 4c  m/DTDs/PropertyL
        80: 69 73 74 2d 31 2e 30 2e 64 74 64 22 3e 0a 3c 70  ist-1.0.dtd">.<p
        90: 6c 69 73 74 20 76 65 72 73 69 6f 6e 3d 22 31 2e  list version="1.
        a0: 30 22 3e 0a 3c 64 69 63 74 3e 0a 09 3c 6b 65 79  0">.<dict>..<key
        b0: 3e 4c 61 62 65 6c 3c 2f 6b 65 79 3e 0a 09 3c 73  >Label</key>..<s
        c0: 74 72 69 6e 67 3e 78 63 6f 64 65 62 75 69 6c 64  tring>xcodebuild
        d0: 3c 2f 73 74 72 69 6e 67 3e 0a 09 3c 6b 65 79 3e  </string>..<key>
        e0: 50 72 6f 74 6f 63 6f 6c 56 65 72 73 69 6f 6e 3c  ProtocolVersion<
        f0: 2f 6b 65 79 3e 0a 09 3c 73 74 72 69 6e 67 3e 32  /key>..<string>2
       100: 3c 2f 73 74 72 69 6e 67 3e 0a 09 3c 6b 65 79 3e  </string>..<key>
       110: 52 65 71 75 65 73 74 3c 2f 6b 65 79 3e 0a 09 3c  Request</key>..<
       120: 73 74 72 69 6e 67 3e 51 75 65 72 79 54 79 70 65  string>QueryType
       130: 3c 2f 73 74 72 69 6e 67 3e 0a 3c 2f 64 69 63 74  </string>.</dict
       140: 3e 0a 3c 2f 70 6c 69 73 74 3e 0a                 >.</plist>.
```

The payloads are exactly as they are sent/received, there is no message entirety grouping like in idevicesniff. Meaning messages can be divided in blocks as we can see in the example above (First comes the size of the message payload then the message). 

_tracelog-parser-binary.py_ is a work in progress to convert the logs into something more readable.



