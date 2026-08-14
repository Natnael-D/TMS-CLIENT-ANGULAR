import { Service, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Course, CourseDetail, PagedResponse } from "../models/course.model";

@Service()
export class CourseService {
    private http = inject(HttpClient);
    private baseUrl = "http://localhost:5158/api/v2/courses";

    getAll(page: number = 1, pageSize: number = 50) {
        // ✅ For V2 API: data[] carries the rows
        // If using V1: map((p) => p.items)
        return this.http
            .get<PagedResponse<Course>>(this.baseUrl, {
                params: {
                    page: page.toString(),
                    pageSize: pageSize.toString(),
                },
            })
            .pipe(map((p: any) => p.data || p.items || []));
    }

    getById(id: string) {
        return this.http.get<CourseDetail>(`${this.baseUrl}/${id}`);
    }
}