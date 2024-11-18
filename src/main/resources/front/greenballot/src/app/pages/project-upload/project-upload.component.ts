import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CardModule} from "primeng/card";
import {MessageService, PrimeTemplate} from "primeng/api";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule, ValidationErrors,
  Validators
} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {interval, Subscription} from "rxjs";
import {CalendarModule} from "primeng/calendar";
import {InputNumberModule} from "primeng/inputnumber";
import {InputMaskModule} from "primeng/inputmask";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {ButtonModule} from "primeng/button";
import {FileUploadModule, UploadEvent} from "primeng/fileupload";
import {ToastModule} from "primeng/toast";
import {AccordionModule} from "primeng/accordion";
import {DialogModule} from "primeng/dialog";
import {AngularOpenlayersModule} from "ng-openlayers";
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {Icon, Style} from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {fromLonLat, toLonLat} from 'ol/proj';
import {FormCacheService} from "../../service/form-cache.service";
import {AccountService} from "../../service/account.service";
import {FormSyncService} from "../../service/form-sync.service";
import {BehaviorSubject} from 'rxjs';
import {NewProjectService} from "../../service/new-project.service";
import {Router} from "@angular/router";
import {ConstantsService} from "../../service/constants.service";
import {CaptchaComponent} from "../../util/captcha/captcha.component";

interface ProjectCategory {
  name: string;
}

@Component({
  selector: 'app-project-upload',
  standalone: true,
  imports: [
    CardModule,
    PrimeTemplate,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    CalendarModule,
    InputNumberModule,
    InputMaskModule,
    NgForOf,
    NgIf,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    FileUploadModule,
    ToastModule,
    AccordionModule,
    DialogModule,
    AngularOpenlayersModule,
    NgClass,
    CaptchaComponent,
  ],
  providers: [MessageService],
  templateUrl: './project-upload.component.html',
  styleUrl: './project-upload.component.scss'
})
export class ProjectUploadComponent implements OnInit, OnDestroy {

  proposalUploadUrl = "api/v1/project/upload-proposal";
  presentationUploadUrl = "api/v1/project/upload-presentation";

  invalidFields: { [key: string]: boolean } = {};
  fundingForm: FormGroup;
  uploadedFiles: any[] = [];

  budgetDialogVisible: boolean = false;
  locationDialogVisible: boolean = false;

  @ViewChild(CaptchaComponent) captcha!: CaptchaComponent;
  @ViewChild('mapElement', {static: true}) mapElement!: ElementRef;
  map!: Map;
  selectedCoordinates: { latitude: number; longitude: number } | null = null;

  markerSource = new VectorSource();
  markerLayer = new VectorLayer({
    source: this.markerSource
  });

  projectCategories: ProjectCategory[] | undefined;
  activeIndices: number[] = [];

  private syncSubscription: Subscription | undefined;

  projectDetails: any = {
    userId: '',
    // Basic Project Information
    name: '',
    category: '',
    description: '',
    location: '',
    targetOutcomes: '',
    keywords: '',

    // Timeline
    startDate: '',
    endDate: '',

    // Project Lead
    projectLeadName: '',
    projectLeadContact: '',

    // Funding Information
    fundingGoal: '',
    fundingAllocation: '',

    // Supporting Media and Resources
    videoUrl: '',
    websiteUrl: '',
    socialMediaLinks: '',
    proposal: '',
    presentation: '',

    // Team and Impact
    teamMembers: '',
    impactGoals: '',

    // Project Sustainability and Risks
    challengesAndRisks: '',
    sustainabilityPlan: '',

    // Administrative Information
    submittedBy: ''
  };

  private projectDetailsSubject = new BehaviorSubject<any>(this.projectDetails);
  projectDetails$ = this.projectDetailsSubject.asObservable();

