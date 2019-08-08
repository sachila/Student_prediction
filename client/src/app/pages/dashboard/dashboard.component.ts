import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import Chart from "chart.js";
import { RemoteService } from "../../services/remote.service";
import { Student } from "../../models/student";
import { Response } from "../../models/Response";

@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html"
})
export class DashboardComponent implements OnInit {
  public canvas: any;
  public ctx;
  public datasets: any;
  public myChartData;

  //student data

  students: Student[] = [];
  selectedStudentId: string;
  selectedStudent: Student = new Student();

  constructor(
    private RemoteService: RemoteService, 
    private route: ActivatedRoute,
  ) {}

  studentChange() {
    if (!this.selectedStudentId || this.selectedStudentId === "0") return null;

    this.selectedStudent = this.students.find(
      f => f.id.toString() === this.selectedStudentId
    );

    if (!this.selectedStudent) return null;

    this.RemoteService.post("predict", null, this.selectedStudentId).subscribe(
      (data: Response) => {
        if (data.status) {
          this.selectedStudent.final = data.message;
          console.log(this.selectedStudent);
          this.updateBarChart();
          this.updatePieChart();
          this.updateBarGreen();
          this.updatePerformanceChart();
        }
      }
    );
  }

  ngOnInit() {
    //load all students
    this.RemoteService.get("students").subscribe((data: Response) => {
      if (data.status) {
        this.students = data.message;
        this.studentChange()
      }
    });

    if (this.route.queryParams["value"] &&this.route.queryParams["value"]["studentId"]) {
         this.selectedStudentId = this.route.queryParams["value"]["studentId"]
    }

    this.updateBarChart();
    this.updatePieChart();
    this.updateBarGreen();
    this.updatePerformanceChart();
  }

