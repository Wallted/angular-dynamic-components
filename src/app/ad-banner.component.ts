import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ComponentFactoryResolver,
  OnDestroy,
  QueryList,
  ViewChildren,
  AfterViewInit
} from "@angular/core";

import { AdDirective } from "./ad.directive";
import { AdItem } from "./ad-item";
import { AdComponent } from "./ad.component";

@Component({
  selector: "app-ad-banner",
  template: `
    <div class="ad-banner-example">
      <h3>Advertisements</h3>
      <div *ngFor="let a of [a, a, a, a]">
        <ng-template adHost></ng-template>
      </div>
    </div>
  `
})
export class AdBannerComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() ads: AdItem[];
  currentAdIndex = -1;
  @ViewChildren(AdDirective) adHosts: QueryList<AdDirective>;
  interval: any;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngAfterViewInit() {
    // viewChildren is set
    this.loadComponent();
    this.getAds();
  }

  ngOnInit() {}

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  loadComponent() {
    this.adHosts
      .toArray()
      .reverse()
      .forEach(obj => {
        this.currentAdIndex = (this.currentAdIndex + 1) % this.ads.length;
        const adItem = this.ads[this.currentAdIndex];

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
          adItem.component
        );

        const viewContainerRef = obj.viewContainerRef;
        viewContainerRef.clear();

        const componentRef = viewContainerRef.createComponent<AdComponent>(
          componentFactory
        );
        componentRef.instance.data = adItem.data;
      });
    this.currentAdIndex += 1;
  }

  getAds() {
    this.interval = setInterval(() => {
      this.loadComponent();
    }, 3000);
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
