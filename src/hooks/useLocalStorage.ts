import { useCallback, useMemo } from "react";

interface UseLocalStorage {
   get<T>(key: string): T
   create<T>(key: string, data: T): void;
   update<T>(key: string, newData: Partial<T>): void;
   remove(key: string): void;
   updateList<T>(key: string, data: Partial<T>): void;
   removeFromList(key: string, id: string): void;
}

export function useLocalStorage(): UseLocalStorage {

   const get = useCallback(<T>(key: string): T => {
      return JSON.parse(localStorage.getItem(key) ?? "{}")
   }, []);

   const create = useCallback(<T>(key: string, data: T) => {
      localStorage.setItem(key, JSON.stringify(data));
      window.dispatchEvent(new Event('storage'));
   }, []);

   const remove = useCallback((key: string) => {
      localStorage.removeItem(key);
   }, [])

   const update = useCallback(<T>(key: string, newData: Partial<T>) => {
      const item = get<T>(key);

      const newItem = {
         ...item,
         ...newData
      }

      create(key, newItem)
   }, [create, get]);

   const updateList = useCallback(<T>(key: string, data: Partial<T>) => {
      const list = get<T[]>(key) ?? [];

      // небольшой хак чтобы добавлять новые элементы в массив
      const newList = list?.length ? [
         ...list,
         data
      ] : [data];

      create(key, newList)
   }, [create, get]);

   const removeFromList = useCallback((key: string, id: string) => {
      const list = get<any[]>(key) ?? [];
      // если у элемена есть _id то сравниваем с ним, иначе берем сам item как ID
      const newList = list.filter(item => item?._id ? item._id !== id : item !== id);

      create(key, newList);

   }, [create, get])

   return useMemo(() => {
      return {
         get,
         create,
         update,
         remove,
         updateList,
         removeFromList,
      }
   }, [create, get, remove, removeFromList, update, updateList])
}