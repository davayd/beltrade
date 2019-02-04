import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { HTTP } from "@ionic-native/http/ngx";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { StorageServiceModule } from "angular-webstorage-service";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { LocalNotifications } from "@ionic-native/local-notifications/ngx";
import { Keyboard } from "@ionic-native/keyboard/ngx";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    StorageServiceModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HTTP,
    SocialSharing,
    LocalNotifications,
    Keyboard,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
