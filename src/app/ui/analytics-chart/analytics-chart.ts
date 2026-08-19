import { Component, computed, input } from '@angular/core';
import { Enrollment } from '../../models/enrollment.model';

@Component({
    selector: 'tms-analytics-chart',
    standalone: true,
    templateUrl: './analytics-chart.html',
    styleUrl: './analytics-chart.scss',
})
export class AnalyticsChartComponent {
    data = input.required<Enrollment[]>();

    // computed() memoizes the result — the filter only re-runs when data() changes,
    // not on every change detection cycle. This is the signal-first pattern.
    approvedHeight = computed(() => {
        const count = this.data().filter(e => e.status === 'Approved').length;
        return Math.max(20, count * 3);
    });

    pendingHeight = computed(() => {
        const count = this.data().filter(e => e.status === 'Pending').length;
        return Math.max(20, count * 3);
    });

    rejectedHeight = computed(() => {
        const count = this.data().filter(e => e.status === 'Rejected').length;
        return Math.max(20, count * 3);
    });
}