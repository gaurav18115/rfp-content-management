"use client";

import { useState, useEffect, useCallback } from "react";
import { FileText, Loader2, AlertCircle } from "lucide-react";
import { RFPCard } from "@/components/rfp/rfp-card";
import { RFPFilters } from "@/components/rfp/rfp-filters";
import { Pagination } from "@/components/ui/pagination";
import { IRFP } from "@/types/rfp";

interface RFPBrowseResponse {
    rfps: (IRFP & {
        user_profiles?: {
            company_name?: string;
            first_name?: string;
            last_name?: string;
        };
    })[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    filters: {
        categories: string[];
    };
}

export default function RfpsPage() {
    const [rfps, setRfps] = useState<RFPBrowseResponse['rfps']>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<RFPBrowseResponse['pagination']>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    });

    const fetchRFPs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: "10",
                ...(search && { search }),
                ...(category && { category }),
            });

            const response = await fetch(`/api/rfps/browse?${params}`);

            if (!response.ok) {
                throw new Error('Failed to fetch RFPs');
            }

            const data: RFPBrowseResponse = await response.json();
            setRfps(data.rfps);
            setPagination(data.pagination);
            setCategories(data.filters.categories);
        } catch (err) {
            console.error('Error fetching RFPs:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
            setRfps([]);
            setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });
            setCategories([]);
        } finally {
            setLoading(false);
        }
    }, [currentPage, search, category]);

    useEffect(() => {
        fetchRFPs();
    }, [fetchRFPs]);

    const handleSearchChange = (newSearch: string) => {
        setSearch(newSearch);
        setCurrentPage(1);
    };

    const handleCategoryChange = (newCategory: string) => {
        setCategory(newCategory === "all" ? "" : newCategory);
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setSearch("");
        setCategory("");
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (loading && rfps.length === 0) {
        return (
            <div className="flex-1 w-full flex flex-col gap-8 max-w-7xl mx-auto p-6">
                <div className="w-full">
                    <h1 className="text-3xl font-bold mb-2">Available RFPs</h1>
                    <p className="text-muted-foreground">
                        Browse and respond to available Request for Proposals
                    </p>
                </div>
                <div className="flex items-center justify-center py-12" data-testid="loading-spinner">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-8 max-w-7xl mx-auto p-6">
            <div className="w-full">
                <h1 className="text-3xl font-bold mb-2">Available RFPs</h1>
                <p className="text-muted-foreground">
                    Browse and respond to available Request for Proposals
                </p>
            </div>

            {/* Filters */}
            <RFPFilters
                onSearchChange={handleSearchChange}
                onCategoryChange={handleCategoryChange}
                onClearFilters={handleClearFilters}
                categories={categories}
                currentSearch={search}
                currentCategory={category}
            />

            {/* Error Display */}
            {error && (
                <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive" data-testid="error-message">
                    <AlertCircle className="h-5 w-5" />
                    <span>{error}</span>
                </div>
            )}

            {/* Results Count */}
            {!loading && (
                <div className="text-sm text-muted-foreground" data-testid="results-count">
                    Showing {rfps.length} of {pagination.total} RFPs
                    {search && ` matching "${search}"`}
                    {category && ` in ${category} category`}
                </div>
            )}

            {/* RFP Grid */}
            {rfps.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="rfp-grid">
                    {rfps.map((rfp) => (
                        <RFPCard key={rfp.id} rfp={rfp} />
                    ))}
                </div>
            ) : !loading ? (
                <div className="text-center py-12" data-testid="no-rfps-message">
                    <FileText size="48" className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No RFPs Found</h3>
                    <p className="text-muted-foreground">
                        {search || category
                            ? "Try adjusting your search criteria or filters."
                            : "There are currently no published RFPs available. Check back later or contact us for more information."
                        }
                    </p>
                </div>
            ) : null}

            {/* Loading State for Additional Pages */}
            {loading && rfps.length > 0 && (
                <div className="flex items-center justify-center py-4" data-testid="loading-more">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="mt-8" data-testid="pagination">
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
} 