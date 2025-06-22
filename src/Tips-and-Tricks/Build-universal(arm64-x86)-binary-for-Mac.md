
# build universal binary for Mac

## Build OpenSSL  1.1 or 3.0
* Download the code 
* https://stackoverflow.com/questions/69002453/how-to-build-openssl-for-m1-and-for-intel
* Create a file named c under folder ~
* put code blew to cc file
```
#!/bin/bash

if [[ $* == *-arch\ x86_64* ]] && ! [[ $* == *-arch\ arm64* ]]; then
    echo Forcing compilation with arm64
    cc -arch arm64 $@
else
    cc $@
fi
```
* chmod a+x ~/cc
* export CC=~/cc
* ./Configure enable-rc5 zlib no-asm darwin64-x86_64-cc
* make && make install



# build libplist 

* export CFLAGS="-arch arm64 -arch x86_64 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX.sdk" 
* ./autogen.sh
* make && make install 

* build libplist   libusbmuxd  libimobiledevice-glue libimobiledevice 
* build ideviceinstaller need build libzip zstd-dev first 

## build zstd-dev
* install ninja first
cmake -B build-cmake-debug -S build/cmake -G Ninja -DCMAKE_OSX_ARCHITECTURES="x86_64;x86_64h;arm64"\ncd build-cmake-debug\nninja\nsudo ninja install
* sudo cp /usr/local/lib/libzstd.1.5.5.dylib  /opt/homebrew/Cellar/zstd/1.5.5/lib/libzstd.dylib 

## build libzip
* mkdir build
* cd build
* cmake ..
* make 


# zsign

 g++ -arch x86_64  *.cpp common/*.cpp -lcrypto -I/usr/local/include -L/usr/local/lib/ -O3 -o zsign
.z
 g++ -arch x86_64 -arch arm64 *.cpp common/*.cpp -lcrypto -I/usr/local/include -L/usr/local/lib/ -O3 -o zsign

# build boost
```
 ./bootstrap.sh
 ./b2 --build-dir=build  architecture=arm+x86 
 ```

