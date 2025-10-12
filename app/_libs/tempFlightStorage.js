// lib/tempFlightStorage.js
class TempFlightStorage {
    constructor() {
        if (!global.tempFlightsMap) {
            global.tempFlightsMap = new Map();
        }
        this.store = global.tempFlightsMap;
    }

    set(id, data) {
        this.store.set(id, {
            ...data,
            createdAt: Date.now(),
        });

        // حذف بعد 15 دقيقة
        setTimeout(() => {
            this.store.delete(id);
        }, 15 * 60 * 1000);
    }

    get(id) {
        const data = this.store.get(id);

        if (!data) return null;

        // تحقق من انتهاء الصلاحية
        const isExpired = Date.now() - data.createdAt > 15 * 60 * 1000;

        if (isExpired) {
            this.store.delete(id);
            return null;
        }

        return data;
    }

    delete(id) {
        this.store.delete(id);
    }
}

export const tempFlightStorage = new TempFlightStorage();
