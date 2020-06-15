import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import places from "places.js";

@Component({
  selector: "app-places",
  template: `
    <input #input type="search" placeholder="Where are we going?" />
  `
})
export class PlacesComponent implements AfterViewInit, OnDestroy {
  private instance = null;

  @ViewChild("input", null) input;

  ngAfterViewInit() {
    this.instance = places({
      container: this.input.nativeElement
      // places options
    });
  }
  ngOnDestroy() {
    this.instance.destroy();
  }
}
