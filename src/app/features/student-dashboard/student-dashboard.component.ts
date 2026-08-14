import { Component, signal, computed, inject } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { RouterLink } from "@angular/router";
import { CourseCardComponent } from "../../ui/course-card/course-card";
import { Course } from "../../models/course.model";
import { CourseService } from "../../services/course.service";

@Component({
    selector: "app-student-dashboard",
    standalone: true,
    imports: [CourseCardComponent, RouterLink],
    templateUrl: "./student-dashboard.component.html",
    styleUrl: "./student-dashboard.component.scss",
})
export class StudentDashboardComponent {
    private api = inject(CourseService);

    studentName = signal("Liya Kebede");
    earnedCredits = signal(45);

    graduationStatus = computed(() =>
        this.earnedCredits() >= 120 ? "Eligible for Graduation" : "In Progress"
    );

    // ✅ Live API data with rxResource
    coursesResource = rxResource({
        stream: () => this.api.getAll(1, 50),
    });

    selectedCourse = signal<Course | null>(null);

    registerForClass() {
        this.earnedCredits.update((c) => c + 3);
    }

    handleEnroll(course: Course) {
        this.selectedCourse.set(course);
        console.log("Enrollment requested for:", course.title);
    }
}