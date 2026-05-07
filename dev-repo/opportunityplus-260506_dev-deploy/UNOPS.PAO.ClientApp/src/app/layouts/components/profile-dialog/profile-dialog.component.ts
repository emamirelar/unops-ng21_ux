import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

interface UserInfo {
  userId: number;
  name: string;
  firstName?: string;
  lastName?: string;
  userEmail: string;
  orgUnit: string;
  orgUnitDescription?: string;
  supervisorId?: number;
  supervisorName?: string;
  supervisorEmail?: string;
  dutyStation?: string;
  position?: string;
  textToSpeech?: boolean;
  language?: string;
  createdDate?: string;
  lastModifiedDate?: string;
}

@Component({
  selector: 'app-profile-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    TranslateModule
  ],
  templateUrl: './profile-dialog.component.html'
})
export class ProfileDialogComponent {
  visible: boolean = false;
  userInfo: UserInfo | null = null;

  show(userInfo: UserInfo) {
    this.userInfo = userInfo;
    this.visible = true;
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  }

  getLanguageName(languageCode?: string): string {
    const languageKeys: { [key: string]: string } = {
      en: 'languages.english',
      fr: 'languages.french',
      es: 'languages.spanish',
      ar: 'languages.arabic',
      zh: 'languages.chinese',
      hi: 'languages.hindi',
      ru: 'languages.russian',
      pt: 'languages.portuguese',
      de: 'languages.german',
      ja: 'languages.japanese'
    };

    const key = languageKeys[languageCode?.toLowerCase() || ''];
    return key ? key : (languageCode || 'languages.not_specified');
  }
}
