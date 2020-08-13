
var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require('console.table');

var connection = mysql.createConnection({
  host: "localhost",

  //  Your port; if not 3306
  port: 3306,

  //  Your username
  user: "root",

  //  Your password
  password: "",
  database: "employee_trackerDB"
});

connection.connect(function(err) {
  if (err) throw err;
  //  a pretty little loading header
  console.log (`


         #### ### #######  ####      ######  ######## ######## ########            ######   # ####  ######   ######  ######## ####### 
 ######  #  ### # #     ## #  #     ##    ## #  ##  # #      # #      #  ######## ##    ## #  ## # ##    ## ##    ## #      # #     ##
##    ## #   #  # #  ##  # #  #     #  ##  # #  ##  # #  ##### #  #####  #  ##  # #  ##  # #   # # #  ##  # #  ##  # #  ##### #  ##  #
#  ##  # #      # #     ## #  #     #  ##  # ##    ## #    #   #    #    #        #      # #     # #      # #  ##### #    #   #     ##
#      # #  # # # #  ####  #  #     #  ##  #  ##  ##  #  ###   #  ###    #        #  ##  # #  #  # #  ##  # #  #   # #  ###   #    ## 
#  ##### #  ### # #  #     #  ##### #  ##  #   #  #   #  ##### #  #####  #  # #   #  ##  # #  ## # #  ##  # #  ##  # #  ##### #  #  ##
##    #  #  # # # #  #     #      # ##    ##   #  #   #      # #      #  #  ###   #  ##  # #  ## # #  ##  # ##    ## #      # #  ##  #
 ######  #### ### ####     ########  ######    ####   ######## ########  #### ### ######## ####### ########  ######  ######## ########


  `);
  start();
});

function start() {
    inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Departments",
        "View All Roles",
        "Add new Employee",
        "Add new Department",
        "Add new Role",
        "Update Employee Role",
        "Exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {

    // Necessary cases

      case "View All Employees":
        viewAllEmployees();
        break;

      case "View All Departments":
        viewAllDepartments();
        break;

      case "View All Roles":
        viewAllRoles();
        break;

      case "Add new Employee":
        addEmployee();
        break;

      case "Add new Department":
        addDepartment();
        break;

      case "Add new Role":
        addRole();
        break;

      case "Update Employee Role":
          updateRole();
          break;


    // Not necessary

      // case "View All Employees by Department":
      //   allEmployeesDepartment();
      //   break; 

    // Future releases
      

      // case "View All Employees By Manager":
      //   allEmployeesManager();
      //   break;

      // case "Update Employee Manager":
      //   updateEmployeeManager();
      //   break;
        
      case "Exit":
        connection.end();
        break;
      }
    });
}

//  make a function here to show everything in the DB

function viewAllEmployees() {
  var query = "SELECT employee.id, first_name, last_name, role.title, role.salary, department.dept_name, manager_id from employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON department.id = role.department_id;";
      connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        start()
    });
}

function viewAllDepartments() {
  var query = "SELECT id, dept_name FROM department";
      connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        start()
    });
}

function viewAllRoles() {
  var query = "SELECT id, title FROM role";
      connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        start()
    });
}


function addEmployee() {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is the first name of the new employee?"
      },
      {
        name: "last_name",
        type: "input",
        message: "What is the last name of the new employee?"
      },
      {
        name: "role_id",
        type: "input",
        message: "What is the role id of the new employee's role?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "manager_id",
        type: "input",
        message: "What is the manager id of the new employee?",
      }
    ])
    .then(function(answer) {
      connection.query(
        `INSERT INTO employee SET ?`,
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.role_id,
          manager_id: answer.manager_id
        },
        function(err) {
          if (err) throw err;
          console.log("Your new employee profile was created successfully!");
          // re-prompt the user
          start();
        }
      );
    });
}


function addRole() {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "What is the name of the new role?"
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "department_id",
        type: "input",
        message: "What is the department ID of the new role?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      connection.query(
        `INSERT INTO role SET ?`,
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.department_id,
        },
        function(err) {
          if (err) throw err;
          console.log("Your new role was created successfully!");
          // re-prompt the user
          start();
        }
      );
    });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "dept_name",
        type: "input",
        message: "What is the name of the new department?"
      }
    ])
    .then(function(answer) {
      connection.query(
        `INSERT INTO department SET ?`,
        {
          dept_name: answer.dept_name
        },
        function(err) {
          if (err) throw err;
          console.log("Your new department was created successfully!");
          // re-prompt the user
          start();
        }
      );
    });
}


function updateRole() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    inquirer
    .prompt([
      {
        name: "first_name",
        type: "list",
        choices: function() {
          var choiceArray = [];
          for (var i =0; i < res.length; i++) {
            choiceArray.push(res[i].first_name)
          }
          return choiceArray;
        },
        message: "Which employee would you like to edit the role of?"
    },
    {
      name: "role_id",
      type: "input",
      message: "Which role ID would you like to change them to?"
    }
    ])
    .then(function(answer) {
      var chosenEmployee;
        for (var i = 0; i < res.length; i++) {
          if (res[i].first_name === answer.first_name) {
            chosenEmployee = res[i];
          }
        }

      connection.query(
        "UPDATE employee SET ? WHERE ?",
        [
          {
            role_id: answer.role_id
          },
          {
            first_name: chosenEmployee.first_name
          }
        ],
        function(err) {
          if (err) throw err;
          console.log("Your employee role has been changed successfully!");
          // re-prompt the user
          start();
        }
      )
  });
});
}
  
// Not Necessary make a function here to show everything in the DB by department

// function allEmployeesDepartment() {
//   inquirer
//     .prompt({
//       name: "dept_name",
//       type: "input",
//       message: "What department would you like to search for?"
//     })
//     .then(function(answer) {
//       var query = "SELECT employee.id, first_name, last_name, role.title, role.salary, department.dept_name, manager_id from employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON department.id = role.department_id WHERE ?";
//       connection.query(query, { dept_name: answer.dept_name }, function(err, res) {
//         if (err) throw err;
//         console.table(res);
//         start();
//       });
//     });
// }