  constructor(private cs: ConstantsService,
              private http: HttpClient,
              private fb: FormBuilder,
              private messageService: MessageService,
              private formCacheService: FormCacheService,
              private accountService: AccountService,
              private formSyncService: FormSyncService,
              private newProjectService: NewProjectService,
              private router: Router
  ) {
    this.proposalUploadUrl = this.cs.getAPIUrl() + this.proposalUploadUrl;
    this.presentationUploadUrl = this.cs.getAPIUrl() + this.presentationUploadUrl;
    this.fundingForm = this.fb.group({
      allocations: this.fb.array([this.createAllocationGroup()])
    });

  }

  isProjectDetailsComplete(): boolean {
    const isEmpty = (value: any) => value === null || value === '' || value === undefined;
    let isComplete = true;
    this.invalidFields = {};

    for (const key in this.projectDetails) {
      if (this.projectDetails.hasOwnProperty(key)) {
        const value = this.projectDetails[key];

        if (typeof value === 'object' && value !== null) {
          for (const subKey in value) {
            if (value.hasOwnProperty(subKey) && isEmpty(value[subKey])) {
              this.invalidFields[subKey] = true;
              isComplete = false;
            }
          }
        } else if (isEmpty(value)) {
          this.invalidFields[key] = true;
          isComplete = false;
        }
      }
    }
    return isComplete;
  }

  startCachingFormData() {

    interval(12300).subscribe(() => {
      this.formCacheService.saveProjectDetails(this.projectDetails);
    });


    this.syncSubscription = interval(120000).subscribe(() => {
      if (this.projectDetails.userId) {
        this.formSyncService.syncFormData(this.projectDetails, this.projectDetails.userId);
      }
    });
  }

  ngOnInit(): void {
    this.accountService.getAccountInfo().subscribe((res: any) => {
      this.projectDetails.userId = res.id;
      this.projectDetails.submittedBy = res.email;

      this.formCacheService.getProjectDetails(this.projectDetails.userId).subscribe((data: any) => {
        if (data) {
          this.projectDetails = {...this.projectDetails, ...data};
          this.projectDetails.startDate = new Date(this.projectDetails.startDate);
          this.projectDetails.endDate = new Date(this.projectDetails.endDate);
          this.populateAllocationsFromProjectDetails();

          this.projectDetails$.subscribe(() => this.startCachingFormData());
        }
      });
    });

    this.markerLayer = new VectorLayer({
      source: this.markerSource
    });
    this.projectCategories = [
      {name: "ClimateAction"},
      {name: "RenewableEnergy"},
      {name: "SustainableAgriculture"},
      {name: "WasteReductionRecycling"},
      {name: "WaterConservation"},
      {name: "BiodiversityConservation"},
      {name: "WildlifeProtection"},
      {name: "ForestRestorationReforestation"},
      {name: "OceanMarineConservation"},
      {name: "UrbanGreenSpaces"},
      {name: "AirQualityImprovement"},
      {name: "PollutionControl"},
      {name: "SustainableTransportMobility"},
      {name: "EcoFriendlyHousingArchitecture"},
      {name: "EnvironmentalEducationAwareness"},
      {name: "CircularEconomyProjects"},
      {name: "SoilHealthLandRestoration"},
      {name: "ClimateAdaptationResilience"},
      {name: "FoodSecurityAgroforestry"},
      {name: "PlasticFreeInitiatives"},
      {name: "CarbonSequestrationProjects"},
      {name: "CleanWaterAccess"},
      {name: "RenewableEnergyInfrastructure"},
      {name: "EnergyEfficiency"},
      {name: "EcotourismDevelopment"},
      {name: "SustainableFisheriesAquaculture"}
    ]
  }

  showBudgetDialog() {
    this.budgetDialogVisible = true;
  }

  enableLocationPicking() {
    this.map.un('click', this.handleMapClick); // Remove any existing listeners
    this.map.on('click', this.handleMapClick.bind(this)); // Add a new click listener
  }

  handleMapClick(event: any) {
    const [longitude, latitude] = toLonLat(event.coordinate);
    this.selectedCoordinates = {latitude, longitude};
    console.log('Selected Coordinates:', this.selectedCoordinates);
    console.log('this.projectDetails.location:', this.projectDetails.location);
    console.log('event coordinate:', event.coordinate);

    this.markerSource.clear();

    const marker = new Feature({
      geometry: new Point(event.coordinate)
    });

    marker.setStyle(new Style({
      image: new Icon({
        src: '/assets/images/pin.png', // Check this URL
        scale: 0.05
      })
    }));

    this.markerSource.addFeature(marker);

  }

