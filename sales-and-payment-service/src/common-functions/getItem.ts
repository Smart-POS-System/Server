import axios from "axios";

export const getItem = async (item_id: number) => {
  try {
    const response = await axios.get(
      `http://product-srv:3000/items/${item_id}`
    );
    const item = response.data;
    console.log(item); // You can handle the item data here
    return item;
  } catch (error) {
    console.error("Error fetching item:", error);
  }
};
