# The Lockdown Protocol


## On Device Pairing

libimobiledevice does all the initial complexities of establishing the communication. A big part of it is the device pairing. All what is described in the video about the diagram bellow is performed by libimobiledevice infrastructure. 

The device pairing relies on many parameters that are part of the host and device identities. These values are exchanged during the pairing process. They are already handled by the libimobiledevice, it's transparent for us as mc tools builders.

```
DeviceCertificate
EscrowBag
HostCertificate
HostID
HostPrivateKey
RootCertificate
RootPrivateKey
SystemBUID
WiFiMACAddress
```

Here we will explain the "pairing" protocol.

![../Resource/wiki_assets/knowledge/ios13ssl.png](../Resource/wiki_assets/knowledge/ios13ssl.png)

An important task of the usbmux is to detect device connections and perform pairing. The counterpart on the iOS side is the lockdown service. The pairing is not a transparent process, it requires users approval, this why we get the “Trust” dialog. It happens only once per Host and it didn’t exist until iOS7.

According to my tests on Mac, the Trust dialog and the pairing doesn’t take place unless iTunes, Xcode or Photos are running. The usbmux daemon itself dos not launch the Trust process, it seems to manage to stablish a non fully trusted basic communication with the device to gather basic information. 

It is when an Application in the host wants to access the device that the Trust dialog and the pairing occurs. On Linux instead, the usbmuxd does force the Trust dialog. This means there is some difference between Apple’s and the open source project regarding when to perform the pairing.

During this process, sets of pairing records are exchanged between the iOS device and computer. Using pairing mechanism computer establishes a trusted relation with iPhone. The pairing records are kept in the folder /var/db/lockdown. You can see the pairing records by listing the directory:

`$ sudo ls /var/db/lockdown`
Deleting its contents will cause the Trust dialog to appear in the next connection.
The pairing record is a file named after the UDID of the iDevice and would look like this:
```
<?xml version=”1.0" encoding=”UTF-8"?><!DOCTYPE plist PUBLIC “-//Apple//DTD PLIST 1.0//EN” “http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version=”1.0"><dict>
<key>DeviceCertificate</key>
<data>LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUN1akNDQWFLZ0F3SUJBZ0lCQURB…</data>
This certificate is unique to each device.
<key>EscrowBag</key>
<data>hXUjlCIlve6v92….=</data>
The keybag of EscrowBag contains class keys used to decrypt the device.
<key>HostCertificate</key>
<data>LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUN1akNDQWFLZ0F3SUJBZ0lCQURB…</data>
This certificate is for the host who's paired with iOS devices (usually, the same for all files that you've paired devices with, on your computer).
<key>HostID</key>
<string>5D9462DF-AB7D-486E-823F-B5C19BF3BF80</string>
This is a generated ID for the host.
<key>HostPrivateKey</key><data>LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2Z0lCQURBTkJna3Foa2lHOXcwQkFRRUZBQVND..</data>
This is the private key for your Mac (should be the same in all files on a given computer).
<key>RootCertificate</key>
<data>LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUNyVENDQVpXZ0F3SUJBZ0lCQURB..</data>
This is the certificate used to generate keys (should be the same in all files on a given computer)
<key>RootPrivateKey</key>
<data>LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2UUlCQURBTkJna3Foa2lHOXcw..</data>
This is the private key of the computer that runs iTunes for that device.
<key>SystemBUID</key>
<string>B0911AB5–84F7–436F-936E-DEA460F6EA3A</string>
This refers to the ID of the computer that runs iTunes.
<key>WiFiMACAddress</key>
<string>e0:33:8e:b1:d7:d9</string>
</dict>
</plist>
```

This is the Mac address of the Wi-Fi interface of the device that is paired to the computer. If you do not have an active Wi-Fi interface, MAC is still used while pairing.

On the device side, the pairing records are kept in “/var/root/Library/ Lockdown/pair_records/”. Multiple pairing records are contained if the device is paired with multiple computers. The pairing record contains the SystemBUID, HostID, RootDertificate, DeviceCertificate and HostCertificate.

With all that information in the device and in the host, the pairing process can find out if the device and the host have alreay been paired (trusted). This trusted relationship grants privileged access to download personal data, install applications, or perform other such tasks on an iOS device.

On the device side we see another type of records next to the pairing records, the scrow_records, located in “/private/var/root/Library/Lockdown/escrow_records/”.

Here we find an explanation for the escrow pairing : https://resources.infosecinstitute.com/ios-forensics/#gref

iTunes can back up and sync with the iPhone even in a locked state using Escrow keybag. It is a copy of class keys and system bag which is used for the encryption in IOS. Access to all classes of data on the device without entering the password can be achieved by keybag.

Newly generated key computed from the key 0x835 is protected with Escrow keybag and saved in escrow record on the phone. It is also plist file and located at /private/var/root/Library/Lockdown/escrow_records/

These records are protected with UntilFirstUserAuthentication protection class. It further encrypts to user’s passcode. Hence device passcode needs to be entered while first time syncing the phone to iTunes.
