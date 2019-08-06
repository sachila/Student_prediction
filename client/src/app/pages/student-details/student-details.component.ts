import { Component, OnInit } from "@angular/core";
import { Student } from "../../models/student";
import { ActivatedRoute } from "@angular/router";
import { RemoteService } from "src/app/services/remote.service";
import { Response } from "src/app/models/Response";

@Component({
  selector: "app-student-details",
  templateUrl: "./student-details.component.html",
  styleUrls: ["./student-details.component.scss"]
})
export class StudentDetailsComponent implements OnInit {
  student: Student = new Student();
  private studnetId: string;

  constructor(
    private route: ActivatedRoute,
    private RemoteService: RemoteService
  ) {}

  ngOnInit() {
    if (
      this.route.queryParams["value"] &&
      this.route.queryParams["value"]["studentId"]
    ) {
      this.studnetId = this.route.queryParams["value"]["studentId"];
      this.RemoteService.post("studentById", null, this.studnetId).subscribe(
        (data: Response) => {
          if (data.status) {
            this.student = data.message[0];
          }
        }
      );
    } else {
      alert("No student Id");
    }
  }
}
