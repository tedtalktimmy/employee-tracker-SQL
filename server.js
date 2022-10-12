const mysql = require('mysql2');
const inquirer = require('inquirer');

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
      case 'view all employees':
        viewAllEmployees();
        break;
        case 'add employee':
        addEmployee();
    }
  })
}