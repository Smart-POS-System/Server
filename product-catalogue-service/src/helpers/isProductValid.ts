export function isProductValid(product: any) {
  return (
    product.product_name != null &&
    product.product_name !== "" &&
    product.unit_weight != null &&
    product.unit_weight !== ""
  );
}
