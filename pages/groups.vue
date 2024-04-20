<template>
	<h1 class="text-center mb-5">RedCloud UI</h1>
	<ul class="nav nav-tabs" id="myTab" role="tablist">
		<li v-for="group in groupList?.groups" @click="changeGroup(group)" class="nav-item" role="presentation">
			<button class="nav-link active" type="button" role="tab" :aria-controls="group" aria-selected="true">
				{{ group }}
			</button>
		</li>
	</ul>

	<!-- Tab panes -->
	<div class="tab-content">
		<div v-if="groupname != ''" class="tab-pane active" role="tabpanel">
			<h3 class="mt-2">Group Info: {{ groupname }} - {{ status[0].toUpperCase() + status.slice(1) }}</h3>
			<div class="mt-3 d-flex justify-content-center gap-5">
				<ul class="list-group w-25">
					<li class="list-group-item">
						Groupname: <b>{{ groupInfo?.groupname }}</b>
					</li>
					<li class="list-group-item">
						Version: <b>{{ groupInfo?.version }}</b>
					</li>
					<li class="list-group-item">
						ServerType: <b>{{ groupInfo?.serverType }}</b>
					</li>
					<li class="list-group-item">
						Maintenance: <b>{{ groupInfo?.maintenance }}</b>
					</li>
					<li class="list-group-item">
						Activated: <b>{{ groupInfo?.activated }}</b>
					</li>
				</ul>
				<ul class="list-group w-25">
					<li class="list-group-item">
						MaxPlayers: <b>{{ groupInfo?.maxPlayers }}</b>
					</li>
					<li class="list-group-item">
						MinOnlineServers: <b>{{ groupInfo?.minOnlineServers }}</b>
					</li>
					<li class="list-group-item">
						MaxOnlineServers: <b>{{ groupInfo?.maxOnlineServers }}</b>
					</li>
					<li class="list-group-item">
						Memory: <b>{{ groupInfo?.memory }} </b> MB
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
const API_URL = 'http://sys.jodu555.de:9090/';
const groupname = ref('');

async function changeGroup(group: string) {
	groupname.value = group;
	await executeGroupList();
	await executeGroupInfo();
}

const {
	data: groupList,
	execute: executeGroupList,
	status,
} = await useAsyncData<{ groups: string[]; success: boolean }>(
	'groupList',
	async () => {
		const res = await fetch(`${API_URL}group?action=list`);
		const json = await res.json();
		json.groups = json.groups.toReversed();
		return json;
	},
	{
		server: false,
	}
);

interface ServerGroupResponse {
	groupname: string;
	version: string;
	serverType: string;
	maintenance: boolean;
	activated: boolean;
	maxPlayers: number;
	minOnlineServers: number;
	maxOnlineServers: number;
	memory: number;
}

const { data: groupInfo, execute: executeGroupInfo } = await useAsyncData<ServerGroupResponse>(
	'groupInfo',
	async () => {
		const res = await fetch(`${API_URL}group?action=info&name=${groupname.value}`);
		const json = await res.json();
		return json;
	},
	{
		server: false,
		immediate: false,
	}
);
</script>
<style lang=""></style>
