'use client'

import PageHeader from "@/components/admin/common/PageHeader";
import Toolbar from "@/components/admin/common/Toolbar";
import SubNav from "@/components/admin/nav/SubNav";
import StatCard from "@/components/admin/dashboard/StatCard";
import ProductTable from "./ProductTable";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button } from "@artistry-hub/ui";

export default function ProductsPage() {
  return (
    <>
      <SubNav section="catalog" />
      <PageHeader
        title="Product Management"
        description="Review and manage artist product submissions"
        actions={<Button>Add Product</Button>}
      />
      <Toolbar right={<Button variant="outline">Bulk Actions</Button>} />

      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard title="Pending Review" value="12" icon={<Clock className="h-5 w-5" />} />
          <StatCard title="Approved" value="156" icon={<CheckCircle2 className="h-5 w-5" />} />
          <StatCard title="Rejected" value="8" icon={<XCircle className="h-5 w-5" />} />
        </div>
      </div>

      <div className="mt-6">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-2 text-lg font-medium">Recent Submissions</h2>
        </div>
        <ProductTable />
      </div>
    </>
  );
}
