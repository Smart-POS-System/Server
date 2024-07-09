import axios from "axios";

export async function getCashier(cashier_id: number) {
  try {
    const response = await axios.get(
      `http://inventory-srv:3000/store-cashiers/${cashier_id}`
    );
    const cashier = response.data;
    console.log(cashier);
    return cashier;
  } catch (error) {
    console.error("Error fetching employee:", error);
  }
}
