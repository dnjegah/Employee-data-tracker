SELECT name 
FROM department 
LEFT JOIN employee_role 
ON department.id = employee_role.department_id;

SELECT title, salary, department_id 
FROM employee_role 
LEFT JOIN department 
ON employee_role.department_id = department.id;

SELECT first_name, last_name, role_id, manager_id 
FROM employee 
JOIN employee_role 
ON employee.role_id = employee_role.id;