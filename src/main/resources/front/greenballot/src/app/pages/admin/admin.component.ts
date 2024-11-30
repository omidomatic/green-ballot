import {Component, OnInit} from '@angular/core';
import {ToastModule} from "primeng/toast";
import {CardModule} from "primeng/card";
import {FormsModule} from "@angular/forms";
import {Button, ButtonDirective, ButtonModule} from "primeng/button";
import {Ripple, RippleModule} from "primeng/ripple";
import {NgForOf, NgIf} from "@angular/common";
import {PasswordModule} from "primeng/password";
import {CaptchaComponent} from "../../util/captcha/captcha.component";
import {TableModule} from "primeng/table";
import {InputIconModule} from "primeng/inputicon";
import {TagModule} from "primeng/tag";
import {MessageService} from "primeng/api";
import {Subject, switchMap} from "rxjs";
import {GreenProject, GreenProjectService} from "../../service/green-project.service";
import {ProjectService} from "../../service/project.service";
import {DropdownModule} from "primeng/dropdown";
interface ProjectStatuses {
  name: string;
}
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CardModule,
    FormsModule,
    Button,
    ButtonDirective,
    Ripple,
    NgIf,
    PasswordModule,
    ToastModule,
    ButtonModule,
    RippleModule,
    CaptchaComponent,
    TableModule,
    NgForOf,
    InputIconModule,
    TagModule,
    DropdownModule,
  ],
  providers: [MessageService],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit{

  projects: GreenProject[] = [];
  totalRecords!: number;
  loading!: boolean;
  cols!: any[];
  projectStatuses: ProjectStatuses[] | undefined;
  filterStatus: any;

  private userIdSubject = new Subject<string>();



  constructor(private projectService:GreenProjectService) {
    this.projectStatuses = [
      {name:"REJECTED"},
      {name:"PENDING"},
      {name:"APPROVED"},
      {name:"ACTIVE"},
      {name:"CLOSED"},
      {name:"FUNDED"},
      {name:"DELETED"}
    ]
  }
  ngOnInit(): void {
    this.cols = [
      {field: 'name', header: 'Name'},
      {field: 'category', header: 'Category'},
      {field: 'fundingGoal', header: 'Funding Goal'},
      {field: 'startDate', header: 'Start Date'},
      {field: 'endDate', header: 'End Date'},
      {field: 'voteCount', header: 'Total Votes'},
      {field: 'projectStatus', header: 'Project Status'}
    ];

  }
  loadProjects(event: any) {
    this.loading = true;
    const page = event.first / event.rows;
    const size = event.rows;

      this.projectService.getProjectByStatus((this.filterStatus)?this.filterStatus.name:'PENDING',page, size).subscribe(
        (data) => {
          this.projects = data.content;
          this.totalRecords = data.totalElements;
          this.loading = false;
        },
        (error) => {
          console.error('Error loading projects', error);
          this.loading = false;
        }
      );
    }

  getSeverity(status: string): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined  {
    switch (status) {
      case 'REJECTED':
        return 'danger';
      case 'PENDING':
        return 'warning';
      case 'APPROVED':
        return 'secondary';
      case 'ACTIVE':
        return 'info';
      case 'CLOSED':
        return 'contrast';
      case 'FUNDED':
        return 'success';
      default:
        return 'secondary'
    }
  }

  verifyProject(id:number) {
    this.projectService.verifyProject(id).subscribe({
      next:(res)=>{
        console.log(res);
      },
      error:(error)=>{
        console.error(error);
      }
    });
  }

  rejectProject(id:number){
    this.projectService.rejectProject(id).subscribe({
      next:(res)=>{
        console.log(res.content);
      },
      error:(error)=>{
        console.error(error);
      }
    });
  }


  onStatusChange($event:any) {
    this.loadProjects({ first: 0, rows: 10 })
  }
}
