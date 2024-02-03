<script>
	import SimViewer from './UI/SimViewer.svelte';
    import { setContext } from "svelte";
    
   
	let App = new class {
		
	}

	window.App = App;
	setContext('App', App);
</script>
<main>
	<SimViewer></SimViewer>
	
	
</main>

<style>
	
</style>