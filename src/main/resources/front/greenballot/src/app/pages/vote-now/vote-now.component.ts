import { Component } from '@angular/core';
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {CardModule} from "primeng/card";

@Component({
  selector: 'app-vote-now',
  standalone: true,
  imports: [
    ToastModule,
    CardModule
  ],
  providers:[MessageService],
  templateUrl: './vote-now.component.html',
  styleUrl: './vote-now.component.scss'
})
export class VoteNowComponent {

}
