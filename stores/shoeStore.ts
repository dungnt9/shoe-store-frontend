import { defineStore } from 'pinia';
import { Shoe, CreateShoeDTO, UpdateShoeDTO } from '~/types/shoe';

export const useShoeStore = defineStore('shoe', {
  state: () => ({
    shoes: [] as Shoe[],
    selectedShoe: null as Shoe | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchShoes() {
      this.loading = true;
      this.error = null;
      try {
        const config = useRuntimeConfig();
        const { data, error } = await useFetch(`${config.public.apiBase}/shoes`, {
          method: 'GET',
        });
        
        if (error.value) {
          throw error.value;
        }
        
        if (data.value) {
          this.shoes = data.value as Shoe[];
        }
      } catch (error) {
        this.error = 'Failed to fetch shoes';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchShoe(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const config = useRuntimeConfig();
        const { data, error } = await useFetch(`${config.public.apiBase}/shoes/${id}`, {
          method: 'GET',
        });
        
        if (error.value) {
          throw error.value;
        }
        
        if (data.value) {
          this.selectedShoe = data.value as Shoe;
        }
      } catch (error) {
        this.error = 'Failed to fetch shoe details';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async createShoe(shoe: CreateShoeDTO) {
      this.loading = true;
      this.error = null;
      try {
        const config = useRuntimeConfig();
        const { data, error } = await useFetch(`${config.public.apiBase}/shoes`, {
          method: 'POST',
          body: shoe,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (error.value) {
          throw error.value;
        }
        
        if (data.value) {
          const newShoe = data.value as Shoe;
          this.shoes.push(newShoe);
          return newShoe;
        }
      } catch (error) {
        this.error = 'Failed to create shoe';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateShoe(id: number, shoe: UpdateShoeDTO) {
      this.loading = true;
      this.error = null;
      try {
        const config = useRuntimeConfig();
        const { data, error } = await useFetch(`${config.public.apiBase}/shoes/${id}`, {
          method: 'PATCH',
          body: shoe,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (error.value) {
          throw error.value;
        }
        
        if (data.value) {
          const updatedShoe = data.value as Shoe;
          const index = this.shoes.findIndex(s => s.id === id);
          if (index !== -1) {
            this.shoes[index] = updatedShoe;
          }
          this.selectedShoe = updatedShoe;
          return updatedShoe;
        }
      } catch (error) {
        this.error = 'Failed to update shoe';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteShoe(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const config = useRuntimeConfig();
        const { error } = await useFetch(`${config.public.apiBase}/shoes/${id}`, {
          method: 'DELETE',
        });
        
        if (error.value) {
          throw error.value;
        }
        
        this.shoes = this.shoes.filter(shoe => shoe.id !== id);
        if (this.selectedShoe && this.selectedShoe.id === id) {
          this.selectedShoe = null;
        }
      } catch (error) {
        this.error = 'Failed to delete shoe';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});