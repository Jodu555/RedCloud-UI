<template>
	<h1 class="text-center mb-5">RedCloud UI</h1>
	<ul class="nav nav-tabs" id="myTab" role="tablist">
		<li v-for="server in serverList?.servers" @click="changeServer(server)" class="nav-item" role="presentation">
			<button class="nav-link active" type="button" role="tab" :aria-controls="server" aria-selected="true">
				{{ server }}
			</button>
		</li>
	</ul>

	<!-- Tab panes -->
	<div class="tab-content">
		<div v-if="servername != ''" class="tab-pane active" role="tabpanel">
			<h3 class="mt-2">Screen: {{ servername }} - {{ status[0].toUpperCase() + status.slice(1) }}</h3>
			<!-- <pre>{{ serverData }}</pre> -->
			<div v-if="serverData != null">
				<h5>
					{{ serverData.state }} - TPS: {{ serverData.tps }} / 20 Memory: {{ serverData.memory }} Player: {{ serverData.onlineplayers }} /
					{{ serverData.maxplayers }} Motd: {{ serverData.motd }}
				</h5>
			</div>

			<div style="max-height: 60vh; overflow-y: scroll" v-if="screenData && screenData.screen.length > 0">
				<p v-for="text in screenData.screen" class="mb-0">{{ text }}</p>
				<!-- <p v-for="text in [...screenData.screen].splice(screenData?.screen.length - 25)" class="mb-0">{{ text }}</p> -->
			</div>
			<div class="d-flex">
				<form style="width: 100%" @submit.prevent="sendCommand">
					<div class="input-group mt-5 mb-3">
						<input
							type="text"
							v-model="command"
							class="form-control"
							placeholder="Command to Send to Server"
							aria-label="Command to Send to Server"
							aria-describedby="button-addon2" />
						<button class="btn btn-outline-primary" type="submit">Send</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const servername = ref('');
const command = ref('');
const API_URL = 'http://sys.jodu555.de:9090/';

async function changeServer(server: string) {
	servername.value = server;
	await executeScreenData();
	await executeServerData();
}

async function sendCommand() {
	console.log(command);
	const res = await fetch(`${API_URL}server?action=command&servername=${servername.value}&command=${command.value}`);
	const json = await res.json();
	await executeScreenData();
	await executeServerData();
	command.value = '';
}

// const { data: groupList, execute: executeGroupList } = await useAsyncData<{ groups: string[]; success: boolean }>(
// 	'groupList',
// 	async () => {
// 		const res = await fetch(`${API_URL}group?action=list`);
// 		const json = await res.json();
// 		return json;
// 	},
// 	{
// 		server: false,
// 	}
// );
const { data: serverList, execute: executeServerList } = await useAsyncData<{ servers: string[]; success: boolean }>(
	'serverList',
	async () => {
		const res = await fetch(`${API_URL}server?action=list&servername=Lobby-1`);
		const json = await res.json();
		json.servers = ['Proxy', ...json.servers];
		return json;
	},
	{
		server: false,
	}
);

const {
	data: screenData,
	execute: executeScreenData,
	status,
} = await useAsyncData<{ success: boolean; servername: string; screen: string[] }>(
	'screenData',
	async () => {
		let res = null;
		if (servername.value == 'Proxy') {
			res = await fetch(`${API_URL}proxy?action=screen`);
		} else {
			res = await fetch(`${API_URL}server?action=screen&servername=${servername.value}`);
		}
		const json = await res.json();
		json.screen = json.screen.toReversed();
		return json;
	},
	{
		server: false,
		// lazy: true,
	}
);

interface ServerInfoResponse {
	state: string;
	motd: string;
	onlineplayers: number;
	maxplayers: number;
	tps: number;
	memory: number;
}

const { data: serverData, execute: executeServerData } = await useAsyncData<ServerInfoResponse>(
	'serverData',
	async () => {
		let res = null;
		if (servername.value !== 'Proxy') {
			res = await fetch(`${API_URL}server?action=info&servername=${servername.value}`);

			const json = await res.json();
			console.log(json);

			return json;
		}
		return;
	},
	{
		server: false,
		immediate: false,
	}
);

let interval: NodeJS.Timeout;

onMounted(() => {
	interval = setInterval(async () => {
		if (servername.value !== '') {
			await executeScreenData();
			await executeServerData();
		}
	}, 1000 * 25);
});

onBeforeUnmount(() => {
	clearInterval(interval);
});

// const { data: screen, execute: executeScreen } = await useLazyFetch<{ servers: string[]; success: boolean }>(
// 	`${API_URL}server?action=screen&servername=${servername}`, {
// 		immediate: false,
// 	}
// );

// const { data: serverList, execute } = await useAsyncData('entries', async () => {
// 	return (await $fetch(`${API_URL}server?action=list`)).map((item) => {
// 		return item;
// 	});
// });
</script>
