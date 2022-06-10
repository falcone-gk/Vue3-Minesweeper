<template>
  <div class="gameboard" :style="gameboardStyle">
    <div class="box" v-for="index in store.getters.totalCells" :key="index"></div>
  </div>
  <button @click.prevent="goToSetup">Configuración</button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const numRows = computed(() => store.getters.getNumRows)
const numCols = computed(() => store.getters.getNumCols)

const gameboardStyle = computed(() => {
  return {
    display: 'grid',
    "grid-template": `repeat(${numRows.value}, 1fr) / repeat(${numCols.value}, 1fr)`,
    margin: "0 auto",
    width: "max-content",
    height: "max-content",
    border: "solid #808080",
    "border-width": "1px 0 0 1px",
    }
  }
)

const goToSetup = () => store.commit('setNewPage', 'settings')

</script>
<style scoped>
.box {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
    width: 20px;
    background: #c0c0c0;
    box-sizing: border-box;
    border: solid #808080;
    border-width: 0 1px 1px 0;
    cursor: pointer;
}
.box::after {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background: #c0c0c0;
    border: 2px outset #ececec;
    font-size: 0.75rem;
    text-align: center;
}
.box.boxShown::after {
    display: none;
}
.box:active::after {
    background: #bdbdbd;
    border: solid #999;
    border-width: 2px 0 0 2px;
}
</style>