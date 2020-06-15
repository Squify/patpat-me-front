import { AfterViewInit, Component, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import places from "places.js";
import { GeolocationService } from "../../services/geolocation.service";

@Component({
  selector: "app-places",
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss'],
})
export class PlacesComponent implements AfterViewInit, OnDestroy {
  private instance = null;
  public data: string;

  @ViewChild("input", null) input;
  @Output() onChange? = new EventEmitter();

  constructor(private geolocationService: GeolocationService) {
    this.geolocationService.myMethod(this.data);
  }

  ngAfterViewInit() {
    this.instance = places({
      container: this.input.nativeElement
      // places options
    });
  }
  ngOnDestroy() {
    this.instance.destroy();
  }

  sendValue() {
    this.geolocationService.myMethod(this.input.nativeElement.value);
  }
}
