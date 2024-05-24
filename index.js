const inquirer = require('inquirer');
const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Cxzshww1.',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

function options() {
  inquirer.prompt({
    name: 'options',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'view all departments',
      'view all roles',
      'view all employees',
      'add a department',
      'add a role',
      'add an employee',
      'update an employee role',
      'delete a department',
      'delete a role',
      'delte an employee',
      'Exit'
    ]
  }).then(answer => {
    switch (answer.options) {
      case 'view all departments':
        viewDepartment();
        break;

      case 'view all roles':
        viewRole();
        break;

      case 'view all employees':
        viewEmployee();
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

      case 'update an employee role':
        updateRole();
        break;

      case 'delete a department':
        deleteDepartment();
        break;

      case 'delete a role':
        deleteRole();
        break;

      case 'delte an employee':
        deleteEmployee();
        break;

      case 'Exit':
        break;
    }
  });
}

// showing department names and department ids
function viewDepartment() {
  const sql = 'SELECT * FROM department';

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log('Showing all departments');
    console.table(result);
    options();
  })
}

// showing the job title, role id, the department that role belongs to, and the salary for that role
function viewRole() {
  const sql = 'SELECT * FROM employee_role';

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log('Showing all roles');
    console.table(result);
    options();
  })
}

// showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
function viewEmployee() {
  const sql = 'SELECT * FROM employee';

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log('Showing all employee information');
    console.table(result);
    options();
  })
}

// enter the name of the department and that department is added to the database
function addDepartment() {
  inquirer.prompt([
    {
      name: "department",
      type: "input",
      message: "What department you would like to add?",
      validate: (value) => {
        if (value) {
          return true;
        } else {
          console.log("Please enter the department name.");
        }
      }
    }
  ]).then(answer => {
    const sql = `INSERT INTO department (name) VALUE ('${answer.department}')`;

    db.query(sql, (err) => {
      if (err) throw err;
      console.log(`${answer.department} department has been added`);
      options();
    })
  });
}

// enter the name, salary, and department for the role and that role is added to the database
function addRole() {
  const sql = "SELECT * FROM department";
  db.query(sql, (err, results) => {
    if (err) throw err;

    inquirer.prompt([
      {
        name: "title",
        type: "input",
        message: "What is the title for the new role?",
        validate: (value) => {
          if (value) {
            return true;
          } else {
            console.log("Please enter the title.");
          }
        }
      },
      {
        name: "salary",
        type: "input",
        message: "What is this new role's salary",
        validate: (value) => {
          if (isNaN(value) === false) {
            return true;
          }
          console.log("Please enter a number");
        }
      },
      {
        name: "department_ID",
        type: "rawlist",
        choices: () => {
          let choiceArray = [];
          for (let i = 0; i < results.length; i++) {
            choiceArray.push(results[i].name);
          }
          return choiceArray;
        },
        message: "What department is this new role belongs to?",
      }
    ]).then(answer => {
      let chosenDept;
      for (let i = 0; i < results.length; i++) {
        if (results[i].name === answer.department_ID) {
          chosenDept = results[i];
        }
      }

      const sql =
        `INSERT INTO employee_role (title, salary, department_id) 
        VALUE ('${answer.title}','${answer.salary}','${chosenDept.id}')`;

      db.query(sql, (err) => {
        if (err) throw err;
        console.log(`New Role ${answer.title} has been added`);
        options();
      }
      )
    });
  });
}

// enter the employee’s first name, last name, role, and manager, and that employee is added to the database
function addEmployee() {
  inquirer.prompt([
    {
      name: "firstName",
      type: "input",
      message: "What is the first name of the new employee?",
      validate: (value) => {
        if (value) {
          return true;
        } else {
          console.log("Please enter the first name of the new employee.");
        }
      }
    },
    {
      name: "lastName",
      type: "input",
      message: "What is the last name of the new employee?",
      validate: (value) => {
        if (value) {
          return true;
        } else {
          console.log("Please enter the last name of the new employee.");
        }
      }
    },
    {
      name: "role_id",
      type: "number",
      message: "What is the role id?",
      validate: (value) => {
        if (value) {
          return true;
        } else {
          console.log("Please enter the role id.");
        }
      }
    },
    {
      name: "manager_id",
      type: "input",
      message: "What is the manager id?(If no manger, just skip)",
    }
  ]).then(answer => {
    let manager_id;
    if (answer.manager_id === '') {
      manager_id = null;
    } else {
      manager_id = answer.manager_id;
    }
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
      VALUES ('${answer.firstName}', '${answer.lastName}', ${answer.role_id}, ${manager_id})`;

    db.query(sql, (err) => {
      if (err) throw err;
      console.log(`New employee ${answer.firstName} ${answer.lastName} has been added`);
      options();
    })
  });
}

// select an employee to update and their new role and this information is updated in the database 
function updateRole() {
  inquirer.prompt([
    {
      name: "employee_id",
      type: "number",
      message: "Which employee would you like to update?(Enter the employee ID)",
      validate: (value) => {
        if (value) {
          return true;
        } else {
          console.log("Please enter the employee id.");
        }
      }
    },
    {
      name: "role_id",
      type: "number",
      message: "What is the employee's new role?(Enter the role ID)",
      validate: (value) => {
        if (value) {
          return true;
        } else {
          console.log("Please enter the employee new role id.");
        }
      }
    }
  ]).then(answer => {
    const sql = `UPDATE employee SET role_id = '${answer.role_id}' WHERE id = '${answer.employee_id}'`

    db.query(sql, (err) => {
      if (err) throw err;
      console.log(`No.${answer.employee_id} employee role has been updated`);
      options();
    })
  })
}

// enter the id of the department and that department is deleted from the database
function deleteDepartment() {
  inquirer.prompt([
    {
      name: "department_ID",
      type: "number",
      message: "Which department you would like to delete?(Enter the department ID)",
      validate: (value) => {
        if (value) {
          return true;
        } else {
          console.log("Please enter the department id.");
        }
      }
    }
  ]).then(answer => {
    const sql = `DELETE from department where id = '${answer.department_ID}'`;

    db.query(sql, (err) => {
      if (err) throw err;
      console.log(`No.${answer.department_ID} department has been deleted`);
      options();
    })
  });
}

// enter the id of the role and that role is deleted from the database
function deleteRole() {
  inquirer.prompt([
    {
      name: "role_ID",
      type: "number",
      message: "Which role you would like to delete?(Enter the role ID)",
      validate: (value) => {
        if (value) {
          return true;
        } else {
          console.log("Please enter the role id.");
        }
      }
    }
  ]).then(answer => {
    const sql = `DELETE from employee_role where id = '${answer.role_ID}'`;

    db.query(sql, (err) => {
      if (err) throw err;
      console.log(`NO.${answer.role_ID} role has been deleted`);
      options();
    })
  });
}

// enter the id of the employee and that employee is deleted from the database
function deleteEmployee() {
  inquirer.prompt([
    {
      name: "employee_ID",
      type: "number",
      message: "Which role you would like to delete?(Enter the role ID)",
      validate: (value) => {
        if (value) {
          return true;
        } else {
          console.log("Please enter the role id.");
        }
      }
    }
  ]).then(answer => {
    const sql = `DELETE from employee where id = '${answer.employee_ID}'`;

    db.query(sql, (err) => {
      if (err) throw err;
      console.log(`NO.${answer.employee_ID} employee has been deleted`);
      options();
    })
  });
}

options();