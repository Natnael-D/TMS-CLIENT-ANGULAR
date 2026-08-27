import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Enrollment } from '../models/enrollment.model';

@Injectable({
    providedIn: 'root'
})
export class EnrollmentService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:5158/api/v2/enrollments';

    getAll(): Observable<Enrollment[]> {
        return this.http.get<any>(this.baseUrl).pipe(
            map(res => res.data || res.items || (Array.isArray(res) ? res : []))
        );
    }

    create(payload: { studentId: number; courseId: number }): Observable<Enrollment> {
        return this.http.post<any>(this.baseUrl, payload).pipe(
            map(res => res.data || res)
        );
    }

    approve(id: string): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/${id}/approve`, {});
    }

    reject(id: string): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/${id}/reject`, {});
    }
}