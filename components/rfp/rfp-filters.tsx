import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

interface RFPFiltersProps {
    onSearchChange: (search: string) => void;
    onCategoryChange: (category: string) => void;
    onClearFilters: () => void;
    categories: string[];
    currentSearch: string;
    currentCategory: string;
}

export function RFPFilters({
    onSearchChange,
    onCategoryChange,
    onClearFilters,
    categories,
    currentSearch,
    currentCategory
}: RFPFiltersProps) {
    const [searchValue, setSearchValue] = useState(currentSearch);
    const [categoryValue, setCategoryValue] = useState(currentCategory);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearchChange(searchValue);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchValue, onSearchChange]);

    const handleClearFilters = () => {
        setSearchValue('');
        setCategoryValue('');
        onClearFilters();
    };

    const hasActiveFilters = currentSearch || currentCategory;

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search RFPs by title, description, or company..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="pl-10"
                        data-testid="search-input"
                    />
                </div>

                {/* Category Filter - Only render when categories are available */}
                {categories && categories.length > 0 && (
                    <Select value={categoryValue} onValueChange={setCategoryValue}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        onClick={handleClearFilters}
                        className="flex items-center gap-2"
                    >
                        <X className="h-4 w-4" />
                        Clear
                    </Button>
                )}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm text-muted-foreground">Active filters:</span>

                    {currentSearch && (
                        <div className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full text-sm">
                            <span>Search: &ldquo;{currentSearch}&rdquo;</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSearchValue('');
                                    onSearchChange('');
                                }}
                                className="h-4 w-4 p-0 hover:bg-transparent"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    )}

                    {currentCategory && (
                        <div className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full text-sm">
                            <span>Category: {currentCategory}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setCategoryValue('');
                                    onCategoryChange('');
                                }}
                                className="h-4 w-4 p-0 hover:bg-transparent"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 