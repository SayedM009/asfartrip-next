// Sort options for hotel results
export const SORT_OPTIONS = [
    {
        value: "top_reviewed",
        labelKey: "top_reviewed",
        sortBy: "TripAdvisorRating",
        order: "desc",
    },
    {
        value: "lowest_price",
        labelKey: "lowest_price",
        sortBy: "MinPrice",
        order: "asc",
    },
    {
        value: "highest_price",
        labelKey: "highest_price",
        sortBy: "MinPrice",
        order: "desc",
    },
    {
        value: "star_rating",
        labelKey: "star_rating",
        sortBy: "Rating",
        order: "desc",
    },
];

export const DEFAULT_SORT = "lowest_price";
