import { Component, OnInit } from "@angular/core";
import { Student } from "../../models/student";
import { RemoteService } from "src/app/services/remote.service";
import { Response } from "../../models/Response";
import { Router } from "@angular/router";

@Component({
  selector: "app-student-list",
  templateUrl: "./student-list.component.html",
  styleUrls: ["./student-list.component.scss"]
})
export class StudentListComponent implements OnInit {
  constructor(private RemoteService: RemoteService, private router: Router) {}
  public students: Student[] = [];

  ngOnInit() {
    this.RemoteService.get("students").subscribe((data: Response) => {
      if (data.status) {
        this.students = data.message as Student[];
        console.log(this.students);
      }
    });
  }

  navigateToDashboard(student: Student) {
    this.router.navigate(["/dashboard"]);
  }

  navigateToDetails(student: Student) {
    this.router.navigate(["/studentDetails"], {
      queryParams: { studentId: student.id }
    });
  }
}
