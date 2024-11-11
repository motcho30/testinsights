<script>
  import { onMount } from 'svelte';
  import AnalysisResults from './AnalysisResults.svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';

  let repoUrl = '';
  let isLoading = false;
  let error = null;
  let analysisResults = null;

  async function analyzeRepo() {
    if (!repoUrl) {
      error = 'Please enter a GitHub repository URL';
      return;
    }

    try {
      isLoading = true;
      error = null;
      analysisResults = null;

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze repository');
      }

      analysisResults = await response.json();
    } catch (err) {
      error = err.message;
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="space-y-6">
  <div class="space-y-4">
    <div class="space-y-2">
      <label for="repoUrl" class="block text-sm font-medium text-gray-700">
        GitHub Repository URL
      </label>
      <div class="relative rounded-md shadow-sm">
        <input
          type="text"
          id="repoUrl"
          bind:value={repoUrl}
          placeholder="https://github.com/username/repo"
          class="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 pl-4 pr-4 py-3 text-gray-900 placeholder-gray-500"
        />
      </div>
    </div>

    <button
      on:click={analyzeRepo}
      disabled={isLoading}
      class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {#if isLoading}
        <LoadingSpinner />
      {:else}
        Analyze Repository
      {/if}
    </button>
  </div>

  {#if error}
    <div class="rounded-md bg-red-50 p-4">
      <div class="flex">
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <div class="mt-2 text-sm text-red-700">
            {error}
          </div>
        </div>
      </div>
    </div>
  {/if}

  {#if analysisResults}
    <AnalysisResults {analysisResults} />
  {/if}
</div>