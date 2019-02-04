import { Injectable, Inject } from "@angular/core";
import { HTTP, HTTPResponse } from "@ionic-native/http/ngx";
import { LOCAL_STORAGE, StorageService } from "angular-webstorage-service";
import { IndustryItem } from "../models/industry";

export const FAVORITES_KEY = "favorites";
export const INDUSTRIES_KEY = "industries";
export const SEARCH_HISTORY_KEY = "s_history";

@Injectable({ providedIn: "root" })
export class CollectorService {
  private AUCTIONS_URL =
    "http://www.icetrade.by/search/auctions?onPage=100&search_text=";
  private INDUSTRIES_URL =
    "http://www.icetrade.by/industries/select_multi?ajax=1";

  constructor(
    private httpClient: HTTP,
    @Inject(LOCAL_STORAGE) private storage: StorageService
  ) {}

  getAuctions(searchText: string): Promise<HTTPResponse> {
    searchText = searchText
      .trim()
      .split(" ")
      .join("+");
    searchText += this.generateIndustries();
    return this.httpClient.get(this.AUCTIONS_URL + searchText, {}, {});
  }

  getIndustries(): Promise<HTTPResponse> {
    return this.httpClient.get(this.INDUSTRIES_URL, {}, {});
  }

  private generateIndustries(): string {
    const temp = [];
    const industryList: IndustryItem[] = this.storage.get(INDUSTRIES_KEY);
    if (industryList) {
      industryList.forEach(item => {
        if (item.isChecked) {
          temp.push(item.value);
        }
      });
    }
    return "&industries=" + temp.join("/");
  }
}
