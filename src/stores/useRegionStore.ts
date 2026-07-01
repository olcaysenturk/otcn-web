import { getCities, getCountries, getDistricts } from "@/services/region";
import { City, Country, District } from "@/types/region";
import { create } from "zustand";

interface RegionStore {
    countries: Country[];
    cities: City[];
    districts: District[];
    fetchCountries: () => Promise<void>;
    fetchCities: (countryCode: string) => Promise<void>;
    fetchDistricts: (cityId: number) => Promise<void>;
}

export const useRegionStore = create<RegionStore>((set) => ({
    countries: [],
    cities: [],
    districts: [],
    fetchCountries: async () => {
        const countries = await getCountries();
        set({ countries });
    },
    fetchCities: async (countryCode: string) => {
        const cities = await getCities(countryCode);
        set({ cities });
    },
    fetchDistricts: async (cityId: number) => {
        const districts = await getDistricts(cityId);
        set({ districts });
    },
}));