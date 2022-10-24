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

inquirer.prompt([
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
    }]).then((response) => {
      switch (response.choice) {
        case 'view all departments':
          viewAllDepartments();
          break;


        case 'view all roles':
          viewAllRoles();
          break;

        case 'view all employees':
          viewAllEmployees();
          break;

        case 'add a department':
          addDepartment();
          break;

        case 'add a role':
          addRole();
          break;

        case 'add an employee':
          addEmployee();
          break;

        case 'update employee role':
          updateEmployeeRole();
          break;

        case 'exit':
          console.log('Until next time!');
          process.exit(0);
      }
    })
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
  console.log("inside add department");
  // db.promise().query(`SELECT name, id FROM departments`).then(([deptResults, fields]) => {
  //   const departments = deptResults.map(departments => {
  //     return { name: departments, value: departments.id }
  //   })
    inquirer.prompt([
      {
        message: 'enter the name of the department',
        type: 'input',
        name: 'name'
      },
    ])
      .then((response) => {
        db.promise().query(`INSERT INTO departments (name)VALUES(?)`, [response.name]).then(([results, fields]) => {
          console.table(results);
          init();
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
      let response = inquirer.prompt([
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
    const managers = results.map(employees => { return { name: employees.first_name + ' ' + employees.last_name, value: employees.id } })
    db.promise().query(`SELECT title, id FROM roles`).then(([roleResults, fields]) => {
      const roles = roleResults.map(roles => { return { name: roles.title, value: roles.id } })
       let response = inquirer.prompt([
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
    const employees = results.map(employees => {
      return {
        name: employees.first_name + ' ' + employees.last_name, value: employees.id
      }
    })
    db.promise().query(`SELECT title, id FROM roles`).then(([rolesResults, fields]) => {
      const roles = rolesResults.map(role => {
        return { name: roles.title, value: roles.id }
      });
      inquirer.prompt([
        {
          message: 'which employee?',
          choices: employees,
          type: 'list',
          name: 'employeesName,'
        },
        {
          message: 'please select new role for employee',
          choices: roles,
          type: 'list',
          name: 'roles'
        },
      ]).then((response) => {
        db.promise().query(`UPDATE employees SET role_id = ? WHERE employees.id = ?`, [response.roles, response.employeesName]).then(([results, fields]) => {
          console.table(results);
          init();
        });
      });
    });

  });
};

init();