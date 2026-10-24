export interface Demographic {
    id: number;
    total_inhabitants: number;
    male_inhabitants: number;
    female_inhabitants: number;
    total_families: number;
    population_growth_rate: string | number;
    sd_graduates: number;
    sltp_graduates: number;
    slta_graduates: number;
    higher_education_graduates: number;
    coconut_land_area: string | number;
    coconut_production: string | number;
    corn_land_area: string | number;
    corn_production: string | number;
    piped_water_families: number;
    healthy_wc_families: number;
    brick_houses: number;
    created_at: string;
    updated_at: string;
}

export type DemografiPageProps = Record<string, unknown> & {
    demographics?: Demographic | null;
};
