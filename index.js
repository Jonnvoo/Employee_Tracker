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

const addDept =() =>{
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
        ]).then((ans) =>{
            db.query(
                `INSERT INTO departments(department_name) VALUES(?)`,
                [ans.dept],
                (err, data)=>{
                    console.log("Department added!")
                    mainPage();
                }
                );
        });


    });
};





mainPage();