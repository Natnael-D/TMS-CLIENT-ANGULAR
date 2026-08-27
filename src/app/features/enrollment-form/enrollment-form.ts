import { Component, inject, signal } from "@angular/core";
import {
    FormBuilder,
    FormControl,
    Validators,
    ReactiveFormsModule,
    FormArray,
} from "@angular/forms";
import { EnrollmentStore } from "../../store/enrollment.store";
import { Enrollment } from "../../models/enrollment.model";
import { CourseService } from "../../services/course.service";

@Component({
    selector: "app-enrollment-form",
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: "./enrollment-form.html",
    styleUrl: "./enrollment-form.scss",
})
export class EnrollmentFormComponent {
    private fb = inject(FormBuilder);
    private store = inject(EnrollmentStore);
    private courseApi = inject(CourseService);
    submitted = signal(false);

    form = this.fb.nonNullable.group({
        studentName: ["", Validators.required],
        studentId: [
            "",
            [Validators.required, Validators.pattern("^STU-[0-9]{4}$")],
        ],
        courseId: ["", Validators.required],
        term: ["Fall 2026", Validators.required],
        notes: [""],
        backupCourses: this.fb.array<FormControl<string>>([]),
    });

    get backups() {
        return this.form.controls.backupCourses;
    }

    addBackup() {
        this.backups.push(
            this.fb.control("", {
                nonNullable: true,
                validators: Validators.required,
            })
        );
    }

    removeBackup(index: number) {
        this.backups.removeAt(index);
    }

    submit() {
        if (this.form.valid) {
            const raw = this.form.getRawValue();
            const numericId = parseInt(raw.studentId.replace("STU-", ""), 10);

            this.courseApi.getById(raw.courseId).subscribe({
                next: (course) => {
                    const enrollment: Enrollment = {
                        id: crypto.randomUUID(),
                        studentId: numericId,
                        studentName: raw.studentName,
                        courseId: Number(raw.courseId),
                        courseName: course.title,
                        status: "Pending",
                        enrolledAt: new Date().toISOString(),
                    };
                    this.store.addEnrollment(enrollment);
                    this.submitted.set(true);
                },
                error: () => {
                    const enrollment: Enrollment = {
                        id: crypto.randomUUID(),
                        studentId: numericId,
                        studentName: raw.studentName,
                        courseId: Number(raw.courseId),
                        courseName: "",
                        status: "Pending",
                        enrolledAt: new Date().toISOString(),
                    };
                    this.store.addEnrollment(enrollment);
                    this.submitted.set(true);
                },
            });
        } else {
            this.form.markAllAsTouched();
        }
    }
}