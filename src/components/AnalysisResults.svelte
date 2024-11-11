<script>
  import { fade } from 'svelte/transition';
  
  export let analysisResults;
  let activeEvidenceIndex = null;

  function getSkillLevelColor(level) {
    const colors = {
      'Expert': 'bg-purple-100 text-purple-800',
      'Advanced': 'bg-blue-100 text-blue-800',
      'Intermediate': 'bg-green-100 text-green-800',
      'Beginner': 'bg-yellow-100 text-yellow-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  }

  function handleMouseEnter(index) {
    activeEvidenceIndex = index;
  }

  function handleMouseLeave() {
    activeEvidenceIndex = null;
  }
</script>

<div class="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 space-y-6">
  <!-- Title and Skill Level -->
  <div class="flex items-center justify-between border-b pb-4">
    <h2 class="text-2xl font-bold text-gray-900">AI Insights</h2>
    <span class="px-3 py-1 rounded-full text-sm font-medium {getSkillLevelColor(analysisResults.skillLevel)}">
      {analysisResults.skillLevel} Level
    </span>
  </div>

  <!-- Insights List -->
  <div class="space-y-4">
    {#each analysisResults.insights as insight, index}
      <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg relative group">
        <span class="text-gray-400 mt-1">•</span>
        <div class="flex-grow">
          <p class="text-gray-800 text-lg">{insight.insight}</p>
          
          <!-- Evidence Button -->
          <button
            class="absolute right-4 top-4 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            on:mouseenter={() => handleMouseEnter(index)}
            on:mouseleave={handleMouseLeave}
            aria-label="View evidence"
          >
            i
          </button>
          
          <!-- Evidence Tooltip -->
          {#if activeEvidenceIndex === index}
            <div
              class="absolute right-16 top-0 w-80 bg-white p-4 rounded-lg shadow-xl z-10"
              transition:fade={{ duration: 100 }}
            >
              <h4 class="font-semibold text-gray-900 mb-2">Evidence</h4>
              <div class="space-y-3">
                <p class="text-gray-600 text-sm">{insight.evidence.description}</p>
                <div class="text-sm">
                  <span class="text-gray-500">Location:</span>
                  <span class="text-gray-700">{insight.evidence.location}</span>
                </div>
                <div class="text-sm bg-gray-50 p-2 rounded">
                  <span class="text-gray-500 block mb-1">Technical Details:</span>
                  <span class="text-gray-700">{insight.evidence.technicalDetails}</span>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>