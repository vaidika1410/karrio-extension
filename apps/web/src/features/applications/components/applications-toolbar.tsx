"use client";

interface ApplicationsToolbarProps {
  search: string;
  setSearch: (
    value: string,
  ) => void;

  status: string;
  setStatus: (
    value: string,
  ) => void;
}

export function ApplicationsToolbar({
  search,
  setSearch,
  status,
  setStatus,
}: ApplicationsToolbarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <input
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value,
          )
        }
        placeholder="Search company or role..."
        className="
          h-10
          rounded-xl
          border
          border-border
          bg-background
          px-4
          text-sm
          outline-none
        "
      />

      <select
        value={status}
        onChange={(e) =>
          setStatus(
            e.target.value,
          )
        }
        className="
          h-10
          rounded-xl
          border
          border-border
          bg-background
          px-4
          text-sm
          outline-none
        "
      >
        <option value="ALL">
          All Statuses
        </option>

        <option value="APPLIED">
          Applied
        </option>

        <option value="INTERVIEW">
          Interview
        </option>

        <option value="REJECTED">
          Rejected
        </option>

        <option value="OFFER">
          Offer
        </option>
      </select>
    </div>
  );
}