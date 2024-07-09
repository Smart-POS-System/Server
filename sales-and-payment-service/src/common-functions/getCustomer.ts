import axios from "axios";

export async function getCustomer(nicOrPhoneNo: string) {
  try {
    const response = await axios.get(
      `http://user-srv:3000/customers/${nicOrPhoneNo}`
    );
    const customer = response.data;
    console.log(customer);
    return customer;
  } catch (error) {
    console.error("Error fetching employee:", error);
  }
}
