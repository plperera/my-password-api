export function notFoundError( message: string ) {
  return {
    name: "NotFoundError",
    message: message || "",
  };
}
