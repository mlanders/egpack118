<script lang="ts">
    interface Props {
        label: string;
        value: string;
        variant?: "default" | "highlight" | "positive" | "negative" | "warning";
        icon?: string;
        size?: "normal" | "large" | "small";
    }

    let {
        label,
        value,
        variant = "default",
        icon,
        size = "normal",
    }: Props = $props();

    const variantClasses = {
        default: "bg-white border-gray-200",
        highlight: "bg-blue-50 border-blue-200",
        positive: "bg-green-50 border-green-200",
        negative: "bg-red-50 border-red-200",
        warning: "bg-yellow-50 border-yellow-200",
    };

    const valueClasses = {
        normal: "text-2xl",
        large: "text-3xl",
        small: "text-xl",
    };
</script>

<div
    class="rounded-lg border p-4 {variantClasses[
        variant
    ]} transition-all hover:shadow-sm"
>
    <div class="flex items-start justify-between">
        <div class="flex-1">
            <p
                class="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1.5"
            >
                {label}
            </p>
            <p class="font-semibold text-gray-900 {valueClasses[size]}">
                {value}
            </p>
        </div>
        {#if icon}
            <div class="text-gray-400 ml-3">
                {@html icon}
            </div>
        {/if}
    </div>
</div>
