<template>
  <div>
    <!-- Hiển thị loading trước, ưu tiên cao nhất -->
    <div v-if="isLoading" class="loading-spinner-container">
      <div class="loading-spinner"></div>
    </div>
    
    <!-- Sau đó hiển thị lỗi nếu có -->
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    
    <!-- Kiểm tra dữ liệu và hiển thị tương ứng -->
    <div v-else-if="!shoeData" class="text-center">
      <p>Shoe not found.</p>
      <NuxtLink to="/" class="btn btn-primary">Back to Home</NuxtLink>
    </div>
    
    <!-- Hiển thị form chỉnh sửa nếu đã có dữ liệu -->
    <div v-else>
      <h1 class="text-center mb-4">Edit Shoe</h1>
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

        <div class="form__group">
          <label class="form__label" for="isAvailable">
            <input
              id="isAvailable"
              v-model="formData.isAvailable"
              type="checkbox"
            />
            Available
          </label>
        </div>

        <div class="form__actions">
          <button type="button" class="btn" @click="$router.back()">Cancel</button>
          <button type="submit" class="btn btn-primary">Update</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { UpdateShoeDTO } from '~/types/shoe';

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const id = Number(route.params.id);
const isLoading = ref(true);
const error = ref(null);
const shoeData = ref(null);

const formData = ref({
  name: '',
  brand: '',
  price: 0,
  stock: 0,
  imageUrl: '',
  description: '',
  isAvailable: true
});

// Định nghĩa hàm fetchShoe để lấy dữ liệu trực tiếp từ API
const fetchShoe = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    console.log('Fetching shoe data for editing...', id);
    const apiUrl = `${config.public.apiBase}/shoes/${id}`;
    
    const data = await $fetch(apiUrl);
    console.log('Received shoe data:', data);
    
    shoeData.value = data;
    
    // Cập nhật form data
    formData.value = {
      name: data.name,
      brand: data.brand,
      price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
      stock: typeof data.stock === 'string' ? parseInt(data.stock) : data.stock,
      imageUrl: data.imageUrl,
      description: data.description || '',
      isAvailable: data.isAvailable
    };
  } catch (err) {
    console.error('Error fetching shoe for editing:', err);
    error.value = 'Failed to fetch shoe details';
  } finally {
    isLoading.value = false;
  }
};

// Fetch dữ liệu khi component được mount
onMounted(() => {
  fetchShoe();
});

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    
    const updateData: UpdateShoeDTO = {
      name: formData.value.name,
      brand: formData.value.brand,
      price: formData.value.price,
      stock: formData.value.stock,
      imageUrl: formData.value.imageUrl,
      description: formData.value.description,
      isAvailable: formData.value.isAvailable
    };
    
    const apiUrl = `${config.public.apiBase}/shoes/${id}`;
    await $fetch(apiUrl, {
      method: 'PATCH',
      body: updateData,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    router.push(`/shoes/${id}`);
  } catch (err) {
    console.error('Failed to update shoe:', err);
    error.value = 'Failed to update shoe';
  } finally {
    isLoading.value = false;
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