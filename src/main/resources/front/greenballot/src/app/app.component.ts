import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {MenuItem, PrimeNGConfig} from 'primeng/api';
import {CalendarModule} from 'primeng/calendar';
import {AutoCompleteModule} from "primeng/autocomplete";
import {InputGroupModule} from "primeng/inputgroup";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {CardModule} from 'primeng/card';
import {ToolbarModule} from 'primeng/toolbar';
import {ThemeService} from "./service/theme.service";
import {AvatarModule} from "primeng/avatar";
import {BadgeModule} from "primeng/badge";
import {MenubarModule} from "primeng/menubar";
import {ReactiveFormsModule} from "@angular/forms";
import {StepsModule} from "primeng/steps";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {PasswordModule} from "primeng/password";
import {InputNumberModule} from "primeng/inputnumber";
import {ButtonModule} from "primeng/button";
import {MessagesModule} from "primeng/messages";
import {SkeletonModule} from "primeng/skeleton";
import {ToastModule} from "primeng/toast";
import {DialogModule} from "primeng/dialog";
import {TableModule} from "primeng/table";
import {ListboxModule} from "primeng/listbox";
import {InputTextModule} from "primeng/inputtext";
import {StyleClassModule} from "primeng/styleclass";
import {RippleModule} from "primeng/ripple";
import {AccountService} from "./service/account.service";
import {CaptchaComponent} from "./util/captcha/captcha.component";
import {AccountComponent} from "./pages/account/account.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    CalendarModule,
    AutoCompleteModule,
    InputGroupModule,
    InputGroupAddonModule,
    CardModule,
    ToolbarModule,
    AvatarModule,
    BadgeModule,
    MenubarModule,
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    StepsModule,
    ProgressSpinnerModule,
    PasswordModule,
    InputNumberModule,
    ButtonModule,
    MessagesModule,
    SkeletonModule,
    ToastModule,
    DialogModule,
    TableModule,
    ListboxModule,
    InputTextModule,
    StyleClassModule,
    RippleModule,
    BadgeModule,

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  selectedItem: any;
  title = 'greenballot';
  isLoggedIn: boolean = false;
  items: MenuItem[] | undefined;
  suggestions = ['first', 'second', 'third'];
  @ViewChild(AccountComponent) accountComponent!: AccountComponent;

  constructor(private primengConfig: PrimeNGConfig,
              private cdr: ChangeDetectorRef,
              private themeService: ThemeService,
              private accountService: AccountService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.isLoggedIn = params['loggedIn'] === 'true';
    });


    this.cdr.detectChanges();
    if (localStorage.getItem('access_token') != '')
      this.isLoggedIn = true;

    this.primengConfig.ripple = true;
    this.primengConfig.zIndex = {
      modal: 1100,    // dialog, sidebar
      overlay: 1000,  // dropdown, overlaypanel
      menu: 1000,     // overlay menus
      tooltip: 1100   // tooltip
    };
    this.items = [
      {
        label: 'Home Page',
        icon: 'pi pi-home',
        url: '/landing'
      },
      {
        label: 'About Us',
        icon: 'pi pi-star',
        url: '/about-us'
      },

      {
        label: 'Vote Now',
        icon: 'pi pi-bolt',
        url: '/vote-now'
      },
      {
        label: 'Blog and News',
        icon: 'pi pi-server',
        url: '/blog-and-news'
      },
      {
        label: 'Get Involved',
        icon: 'pi pi-server',
        url: '/get-involved'
      },

      {
        label: 'Explore Initiatives',
        icon: 'pi pi-search',
        url: '/explore-initiatives',
        items: [{
          label: 'Get Involved',
          icon: 'pi pi-palette',
          items: [
            {
              label: 'Apollo',
              icon: 'pi pi-palette',
              badge: '2',
              url: '/'
            },
            {
              label: 'Ultima',
              icon: 'pi pi-palette',
              badge: '3',
              url: '/'
            }
          ]
        }
        ]
      },
      {
        label: 'Contact',
        icon: 'pi pi-envelope',
        url: '/contact'
      },
      {
        label: 'Account',
        icon: 'pi pi-server',
        url: '/account'
      },
    ];
    // this.changeTheme("");

  }

  // changeTheme(theme: string) {
  //   this.themeService.switchTheme("lara-light-teal");
  // }

  logout() {

    localStorage.setItem("access_token", '');
    this.accountService.logout();
    if (this.router.url == '/account') {
      this.router.navigate(['/login']);
    }
    this.isLoggedIn = false;

  }



}
