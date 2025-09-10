"use client";
import {
  categoriesTableHead,
  usersTableHead,
  productsTableHead,
} from "@/lib/data";
import { ArrowLeftCircle, ArrowRightCircle, Edit, Trash } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dispatch, JSX, SetStateAction, useEffect, useState } from "react";
import { Axios } from "@/axios";
import Image from "next/image";
import { dateHandler } from "@/lib/utils";

const Table = ({
  data,
  parent,
  setFixer,
  itemsPerPage,
}: {
  data: string[][] | undefined;
  parent: string;
  setFixer: Dispatch<SetStateAction<number>>;
  itemsPerPage: number;
}): JSX.Element => {
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // === GET SCREEN WIDTH ===

  const [screenWidth, setScreenWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      window.addEventListener("resize", () =>
        setScreenWidth(window.innerWidth)
      );
    };
    handleResize();
  }, []);

  let tableHead: string[] = [];
  switch (parent) {
    case "users":
      tableHead = usersTableHead;
      break;
    case "categories":
      tableHead = categoriesTableHead;
      break;
    case "products":
      tableHead = productsTableHead;
      break;

    default:
      break;
  }

  // === HANDLE DELETE ===

  const handleDelete = async (id: string, name: string) => {
    // Confirm before deleting
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${name}? This action cannot be undone.`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      let endpoint = "";
      if (parent === "users") {
        endpoint = `/user/${id}`;
      } else if (parent === "category") {
        endpoint = `/category/${id}`;
      } else if (parent === "products") {
        endpoint = `/product/${id}`;
      }
      await Axios.delete(endpoint);

      setFixer((prev) => prev + 1);
    } catch (err: unknown) {
      console.error(err);
      let errorMessage = "Error deleting item";

      if (err && typeof err === "object" && "response" in err) {
        const response = (
          err as { response?: { data?: { message?: string }; status?: number } }
        ).response;
        if (response?.data?.message) {
          errorMessage = response.data.message;
        } else if (response?.status === 404) {
          errorMessage = "Item not found.";
        } else if (response?.status === 403) {
          errorMessage = "You don't have permission to delete this item.";
        }
      }

      setError(errorMessage);
      // Clear error after 5 seconds
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  // === HANDLE PAGINATION ===

  if (screenWidth < 768) itemsPerPage = 3;
  const [page, setPage] = useState<number>(1);
  let paginationData: string[][] = [];
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  let maxPagesNumber: number;

  if (data) {
    maxPagesNumber = Math.ceil(data.length / itemsPerPage);
    paginationData = data.slice(startIndex, endIndex);
  }

  // === HANDLE SEARCH ===

  const [search, setSearch] = useState<string>("");
  let filteredData = paginationData.filter((item) =>
    item[1].toLowerCase().includes(search.toLowerCase())
  );
  // === HANDLE SEARCH ===

  const [filterByDate, setFilterByDate] = useState<string>();
  if (filterByDate) {
    filteredData = filteredData.filter(
      (item) => item[5] === dateHandler(filterByDate)
    );
  }

  return (
    <div className="w-full h-full">
      <div className="w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm py-3 px-6 mb-6 flex flex-col gap-3">
        <h1 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl uppercase">
          {parent}
        </h1>
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <input
            type="search"
            placeholder="Search..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearch(e.target.value);
            }}
            className="peer w-full lg:w-2/5 h-14 outline-0 rounded-sm bg-slate-50 pl-6 shadow-[inset_0_0_10px_0_rgba(0,0,0,0.1)]"
          />
          <input
            type="date"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFilterByDate(e.target.value);
            }}
            value={filterByDate}
            className="peer w-full lg:w-2/5 h-14 outline-0 rounded-sm bg-slate-50 pl-6 shadow-[inset_0_0_10px_0_rgba(0,0,0,0.1)]"
          />
        </div>
      </div>
      <div className="w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {/* === Error Message === */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-t-xl">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* === Desktop Table === */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                {tableHead.map((td, i) => (
                  <th
                    key={i}
                    className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground tracking-wide border-b border-border/50"
                  >
                    {td}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredData?.map((tr, i) => (
                <tr
                  key={i}
                  className="group transition-all duration-300 ease-in-out hover:bg-muted/30 hover:shadow-sm"
                >
                  {tr.map((td, i) => (
                    <td
                      key={i}
                      className="px-6 py-4 text-sm text-foreground group-hover:text-primary transition-colors duration-200"
                    >
                      {(parent === "category" && i === 2) ||
                      (parent === "products" && i === 2) ? (
                        // Display image for category or product image column
                        <div className="flex items-center gap-3">
                          {(() => {
                            return td &&
                              typeof td === "string" &&
                              td !== "No image" &&
                              td.startsWith("http") ? (
                              <Image
                                src={decodeURIComponent(td)}
                                width={48}
                                height={48}
                                alt={
                                  parent === "category" ? "Category" : "Product"
                                }
                                className="rounded-lg object-cover border border-border/30"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-muted/50 border border-border/30 flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-muted-foreground"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            );
                          })()}
                          <span className="text-xs text-muted-foreground truncate max-w-20">
                            {td &&
                            typeof td === "string" &&
                            td !== "No image" &&
                            td.startsWith("http")
                              ? "Image"
                              : "No image"}
                          </span>
                        </div>
                      ) : (
                        td
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4">
                    {tr[3] !== "Admin" && (
                      <div className="w-full h-full flex items-center justify-start gap-3 transition-all duration-300 ease-in-out">
                        <Link
                          href={pathname + `/` + tr[0]}
                          className="p-2 rounded-lg bg-accent hover:bg-accent/80 text-accent-foreground hover:scale-110 transition-all duration-200 hover:shadow-md"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(tr[0], tr[1])}
                          disabled={loading}
                          className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive hover:scale-110 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <div className="w-4 h-4 border-2 border-destructive border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* === Mobile Cards === */}
        <div className="md:hidden space-y-3 p-4">
          {filteredData.map((tr, i) => (
            <div
              key={i}
              className="p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/30 hover:shadow-md transition-all duration-300 ease-in-out group"
            >
              <div className="space-y-3">
                {/* ID and Role Row */}
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
                    {tr[0]}
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-200">
                    {tr[3]}
                  </span>
                </div>

                {/* Name and Email/Image */}
                <div className="space-y-1">
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                    {tr[1]}
                  </h3>
                  {parent === "category" || parent === "products" ? (
                    // For categories and products, show image below name
                    <div className="flex items-center gap-2">
                      {(() => {
                        return tr[2] &&
                          typeof tr[2] === "string" &&
                          tr[2] !== "No image" &&
                          tr[2].startsWith("http") ? (
                          <Image
                            src={tr[2]}
                            width={32}
                            height={32}
                            alt={parent === "category" ? "Category" : "Product"}
                            className="rounded-md object-cover border border-border/30"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-md bg-muted/50 border border-border/30 flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-muted-foreground"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        );
                      })()}
                      <span className="text-xs text-muted-foreground">
                        {tr[2] &&
                        typeof tr[2] === "string" &&
                        tr[2] !== "No image" &&
                        tr[2].startsWith("http")
                          ? "Image"
                          : "No image"}
                      </span>
                    </div>
                  ) : (
                    // For users, show email
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                      {tr[2]}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/30">
                  {tr[3] !== "Admin" && (
                    <>
                      <Link
                        href={pathname + `/` + tr[0]}
                        className="p-2 rounded-lg bg-accent hover:bg-accent/80 text-accent-foreground hover:scale-110 transition-all duration-200 hover:shadow-md"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(tr[0], tr[1])}
                        disabled={loading}
                        className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive hover:scale-110 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <div className="w-4 h-4 border-2 border-destructive border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash className="w-4 h-4" />
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* === Empty State === */}
        {(!data || data.length === 0) && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No data available
            </h3>
            <p className="text-sm text-muted-foreground">
              There are no {parent === "users" ? "users" : "categories"} to
              display at the moment.
            </p>
          </div>
        )}
        {/* ==== PAGINATION === */}
        <div className="w-full h-10 flex items-center gap-4 justify-end p-8 border-t border-t-border">
          <ArrowLeftCircle
            onClick={() => {
              setPage((prev) => (prev > 1 ? prev - 1 : prev));
            }}
          />
          <span className="flex items-center gap-2">
            <span>{startIndex + 1}</span>
            <span>-</span>
            <span>{startIndex + filteredData.length}</span>
          </span>
          <ArrowRightCircle
            onClick={() => {
              setPage((prev) => (prev < maxPagesNumber ? prev + 1 : prev));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Table;