  updatePerformanceChart() {
    var gradientChartOptionsConfigurationWithTooltipRed: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: "#f5f5f5",
        titleFontColor: "#333",
        bodyFontColor: "#666",
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.0)",
              zeroLineColor: "transparent"
            },
            ticks: {
              suggestedMin: 10,
              suggestedMax: 90,
              padding: 20,
              fontColor: "#9a9a9a"
            }
          }
        ],

        xAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(233,32,16,0.1)",
              zeroLineColor: "transparent"
            },
            ticks: {
              padding: 20,
              fontColor: "#9a9a9a"
            }
          }
        ]
      }
    };

    var chart_labels = ["JAN", "APR", "AUG", "DEC"];
    this.datasets = [
      this.selectedStudent.term1,
      this.selectedStudent.term1,
      this.selectedStudent.term2,
      this.selectedStudent.final
    ];

    this.canvas = document.getElementById("chartBig1");
    this.ctx = this.canvas.getContext("2d");

    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(233,32,16,0.2)");
    gradientStroke.addColorStop(0.4, "rgba(233,32,16,0.0)");
    gradientStroke.addColorStop(0, "rgba(233,32,16,0)"); //red colors

    var config = {
      type: "line",
      data: {
        labels: chart_labels,
        datasets: [
          {
            label: "My First dataset",
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: "#ec250d",
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: "#ec250d",
            pointBorderColor: "rgba(255,255,255,0)",
            pointHoverBackgroundColor: "#ec250d",
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: this.datasets
          }
        ]
      },
      options: gradientChartOptionsConfigurationWithTooltipRed
    };

    this.myChartData = new Chart(this.ctx, config);
  }

  updateBarGreen() {
    var gradientChartOptionsConfigurationWithTooltipGreen: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: "#f5f5f5",
        titleFontColor: "#333",
        bodyFontColor: "#666",
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.0)",
              zeroLineColor: "transparent"
            },
            ticks: {
              fontColor: "#9e9e9e"
            }
          }
        ],

        xAxes: [
          {
            gridLines: {
              drawBorder: false,
              color: "rgba(0,242,195,0.1)",
              zeroLineColor: "transparent"
            },
            ticks: {
              suggestedMin: 0,
              suggestedMax: 10,
              fontColor: "#9e9e9e"
            }
          }
        ]
      }
    };

    this.canvas = document.getElementById("timeChart");
    this.ctx = this.canvas.getContext("2d");

    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(66,134,121,0.15)");
    gradientStroke.addColorStop(0.4, "rgba(66,134,121,0.0)"); //green colors
    gradientStroke.addColorStop(0, "rgba(66,134,121,0)"); //green colors

    var data = {
      labels: ["Work Time", "Free Time"],
      datasets: [
        {
          label: "Hours",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: "#00d6b4",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: "#00d6b4",
          pointBorderColor: "rgba(255,255,255,0)",
          pointHoverBackgroundColor: "#00d6b4",
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: [this.selectedStudent.workTime, this.selectedStudent.freetime]
        }
      ]
    };

    var myChart = new Chart(this.ctx, {
      type: "horizontalBar",
      data: data,
      options: gradientChartOptionsConfigurationWithTooltipGreen
    });
  }

  updatePieChart() {
    var pieChartOptionsConfigurationWithTooltipRed: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: "#f5f5f5",
        titleFontColor: "#333",
        bodyFontColor: "#666",
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.0)",
              zeroLineColor: "transparent"
            },
            ticks: {
              suggestedMin: 60,
              suggestedMax: 125,
              padding: 20,
              fontColor: "#9a9a9a"
            }
          }
        ],

        xAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(233,32,16,0.1)",
              zeroLineColor: "transparent"
            },
            ticks: {
              padding: 20,
              fontColor: "#9a9a9a"
            }
          }
        ]
      }
    };

    this.canvas = document.getElementById("chartLineRed");
    this.ctx = this.canvas.getContext("2d");

    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(233,32,16,0.2)");
    gradientStroke.addColorStop(0.4, "rgba(233,32,16,0.0)");
    gradientStroke.addColorStop(0, "rgba(233,32,16,0)"); //red colors

    var data = {
      datasets: [
        {
          label: "Data",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: "#ec250d",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: "#ec250d",
          pointBorderColor: "rgba(255,255,255,0)",
          pointHoverBackgroundColor: "#ec250d",
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: [
            this.selectedStudent.failures,
            this.selectedStudent.internet,
            this.selectedStudent.absence
          ]
        }
      ],
      labels: ["Failure Subjects", "Internet", "Absence"]
    };

    var myChart = new Chart(this.ctx, {
      type: "doughnut",
      data: data,
      options: pieChartOptionsConfigurationWithTooltipRed
    });
  }

  updateBarChart() {
    var gradientBarChartConfiguration: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: "#f5f5f5",
        titleFontColor: "#333",
        bodyFontColor: "#666",
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.1)",
              zeroLineColor: "transparent"
            },
            ticks: {
              suggestedMin: 0,
              suggestedMax: 25,
              padding: 20,
              fontColor: "#9e9e9e"
            }
          }
        ],

        xAxes: [
          {
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.1)",
              zeroLineColor: "transparent"
            },
            ticks: {
              padding: 20,
              fontColor: "#9e9e9e"
            }
          }
        ]
      }
    };

    this.canvas = document.getElementById("InternalAssesmentChart");
    this.ctx = this.canvas.getContext("2d");
    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
    gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
    gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors


    var gradientStroke2 = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke2.addColorStop(1, this.getAssessmentChartBargradient());
    gradientStroke2.addColorStop(0.4, this.getAssessmentChartBarColor());
    gradientStroke2.addColorStop(0, this.getAssessmentChartBarColor()); //blue colors

    var myChart = new Chart(this.ctx, {
      type: "bar",
      responsive: true,
      legend: {
        display: false
      },
      data: {
        labels: ["Term 1", "Term 2", "Final"],
        datasets: [
          {
            label: "Marks",
            fill: true,
            backgroundColor: [
                gradientStroke,
                gradientStroke,
                gradientStroke2,
            ],
            hoverBackgroundColor:  [
                gradientStroke,
                gradientStroke,
                gradientStroke2,
            ],
            borderColor:[
              "#1f8ef1",
              "#1f8ef1",
              this.getAssessmentChartBorderColor(),
            ],
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            data: [
              this.selectedStudent.term1,
              this.selectedStudent.term2,
              this.selectedStudent.final
            ]
          }
        ]
      },
      options: gradientBarChartConfiguration
    });
  }

  getAssessmentChartBargradient(){

      let mean: number = (parseInt(this.selectedStudent.term1) + parseInt(this.selectedStudent.term2)) / 2

      if(mean < parseInt(this.selectedStudent.final)){
        return "rgba(66,134,121,0.2)"; //green 
      }else if(mean > parseInt(this.selectedStudent.final)){
        return "rgba(233,32,16,0.2)"; //red 
      }

      return "rgba(29,140,248,0.2)"; // blue 
  }

  getAssessmentChartBarColor(){

      let mean: number = (parseInt(this.selectedStudent.term1) + parseInt(this.selectedStudent.term2)) / 2

      if(mean < parseInt(this.selectedStudent.final)){
        return "rgba(66,134,121,0)"; //green 
      }else if(mean > parseInt(this.selectedStudent.final)){
        return "rgba(233,32,16,0)"; //red 
      }

      return "rgba(29,140,248,0)"; // blue 
  }

  getAssessmentChartBorderColor(){
    let mean: number = (parseInt(this.selectedStudent.term1) + parseInt(this.selectedStudent.term2)) / 2

    if(mean < parseInt(this.selectedStudent.final)){
      return "#00d6b4"; //green boarder
    }else if(mean > parseInt(this.selectedStudent.final)){
      return "#ec250d"; //red boarder
    }

    return "#1f8ef1"; // blue boarder
  }
}


