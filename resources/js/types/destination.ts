export interface Destination {
    id: number;
    title: string;
    description: string;
    location_url: string | null;
    image_path: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type WisataPageProps = Record<string, unknown> & {
    destinations?: Destination[];
};
