<script setup>
import {SquareCheckBig, TriangleAlert, X} from 'lucide-vue-next';
import draggable from 'vuedraggable';
import {computed, ref} from 'vue';
import MainForm from '@/views/Home/main/components/MainForm.vue';

const drag = ref(false);
const tasks = ref([
	{id: 1, title: 'Task 1', text: ' sdfk sldfsdf sd fs', priority: 'A', date: '03.02.2024', status: 'done'},
	{id: 2, title: 'Task 2', text: ' sdfeklurw erweoruwe', priority: 'B', date: '03.02.2024', status: 'inProgress'},
	{id: 3, title: 'Task 3', text: 'dfkj 2eiru fweou owe', priority: 'C', date: '04.02.2024', status: 'new'},
	{id: 4, title: 'Task 4', text: 'sdhfjk hskdjhfkj sdf', priority: 'A', date: '04.02.2024', status: 'new'}
]);

const getPriorityIcon = (priority) => {
	switch (priority) {
		case 'A':
			return '🔥';
		case 'B':
			return '⭐';
		case 'C':
			return '❄️';
		default:
			return '';
	}
};

const columns = computed(() => ({
	new: tasks.value.filter(task => task.status === 'new').sort(sortByPriority),
	inProgress: tasks.value.filter(task => task.status === 'inProgress').sort(sortByPriority),
	done: tasks.value.filter(task => task.status === 'done').sort(sortByPriority)
}));

const sortByPriority = (a, b) => {
	const priorityOrder = {'A': 1, 'B': 2, 'C': 3};
	return priorityOrder[a.priority] - priorityOrder[b.priority];
};

const updateTaskStatus = (columnName, evt) => {
	if (evt.added) {
		const movedItemId = evt.added.element.id;
		const movedItem = tasks.value.find(task => task.id === movedItemId);
		if (movedItem) {
			movedItem.status = columnName;
			tasks.value = [...tasks.value];
		}
	}
};
</script>

<template>
	<div class="main">
		<MainForm />

		<div class="list">
			<div class="column new">
				<p class="title">
					<X :size="20" color="red" />
					#New
				</p>

				<draggable
					v-model="columns.new"
					class="drag"
					group="tasks"
					@start="drag = true"
					@change="event => updateTaskStatus('new', event)"
					item-key="id"
				>
					<template #item="{ element }">
						<div :key="element.id" :data-id="element.id">
							<div style="display:flex; align-items: center; gap: 10px; cursor: pointer;">
								<h3>{{ getPriorityIcon(element.priority) + element.title }}</h3>
								<span>({{ element.date }})</span>
							</div>
							<p>{{ element.text }}</p>
						</div>
					</template>
				</draggable>
			</div>

			<div class="column inProgress">
				<p class="title">
					<TriangleAlert :size="20" color="yellow" />
					#In Progress
				</p>

				<draggable
					v-model="columns.inProgress"
					class="drag"
					group="tasks"
					@start="drag = true"
					@change="event => updateTaskStatus('inProgress', event)"
					item-key="id"
				>
					<template #item="{ element }">
						<div :key="element.id" :data-id="element.id">
							<div style="display:flex; align-items: center; gap: 10px;">
								<h3>{{ getPriorityIcon(element.priority) + element.title }}</h3>
								<span>({{ element.date }})</span>
							</div>
							<p>{{ element.text }}</p>
						</div>
					</template>
				</draggable>
			</div>

			<div class="column done">
				<p class="title">
					<SquareCheckBig :size="20" color="green" />
					#Done
				</p>

				<draggable
					v-model="columns.done"
					class="drag"
					group="tasks"
					@start="drag = true"
					@change="event => updateTaskStatus('done', event)"
					item-key="id"
				>
					<template #item="{ element }">
						<div class="task-done" :key="element.id" :data-id="element.id">
							<div style="display:flex; align-items: center; gap: 10px;">
								<SquareCheckBig :size="20" color="green" />
								<h3>{{ getPriorityIcon(element.priority) + element.title }}</h3>
								<span>({{ element.date }})</span>
							</div>
							<p>{{ element.text }}</p>
						</div>
					</template>
				</draggable>
			</div>
		</div>
	</div>
</template>


<style scoped>
@import 'main.css';
</style>
