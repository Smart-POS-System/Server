import { isProductValid } from "../helpers/isProductValid";

describe("Testing isProductValid function", () => {
  test("Valid product with both required fields", () => {
    expect(
      isProductValid({ product_name: "Protein Powder", unit_weight: "5lbs" })
    ).toBe(true);
  });

  test("Invalid product with missing product_name", () => {
    expect(isProductValid({ unit_weight: "5lbs" })).toBe(false);
  });

  test("Invalid product with missing unit_weight", () => {
    expect(isProductValid({ product_name: "Protein Powder" })).toBe(false);
  });

  test("Invalid product with both fields missing", () => {
    expect(isProductValid({})).toBe(false);
  });

  test("Invalid product with null values for both fields", () => {
    expect(isProductValid({ product_name: null, unit_weight: null })).toBe(
      false
    );
  });

  test("Invalid product with empty strings for both fields", () => {
    expect(isProductValid({ product_name: "", unit_weight: "" })).toBe(false);
  });

  test("Invalid product with product_name as empty string", () => {
    expect(isProductValid({ product_name: "", unit_weight: "5lbs" })).toBe(
      false
    );
  });

  test("Invalid product with unit_weight as empty string", () => {
    expect(
      isProductValid({ product_name: "Protein Powder", unit_weight: "" })
    ).toBe(false);
  });
});
