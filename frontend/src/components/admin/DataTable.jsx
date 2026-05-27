import React, { useState, useMemo } from "react";
import { useAdminContext } from "../../context/AdminContext";
import ReviewApplicantModal from "./ReviewApplicantModal";

const ROWS_PER_PAGE = 10;

const getBadgeClass = (status) => {
  switch (status) {
    case "Approved":
      return "badge badge-success";
    case "Pending":
      return "badge badge-warning";
    case "Under Review":
      return "badge badge-info";
    case "Rejected":
      return "badge badge-danger";
    case "Withdrawn":
      return "badge badge-neutral";
    case "Completed":
      return "badge badge-completed";
    default:
      return "badge";
  }
};

// Consistent color per student name for the grouping sidebar
const GROUP_COLORS = [
  "#e8b931",
  "#3b82f6",
  "#10b981",
  "#f97316",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f43f5e",
];

const DataTable = ({ addToast }) => {
  const {
    adminApplicants,
    approveApplicant,
    rejectApplicant,
    completeApplicant,
  } = useAdminContext();
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Count how many total applications each student has
  const appCountsByName = useMemo(() => {
    const counts = {};
    adminApplicants.forEach((a) => {
      counts[a.name] = (counts[a.name] || 0) + 1;
    });
    return counts;
  }, [adminApplicants]);

  // Sort: group students with multiple apps together
  const sortedApplicants = useMemo(() => {
    const filtered = adminApplicants.filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.program.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "All" || a.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    // Sort by name so grouped rows are adjacent
    return [...filtered].sort((a, b) => {
      const aMulti = appCountsByName[a.name] > 1 ? 1 : 0;
      const bMulti = appCountsByName[b.name] > 1 ? 1 : 0;
      // Multi-app students first, then alphabetical
      if (bMulti !== aMulti) return bMulti - aMulti;
      const nameComp = a.name.localeCompare(b.name);
      if (nameComp !== 0) return nameComp;
      return 0;
    });
  }, [adminApplicants, searchTerm, filterStatus, appCountsByName]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(sortedApplicants.length / ROWS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedApplicants = sortedApplicants.slice(
    (safeCurrentPage - 1) * ROWS_PER_PAGE,
    safeCurrentPage * ROWS_PER_PAGE,
  );

  // Assign a consistent color index to each multi-app student name
  const multiAppNames = useMemo(() => {
    const names = [
      ...new Set(
        adminApplicants
          .filter((a) => appCountsByName[a.name] > 1)
          .map((a) => a.name),
      ),
    ];
    const map = {};
    names.forEach((name, i) => {
      map[name] = GROUP_COLORS[i % GROUP_COLORS.length];
    });
    return map;
  }, [adminApplicants, appCountsByName]);

  // Build grouping info for the paginated rows
  const groupInfo = useMemo(() => {
    const info = [];
    for (let i = 0; i < paginatedApplicants.length; i++) {
      const a = paginatedApplicants[i];
      const isMulti = appCountsByName[a.name] > 1;
      const color = multiAppNames[a.name] || null;

      if (!isMulti) {
        info.push({
          isGrouped: false,
          color: null,
          isFirst: false,
          isLast: false,
          groupSize: 1,
        });
        continue;
      }

      const prevName = i > 0 ? paginatedApplicants[i - 1].name : null;
      const nextName =
        i < paginatedApplicants.length - 1
          ? paginatedApplicants[i + 1].name
          : null;
      const isFirst = prevName !== a.name;
      const isLast = nextName !== a.name;

      // Count consecutive rows in this group on this page
      let groupSize = 0;
      if (isFirst) {
        for (
          let j = i;
          j < paginatedApplicants.length &&
          paginatedApplicants[j].name === a.name;
          j++
        ) {
          groupSize++;
        }
      }

      info.push({ isGrouped: true, color, isFirst, isLast, groupSize });
    }
    return info;
  }, [paginatedApplicants, appCountsByName, multiAppNames]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  return (
    <>
      <div className="dt-controls">
        <input
          type="text"
          placeholder="Search applicants or programs..."
          className="form-input dt-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-input dt-filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Under Review">Under Review</option>
          <option value="Approved">Approved</option>
          <option value="Completed">Completed</option>
          <option value="Rejected">Rejected</option>
          <option value="Withdrawn">Withdrawn</option>
        </select>
      </div>

      <div className="card table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="dt-group-th"></th>
              <th>Applicant Name</th>
              <th>Scholarship Program</th>
              <th>GWA</th>
              <th>Applied Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedApplicants.length > 0 ? (
              paginatedApplicants.map((a, idx) => {
                const g = groupInfo[idx];
                return (
                  <tr
                    key={a.id}
                    style={{
                      backgroundColor: g.isGrouped ? `${g.color}08` : undefined,
                    }}
                  >
                    {/* Grouping sidebar cell */}
                    <td
                      className="dt-group-td"
                      style={{
                        borderBottom:
                          g.isGrouped && !g.isLast ? "none" : undefined,
                      }}
                    >
                      {g.isGrouped && (
                        <div
                          className="dt-group-indicator"
                          style={{
                            top: g.isFirst ? "8px" : 0,
                            bottom: g.isLast ? "8px" : 0,
                            backgroundColor: g.color,
                            borderRadius:
                              g.isFirst && g.isLast
                                ? "4px"
                                : g.isFirst
                                  ? "4px 4px 0 0"
                                  : g.isLast
                                    ? "0 0 4px 4px"
                                    : "0",
                          }}
                        />
                      )}
                    </td>
                    <td className="table-cell-name">
                      <div className="dt-name-container">
                        <span>{a.name}</span>
                        {g.isGrouped && g.isFirst && (
                          <span className="badge badge-info">
                            {appCountsByName[a.name]} Applications
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{a.program}</td>
                    <td>{a.gpa}</td>
                    <td>{a.appliedDate}</td>
                    <td>
                      <span className={getBadgeClass(a.status)}>
                        {a.status}
                      </span>
                    </td>
                    <td>
                      {a.status === "Approved" || a.status === "Completed" ? (
                        <button className="btn-review" disabled>
                          Reviewed
                        </button>
                      ) : (
                        <button
                          className="btn-review"
                          onClick={() => setSelectedApplicant(a)}
                          disabled={
                            a.status === "Rejected" ||
                            a.status === "Withdrawn" ||
                            a.status === "Completed"
                          }
                        >
                          {a.status === "Rejected" ||
                          a.status === "Withdrawn" ||
                          a.status === "Completed"
                            ? "Reviewed"
                            : "Review"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "var(--text-medium)",
                  }}
                >
                  No applicants found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="dt-pagination">
          <span className="dt-page-info">
            Showing {(safeCurrentPage - 1) * ROWS_PER_PAGE + 1}–
            {Math.min(safeCurrentPage * ROWS_PER_PAGE, sortedApplicants.length)}{" "}
            of {sortedApplicants.length} applicants
          </span>
          <div className="dt-page-btns">
            <button
              className="btn-review"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`btn-review ${page === safeCurrentPage ? "dt-btn-active" : ""}`}
                onClick={() => setCurrentPage(page)}
                style={{ minWidth: "36px" }}
              >
                {page}
              </button>
            ))}
            <button
              className="btn-review"
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {selectedApplicant && (
        <ReviewApplicantModal
          applicant={selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          addToast={addToast}
        />
      )}
    </>
  );
};

export default DataTable;
