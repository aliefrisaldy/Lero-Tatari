export interface Official {
    id: number;
    name: string;
    position: string;
    category: 'pimpinan' | 'sekretariat' | 'kasi' | 'kadusun';
    photo_path: string | null;
    order_index: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface OfficialFormData {
    name: string;
    position: string;
    category: 'pimpinan' | 'sekretariat' | 'kasi' | 'kadusun';
    photo: File | null;
    order_index: number;
    is_active: boolean;
}

export interface OfficialsResponse {
    officials: Official[];
}

export interface OfficialResponse {
    message: string;
    official: Official;
}

export interface OfficialStats {
    total: number;
    active: number;
    by_category: Record<string, number>;
}

export interface FilterState {
    search: string;
    category: string;
    status: 'all' | 'active' | 'inactive';
    sortBy: 'name' | 'position' | 'category' | 'order_index' | 'created_at';
    sortOrder: 'asc' | 'desc';
}
