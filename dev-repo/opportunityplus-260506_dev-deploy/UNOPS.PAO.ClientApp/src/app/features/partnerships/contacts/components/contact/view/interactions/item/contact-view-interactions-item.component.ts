import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { InteractionViewModel } from '../interaction-view.model';
import { InteractionType } from '../../../../../../interactions/models/interaction-type.enum';

interface TypeStyle {
  icon: string;
  bgColor: string;
  textColor: string;
}

@Component({
  selector: 'app-contact-view-interactions-item',
  standalone: true,
  imports: [
    NgClass,
    DatePipe,
    TranslatePipe
  ],
  templateUrl: './contact-view-interactions-item.component.html'
})
export class ContactViewInteractionsItemComponent {
  @Input() interaction!: InteractionViewModel;
  @Output() itemClick = new EventEmitter<InteractionViewModel>();

  getTypeStyle(type: string): TypeStyle {
    const typeLower = type?.toLowerCase() || '';
    
    switch (typeLower) {
      case InteractionType.Email.toLowerCase():
        return {
          icon: 'pi pi-envelope',
          bgColor: 'bg-cherry-500/10',
          textColor: 'text-cherry-500'
        };
      case InteractionType.Call.toLowerCase():
        return {
          icon: 'pi pi-phone',
          bgColor: 'bg-green-500/10',
          textColor: 'text-green-500'
        };
      case InteractionType.Chat.toLowerCase():
        return {
          icon: 'pi pi-comments',
          bgColor: 'bg-ocean-500/10',
          textColor: 'text-ocean-700'
        };
      case InteractionType.VirtualMeeting.toLowerCase():
        return {
          icon: 'pi pi-video',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-600'
        };
      case InteractionType.InPersonMeeting.toLowerCase():
        return {
          icon: 'pi pi-users',
          bgColor: 'bg-midnight-100',
          textColor: 'text-midnight-500'
        };
      default:
        return {
          icon: 'pi pi-question-circle',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-800'
        };
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  getSenderName(interaction: InteractionViewModel): string {
    const name = interaction.sender?.trim();
    return name ? name : this.translate.instant('common.unknown');
  }

  getRecipientName(interaction: InteractionViewModel): string {
    const first = interaction.recipients?.[0]?.trim();
    return first ? first : this.translate.instant('common.unknown');
  }

  getRemainingRecipientsCount(interaction: InteractionViewModel): number {
    return interaction.recipients ? interaction.recipients.length - 1 : 0;
  }

  hasMultipleRecipients(interaction: InteractionViewModel): boolean {
    return (interaction.recipients?.length || 0) > 1;
  }

  onClick(): void {
    this.itemClick.emit(this.interaction);
  }
}
