import { Component, inject } from '@angular/core';
import { EnrollmentStore } from '../../store/enrollment.store';
import { AnalyticsChartComponent } from '../../ui/analytics-chart/analytics-chart';

@Component({
    selector: 'tms-instructor-dashboard',
    standalone: true,
    imports: [AnalyticsChartComponent],
    templateUrl: './instructor-dashboard.html',
    styleUrl: './instructor-dashboard.scss',
})
export class InstructorDashboardComponent {
    store = inject(EnrollmentStore);
}