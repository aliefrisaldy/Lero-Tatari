export interface News {
    id: number;
    user_id: number;
    title: string;
    category: string;
    content: string;
    image_path: string | null;
    status: 'published' | 'draft';
    published_at: string | null;
    author?: {
        id: number;
        name: string;
    } | null;
    created_at: string;
    updated_at: string;
}

export type BeritaPageProps = Record<string, unknown> & {
    news?: News[];
};
