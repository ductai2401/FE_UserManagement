import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@core/domain-classes/user';
import { SecurityService } from '@core/security/security.service';
import { ClonerService } from '@core/services/clone.service';
import { SignalrService } from '@core/services/signalr.service';
import { TranslationService } from '@core/services/translation.service';
import { environment } from '@environments/environment';
import { BaseComponent } from 'src/app/base.component';

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends BaseComponent implements OnInit {
  @ViewChild('selectElem', { static: true }) el: ElementRef;
  @Input()
  public lead: any;
  navbarOpen = false;
  appUserAuth: User = null;
  language: LanguageFlag;
  languages: LanguageFlag[] = [
    {
      lang: 'en',
      name: 'English',
      flag: '../../../assets/images/flags/united-states.svg',
    },
    {
      lang: 'es',
      name: 'Spanish ',
      flag: '../../../assets/images/flags/france.svg',
    },
    {
      lang: 'ar',
      name: 'Arabic ',
      flag: '../../../assets/images/flags/saudi-arabia.svg',
    },
    {
      lang: 'ru',
      name: 'Russian',
      flag: '../../../assets/images/flags/russia.svg',
    },
    {
      lang: 'ja',
      name: 'Japanese',
      flag: '../../../assets/images/flags/japan.svg',
    },
    {
      lang: 'ko',
      name: 'Korean',
      flag: '../../../assets/images/flags/south-korea.svg',
    },
    {
      lang: 'cn',
      name: 'Chinese',
      flag: '../../../assets/images/flags/china.svg',
    },
    {
      lang: 'vi',
      name: 'Vietnamese',
      flag:'../../assets/images/flags/vietnam.svg'
    }
  ];

  constructor(
    private router: Router,
    private securityService: SecurityService,
    private signalrService: SignalrService,
    private translationService: TranslationService,
    private clonerService: ClonerService
  ) {
    super();
  }

  ngOnInit(): void {
    this.setTopLogAndName();
    this.setDefaultLanguage();
  }

  setDefaultLanguage() {
    const lang = this.translationService.getSelectedLanguage();
    if (lang) this.setLanguageWithRefresh(lang);
  }

  setLanguageWithRefresh(lang: string) {
    this.languages.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
    this.translationService.setLanguage(lang);
  }

  setNewLanguageRefresh(lang: string) {
    this.sub$.sink = this.translationService
      .setLanguage(lang)
      .subscribe((response) => {
        this.setLanguageWithRefresh(response['LANGUAGE']);
      });
  }
  setTopLogAndName() {
    this.sub$.sink = this.securityService.securityObject$.subscribe((c) => {
      if (c) {
        this.appUserAuth = this.clonerService.deepClone(c);
        if (this.appUserAuth.profilePhoto) {
          this.appUserAuth.profilePhoto = `${environment.apiUrl}${this.appUserAuth.profilePhoto}`;
        }
      }
    });
  }

  onLogout(): void {
    this.signalrService.logout(this.appUserAuth.id);
    this.securityService.logout();
    this.translationService.removeLanguage();
    this.router.navigate(['/login']);
  }

  onMyProfile(): void {
    this.router.navigate(['/my-profile']);
  }
}
