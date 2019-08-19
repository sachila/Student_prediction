import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RemoteService } from "../../services/remote.service";
import { Response } from "../../models/Response";
import { Student } from "../../models/student";

import {
  GenderSummary,
  AgeSummary,
  TermAvgModel,
  ExtraActivitySummary,
  AgeToFreetimeSummary,
  AgeToWorktimeSummary,
  AgeToInternetSummary,
  SumSummary,
} from "../../models/SummaryModels";
import Chart from "chart.js";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html"
})
export class AdminDashboardComponent implements OnInit {
  public canvas: any;
  public ctx;

  genderSummaryData = new GenderSummary();
  termAvgData = new TermAvgModel();
  extraActivityData = new ExtraActivitySummary();

  freeTimeBubble = new SumSummary();
  workTimeBubble = new SumSummary();
  internetBubble = new SumSummary();

  ageToFreetimeSummaryData: AgeToFreetimeSummary[] = [];
  ageToWorktimeSummaryData: AgeToWorktimeSummary[] = [];
  ageToInternetSummaryData: AgeToInternetSummary[] = [];
  ageSummaryData: AgeSummary[] = [];
  students: Student[] = [];

  constructor(
    private RemoteService: RemoteService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    //load gender summary
    this.RemoteService.get("getGenderSummary").subscribe((data: Response) => {
      if (data.status) {
        this.genderSummaryData = data.message;
        this.updateGenderPieChart();
      }
    });

    this.RemoteService.get("getTermsAverage").subscribe((data: Response) => {
      if (data.status) {
        this.termAvgData = data.message;
        this.updateTermAvgBarChart();
      }
    });

    this.RemoteService.get("getExtraActivitySummary").subscribe(
      (data: Response) => {
        if (data.status) {
          this.extraActivityData = data.message;
          this.updateExtraActivityPieChart();
        }
      }
    );

    this.RemoteService.get("getAgeFreetimeSummary").subscribe(
      (data: Response) => {
        if (data.status) {
          this.ageToFreetimeSummaryData = data.message;
          this.updateAgeFreetimeLineChart(); 
        }
      }
    );

    this.RemoteService.get("getAgeWorktimeSummary").subscribe(
      (data: Response) => {
        if (data.status) {
          this.ageToWorktimeSummaryData = data.message;
          this.updateAgeWorktimeLineChart(); 
        }
      }
    );

    this.RemoteService.get("getAgeInternetSummary").subscribe(
      (data: Response) => {
        if (data.status) {
          this.ageToInternetSummaryData = data.message;
          this.updateAgeInternetLineChart(); 
        }
      }
    );

    this.RemoteService.get("getAgeSummary").subscribe((data: Response) => {
      if (data.status) {
        this.ageSummaryData = data.message;
        this.updateAgeBar();
      }
    });

    this.RemoteService.post("studentsByLimit", null, '100').subscribe((data: Response) => {
      if (data.status) {
        this.students = data.message as Student[];  
      }
    });


    this.RemoteService.get("getAverageFreetimeSummary").subscribe((data: Response) => {
      if (data.status) {
        this.freeTimeBubble = data.message[0];
    	this.updateWorkTimeBubbleChart();
      }
    });

    this.RemoteService.get("getAverageWorktimeSummary").subscribe((data: Response) => {
      if (data.status) {
        this.workTimeBubble = data.message[0];
    	this.updateWorkTimeBubbleChart();
      }
    });

    this.RemoteService.get("getAverageInternetSummary").subscribe((data: Response) => {
      if (data.status) {
        this.internetBubble = data.message[0];
    	this.updateWorkTimeBubbleChart();
      }
    });

    this.updateGenderPieChart();
    this.updateTermAvgBarChart();
    this.updateExtraActivityPieChart();
    this.updateAgeBar();

    //age charts
    this.updateAgeFreetimeLineChart();
    this.updateAgeWorktimeLineChart();
    this.updateAgeInternetLineChart();
    //bubble charts 
    this.updateWorkTimeBubbleChart();
  }

