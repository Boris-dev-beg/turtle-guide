"use server"
import { proceduresServices } from "@/services/procedure.service";

export async function getAllProcedures() {
    return await proceduresServices.getAll()
}

export async function getPopular() {
    return await proceduresServices.getFew(); 
}

export async function getByCategory(categoryName: string) {
    return await proceduresServices.getByCategory(categoryName); 
}