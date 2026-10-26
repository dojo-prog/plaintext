export type ApiResponse<K> = {
  data: K;
};

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export type PaginatedResponse<K> = ApiResponse<K> & {
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    links: PaginationLink[];
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
};
