const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function calculateAverage(grades) {
  const sum = grades.reduce((total, grade) => total + grade, 0);
  return sum / grades.length;
}

function calculateFinalGrade(participation, summative, exam) {
  const participationWeight = 0.3;
  const summativeWeight = 0.3;
  const examWeight = 0.4;

  return participation * participationWeight + summative * summativeWeight + exam * examWeight;
}

function getLetterGrade(grade) {
  if (grade >= 90) {
    return 'A';
  } else if (grade >= 80) {
    return 'B';
  } else if (grade >= 70) {
    return 'C';
  } else if (grade >= 60) {
    return 'D';
  } else {
    return 'F';
  }
}

function displayStudentGrades(studentGrades) {
  console.log('Name of Student\tClass Participation\tSummative Assessment\tExam Grade\tGrade Score\tLetter Grade');
  studentGrades.forEach((student) => {
    console.log(`${student.name}\t\t${student.participation.toFixed(2)}\t\t\t${student.summative.toFixed(2)}\t\t\t${student.exam}\t\t${student.grade.toFixed(2)}\t\t${student.letterGrade}`);
  });
}

function promptStudentGrades(count, studentGrades) {
  if (count > 5) {
    displayStudentGrades(studentGrades);
    rl.close();
    return;
  }

  let enablingGrades = [];
  let summativeGrades = [];
  let name = '';

  function promptEnablingAssessment(callback) {
    rl.question(`Enter enabling assessment ${count}: `, (grade) => {
      enablingGrades.push(parseFloat(grade));
      if (enablingGrades.length < 5) {
        promptEnablingAssessment(callback);
      } else {
        callback();
      }
    });
  }

  function promptSummativeAssessment(callback) {
    rl.question(`Enter summative assessment ${count}: `, (grade) => {
      if (grade === '') {
        // If no input provided, use a default value of 0
        summativeGrades.push(0);
      } else {
        summativeGrades.push(parseFloat(grade));
      }
      if (summativeGrades.length < 3) {
        promptSummativeAssessment(callback);
      } else {
        callback();
      }
    });
  }

  rl.question('Enter the name of the student: ', (studentName) => {
    name = studentName;
    promptEnablingAssessment(() => {
      promptSummativeAssessment(() => {
        rl.question('Enter major exam grade: ', (examGrade) => {
          const participation = calculateAverage(enablingGrades);
          const summative = calculateAverage(summativeGrades);
          const grade = calculateFinalGrade(participation, summative, parseFloat(examGrade));
          const letterGrade = getLetterGrade(grade);

          studentGrades.push({
            name,
            participation,
            summative,
            exam: parseFloat(examGrade),
            grade,
            letterGrade
          });

          promptStudentGrades(count + 1, studentGrades);
        });
      });
    });
  });
}

promptStudentGrades(1, []);
