const getReqEnv = (name: string) => {
  const value = import.meta.env[name];

  if (!value) {
    throw new Error(`Missing req env ${name}`);
  }

  return value;
};

export const env = {
  environment: getReqEnv("VITE_ENVIRONMENT"),

  ...(import.meta.env["VITE_ENVIRONMENT"] === "production"
    ? {
        apiUrl: getReqEnv("VITE_API_URL"),
      }
    : {
        apiUrl: getReqEnv("VITE_DEV_API_URL"),
      }),
} as const;
