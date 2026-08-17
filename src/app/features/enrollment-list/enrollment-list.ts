import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentStore } from '../../store/enrollment.store';

@Component({
    selector: 'tms-enrollment-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './enrollment-list.html',
    styleUrl: './enrollment-list.scss',
})
export class EnrollmentListComponent implements OnInit {
    store = inject(EnrollmentStore);

    ngOnInit() {
        this.store.loadEnrollments();
    }

    onApprove(id: string) {
        this.store.approveEnrollment(id);
    }

    onReject(id: string) {
        this.store.rejectEnrollment(id);
    }

    onSelect(id: string) {
        this.store.selectEnrollment(id);
    }
}