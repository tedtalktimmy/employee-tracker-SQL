const mysql = require('mysql2');
const inquirer = require('inquirer');
const { inherits } = require('util');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employeetracker_db'
  },
  console.log(`Connected to the employeetracker_db database.`)
);

function mainQuestions() {
  inquirer.prompt([
    {
      message: 'what would you like to do?',
      type: 'list',
      name: 'action',
      choices: [
        'view all employees',
        'add employee',
        'update employee role',
        'view all roles',
        'add role',
        'view all departments',
        'add department',
        'quit'
      ],
    }
  ]).then(answer => {
    switch (answer.action) {
      case 'view all employees': {
        return viewAllEmployees();
      }
      case 'add employee': {
        return addEmployee();
      }
      case 'update employee role': {
        return updateEmployeeRole();
      }
      case 'view all roles': {
        viewAllRoles();
      }
      case 'add role': {
        addRole();
      }
      case 'view all departments': {
        viewAllDepartments();
      }
      case 'add department':{
        addDepartment();
      }
      default: {
        return process.exit();
      }
      console.log('Until next time!')
    }
  })
  .catch(err => {

  });
};


const viewAllEmployees = () => {
  db.promise().query(`SELECT * FROM employee`).then(function ([results, fields]) {
    console.table(results);
    init();
  });
}
