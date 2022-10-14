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
      case 'add department': {
        addDepartment();
      }
      default: {
        return process.exit();
      }
        console.log('Until next time!')
    }
  })
};

function viewAllEmployees() {
  db.promise().query(`SELECT * FROM employee`).then(([results, fields]) => {
    console.table(results);
  });
}

function addEmployee() {
  db.promise().query(`SELECT first_name, last_name, id FROM employee`).then(([results, fields]) => {
    const managers = results.map(employee => { return { name: employee.first_name + ' ' + employee.last_name, value: employee.id } })
    db.promise().query(`SELECT title, id FROM role`).then(([roleResults, fields]) => {
      const roles = roleResults.map(role => { return { name: role.title, value: role.id } })
      inquirer.prompt([
        {
          message: 'please enter the first name of the employee',
          type: 'input',
          name: 'empFirstName'
        },
        {
          message: 'please enter the last name of the employee',
          type: 'input',
          name: 'empLastName'
        },
        {
          message: 'what is the role of the employee?',
          choices: roles,
          type: 'list',
          name: 'empRole'
        },
        {
          message: 'who is the manager of the employee?',
          choice: managers,
          type: 'list',
          name: 'empManager'
        }
      ]).then((response) => {
        db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)`, VALUES(`?,?,?`),
          [response.empFirstName, response.empLastName, response.empRole, response.empManager]).then(([results, fields]) => {
            console.log('');
            mainQuestions();
          })
      })
    })
  })
};

function updateEmployeeRole() {
  db.promise().query(`SELECT first_name, last_name, id FROM employee`).then(([results, fields]) => {
    const employees = results.map(employee => {
      return {
        name: empFirstName + ' ' + empLastName, value: employee.id
      }
    })
    db.promise().query(`SELECT title, id, FROM role`).then(([roleResults, fields]) => {
      const roles = roleResults.map(role => {
        return { name: role.title, value: role.id }
      });
      inquirer.prompt([
        {
          message: 'which employee?',
          choices: employees,
          type: 'list',
          name: 'empName,'
        },
        {
          message: 'please select new role for employee',
          choices: roles,
          type: 'list',
          name: 'empRole'
        },
      ]).then((response) => {
        db.promise().query(`UPDATE employee SET role_id = ? WHERE employee.id = ?`, [response.empRole, response.empName]).then(([results, fields]) => {
          console.log();
          mainQuestions();
        })
      })
    })

  })
}

function viewAllRoles() {
  db.promise().query(`SELECT * FROM role`).then(([results, fields]) => {
    console.table(results);
    console.log();
    mainQuestions();
  });
}

function addRole() {
  db.promise().query(`SELECT title, salary, id FROM role`).then(([roleResults, fields]) => {
    const role = roleResults.map(role => {
      return { name: role.title, value: role.salary, value: role.id }
    })
    db.promise().query(`SELECT name, id FROM department`).then(([deptResults, fields]) => {
      const departments = deptResults.map(departments => {
        return { name: departments.name, value: departments.id }
      })
      inquirer.prompt([
        {
          message: 'enter role',
          type: 'input',
          name: 'roleName'
        },
        {
          message: 'enter salary for role',
          type: 'input',
          name: 'roleSalary'
        },
        {
          message: 'select the department for this role',
          choices: departments,
          type: 'list',
        },
      ])
    })
  })
}

function viewAllDepartments() {

}

function addDepartment() {

}