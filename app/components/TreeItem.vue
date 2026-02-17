<template>
  <div class="tree-item-container">
    <button 
      class="tree-item-btn"
      :class="{ active: selectedPath === item.path, expanded: isExpanded }"
      @click="handleSelect"
    >
      <Icon 
        :name="item.children?.length ? (isExpanded ? 'lucide:chevron-down' : 'lucide:chevron-right') : 'lucide:folder'" 
        class="icon"
      />
      <span class="name">{{ item.name }}</span>
    </button>
    
    <div v-if="isExpanded && item.children?.length" class="tree-children">
      <TreeItem 
        v-for="child in item.children" 
        :key="child.path" 
        :item="child" 
        :selected-path="selectedPath"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: Object,
  selectedPath: String
})

const emit = defineEmits(['select'])
const isExpanded = ref(false)

const handleSelect = () => {
  if (props.item.children?.length) {
    isExpanded.value = !isExpanded.value
  }
  emit('select', props.item.path)
}

// Auto-expand if the selected path is under this item
watch(() => props.selectedPath, (newPath) => {
  if (newPath?.startsWith(props.item.path + '/')) {
    isExpanded.value = true
  }
}, { immediate: true })
</script>

<style scoped>
.tree-item-container {
  display: flex;
  flex-direction: column;
}

.tree-item-btn {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.4rem 0.75rem;
  border-radius: 0.4rem;
  font-size: 0.875rem;
  color: var(--text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.tree-item-btn:hover {
  background: rgba(128, 128, 128, 0.05);
  color: var(--text);
}

.tree-item-btn.active {
  background: rgba(128, 128, 128, 0.1);
  color: var(--text);
  font-weight: 500;
}

.icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  opacity: 0.5;
}

.tree-children {
  margin-left: 1.25rem;
  border-left: 1px solid rgba(128, 128, 128, 0.1);
  padding-left: 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
