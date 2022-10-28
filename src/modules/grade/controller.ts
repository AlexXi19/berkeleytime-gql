import { response } from "express";
import { GradeModel } from "./model";
import { GradeModule } from "./generated-types/module-types";
// import { formatGrade } from "./formatter";

export async function grades() {
  const grades = await GradeModel.find({CourseControlNbr: 26384, "term.year": 2021, "term.semester": "Fall"});

  // total enrolled DOES NOT include students who withdrew/incomplete
  let totalEnrolled = 0;
  let possible_grades: { [key: string]: Number } = {};

  grades.map((grade)=> {
    if (grade.EnrollmentCnt && grade.GradeNm) {
      if (grade.GradeNm !== "Withdrawn" && grade.GradeNm !== "Incomplete") {
        possible_grades[grade.GradeNm] = grade.EnrollmentCnt;
        totalEnrolled += grade.EnrollmentCnt;
      }
    }
  })

  let response : GradeModule.Grade = {
    APlus: {
      percent: 0,
      numerator: 0,
      percentile_high: 0,
      percentile_low: 0
    },
    A: {
      percent: 0,
      numerator: 0,
      percentile_high: 0,
      percentile_low: 0
    },
    AMinus: {
      percent: 0,
      numerator: 0,
      percentile_high: 0,
      percentile_low: 0
    },
    BPlus: {
      percent: 0,
      numerator: 0,
      percentile_high: 0,
      percentile_low: 0
    },
    B: {
      percent: 0,
      numerator: 0,
      percentile_high: 0,
      percentile_low: 0
    },
    BMinus: {
      percent: 0,
      numerator: 0,
      percentile_high: 0,
      percentile_low: 0
    },
    CPlus: {
      percent: 0,
      numerator: 0,
      percentile_high: 0,
      percentile_low: 0
    },
    C: {
      percent: 0,
      numerator: 0,
      percentile_high: 0,
      percentile_low: 0
    },
    CMinus: {
      percent: 0,
      numerator: 0,
      percentile_high: 0,
      percentile_low: 0
    },
    D: {
      percent: 0,
      numerator: 0,
      percentile_high: 0,
      percentile_low: 0
    },
    F: {
      percent: 0,
      numerator: 0,
      percentile_high: 0,
      percentile_low: 0
    },
    P: {
      percent: 0,
      numerator: 0,
      percentile_high: 0,
      percentile_low: 0
    },
    NP: {
      percent: 0,
      numerator: 0,
      percentile_high: 0,
      percentile_low: 0
    }
  }

  let starting_percentile = 1;
  // map over response object and add percent, numerator, percentile_high, percentile_low
  Object.keys(response).map((grade)=> {

    let newGrade = grade.toString().replace("Plus", "+").replace("Minus", "-")
    if (grade === "P") {
      newGrade = "Pass";
    }
    if (grade === "NP") {
      newGrade = "Not Pass"
    }

    if (newGrade in possible_grades) {
      let percentage = Math.round((possible_grades[newGrade] / totalEnrolled) * 100) / 100;
      response[grade].percent = percentage;
      response[grade].numerator = possible_grades[newGrade];
      response[grade].percentile_high = starting_percentile;

      let percentile_low = Math.round((starting_percentile - percentage) * 100) / 100;
      response[grade].percentile_low = percentile_low;
      starting_percentile = percentile_low;
    }
  })

  return response;
}
