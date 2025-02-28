<template>
  <div>
    <h1 class="text-center mb-4">Add New Shoe</h1>
    
    <div v-if="loading" class="loading-spinner-container">
      <div class="loading-spinner"></div>
    </div>
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    
    <form class="form" @submit.prevent="handleSubmit">
      <div class="form__group">
        <label class="form__label" for="name">Name</label>
        <input
          id="name"
          v-model="formData.name"
          class="form__input"
          type="text"
          required
        />
      </div>

      <div class="form__group">
        <label class="form__label" for="brand">Brand</label>
        <input
          id="brand"
          v-model="formData.brand"
          class="form__input"
          type="text"
          required
        />
      </div>

      <div class="form__group">
        <label class="form__label" for="price">Price</label>
        <input
          id="price"
          v-model.number="formData.price"
          class="form__input"
          type="number"
          step="0.01"
          min="0"
          required
        />
      </div>

      <div class="form__group">
        <label class="form__label" for="stock">Stock</label>
        <input
          id="stock"
          v-model.number="formData.stock"
          class="form__input"
          type="number"
          min="0"
          required
        />
      </div>

      <div class="form__group">
        <label class="form__label" for="imageUrl">Image URL</label>
        <input
          id="imageUrl"
          v-model="formData.imageUrl"
          class="form__input"
          type="url"
          required
        />
      </div>

      <div class="form__group">
        <label class="form__label" for="description">Description</label>
        <textarea
          id="description"
          v-model="formData.description"
          class="form__input"
          rows="4"
        ></textarea>
      </div>

      <div class="form__actions">
        <button type="button" class="btn" @click="$router.back()">Cancel</button>
        <button type="submit" class="btn btn-primary">Create</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useShoeStore } from '~/stores/shoeStore';
import { storeToRefs } from 'pinia';
import { CreateShoeDTO } from '~/types/shoe';

const router = useRouter();
const store = useShoeStore();
const { loading, error } = storeToRefs(store);

const formData = ref<CreateShoeDTO>({
  name: '',
  brand: '',
  price: 0,
  stock: 0,
  imageUrl: '',
  description: ''
});

const handleSubmit = async () => {
  try {
    const newShoe = await store.createShoe(formData.value);
    if (newShoe) {
      router.push(`/shoes/${newShoe.id}`);
    }
  } catch (error) {
    console.error('Failed to create shoe:', error);
  }
};
</script>

<style scoped>
.loading-spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3498db;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  margin: 1rem 0;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}
</style>