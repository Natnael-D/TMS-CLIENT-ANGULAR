import { Component } from "@angular/core";
import { RouterOutlet, RouterLink } from "@angular/router";
import { DashboardSummaryComponent } from "./features/dashboard-summary/dashboard-summary";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet, RouterLink, DashboardSummaryComponent],
    templateUrl: "./app.html",
    styleUrl: "./app.scss",
})
export class AppComponent {}