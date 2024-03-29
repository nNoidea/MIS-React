export interface Globals {
    GETTERS: any;
    SETTERS: any;
}

// Homepage
export interface Trending {
    page: number;
    results: TrendingResult[];
    total_pages: number;
    total_results: number;
}

export interface TrendingResult {
    adult?: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title?: string;
    overview: string;
    poster_path: string;
    release_date?: string;
    title?: string;
    video?: boolean;
    vote_average: number;
    vote_count: number;
    popularity: number;
    first_air_date?: string;
    name?: string;
    origin_country?: string[];
    original_name?: string;
}