  updateWorkTimeBubbleChart(){

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
              suggestedMin: 0,
              suggestedMax: 20,
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

    this.canvas = document.getElementById("timeScatterChart");
    this.ctx = this.canvas.getContext("2d");

    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(176,255,87,0.15)");
    gradientStroke.addColorStop(0.4, "rgba(176,255,87,0.0)"); //green colors
    gradientStroke.addColorStop(0, "rgba(176,255,87,0)"); //green colors

    var data = { 
      datasets: [
        {
          label: "Free Time",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: "#32cb00",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: "#32cb00",
          pointBorderColor: "rgba(255,255,255,0)",
          pointHoverBackgroundColor: "#32cb00",
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: [{
            x: this.freeTimeBubble.sum,
            y: this.freeTimeBubble.avg,
            r: 25
          }], 
          
        },
        {
          label: "Work Time",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: "#32cb00",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: "#32cb00",
          pointBorderColor: "rgba(255,255,255,0)",
          pointHoverBackgroundColor: "#32cb00",
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data:  [{
            x: this.workTimeBubble.sum,
            y: this.workTimeBubble.avg,
            r: 30
          }], 
          
        },
        {
          label: "Internet Access",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: "#32cb00",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: "#32cb00",
          pointBorderColor: "rgba(255,255,255,0)",
          pointHoverBackgroundColor: "#32cb00",
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data:  [{
            x: this.internetBubble.sum,
            y: this.internetBubble.avg,
            r: 10
          }], 
          
        }
      ]
    };

    var myChart = new Chart(this.ctx, {
      type: "bubble",
      data: data,
      options: gradientChartOptionsConfigurationWithTooltipGreen
    });
  }

  // private mapWorkTimeData(){
  // 	return this.students.map((student) => {
  // 		return {
  // 			x : student.workTime,
  // 			y : student.freetime,
  // 			t: 20,
  // 		}
  // 	})
  // }

  updateAgeBar() {

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
              suggestedMin: 0,
              suggestedMax: 20,
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

    this.canvas = document.getElementById("ageSummaryChart");
    this.ctx = this.canvas.getContext("2d");

    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(66,134,121,0.15)");
    gradientStroke.addColorStop(0.4, "rgba(66,134,121,0.0)"); //green colors
    gradientStroke.addColorStop(0, "rgba(66,134,121,0)"); //green colors

    var data = {
      labels: this.ageSummaryData.map(m => m.age),
      datasets: [
        {
          label: "Age Count",
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
          data: this.ageSummaryData.map(m => m.ageCount), 
          
        }
      ]
    };

    var myChart = new Chart(this.ctx, {
      type: "horizontalBar",
      data: data,
      options: gradientChartOptionsConfigurationWithTooltipGreen
    });

  }

