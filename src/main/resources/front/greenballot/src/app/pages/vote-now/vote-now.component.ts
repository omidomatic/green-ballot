import {Component, OnInit} from '@angular/core';
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {CardModule} from "primeng/card";
import {VotingService} from "../../service/voting.service";
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {GreenProjectService} from "../../service/green-project.service";
import {Button} from "primeng/button";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {DialogModule} from "primeng/dialog";
import {PaginatorModule} from "primeng/paginator";
import {ReactiveFormsModule} from "@angular/forms";

export interface VoteDto {
  userId: number,
  vote: string,
  projectId: number
}

@Component({
  selector: 'app-vote-now',
  standalone: true,
  imports: [
    ToastModule,
    CardModule,
    DatePipe,
    CurrencyPipe,
    NgForOf,
    NgIf,
    Button,
    DialogModule,
    PaginatorModule,
    ReactiveFormsModule
  ],
  providers: [MessageService],
  templateUrl: './vote-now.component.html',
  styleUrl: './vote-now.component.scss'
})
export class VoteNowComponent implements OnInit {


  projects: any[] = [];
  currentIndex: number = 0;
  imageViewDialogVisible: boolean = false;
  imageUrl: any;

  constructor(private votingService: VotingService,
              private greenProjectService: GreenProjectService,
              private messageService: MessageService) {

  }

  loadImage(filename: string) {
    this.greenProjectService.getFeaturedImage(filename).subscribe({
      next: (blob) => {
        // Create a URL for the Blob
        const reader = new FileReader();
        reader.onload = () => {
          this.imageUrl = reader.result as string;
        };
        reader.readAsDataURL(blob); // Convert Blob to Data URL
      },
      error: (err) => {
        console.error('Error fetching image:', err);
      },
    });
  }

  get currentProject() {
    return this.projects[this.currentIndex];
  }


  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects() {
    this.greenProjectService.getProjectByStatus("ACTIVE", 0, 10).subscribe(
      {
        next: (res: any) => {
          this.projects = res.content;
          console.log(res.content);
        }
      }
    );
  }

  vote(userId: number, projectId: string, type: string) {
    console.log(`Voted ${type} for project ID: ${projectId}`);
    this.votingService.castVote(userId, projectId, type).subscribe(
      {
        next: (res: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Register Successful',
            detail: 'You are successfully logged in!',
          });
        },
        error: (err) => {
          console.log(err);
        }
      }
    );
  }

  nextProject() {
    if (this.currentIndex < this.projects.length - 1) {
      this.currentIndex++;
      this.loadImage(this.projects[this.currentIndex].featuredImage);
    }
  }

  previousProject() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.loadImage(this.projects[this.currentIndex].featuredImage);
    }
  }

  toggleViewImage() {
    this.imageViewDialogVisible = !this.imageViewDialogVisible;
  }
}
