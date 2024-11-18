import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {CardModule} from "primeng/card";
import {AccountService} from "../../service/account.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {Button, ButtonDirective, ButtonModule} from "primeng/button";
import {Ripple, RippleModule} from "primeng/ripple";
import {NgForOf, NgIf} from "@angular/common";
import {MessageService, PrimeIcons} from "primeng/api";
import {PasswordModule} from "primeng/password";
import {ToastModule} from "primeng/toast";
import {ChangePasswordRequest} from "../../dto/ChangePasswordRequest";
import {catchError, Subject, switchMap, throwError} from "rxjs";
import {CaptchaComponent} from "../../util/captcha/captcha.component";
import {TableModule} from "primeng/table";
import {GreenProject, GreenProjectService} from "../../service/green-project.service";
import {InputIconModule} from "primeng/inputicon";
import {TagModule} from "primeng/tag";


@Component({
  selector: 'app-account',
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
  ],
  providers: [MessageService],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit, AfterViewInit {

  editMode: boolean = false;
  passwordEditModeEnabled: boolean = false;

  @ViewChild(CaptchaComponent) captcha!: CaptchaComponent;

  userInfo: any = {
    userId: "",
    firstname: "",
    lastname: "",
    email: "",
    walletAddress: ""
  }

  password: any = {
    oldPassword: '',
    newPassword: '',
    repeatPassword: ''
  }

  changePasswordRequest: ChangePasswordRequest = {
    currentPassword: '',
    newPassword: '',
    confirmationPassword: ''
  }

  projects: GreenProject[] = [];
  totalRecords!: number;
  loading!: boolean;
  cols!: any[];

  private userIdSubject = new Subject<string>();

  constructor(private accountService: AccountService,
              private router: Router,
              private messageService: MessageService,
              private activatedRoute: ActivatedRoute,
              private projectService: GreenProjectService,
              private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.cols = [
      {field: 'name', header: 'Name'},
      {field: 'category', header: 'Category'},
      {field: 'fundingGoal', header: 'Funding Goal'},
      {field: 'startDate', header: 'Start Date'},
      {field: 'endDate', header: 'End Date'},
      {field: 'voteCount', header: 'Total Votes'},
      {field: 'projectStatus', header: 'Project Status'}
    ];
    this.userIdSubject
      .pipe(
        switchMap((userId) => {
          this.loading = true;
          return this.projectService.getProjectsByUserId(userId, 0, 10); // Default to page 0 and size 10
        })
      )
      .subscribe(
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

  loadProjects(event: any) {
    this.loading = true;
    const page = event.first / event.rows;
    const size = event.rows;
    if (this.userInfo.userId) {
      this.projectService.getProjectsByUserId(this.userInfo.userId, page, size).subscribe(
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
  }

  ngAfterViewInit() {

    if (localStorage.getItem('access_token') != '') {
      this.accountService.getAccountInfo().subscribe((res: any) => {
          this.userInfo.userId = res.id;
          this.userInfo.firstname = res.firstname;
          this.userInfo.lastname = res.lastname;
          this.userInfo.email = res.email;
          this.userInfo.walletAddress = res.walletAddress;
          this.userIdSubject.next(this.userInfo.userId);
          this.cdr.detectChanges();
        },
        (error: HttpErrorResponse) => {
          if (error.status === 403) {
            localStorage.setItem('access_token', '');
            console.error('Access denied - 403 Forbidden');
            // Redirect to the login page
            this.router.navigate(['/login']);
          } else {
            console.error('An error occurred:', error);
          }
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  updateInfo() {
    this.editMode = !this.editMode;
    this.logEditModes();
  }

  submit() {
    if (this.captcha.isValidated) {
      if (this.passwordEditModeEnabled) {
        this.accountService.updatePassword(this.changePasswordRequest).pipe(
          catchError((error) => {
            // Handle error and show the toast notification
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update password. Please try again.',
            });

            // Log the error (optional)
            console.error('Password change error:', error);

            // Return a throwError to complete the observable chain
            return throwError(() => error);
          })
        ).subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Password updated!',
          });
          console.log('password change resposne:', res);
        });
      } else {
        const updateUserInfo = {
          firstname: this.userInfo.firstname,
          lastname: this.userInfo.lastname,
          oldEmail: this.userInfo.email,
          email: this.userInfo.email,
          walletAddress: this.userInfo.walletAddress
        }
        this.accountService.updateAccountInfo(updateUserInfo).subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Account information successfully updated!',
          });
        });
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Incorrect captcha',
        detail: 'Account information successfully updated!',
      });
    }
    this.editMode = false;
    this.passwordEditModeEnabled = false;
  }

  passwordEditMode() {
    this.passwordEditModeEnabled = !this.passwordEditModeEnabled;
    if (this.editMode == false)
      this.editMode = !this.editMode;
    this.logEditModes();
  }

  logEditModes() {
    console.log('edit mode: ', this.editMode);
    console.log('password edit mode: ', this.passwordEditModeEnabled);
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

}

