import axios from "axios";

export async function getStore(store_id: number) {
  try {
    const response = await axios.get(
      `http://inventory-srv:3000/stores/${store_id}`
    );
    const store = response.data;
    console.log(store);
    return store;
  } catch (error) {
    console.error("Error fetching employee:", error);
  }
}
