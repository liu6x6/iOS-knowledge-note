* zsign need unzip ipa subfolders to temp folder
* By default, Windows uses a path length limitation (MAX_PATH) of 256 characters
* sometimes the subfolders path is too long then it make zsign couldn't work

*** 
## Enable Long Path Support in Windows 10

### 1 use Regedit

```
Windows Registry Editor Version 5.00
 
[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem]
"LongPathsEnabled"=dword:00000001
 
```
### 2 PowerShell

```powershell
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" `
-Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```
 
 
 
### 3 Regedit manually
  
1.	Open command prompt as Administrator.
2.	Type reg add "HKLM\SYSTEM\CurrentControlSet\Control\FileSystem" /v LongPathsEnabled /t REG_DWORD /d 1 and hit Enter.
3.	Restart Windows 10.
4.	You have enabled the Long Path support in File Explorer.
 
 
 
 
### 4 Group policy 
1.	Press Win + R keys together on your keyboard and type: gpedit.msc. Hit Enter. 
2.	Expand the left panel to Local Computer Policy > Computer Configuration > Administrative Templates > System > Filesystem. 
3.	Double click option Enable Win32 long paths in the right panel. 
4.	Restart Windows 10.
 

----
## references
* https://docs.microsoft.com/en-us/windows/win32/fileio/maximum-file-path-limitation?tabs=powershell
* https://www.msftnext.com/how-to-enable-ntfs-long-paths-in-windows-10/
* https://knowledge.autodesk.com/support/autocad/troubleshooting/caas/sfdcarticles/sfdcarticles/The-Windows-10-default-path-length-limitation-MAX-PATH-is-256-characters.html
 