import axios from "axios";

export const getEmployee = async (employee_id: number) => {
  try {
    const response = await axios.get(
      `http://user-srv:3000/employees/${employee_id}`
    );
    const employee = response.data;
    console.log(employee); // You can handle the employee data here
    return employee;
  } catch (error) {
    console.error("Error fetching employee:", error);
  }
};
