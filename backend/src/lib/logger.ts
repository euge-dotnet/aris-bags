const sensitiveKeys = ["password", "token", "authorization", "secret", "jwt"];

function sanitize(value: unknown): unknown {
  if (!value || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(sanitize);
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nested]) => {
      const hidden = sensitiveKeys.some((item) =>
        key.toLowerCase().includes(item),
      );
      return [key, hidden ? "[redacted]" : sanitize(nested)];
    }),
  );
}

function write(level: string, message: string, extra?: unknown) {
  const line = {
    level,
    message,
    time: new Date().toISOString(),
    ...(extra !== undefined ? { extra: sanitize(extra) } : {}),
  };

  if (level === "error") {
    console.error(JSON.stringify(line));
    return;
  }

  console.log(JSON.stringify(line));
}

export const logger = {
  info(message: string, extra?: unknown) {
    write("info", message, extra);
  },
  warn(message: string, extra?: unknown) {
    write("warn", message, extra);
  },
  error(message: string, extra?: unknown) {
    write("error", message, extra);
  },
};
