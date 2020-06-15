import { NgModule } from "@angular/core";
import { PlacesComponent } from "./places/places.component";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
    imports: [
        TranslateModule

    ],
    declarations: [
        PlacesComponent
    ],
    exports: [
        PlacesComponent
    ]
})
export class ComponentModule {
    
}
