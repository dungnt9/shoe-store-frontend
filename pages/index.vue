<template>
  <div>
    <h1 class="text-center mb-4">All Shoes</h1>
    
    <!-- Hiển thị loading spinner - ưu tiên cao nhất -->
    <div v-if="isLoading" class="loading-spinner-container">
      <div class="loading-spinner"></div>
    </div>
    
    <!-- Hiển thị thông báo lỗi nếu có -->
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    
    <!-- Hiển thị thông báo không có sản phẩm nếu mảng rỗng -->
    <div v-else-if="shoes.length === 0" class="text-center">
      <p>No shoes found.</p>
      <NuxtLink to="/shoes/new" class="btn btn-primary">Add New Shoe</NuxtLink>
    </div>
    
    <!-- Hiển thị danh sách sản phẩm nếu có dữ liệu -->
    <div v-else class="shoes-grid">
      <ShoeCard 
        v-for="shoe in shoes" 
        :key="shoe.id" 
        :shoe="shoe" 
        :onDelete="handleDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ShoeCard from '~/components/ShoeCard.vue';

const config = useRuntimeConfig();
const isLoading = ref(true);
const error = ref(null);
const shoes = ref([]);

// Định nghĩa hàm fetchShoes để lấy dữ liệu trực tiếp từ API
const fetchShoes = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    console.log('Fetching all shoes...');
    const apiUrl = `${config.public.apiBase}/shoes`;
    
    const data = await $fetch(apiUrl);
    console.log('Received shoes data:', data);
    
    // Normalize numeric fields
    const normalizedShoes = data.map(shoe => ({
      ...shoe,
      price: typeof shoe.price === 'string' ? parseFloat(shoe.price) : shoe.price,
      stock: typeof shoe.stock === 'string' ? parseInt(shoe.stock) : shoe.stock
    }));
    
    shoes.value = normalizedShoes;
  } catch (err) {
    console.error('Error fetching shoes:', err);
    error.value = 'Failed to fetch shoes';
  } finally {
    isLoading.value = false;
  }
};

// Fetch dữ liệu khi component được mount
onMounted(() => {
  fetchShoes();
});

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this shoe?')) {
    try {
      isLoading.value = true;
      const apiUrl = `${config.public.apiBase}/shoes/${id}`;
      
      await $fetch(apiUrl, {
        method: 'DELETE',
      });
      
      // Cập nhật danh sách sau khi xóa
      shoes.value = shoes.value.filter(shoe => shoe.id !== id);
    } catch (err) {
      console.error('Failed to delete shoe:', err);
      error.value = 'Failed to delete shoe';
    } finally {
      isLoading.value = false;
    }
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

.shoes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin: 2rem 0;
}
</style>