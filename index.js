const inquirer = require("inquirer")
const mysql = require("mysql2");
const { type } = require("os");


const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employees_db'

    },
    console.log(`Connected to the employees_db database.`)
);

const mainPage = async () => {
    await inquirer
        .prompt({
            name: "directory",
            type: "list",
            message: "Welcome to the home directory. What would you like to do?",
            choices: [
                "View departments",
                "View employees",
                "View roles",
                "Add a departmnet",
                "Add a role",
                "Add a employee",
                "Update a employee",
                "Close",



            ],

        }).then((ans) => {
            switch (ans.directory) {
                case "View departments":
                    departmentsTable()
                    break;
                case "View employees":
                    employeesTables()
                    break;
                case "View roles":
                    rolesTable();
                    break;
                case "Add a departmnet":
                    addDept()
                    break;
                case "Add a role":
                    addRole()
                    break;
                case "Add a employee":
                    addEmployee()
                    break;
                case "Update a employee":
                    updateEmpRole()
                    break;
                case "Close":
                    console.log("Have a good day!")
                    process.exit();
                    break;


            };
        });
};

const departmentsTable = () => {
    const query = `SELECT departments.department_name AS Departments, departments.id AS id FROM departments`;
    db.query(query, (err, data) => {
        console.table(data);
        mainPage();

    });
};


const employeesTables = () => {
    const query = `SELECT employees.id, employees.first_name, employees.last_name, roles.title AS Job_Title, department_name AS Department, roles.salary AS Salary, CONCAT(managers.first_name, " ", managers.last_name) AS Manager FROM roles LEFT JOIN employees ON roles.id = employees.role_id LEFT JOIN departments ON departments.id = roles.department_id LEFT JOIN employees AS managers ON managers.id = employees.manager_id`;
    db.query(query, (err, data) => {
        console.table(data);
        mainPage();

    });
};

const rolesTable = () => {
    const query = `SELECT roles.id, roles.title AS Job_Title, departments.department_name AS Department FROM roles LEFT JOIN departments ON roles.department_id = departments.id`;
    db.query(query, (err, data) => {
        console.table(data);
        mainPage();

    });
};

const addDept = () => {
    const query = `SELECT * FROM departments`;
    db.query(query, (err, data) => {
        if (err) throw err;

        console.log(data)

        inquirer
            .prompt([
                {
                    name: "dept",
                    type: "input",
                    message: "What is the name of the new department?",

                },
            ]).then((ans) => {
                db.query(
                    `INSERT INTO departments(department_name) VALUES(?)`,
                    [ans.dept],
                    (err, data) => {
                        console.log("Department added!")
                        mainPage();
                    }
                );
            });


    });
};


const addRole = () => {
    return inquirer.prompt([
        {
            name: "newRole",
            type: "input",
            message: "What is the name of this role?",

        },
        {
            name: "money",
            type: "input",
            message: "What is the yearly salary of the new role?",
        }
    ])
        .then(ans => {
            const answers = [ans.newRole, ans.money];
            const query = `SELECT * FROM departments`;
            db.query(query, (err, data) => {
                if (err) {
                    throw err;
                }
                const departments = data.map(({ department_name, id }) => ({ name: department_name, value: id }));
                inquirer.prompt([
                    {
                        name: "deptName",
                        type: "list",
                        message: "What department does this role belong to?",
                        choices: departments
                    }
                ])
                    .then(ans => {
                        const dept = ans.deptName;
                        answers.push(dept);
                        const query = `INSERT INTO roles (title, salary, department_id)
            VALUES (?, ?, ?)`;
                        db.query(query, answers, (err) => {
                            if (err) {
                                throw err;
                            }
                            console.log("Role created!");
                            return mainPage();
                        });
                    });
            });
        });
};

const addEmployee = () => {
    return inquirer.prompt([
        {
            name: "fName",
            type: "input",
            message: "What is the employee's first name?",

        },
        {
            name: "lName",
            type: "input",
            message: "What is the employee's last name?",
        }
    ])
        .then(ans => {
            const answers = [ans.fName, ans.lName];
            const query = `SELECT * FROM roles`;
            db.query(query, (err, data) => {
                if (err) throw err;

                const roles = data.map(({ title, id }) => ({ name: title, value: id }));
                inquirer.prompt([
                    {
                        name: "empRole",
                        type: "list",
                        message: "What is the employee's role in the company?",
                        choices: roles,
                    }
                ])
                    .then(rAns => {
                        const role = rAns.empRole;
                        answers.push(role);
                        const query = `SELECT * FROM employees`;
                        db.query(query, (err, data) => {
                            if (err) throw err;

                            const managers = data.map(({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id }));
                            managers.push({ name: "No manager", value: null });
                            inquirer.prompt([
                                {
                                    name: "mgr",
                                    type: "list",
                                    message: "who does this employee report to?",
                                    choices: managers

                                },
                            ])
                                .then(mAns => {
                                    const manager = mAns.mgr;
                                    answers.push(manager);
                                    const query = `INSERT INTO employees (first_name, last_name, role_id, manager_id)  VALUES (?, ?, ?, ?)`;
                                    db.query(query, answers, (err) => {
                                        if (err) {
                                            throw err;
                                        }
                                        console.log("Employee added!");
                                        return mainPage();
                                    });
                                });
                        });
                    });
            });
        });
};

const updateEmpRole = () => {
    const query = `SELECT first_name, last_name, id FROM employees`
    db.query(query, (err, data) => {
        if (err) throw err;
    

    const employees = data.map(({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id }));
    inquirer.prompt([
        {
            name: "emp",
            type: "list",
            message: "Choose the employee you would like to update.",
            choices: employees,
        },
    ])
        .then(eAns => {
            const emp = eAns.emp;
            const answers = [emp];
            const query = `SELECT title, id FROM roles`;
            db.query(query, (err,data) => {
             if (err) throw err;

            const roles = data.map(({ title, id }) => ({ name: title, value: id }));
            inquirer.prompt([
        {
            name: "role",
            type: "list",
            message: "Choose the new role for the chosen employee",
            choices: roles,
        },
    ])
        .then(rAns => {
            const role = rAns.role;
            answers.unshift(role);
            const query = `UPDATE employees
                        SET role_id = ?
                        WHERE id = ?`
            db.query(query, answers, (err) => {
                if (err) {
                    throw err;
                }
                console.log("Employee has been updated!");
                return mainPage();
            });
          });
        });
      });
    });
  };




mainPage();