const mysql = require('mysql2');
const inquirer = require('inquirer');
const table = require('console.table');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);

const init = () => {

let response = inquirer.prompt(
  {
      message: 'what would you like to do?',
      type: 'list',
      name: 'choice',
      choices: [
        'view all departments',
        'view all roles',
        'view all employees',
        'add a department',
        'add a role',
        'add an employee',
        'update an employee role'
      ],
    }).then((response => {
      switch (response.choice) {
        case 'view all departments':
          viewAllDepartments();


        case 'view all roles':
          viewAllRoles();

        case 'view all employees':
          return viewAllEmployees();

        case 'add department':
          addDepartment();

        case 'add role':
          addRole();

        case 'add employee':
          addEmployee();

        case 'update employee role':
          updateEmployeeRole();

        case 'exit':
          console.log('Until next time!');
          process.exit(0);
      }
    })
    )
};


const viewAllDepartments = () => {
  db.promise().query(`SELECT * FROM departments`).then(([results, fields]) => {
    console.table(results);
    init();
  });
};

const viewAllRoles = () => {
  db.promise().query(`SELECT * FROM roles`).then(([results, fields]) => {
    console.table(results);
    init();
  });
}

const viewAllEmployees = () => {
  db.promise().query(`SELECT * FROM employees`).then(([results, fields]) => {
    console.table(results);
    init();
  });
};

const addDepartment = () => {
  db.promise().query(`SELECT name, id FROM departments`).then(([deptResults, fields]) => {
    const departments = deptResults.map(departments => {
      return { name: departments.name, value: departments.id }
    })
    inquirer.prompt([
      {
        message: 'enter the name of the department',
        type: 'input',
        name: 'departmentName'
      },
    ])
      .then((response) => {
        db.promise().query(`INSERT INTO departments (name)VALUES(?)`, [response.departmentName]).then(([results, fields]) => {
          console.table(results);
          init();
        });
      });
  });
};

const addRole = () => {
  db.promise().query(`SELECT title, salary, id FROM roles`).then(([roleResults, fields]) => {
    const role = roleResults.map(roles => {
      return { name: roles.title, value: roles.salary, value: roles.id }
    })
    db.promise().query(`SELECT name, id FROM departments`).then(([deptResults, fields]) => {
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
          type: 'list'
        },
      ]).then((response) => {
        db.promise().query(`INSERT INTO roles (title, salary, department_id)VALUES(?,?,?)`, [response.roleName, response.roleSalary, response.departments]).then(([results, fields]) => {
          console.table(results);
          init();
        });
      });
    });
  });
};


const addEmployee = () => {
  db.promise().query(`SELECT first_name, last_name, id FROM employees`).then(([results, fields]) => {
    const managers = results.map(employee => { return { name: employee.first_name + ' ' + employee.last_name, value: employee.id } })
    db.promise().query(`SELECT title, id FROM roles`).then(([roleResults, fields]) => {
      const roles = roleResults.map(roles => { return { name: roles.title, value: roles.id } })
      inquirer.prompt([
        {
          message: 'please enter the first name of the employee',
          type: 'input',
          name: 'first_name'
        },
        {
          message: 'please enter the last name of the employee',
          type: 'input',
          name: 'last_name'
        },
        {
          message: 'what is the role of the employee?',
          choices: roles,
          type: 'list',
          name: 'role'
        },
        {
          message: 'who is the manager of the employee?',
          choices: managers,
          type: 'list',
          name: 'manager'
        }
      ]).then((response) => {
        db.promise().query(`INSERT INTO employees (first_name, last_name, role_id, manager_id)`, VALUES(`?,?,?`),
          [response.employee.first_name, response.employee.last_name, response.employee.role, response.employee.manager]).then(([results, fields]) => {
            console.table(results);
            init();
          });
      });
    });
  });
};

const updateEmployeeRole = () => {
  db.promise().query(`SELECT first_name, last_name, id FROM employees`).then(([results, fields]) => {
    const employees = results.map(employee => {
      return {
        name: employee.first_name + ' ' + employee.last_name, value: employee.id
      }
    })
    db.promise().query(`SELECT title, id FROM roles`).then(([roleResults, fields]) => {
      const roles = roleResults.map(role => {
        return { name: role.title, value: role.id }
      });
      inquirer.prompt([
        {
          message: 'which employee?',
          choices: employees,
          type: 'list',
          name: 'employee_name,'
        },
        {
          message: 'please select new role for employee',
          choices: roles,
          type: 'list',
          name: 'role'
        },
      ]).then((response) => {
        db.promise().query(`UPDATE employees SET role_id = ? WHERE employee.id = ?`, [response.role, response.employee_name]).then(([results, fields]) => {
          console.table(results);
          init();
        });
      });
    });

  });
};

init();