  saveSelectedCoordinates() {
    this.projectDetails.location = {};
    this.projectDetails.location = this.selectedCoordinates;
    this.locationDialogVisible = false;
  }

  showLocationDialog() {
    this.locationDialogVisible = true;
  }

  onDialogShow() {
    if (!this.map) {
      this.map = new Map({
        layers: [
          new TileLayer({
            source: new OSM()
          }),
          this.markerLayer
        ],
        view: new View({
          center: fromLonLat([0, 0]),
          zoom: 2
        })
      });
    }

    this.map.setTarget(this.mapElement.nativeElement);


    this.enableLocationPicking();
  }

  convertToDateOnly(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  createAllocationGroup() {
    return this.fb.group({
      title: ['', Validators.required],
      percentage: [0, [Validators.required, Validators.min(0), Validators.max(100), this.nonNegativeValidator]]
    });
  }

  nonNegativeValidator(control: AbstractControl): ValidationErrors | null {
    return control.value >= 0 ? null : {nonNegative: true};
  }

  preventNegativeInput(event: KeyboardEvent): void {
    const charCode = event.charCode;

    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  get allocations(): FormArray {
    return this.fundingForm.get('allocations') as FormArray;
  }

  addAllocation() {
    this.allocations.push(this.createAllocationGroup());
  }

  removeAllocation(index: number) {
    this.allocations.removeAt(index);
  }

  getTotalPercentage(): number {
    return this.allocations.controls
      .map(control => Number(control.get('percentage')?.value || 0)) // Ensure value is treated as a number
      .reduce((acc, value) => acc + value, 0);
  }

  isTotalPercentageValid(): boolean {
    return this.getTotalPercentage() <= 100;
  }

  saveAllocationsToProjectDetails() {
    const allocationsArray = this.allocations.controls.map(control => ({
      title: control.get('title')?.value,
      percentage: control.get('percentage')?.value
    }));

    this.projectDetails.fundingAllocation = allocationsArray;
    console.log(this.projectDetails);
    this.budgetDialogVisible = false;
  }

  populateAllocationsFromProjectDetails() {

    this.allocations.clear();

    if (this.projectDetails.fundingAllocation && Array.isArray(this.projectDetails.fundingAllocation)) {
      this.projectDetails.fundingAllocation.forEach((allocation: any) => {
        const allocationGroup = this.createAllocationGroup();
        allocationGroup.patchValue({
          title: allocation.title,
          percentage: allocation.percentage
        });
        this.allocations.push(allocationGroup);
      });
    }
  }

  onUpload(event: UploadEvent) {
    this.messageService.add({severity: 'info', summary: 'Success', detail: 'Proposal Uploaded'});
  }

  onProposalUpload(event: any) {
    const file = event.files[0]; // Get the first file from the selected files
    const token = localStorage.getItem('access_token'); // Adjust this if token is stored elsewhere

    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.post(this.proposalUploadUrl, formData, {headers})
      .subscribe({
        next: (response: any) => {
          console.log('File uploaded successfully:', response);
          this.projectDetails.proposal = response.filename;
          this.messageService.add({severity: 'info', summary: 'Success', detail: 'Proposal Uploaded'});
        },
        error: error => {
          console.error('File upload failed:', error);
          this.messageService.add({severity: 'error', summary: 'Failed', detail: 'Failed to upload file!'});
        }
      });
  }

  onPresentationUpload(event: any) {
    const file = event.files[0]; // Get the first file from the selected files
    const token = localStorage.getItem('access_token'); // Adjust this if token is stored elsewhere


    const formData: FormData = new FormData();
    formData.append('file', file, file.name);


    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.post(this.presentationUploadUrl, formData, {headers})
      .subscribe({
        next: (response: any) => {
          console.log('File uploaded successfully:', response);
          this.projectDetails.presentation = response.filename;
          this.messageService.add({severity: 'info', summary: 'Success', detail: 'Proposal Uploaded'});
        },
        error: error => {
          console.error('File upload failed:', error);
          this.messageService.add({severity: 'error', summary: 'Failed', detail: 'Failed to upload file!'});
        }
      });
  }

  ngOnDestroy(): void {
    if (this.syncSubscription) {
      this.syncSubscription.unsubscribe();
    }
  }

  submit() {
    if (this.captcha.isValidated) {
      if (this.isProjectDetailsComplete()) {
        this.projectDetails.category = this.projectDetails.category.name;
        this.projectDetails.startDate = this.convertToDateOnly(this.projectDetails.startDate);
        this.projectDetails.endDate = this.convertToDateOnly(this.projectDetails.endDate);

        this.newProjectService.uploadProject(this.projectDetails).subscribe(
          {
            next: (res: any) => {
              console.log('submit result:', res);

              this.messageService.add({
                severity: 'success',
                summary: 'Project Submitted Successfully',
                detail: 'Your project has been submitted for review. You will be notified once it has been evaluated.',
              });

              this.router.navigate(['/account']);
            },
            error: (err) => {
              console.log("Failed to register project!");
              this.messageService.add({
                severity: 'error',
                summary: 'Project Submission Failed',
                detail: 'An error occurred while submitting your project. Please try again later or contact support if the issue persists.',
              });
            }
          });
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Incomplete Submission',
          detail: 'Please fill out all red sections before submitting your project.',
        });
        this.openAllTabs();
      }
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Captcha Failed!',
        detail: 'Please reenter captcha.',
      });
    }
  }

  clearFormAndCache() {
    this.formCacheService.clearServerCache(this.projectDetails.userId);

    this.projectDetails = {
      userId: '',
      name: '',
      category: '',
      description: '',
      location: '',
      targetOutcomes: '',
      keywords: '',
      startDate: null,
      endDate: null,
      projectLeadName: '',
      projectLeadContact: '',
      fundingGoal: '',
      fundingAllocation: '',
      videoUrl: '',
      websiteUrl: '',
      socialMediaLinks: '',
      proposal: '',
      presentation: '',
      teamMembers: '',
      impactGoals: '',
      challengesAndRisks: '',
      sustainabilityPlan: '',
      submittedBy: 'user goes here',
    };


  }

  fillWithDummyData() {
    this.projectDetails = {
      userId: '1',
      name: 'Green Energy Initiative',
      category: {name: 'Renewable Energy'},
      description: 'A project focused on developing sustainable energy solutions for rural areas.',
      location: {
        latitude: 40.712776,
        longitude: -74.005974
      },
      targetOutcomes: 'Reduce carbon footprint by 30% within 5 years',
      keywords: 'green, renewable, sustainable, energy',
      startDate: new Date('2024-11-15'),
      endDate: new Date('2025-05-15'),
      projectLeadName: 'Alice Johnson',
      projectLeadContact: '+1 (555) 123-4567',
      fundingGoal: '1000000',
      fundingAllocation: [
        {title: 'Equipment', percentage: 40},
        {title: 'Labor', percentage: 30},
        {title: 'Marketing', percentage: 20},
        {title: 'Miscellaneous', percentage: 10}
      ],
      videoUrl: 'https://example.com/project-video',
      websiteUrl: 'https://example.com',
      socialMediaLinks: 'https://twitter.com/GreenEnergyProj',
      proposal: 'https://example.com/proposal.pdf',
      presentation: 'https://example.com/presentation.pptx',
      teamMembers: 'Alice Johnson, Bob Smith, Clara Lee',
      impactGoals: 'Provide clean energy to 500 households, create 50 new jobs',
      challengesAndRisks: 'Lack of funding, regulatory hurdles, weather disruptions',
      sustainabilityPlan: 'Solar panels with a 25-year warranty and recycling program for old equipment',
      submittedBy: 'user@example.com',
    };
  }

  openAllTabs() {
    this.activeIndices = [0, 1, 2, 3, 4, 5, 6];
  }
}
