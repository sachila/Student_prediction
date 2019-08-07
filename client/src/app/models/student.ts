export class Student {
  id?: string;
  name: string;
  gender: string;
  age: string;
  failures: string;
  extraActivities: string;
  internet: string;
  workTime: string;
  freetime: string;
  absence: string;
  term1: string;
  term2: string;
  final?: string;
}

export class StudentColumns {
  public static columns = [
    "name",
    "gender",
    "age",
    "failures",
    "extraActivities",
    "internet",
    "freetime",
    "workTime",
    "absence",
    "term1",
    "term2"
  ];
}
