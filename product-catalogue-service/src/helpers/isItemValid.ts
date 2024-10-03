export function isItemValid(item: any) {
  const { product_id, buying_price, selling_price, mfd, exp } = item;

  return (
    product_id != null &&
    product_id !== "" &&
    buying_price != null &&
    buying_price !== "" &&
    selling_price != null &&
    selling_price !== "" &&
    mfd != null &&
    mfd !== "" &&
    exp != null &&
    exp !== ""
  );
}
