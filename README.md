# beltrade
## Building
- change version in <i>config.xml</i>
- Run in root folder <code>ionic cordova build android --prod --release</code>
- <code>cd $HOME/Projects/icetrade_scanner/platforms/android/app/build/outputs/apk/release/</code>
- <code>jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/Projects/icetrade_scanner/my-release-key.keystore app-release-unsigned.apk beltrade</code>
- KEYSTORE PASSWORD: beltrade2k19
- <code>zipalign -v 4 app-release-unsigned.apk BelTrade.apk</code>