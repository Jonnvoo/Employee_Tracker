INSERT INTO departments (department_name)
VALUES 
("Marketing"),
("Accounting"),
("Finace"),
("Human resources"),
("Legal"),
("Engineers");


INSERT INTO roles (department_id, title, salary)
VALUES 
(1,"Chief marketing officer", 90000),
(1,"Marketing specialist", 65000),
(2,"Managerial accountant", 100000),
(2,"General accountant", 80000),
(3,"Finance manager", 85000),
(3,"Treasurer", 60000),
(4,"chief human resources officer", 110000),
(4,"Recruiter", 55000),
(5,"Legal Team Lead", 130000),
(5,"Lawyer", 115000),
(6,"Lead Engineer", 200000),
(6,"Engineer", 150000);


INSERT INTO employees (first_name,last_name, role_id, manager_id)
VALUES 
("Tyler","Reyes", 1, 1),
("Sara","Marabini-Linguini ", 2, NULL),
("Dustin","Chom", 3, 2),
("Boo","Pho", 4, NULL),
("Alam","Choat", 5, 3),
("Sabi","Singh", 6, NULL),
("Brandon","Roque", 7, 4),
("Bibhan","Shrestha", 8, NULL),
("Kyle","Lau", 9, 5),
("Kevin","Lau", 10, NULL),
("Nat","Besarat", 11, 6),
("Jonathan","Vu", 12, 6);






