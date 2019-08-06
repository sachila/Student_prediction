export class Student {
  id?: string;
  name: string;
  gender: string;
  age: string;
  failures: string;
  extracurricular: string;
  internet: string;
  freetime: string;
  absence: string;
  term1: string;
  term2: string;
}

export class StudentColumns {
  public static columns = [
    "name",
    "gender",
    "age",
    "failures",
    "extracurricular",
    "internet",
    "freetime",
    "absence",
    "term1",
    "term2"
  ];
}
