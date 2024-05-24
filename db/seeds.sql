INSERT INTO department (name)
VALUES 
    ("Administration"),
    ("Purchasing"),
    ("HR"),
    ("Finance");

INSERT INTO employee_role (title, salary, department_id)
VALUES
    ("Senior Director", 60000, 1),
    ("Assistant Director", 40000, 1),
    ("Senior Purchasor", 30000, 2),
    ("Assistant Purchasor", 20000, 2),
    ("Junior HR", 22000, 3),
    ("Senior HR", 35000, 3),
    ("Junior Finance", 27000, 4),
    ("Senior Finance", 50000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("David", "Waweru", 1, NULL),
    ("Michael", "Phelps", 2, 1),
    ("Tiffany", "Good", 3, NULL),
    ("Sammy", "Becker", 4, 3),
    ("Antonio", "John", 5, NULL),
    ("Julia", "Roberts", 6, NULL),
    ("Rodrigo", "Hernandez", 7, 6);