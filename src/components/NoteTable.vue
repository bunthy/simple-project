<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <h1 class="text-2xl font-bold mb-4">Notes Management</h1>
    <form
        @submit.prevent="saveNote"
        class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
          Title
        </label>
        <input
            type="text"
            id="title"
            v-model="form.title"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter title"
            required
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="content">
          Content
        </label>
        <textarea
            id="content"
            v-model="form.content"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter content"
            required
        ></textarea>
      </div>
      <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {{ editMode ? "Update Note" : "Add Note" }}
      </button>
    </form>
    <input
        v-model="searchTerm"
        type="text"
        placeholder="Search notes..."
        class="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <div class="overflow-x-auto">
      <table class="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-200">
          <th
              v-for="(column, index) in columns"
              :key="index"
              class="px-4 py-2 text-left cursor-pointer"
              @click="sortBy(column.key)"
          >
            {{ column.label }}
            <span v-if="sortKey === column.key">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
          </th>
          <th class="px-4 py-2">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="note in filteredNotes"
            :key="note.id"
            class="bg-white border-b hover:bg-gray-100"
        >
          <td class="px-4 py-2">{{ note.title }}</td>
          <td class="px-4 py-2">{{ note.content }}</td>
          <td class="px-4 py-2">{{ note.createAt }}</td>
          <td class="px-4 py-2">{{ note.updatedAt }}</td>
          <td class="px-4 py-2">
            <button
                class="text-blue-500 hover:underline"
                @click="editNote(note)"
            >
              Edit
            </button>
            <button
                class="text-red-500 hover:underline ml-2"
                @click="deleteNote(note.id)"
            >
              Delete
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import axios from "axios";

const form = ref({ id: null, title: "", content: "" });
const editMode = ref(false);
const searchTerm = ref('');
const sortKey = ref('title');
const sortDirection = ref('asc')
const notes = ref([])
const columns = [
  { label: "Title", key: "title" },
  { label: "Content", key: "content" },
  { label: "Created At", key: "createAt" },
  { label: "Updated  At", key: "updatedAt" },
]


const filteredNotes = computed( () => {
  let filtered = notes?.value.filter((note) =>
      note?.title?.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
  return filtered.sort((a, b) => {
    let modifier = sortDirection.value === "asc" ? 1 : -1;
    if (a[sortKey.value] < b[sortKey.value]) return -1 * modifier;
    if (a[sortKey.value] > b[sortKey.value]) return modifier;
    return 0;
  });
});

onMounted(async () => {
   await fetchNotes();
});

function sortBy(key: string) {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortDirection.value = "asc";
  }
}

const fetchNotes = async () => {
  try {
    const  {
      data: { data: response },
    } = await axios.get("https://localhost:7233/notes/get");
    notes.value = response;
  } catch (error) {
    console.error("Error fetching notes:", error);
  }
}

const saveNote = async () => {
  if (editMode.value) {
    await axios.put(`https://localhost:7233/note/update`, form.value);
  } else {
    await axios.post("https://localhost:7233/note/add", form.value);
  }
  await fetchNotes();
};

const editNote = (note: any) => {
  form.value = { ...note };
  editMode.value = true;
};

const deleteNote = async (id: any) => {
  await axios.delete(`https://localhost:7233/note/delete/${id}`);
  await fetchNotes();
};
</script>

<style>
</style>
