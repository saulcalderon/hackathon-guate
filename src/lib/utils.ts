export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatCurrency(value: number, currency = "GTQ"): string {
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: currency === "GTQ" ? "GTQ" : currency,
    minimumFractionDigits: 2,
  }).format(value);
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
