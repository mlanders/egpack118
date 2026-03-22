<script>
    // Static list of presentations for University of Scouting
    const presentations = [
        {
            title: "New Cub Parent Orientation",
            presenter: "Michael Landers",
            blurb: "How to engage, include and encourage participation by new families in your unit, utilizing their skills to make your pack program more creative and functional.",
            links: [
                {
                    label: "New Cub Parent Orientation Presentation (PPTX)",
                    href: "/src/lib/UoS/NewCubParentOrientation/New_Cub_Parent_Orientation.pptx",
                },
                {
                    label: "New Cub Scout Orientation Summary (PDF)",
                    href: "/src/lib/UoS/NewCubParentOrientation/New_Cub_Scout_Orientation_Summary.pdf",
                },
            ],
        },
        // Add more presentations here as needed
    ];
</script>

<svelte:head>
    <title>University of Scouting Presentations</title>
    <meta
        name="description"
        content="Reference materials and presentations from University of Scouting sessions for Cub Scout leaders and volunteers."
    />
</svelte:head>

<section class="uos-resource-page">
    <h1>University of Scouting</h1>
    <p class="intro">
        Explore reference materials and session presentations by Pack 118
        Leaders from the University of Scouting. These resources are provided to
        help leaders and volunteers enhance their Cub Scout programs and welcome
        new families.
    </p>

    <ul class="presentation-list">
        {#each presentations as pres}
            <li class="presentation">
                <h3>{pres.title}</h3>
                <p class="presenter">
                    <strong>Presenter:</strong>
                    {pres.presenter}
                </p>
                <p class="blurb">{pres.blurb}</p>
                <ul class="file-links">
                    {#each pres.links as link}
                        <li>
                            <a href={link.href} target="_blank" rel="noopener"
                                >{link.label}</a
                            >
                        </li>
                    {/each}
                </ul>
            </li>
        {/each}
    </ul>

    <hr />

    <p>
        <a href="/resources">← Back to Resources</a>
    </p>
</section>

<style>
    .uos-resource-page {
        max-width: 700px;
        margin: 2rem auto;
        padding: 1.5rem;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }
    .uos-resource-page h1 {
        margin-bottom: 0.5em;
        font-size: 2rem;
    }
    .uos-resource-page .intro {
        font-size: 1.1rem;
        margin-bottom: 1.5em;
        color: #2a4b7c;
    }
    .presentation-list {
        list-style: none;
        padding: 0;
        margin: 0 0 2em 0;
    }
    .presentation {
        margin-bottom: 2em;
        padding-bottom: 1em;
        border-bottom: 1px solid #eee;
    }
    .presentation h3 {
        margin: 0 0 0.3em 0;
        font-size: 1.25rem;
        color: #1a5fb4;
    }
    .presentation .presenter {
        margin: 0 0 0.3em 0;
        color: #444;
        font-size: 1rem;
    }
    .presentation .blurb {
        margin: 0 0 0.7em 0;
        color: #333;
    }
    .file-links {
        list-style: disc inside;
        margin: 0 0 0 1em;
        padding: 0;
    }
    .file-links li {
        margin-bottom: 0.3em;
    }
    .file-links a {
        color: #1a5fb4;
        text-decoration: underline;
    }
    .file-links a:hover {
        text-decoration: none;
    }
    hr {
        margin: 2em 0 1em 0;
        border: none;
        border-top: 1px solid #eee;
    }
</style>
