import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Student, StudentColumns } from "../../models/student";
import { Response } from "../../models/Response";
import { RemoteService } from "../../services/remote.service";

@Component({
  selector: "app-user",
  templateUrl: "user.component.html"
})
export class UserComponent implements OnInit {
  student: Student = new Student();

  constructor(private RemoteService: RemoteService, private router: Router) {}

  ngOnInit() {}

  submit() {
    if (!this.isValid()) return;
    this.RemoteService.post("saveStudent", null, this.student).subscribe(
      (data: Response) => {
        if (data && data.status) {
          this.router.navigate(["/dashboard"]);
            this.router.navigate(["./dashboard"], {
      			queryParams: { studentId: data.message.studentId }
    		});
        }
      }
    );
  }

  private isValid() {
    let valid = true;
    let keys = Object.keys(this.student);
    for (var i in StudentColumns.columns) {
      if (!keys.hasOwnProperty(i)) {
        alert("please fill the " + StudentColumns.columns[i]);
        valid = false;
        break;
      }
    }

    return valid;
  }
}
