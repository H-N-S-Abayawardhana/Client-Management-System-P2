CREATE TABLE TaskProgress (
    TaskProgressID INT AUTO_INCREMENT PRIMARY KEY,
    TaskID INT NOT NULL,
    EmployeeID INT NOT NULL,
    TaskName VARCHAR(255) NOT NULL,
    TaskDescription TEXT,
    Attachment VARCHAR(255),
    FOREIGN KEY (TaskID) REFERENCES Task(TaskID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Task (
    TaskID INT AUTO_INCREMENT PRIMARY KEY,
    EmployeeID INT NOT NULL,
    TaskName VARCHAR(100) NOT NULL,
    Description TEXT,
    Deadline DATE,
    BudgetInfo DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Service (
    ServiceID INT AUTO_INCREMENT PRIMARY KEY,
    ServiceName VARCHAR(255) NOT NULL,
    Description TEXT NOT NULL,
    Cost DECIMAL(10, 2) NOT NULL
);