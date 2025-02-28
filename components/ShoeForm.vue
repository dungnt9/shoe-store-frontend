<template>
  <form class="form" @submit.prevent="submitForm">
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

    <div v-if="isEditMode" class="form__group">
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
      <button type="submit" class="btn btn-primary">{{ isEditMode ? 'Update' : 'Create' }}</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { CreateShoeDTO, UpdateShoeDTO, Shoe } from '~/types/shoe';

const props = defineProps<{
  shoe?: Shoe;
  isEditMode?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', data: CreateShoeDTO | UpdateShoeDTO): void;
}>();

const isEditMode = computed(() => props.isEditMode || false);

// Khởi tạo formData với các giá trị mặc định
const formData = ref({
  name: '',
  brand: '',
  price: 0,
  stock: 0,
  imageUrl: '',
  description: '',
  isAvailable: true
});

// Watch prop shoe để cập nhật formData khi prop thay đổi
watch(() => props.shoe, (newShoe) => {
  if (newShoe) {
    console.log('Updating form with shoe data:', newShoe);
    formData.value = {
      name: newShoe.name,
      brand: newShoe.brand,
      price: typeof newShoe.price === 'string' ? parseFloat(newShoe.price) : newShoe.price,
      stock: typeof newShoe.stock === 'string' ? parseInt(newShoe.stock) : newShoe.stock,
      imageUrl: newShoe.imageUrl,
      description: newShoe.description || '',
      isAvailable: newShoe.isAvailable
    };
  }
}, { immediate: true });

const submitForm = () => {
  console.log('Form submitted:', formData.value, 'isEditMode:', isEditMode.value);
  
  if (isEditMode.value) {
    // Khi ở chế độ edit, chỉ cần gửi những trường đã thay đổi
    const updateData = { ...formData.value };
    emit('submit', updateData);
  } else {
    // Khi ở chế độ tạo mới, loại bỏ trường isAvailable
    const { isAvailable, ...createData } = formData.value;
    emit('submit', createData);
  }
};
</script>