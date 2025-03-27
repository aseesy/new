import { MMKV } from 'react-native-mmkv'

class AppStorage {
    #storage;
    constructor() {
        this.#storage = new MMKV()
    }

    getSotageItem = <T>(key: string) : T | undefined => {
        const data = this.#storage.getString(key);
        if (data) {
            return JSON.parse(data);
        };
        return undefined;
    }

    setSotageItem = <T>(key: string, value: T) => {
        this.#storage.set(key, JSON.stringify(value));
    }

    removeSotageItem = (key: string) => {
        this.#storage.delete(key);
    }

    resetAll = () => {
        this.#storage.clearAll();
    }
}

export const AppStore =  new AppStorage();