import { isItemValid } from "../helpers/isItemValid";

describe("Testing isItemValid function", () => {
  test("Valid item with all required fields", () => {
    expect(
      isItemValid({
        product_id: 2,
        buying_price: 200,
        selling_price: 300,
        mfd: "2024/03/12",
        exp: "2024/03/29",
      })
    ).toBe(true);
  });

  test("Invalid item with missing product_id", () => {
    expect(
      isItemValid({
        buying_price: 200,
        selling_price: 300,
        mfd: "2024/03/12",
        exp: "2024/03/29",
      })
    ).toBe(false);
  });

  test("Invalid item with missing buying_price", () => {
    expect(
      isItemValid({
        product_id: 2,
        selling_price: 300,
        mfd: "2024/03/12",
        exp: "2024/03/29",
      })
    ).toBe(false);
  });

  test("Invalid item with missing selling_price", () => {
    expect(
      isItemValid({
        product_id: 2,
        buying_price: 200,
        mfd: "2024/03/12",
        exp: "2024/03/29",
      })
    ).toBe(false);
  });

  test("Invalid item with missing mfd", () => {
    expect(
      isItemValid({
        product_id: 2,
        buying_price: 200,
        selling_price: 300,
        exp: "2024/03/29",
      })
    ).toBe(false);
  });

  test("Invalid item with missing exp", () => {
    expect(
      isItemValid({
        product_id: 2,
        buying_price: 200,
        selling_price: 300,
        mfd: "2024/03/12",
      })
    ).toBe(false);
  });

  test("Invalid item with all fields missing", () => {
    expect(isItemValid({})).toBe(false);
  });

  test("Invalid item with null values for all fields", () => {
    expect(
      isItemValid({
        product_id: null,
        buying_price: null,
        selling_price: null,
        mfd: null,
        exp: null,
      })
    ).toBe(false);
  });

  test("Invalid item with empty strings for all fields", () => {
    expect(
      isItemValid({
        product_id: "",
        buying_price: "",
        selling_price: "",
        mfd: "",
        exp: "",
      })
    ).toBe(false);
  });
});
