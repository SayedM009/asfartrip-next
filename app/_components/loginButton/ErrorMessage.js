import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

export default function ErrorMessage({ error }) {
  return (
    <span className="text-red-500 text-xs mt-2 flex items-center gap-1">
      <ExclamationCircleIcon className="w-4" />
      {error}
    </span>
  );
}
