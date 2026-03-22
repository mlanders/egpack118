<script>
  const resources = [
    {
      label: "University of Scouting",
      href: "/resources/university-of-scouting",
      description:
        "Presentations and materials from University of Scouting sessions, including New Cub Parent Orientation and more.",
    },
    {
      label: "Become a Leader",
      href: "/become-a-leader",
      description:
        "Information and resources for adults interested in volunteering and leading within Pack 118.",
    },
  ];
</script>

<svelte:head>
  <title>Resources | Pack 118</title>
  <meta
    name="description"
    content="Resources for Cub Scout Pack 118 leaders, parents, and volunteers, including University of Scouting presentations and leadership information."
  />
</svelte:head>

<section class="resources-index">
  <h1>Resources</h1>
  <p class="intro">
    Explore helpful resources for Pack 118 leaders, parents, and volunteers.
  </p>
  <ul class="resource-list">
    {#each resources as resource}
      <li class="resource-item">
        <h2>
          <a href={resource.href}>{resource.label}</a>
        </h2>
        <p>{resource.description}</p>
      </li>
    {/each}
  </ul>
</section>

<style>
  .resources-index {
    max-width: 700px;
    margin: 2rem auto;
    padding: 1.5rem;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .resources-index h1 {
    margin-bottom: 0.5em;
    font-size: 2rem;
  }
  .resources-index .intro {
    font-size: 1.1rem;
    margin-bottom: 1.5em;
    color: #2a4b7c;
  }
  .resource-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .resource-item {
    margin-bottom: 2em;
    padding-bottom: 1em;
    border-bottom: 1px solid #eee;
  }
  .resource-item h2 {
    margin: 0 0 0.3em 0;
    font-size: 1.25rem;
    color: #1a5fb4;
  }
  .resource-item a {
    color: #1a5fb4;
    text-decoration: underline;
  }
  .resource-item a:hover {
    text-decoration: none;
  }
  .resource-item p {
    margin: 0;
    color: #333;
  }
</style>
