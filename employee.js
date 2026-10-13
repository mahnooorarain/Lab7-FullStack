const fs = require("fs");

// 1. Read the file and convert the text into a JavaScript array
const data = fs.readFileSync("employees.json", "utf8");
const employees = JSON.parse(data);

// 2. Display all employees
console.log("Employees before adding:");
console.log(employees);

// 3. Add one new employee (skip if already added, so repeated runs don't duplicate)
const exists = employees.some((e) => e.name === "Hina Tariq");

if (!exists) {
  employees.push({ id: employees.length + 1, name: "Hina Tariq", department: "IT", salary: 75000 });

  // 4. Convert back to formatted JSON and save
  fs.writeFileSync("employees.json", JSON.stringify(employees, null, 2));
  console.log("Success: new employee added and saved to employees.json");
} else {
  console.log("Hina Tariq already exists, nothing added.");
}