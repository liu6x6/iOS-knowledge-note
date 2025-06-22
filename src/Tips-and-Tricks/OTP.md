## OTP
one time password

***

## Get the passcode from terminal
get the otp code from SMS or you phone could be very time, even it need 10 seconds.
but if i can get it from my terminal, it will be less than 1 second and it could automatic copyed to the pasteboard


## py_oathtool

``` bash
pip install py_oathtool

otp MY_OTP1
```

 Edit the file .otp-secrets.yaml

add the key to the yaml file

otpsecrets:
  MY_OTP1: 36SCXXXXXXXXXXXXXXXXXXXXXXXXX

## oathtool

``` bash
 brew install oath-toolkit
  
alias otp1='oathtool --totp -b -d 6 36SCXXXXXXXXXXXXXXXXXXXXXXXXX'

use otp1
```






## pass-otp
install pass https://www.passwordstore.org/
install pass-otp https://github.com/tadfisher/pass-otp

gpg create pair

gpg --full-generate-key

gpg --list-secret-keys --keyid-format LONG

pass init 

pass otp insert -e mf





* setting:

```
otpauth://totp/totp-secret?secret=36SCXXXXXXXXXXXXXXXXXXXXXXXXX&issuer=test1
```

* Use:

```
pass otp mf
```



## gotp

https://medium.com/@jtbonhomme?p=e9955fbc9b65

