export interface Gallery {
    id: number;
    title: string;
    captured_at: string | null;
    image_path: string | null;
    is_active: boolean;
    order_index: number;
    created_at: string;
    updated_at: string;
}

export type GaleriPageProps = Record<string, unknown> & {
    galleries?: Gallery[];
};