type Props = { status: "APPROVED" | "PENDING" | "REJECTED" };

export default function StatusBadge({ status }: Props) {
  const styles = {
    APPROVED: "bg-green-100 text-green-700 border-green-200",
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    REJECTED: "bg-rose-100 text-rose-700 border-rose-200",
  }[status];
  
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles}`}>
      {status}
    </span>
  );
}
