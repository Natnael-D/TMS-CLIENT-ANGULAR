import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: "dashboard",
        loadComponent: () =>
            import("./features/instructor-dashboard/instructor-dashboard").then(
                (m) => m.InstructorDashboardComponent
            ),
    },
    {
        path: "courses/:id",
        loadComponent: () =>
            import("./features/course-detail/course-detail").then(
                (m) => m.CourseDetailComponent
            ),
    },
    {
        path: "enroll",
        loadComponent: () =>
            import("./features/enrollment-form/enrollment-form").then(
                (m) => m.EnrollmentFormComponent
            ),
    },
    {
        path: "enrollments",
        loadComponent: () =>
            import("./features/enrollment-list/enrollment-list").then(
                (m) => m.EnrollmentListComponent
            ),
    },
    { path: "", redirectTo: "dashboard", pathMatch: "full" },
];