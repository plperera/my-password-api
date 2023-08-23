export function badRequestError( message: string ) {
  return {
    name: "BadRequestError",
    message: message || "",
  };
}
