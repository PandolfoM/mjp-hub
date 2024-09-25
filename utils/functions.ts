export function formToNumber(field: string) {
  if (field === "monthly") {
    return 1;
  } else if (field === "quarterly") {
    return 3;
  } else if (field === "biannual") {
    return 6;
  } else if (field === "yearly") {
    return 12;
  } else {
    return 0;
  }
}
