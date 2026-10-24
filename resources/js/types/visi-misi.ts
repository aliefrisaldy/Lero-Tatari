export interface VillageVision {
    id: number;
    vision_statement: string;
    period: string;
}

export interface VillageMission {
    id: number;
    description: string;
    order_index: number;
}

export type VisiMisiPageProps = Record<string, unknown> & {
    vision?: VillageVision | null;
    missions?: VillageMission[];
};
