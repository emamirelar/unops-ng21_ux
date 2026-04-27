import { CreditScoreWidget } from '@/app/pages/dashboards/banking/components/creditscorewidget';
import { CurrencyCardWidget } from '@/app/pages/dashboards/banking/components/currencycardwidget';
import { IncomeExpenditureWidget } from '@/app/pages/dashboards/banking/components/incomeexpenditurewidget';
import { SpendingLimitWidget } from '@/app/pages/dashboards/banking/components/spendinglimitwidget';
import { TransactionsHistoryWidget } from '@/app/pages/dashboards/banking/components/transactionshistorywidget';
import { Component } from '@angular/core';

@Component({
    selector: 'app-banking-dashboard',
    standalone: true,
    imports: [CurrencyCardWidget, IncomeExpenditureWidget, SpendingLimitWidget, CreditScoreWidget, TransactionsHistoryWidget],
    template: `<section>
        <div class="flex flex-col gap-7">
            <currency-card-widget class="animate-fade-in-up stagger-1" />
            <div class="w-full flex xl:flex-row flex-col gap-6 animate-fade-in-up stagger-2">
                <income-expenditure-widget />
                <spending-limit-widget />
            </div>
            <div class="flex xl:flex-row flex-col gap-6 animate-fade-in-up stagger-3">
                <credit-score-widget />
                <transactions-history-widget />
            </div>
        </div>
    </section>`
})
export class BankingDashboard {}
