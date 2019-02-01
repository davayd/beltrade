import { Component, OnInit, Inject } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { LOCAL_STORAGE, StorageService } from "angular-webstorage-service";
import { CollectorService, INDUSTRIES_KEY } from "./../collector.service";
import { IndustryItem } from "../models";

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"]
})
export class Tab3Page implements OnInit {
  searchResult = "idle";
  industryList: IndustryItem[] = [];
  selected = 0;

  constructor(
    private collectorService: CollectorService,
    @Inject(LOCAL_STORAGE) private storage: StorageService
  ) {}

  ngOnInit() {
    this.searchResult = "loading";
    const industries = this.storage.get(INDUSTRIES_KEY);
    if (industries) {
      this.industryList = industries;
      this.countSelectedItems(this.industryList);
      this.searchResult = "success";
    } else {
      this.collectorService
        .getIndustries()
        .then(result => {
          this.industryList = this.parseIndustries(result.data);
          this.countSelectedItems(this.industryList);
          this.storage.set(INDUSTRIES_KEY, this.industryList);
          this.searchResult = "success";
        })
        .catch((error: HttpErrorResponse) => {
          console.log(error.message);
          this.searchResult = "error";
        });
    }
  }

  private parseIndustries(htmlDocument: string) {
    const el = document.createElement("html");
    el.innerHTML = htmlDocument;
    const industriesList = <HTMLUListElement>(
      el.getElementsByTagName("ul").item(0)
    );
    console.log(industriesList);
    if (industriesList) {
      for (
        let categoryId = 0;
        categoryId < industriesList.childElementCount;
        categoryId++
      ) {
        const industryItem: IndustryItem = {
          isChecked: false,
          name: undefined,
          value: undefined
        };
        const category = <HTMLLIElement>industriesList.children[categoryId];

        const branches = category.getElementsByTagName("ul").item(0);
        industryItem.name = category
          .getElementsByTagName("span")
          .item(0).textContent;

        const categoryValue = category
          .getElementsByTagName("input")
          .item(0)
          .getAttribute("value");
        const startValue = branches.firstElementChild
          .getElementsByTagName("input")
          .item(0)
          .getAttribute("value");
        const endValue = branches.lastElementChild
          .getElementsByTagName("input")
          .item(0)
          .getAttribute("value");

        industryItem.value = categoryValue + "." + startValue + "-" + endValue;

        this.industryList.push(industryItem);
      }
      console.log(this.industryList);
      return this.industryList;
    } else {
      this.searchResult = "error";
    }
  }

  ionViewWillLeave() {
    this.storage.set(INDUSTRIES_KEY, this.industryList);
  }

  private countSelectedItems(list: IndustryItem[]) {
    list.forEach(item => {
      if (item.isChecked) {
        this.selected++;
      }
    });
  }

  onChange(item: IndustryItem) {
    item.isChecked ? this.selected++ : this.selected--;
  }

  clearAll() {
    this.industryList.forEach(item => {
      item.isChecked = false;
    });
  }
}
