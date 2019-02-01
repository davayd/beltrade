import { Component, ViewChild, OnInit, Inject } from "@angular/core";
import { IonSearchbar } from "@ionic/angular";
import { HttpErrorResponse } from "@angular/common/http";
import { StorageService, LOCAL_STORAGE } from "angular-webstorage-service";
import { CollectorService, FAVORITES_KEY } from "./../collector.service";
import { TenderItem } from "../models";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"]
})
export class Tab1Page implements OnInit {
  tendersList: TenderItem[] = [];
  searchResult = "idle";

  @ViewChild(IonSearchbar) searchBar: IonSearchbar;

  constructor(
    private collectorService: CollectorService,
    @Inject(LOCAL_STORAGE) private storage: StorageService,
    private socialSharing: SocialSharing
  ) {}

  ngOnInit() {}

  onInput(event: any) {
    console.log(event.target.value);
    const searchQuary: string = event.target.value;

    if (searchQuary.trim().length) {
      this.searchResult = "loading";
      this.tendersList = [];

      this.collectorService
        .getAuctions(searchQuary)
        .then(result => {
          console.log(result);
          this.parseTable(result.data);
        })
        .catch((error: HttpErrorResponse) => {
          console.log(error.message);
          this.searchResult = "error";
        });
    }
  }

  private parseTable(htmlDocument: string) {
    const el = document.createElement("html");
    el.innerHTML = htmlDocument;
    const auctionsTable = <HTMLTableElement>(
      el.getElementsByClassName("auctions").item(0)
    );
    if (auctionsTable) {
      // DELETE HEADER
      auctionsTable.deleteRow(0);
      const tBody = auctionsTable.tBodies.item(0);
      if (tBody.childNodes.length) {
        if (tBody.firstElementChild.textContent === "Тендеры не найдены") {
          this.searchResult = "error";
          return;
        }
        // TABLE ROWS
        for (let rowId = 0; rowId < tBody.rows.length; rowId++) {
          const tableRow = tBody.rows.item(rowId);
          const tenderItem: TenderItem = {
            cost: undefined,
            country: undefined,
            customerName: undefined,
            id: undefined,
            offersTo: undefined,
            shortDescription: undefined,
            href: undefined,
            isFavorite: false
          };
          // CELLS
          for (let cellId = 0; cellId < tableRow.cells.length; cellId++) {
            const rowCell = tableRow.cells.item(cellId);
            // console.log(cellId, rowCell);
            if (rowCell.firstElementChild) {
              switch (rowCell.firstElementChild.tagName) {
                // <a> tag
                // Краткое описание предмета закупки
                case "A":
                  tenderItem.shortDescription = rowCell.firstElementChild.textContent.trim();
                  tenderItem.href = rowCell.firstElementChild.getAttribute(
                    "href"
                  );
                  break;
                // <span> tag
                // Стоимость
                case "SPAN":
                  tenderItem.cost = rowCell.firstElementChild.textContent.trim();
                  break;
                default:
                  break;
              }
            } else {
              switch (cellId) {
                // Наименование заказчика/организатора
                case 1:
                  tenderItem.customerName = rowCell.textContent.trim();
                  break;
                // Страна
                case 2:
                  tenderItem.country = rowCell.textContent.trim();
                  break;
                // Номер
                case 3:
                  tenderItem.id = rowCell.textContent.trim();
                  tenderItem.isFavorite = this.checkIsFavorite(tenderItem.id);
                  break;
                // Предложения до
                case 5:
                  tenderItem.offersTo = rowCell.textContent.trim();
                  break;
                default:
                  break;
              }
            }
          }
          // push Tender
          this.tendersList.push(tenderItem);
        }
        this.searchResult = "success";
      } else {
        this.searchResult = "error";
        console.error("table is empty");
      }
    } else {
      this.searchResult = "error";
      console.error("no table");
    }
  }

  openTender(item: TenderItem) {
    window.open(item.href, "_system", "location=yes");
  }

  favorite(item: TenderItem) {
    let favoriteTenders: TenderItem[] = this.storage.get(FAVORITES_KEY);
    if (favoriteTenders) {
      if (favoriteTenders.some(favorite => item.id === favorite.id)) {
        favoriteTenders = favoriteTenders.filter(
          favorite => favorite.id !== item.id
        );
        this.storage.set(FAVORITES_KEY, favoriteTenders);
        item.isFavorite = false;
      } else {
        favoriteTenders.push(item);
        this.storage.set(FAVORITES_KEY, favoriteTenders);
        item.isFavorite = true;
      }
    } else {
      const newState: TenderItem[] = [item];
      item.isFavorite = true;
      this.storage.set(FAVORITES_KEY, newState);
    }
  }

  share(item: TenderItem) {
    this.socialSharing
      .share(
        item.shortDescription,
        "Тендер " + item.customerName,
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

  private checkIsFavorite(tenderId: string): boolean {
    const favoriteTenders: TenderItem[] = this.storage.get(FAVORITES_KEY);
    return favoriteTenders
      ? favoriteTenders.some(favorite => tenderId === favorite.id)
      : false;
  }
}