<script>
    export let insignia;
    export let rank;
    export let grade;
    export let description;
</script>

<div class="flex items-start gap-4">
    <img
        src={insignia}
        alt="{rank} rank insignia"
        class="w-16 h-16 object-contain flex-shrink-0"
    />
    <div>
        <h3 class="font-bold text-gray-900 text-lg">
            {rank} ({grade})
        </h3>
        <p class="text-gray-700">
            {description}
        </p>
    </div>
</div>
