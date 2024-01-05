
export function formatDateToYYYYMMDD(dateString: Date, delimitador:string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}${delimitador}${month}${delimitador}${day}`;
}

export function formatDateToDDMMYYYY(dateString: Date, delimitador:string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}${delimitador}${month}${delimitador}${year}`;
}

