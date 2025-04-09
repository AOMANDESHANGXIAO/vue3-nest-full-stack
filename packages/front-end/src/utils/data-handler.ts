const cleanObject = (obj: Record<string, any>) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value === undefined) return acc;
    if (Array.isArray(value) && value.length === 0) return acc;
    if (typeof value === "string" && value.trim() === "") return acc;
    acc[key] = value;
    return acc;
  }, {} as Record<string, any>);
};
