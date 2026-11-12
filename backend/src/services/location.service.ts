import { Location } from '../models/location.model';

export class LocationService {
    
    static async getLocationsByCountry(country: string) {
        
        const filter: any = { country };
        return await Location.find(filter).sort({ name: 1 });
    }

    static async addLocation(name: string, country: 'Maroc' | 'France') {
        const existing = await Location.findOne({ name, country });
        if (existing) {
            throw new Error(`City "${name}" already exists in ${country}`);
        }
        return await Location.create({ name, country });
    }


    static async deleteLocation(id: string) {
        const location = await Location.findByIdAndDelete(id);
        if (!location) throw new Error('Location not found');
        return location;
    }
}