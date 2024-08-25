export const setFeatures = (query: any) => {
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  const sortBy = (query.sortBy as string) || "employee_name";
  const sortOrder = (query.sortOrder as string) === "DESC" ? "DESC" : "ASC";
  const name = (query.name as string) || "";
  const role = (query.role as string) || "";

  return {
    page,
    limit,
    sortBy,
    sortOrder,
    name,
    role,
  };
};
