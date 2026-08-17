import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentStore } from '../../store/enrollment.store';

@Component({
    selector: 'tms-dashboard-summary',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard-summary.html',
    styleUrl: './dashboard-summary.scss',
})
export class DashboardSummaryComponent {
    store = inject(EnrollmentStore);
}