  updateAgeFreetimeLineChart() {
    let gradientChartOptionsConfigurationWithTooltipGreen: any = {
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
              suggestedMin: 15,
              suggestedMax: 25,
              padding: 20,
              fontColor: "#9e9e9e"
            }
          }
        ],

        xAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(0,242,195,0.1)",
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

    this.canvas = document.getElementById("ageFreetimeLineChart");
    this.ctx = this.canvas.getContext("2d");

    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(29,140,248,0.15)");
    gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)"); //yellow colors
    gradientStroke.addColorStop(0, "rgba(229,140,248,0)"); //yellow colors

    var data = {
      labels: this.ageToFreetimeSummaryData.map(m => m.age),
      datasets: [
        {
          label: "Student Count",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: "#1f8ef1",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: "#1f8ef1",
          pointBorderColor: "rgba(255,255,255,0)",
          pointHoverBackgroundColor: "#1f8ef1",
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: this.ageToFreetimeSummaryData.map(m => m.freetime)
        }
      ]
    };

    var myChart = new Chart(this.ctx, {
      type: "line",
      data: data,
      options: gradientChartOptionsConfigurationWithTooltipGreen
    });
  }

  updateAgeWorktimeLineChart() {
    let gradientChartOptionsConfigurationWithTooltipGreen: any = {
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
              suggestedMin: 15,
              suggestedMax: 25,
              padding: 20,
              fontColor: "#9e9e9e"
            }
          }
        ],

        xAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(0,242,195,0.1)",
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

    this.canvas = document.getElementById("ageWorktimeLineChart");
    this.ctx = this.canvas.getContext("2d");

    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(238,152,251,0.15)");
    gradientStroke.addColorStop(0.4, "rgba(238,152,251,0.0)"); //pink (text primary) colors
    gradientStroke.addColorStop(0, "rgba(238,152,251,0)"); //pink (text primary) colors

    var data = {
      labels: this.ageToWorktimeSummaryData.map(m => m.age),
      datasets: [
        {
          label: "Student Count",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: "#d725bb",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: "#d725bb",
          pointBorderColor: "rgba(255,255,255,0)",
          pointHoverBackgroundColor: "#d725bb",
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: this.ageToWorktimeSummaryData.map(m => m.workTime)
        }
      ]
    };

    var myChart = new Chart(this.ctx, {
      type: "line",
      data: data,
      options: gradientChartOptionsConfigurationWithTooltipGreen
    });
  }

  updateAgeInternetLineChart() {
    let gradientChartOptionsConfigurationWithTooltipGreen: any = {
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
              suggestedMin: 15,
              suggestedMax: 25,
              padding: 20,
              fontColor: "#9e9e9e"
            }
          }
        ],

        xAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(0,242,195,0.1)",
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

    this.canvas = document.getElementById("ageInternetSummary");
    this.ctx = this.canvas.getContext("2d");

    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(111,249,255,0.15)");
    gradientStroke.addColorStop(0.4, "rgba(111,249,255,0.0)"); //blue (text info) colors
    gradientStroke.addColorStop(0, "rgba(111,249,255,0)"); //blue (text info) colors

    var data = {
      labels: this.ageToInternetSummaryData.map(m => m.age),
      datasets: [
        {
          label: "Student Count",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: "#26c6da",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: "#26c6da",
          pointBorderColor: "rgba(255,255,255,0)",
          pointHoverBackgroundColor: "#26c6da",
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: this.ageToInternetSummaryData.map(m => m.internet)
        }
      ]
    };

    var myChart = new Chart(this.ctx, {
      type: "line",
      data: data,
      options: gradientChartOptionsConfigurationWithTooltipGreen
    });
  }

  updateExtraActivityPieChart() {
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
              fontColor: "#9e9e9e"
            }
          }
        ]
      }
    };

    this.canvas = document.getElementById("extraActivityChart");
    this.ctx = this.canvas.getContext("2d");

    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(176,133,245,0.15)");
    gradientStroke.addColorStop(0.4, "rgba(176,133,245,0.0)"); //purple colors
    gradientStroke.addColorStop(0, "rgba(176,133,245,0)"); //purple colors

    var data = {
      labels: ["Yes", "No"],
      datasets: [
        {
          label: "Data",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: "#7e57c2",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: "#b085f5",
          pointBorderColor: "rgba(255,255,255,0)",
          pointHoverBackgroundColor: "#b085f5",
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: [
            this.extraActivityData.extraYes,
            this.extraActivityData.extraNo
          ]
        }
      ]
    };

    var myChart = new Chart(this.ctx, {
      type: "pie",
      data: data,
      options: gradientChartOptionsConfigurationWithTooltipGreen
    });
  }

  updateTermAvgBarChart() {
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

    this.canvas = document.getElementById("InternalAssesmentSummaryChart");
    this.ctx = this.canvas.getContext("2d");
    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(0,94,203,0.2)");
    gradientStroke.addColorStop(0.4, "rgba(0,94,203,0.0)");
    gradientStroke.addColorStop(0, "rgba(0,94,203,0)"); //blue colors 

    var myChart = new Chart(this.ctx, {
      type: "bar",
      responsive: true,
      legend: {
        display: false
      },
      data: {
        labels: ["Term 1 Average", "Term 2 Average"],
        datasets: [
          {
            label: "Average Marks",
            fill: true,
            backgroundColor: gradientStroke,
            hoverBackgroundColor: gradientStroke,
            borderColor: '#448aff',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            data: [this.termAvgData.t1Avg, this.termAvgData.t2Avg]
          }
        ]
      },
      options: gradientBarChartConfiguration
    });
  }

  updateGenderPieChart() {
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

    this.canvas = document.getElementById("genderSummaryChart");
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
            this.genderSummaryData.femaleCount,
            this.genderSummaryData.maleCount
          ]
        }
      ],
      labels: ["Female", "Male"]
    };

    var myChart = new Chart(this.ctx, {
      type: "doughnut",
      data: data,
      options: pieChartOptionsConfigurationWithTooltipRed
    });
  }
}
