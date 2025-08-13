import { Button } from "@artistry-hub/ui";

type Props = { title: string; description?: string; actions?: React.ReactNode };

export default function PageHeader({ title, description, actions }: Props) {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
        </div>
        {actions ?? <Button>Action</Button>}
      </div>
    </div>
  );
}
