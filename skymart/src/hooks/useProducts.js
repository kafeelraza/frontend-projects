import { useQuery } from "@tanstack/react-query";
import { CATEGORIES, PRODUCTS } from "../data/products";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      await delay(500);
      return PRODUCTS;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: ["product", Number(id)],
    queryFn: async () => {
      await delay(300);
      return PRODUCTS.find((product) => product.id === Number(id)) || null;
    },
    enabled: Boolean(id),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      await delay(200);
      return CATEGORIES;
    },
    staleTime: 60 * 60 * 1000,
  });
}
