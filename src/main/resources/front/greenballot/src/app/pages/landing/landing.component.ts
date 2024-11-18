import { Component } from '@angular/core';
import {Button} from "primeng/button";
import {ToolbarModule} from "primeng/toolbar";
import {CardModule} from "primeng/card";
import {CarouselComponent} from "../../util/carousel/carousel.component";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    Button,
    ToolbarModule,
    CardModule,
    CarouselComponent
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {

}
