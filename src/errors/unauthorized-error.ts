export function unauthorizedError( message: string ) {
  return {
    name: "UnauthorizedError",
    message: message || "",
  };
}
