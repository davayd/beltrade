import { Component, Inject, OnInit } from "@angular/core";
import { LOCAL_STORAGE, StorageService } from "angular-webstorage-service";
import { TenderItem } from "../models";
import { FAVORITES_KEY } from "../collector.service";
import {
  LocalNotifications,
  ELocalNotificationTriggerUnit
} from "@ionic-native/local-notifications/ngx";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";

import * as moment from "moment";
import "moment/locale/ru";
import { ActionSheetController } from "@ionic/angular";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"]
})
export class Tab2Page implements OnInit {
  favoriteTenders: TenderItem[];

  constructor(
    @Inject(LOCAL_STORAGE) private storage: StorageService,
    private localNotifications: LocalNotifications,
    private socialSharing: SocialSharing,
    public actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    moment().locale("ru");
  }

  subscribe(item: TenderItem) {
    this.localNotifications.schedule({
      id: 666,
      title: item.customerName,
      text: item.shortDescription,
      trigger: { every: ELocalNotificationTriggerUnit.MINUTE, count: 5 },
      led: "FF0000",
      sound: null
    });
  }

  unsubscribe(item: TenderItem) {
    this.localNotifications.cancel(666);
  }

  getDay(offersTo: string) {
    const dmy = offersTo.split("."); // day.month.year
    const jsDate = moment(`${dmy[1]}.${dmy[0]}.${dmy[2]}`);
    return {
      day: jsDate.format("ddd"),
      date: jsDate.format("D"),
      month: jsDate.format("MMM")
    };
  }

  ionViewDidEnter() {
    this.storage.get(FAVORITES_KEY)
      ? (this.favoriteTenders = this.storage.get(FAVORITES_KEY))
      : (this.favoriteTenders = []);
  }

  share(item: TenderItem) {
    this.socialSharing
      .share(
        item.customerName + " - " + item.shortDescription,
        null,
        null,
        item.href
      )
      .then(() => {
        console.log("Success!");
      })
      .catch(error => {
        console.error(error);
      });
  }

  openTender(item: TenderItem) {
    window.open(item.href, "_system", "location=yes");
  }

  async delete(item: TenderItem) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Удалить закладку',
        role: 'destructive',
        icon: 'trash',
        cssClass: 'delete',
        handler: () => {
          this.favoriteTenders = this.favoriteTenders.filter(fav => fav.id !== item.id);
          this.storage.set(FAVORITES_KEY, this.favoriteTenders);
        }
      }, {
        text: 'Отмена',
        icon: 'close-circle',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }
}
