"use client";
import StatusBadge from "@/components/admin/common/StatusBadge";
import { Button } from "@artistry-hub/ui";

type Row = {
  id: string;
  name: string;
  submittedAt: string;
  artist: string;
  category: string;
  price: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
};

const rows: Row[] = [
  { id: "1", name: "Sunset Landscape", submittedAt: "2024-01-15", artist: "John Artist", category: "Paintings", price: "$299.99", status: "APPROVED" },
  { id: "2", name: "Abstract Dreams", submittedAt: "2024-01-20", artist: "Jane Creator", category: "Digital Art", price: "$199.99", status: "PENDING" },
  { id: "3", name: "Mountain View", submittedAt: "2024-01-18", artist: "Bob Painter", category: "Photography", price: "$399.99", status: "REJECTED" },
];

export default function ProductTable() {
  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-left text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Artist</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-gray-500">Submitted {r.submittedAt}</div>
                </td>
                <td className="px-4 py-3">{r.artist}</td>
                <td className="px-4 py-3">{r.category}</td>
                <td className="px-4 py-3">{r.price}</td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Approve</Button>
                    <Button variant="destructive" size="sm">Reject</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
