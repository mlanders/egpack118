<script>
    let openItems = new Set();

    function toggleItem(index) {
        if (openItems.has(index)) {
            openItems.delete(index);
        } else {
            openItems.add(index);
        }
        openItems = openItems; // trigger reactivity
    }

    const faqs = [
        {
            category: "Getting Started",
            questions: [
                {
                    question: "What ages can join Cub Scouts?",
                    answer: "Cub Scouts is for boys and girls in Kindergarten through 5th grade (ages 5-10). Scouts must be in Kindergarten AND at least 5 years old. We don't currently have a curriculum for Transitional Kindergarten (TK), so it's best to wait until entering Kindergarten."
                },
                {
                    question: "How do I register my child?",
                    answer: "The best way to start is to attend one of our pack meetings (2nd Tuesday of each month at 6:15pm). You can meet the leaders, see what we do, and get help with registration. You can also email us at ElkGrovePack118@gmail.com for more information."
                },
                {
                    question: "What does it cost?",
                    answer: "There are two fees: (1) Registration Fee of $165 paid to Scouting America, which covers national and council registration. (2) Pack Fee of $100 paid to Pack 118, which covers rank badges, adventure belt loops, awards, Pinewood Derby, supplies, and celebrations like the Blue and Gold Banquet."
                },
                {
                    question: "Can my child join mid-year?",
                    answer: "Yes! Scouts can join at any time during the year. We'll help your scout catch up on any advancement requirements they may have missed."
                },
                {
                    question: "Is Cub Scouts co-ed?",
                    answer: "Yes! Cub Scouts welcomes both boys and girls. Dens may be single-gender or co-ed depending on enrollment."
                }
            ]
        },
        {
            category: "Meetings & Schedule",
            questions: [
                {
                    question: "When and where are pack meetings?",
                    answer: "Pack meetings are held on the 2nd Tuesday of each month from 6:15pm to 7:30pm at the United Methodist Church (3329 Point Pleasant Rd, Elk Grove, CA 95757)."
                },
                {
                    question: "What are den meetings?",
                    answer: "Den meetings are smaller gatherings organized by grade level (Lions, Tigers, Wolves, Bears, Webelos). These typically meet monthly and are where scouts work on advancement requirements, crafts, and activities. Your den leader will communicate the schedule."
                },
                {
                    question: "What if we can't attend every meeting?",
                    answer: "We understand families have busy schedules! While regular attendance helps scouts advance and build friendships, we know conflicts happen. Just communicate with your den leader if you'll miss meetings."
                },
                {
                    question: "Are parents required to stay?",
                    answer: "Yes, at least one parent/guardian must remain during all Cub Scout activities. Scouting America requires adult supervision, and parent involvement is a key part of the Cub Scout experience."
                }
            ]
        },
        {
            category: "Uniforms & Equipment",
            questions: [
                {
                    question: "Does my scout need a uniform?",
                    answer: "While uniforms aren't mandatory at first, they are strongly encouraged. The uniform helps build a sense of belonging and pride. At minimum, scouts should have a Class A uniform shirt for ceremonies and special events. Uniforms can be purchased at the Scout Shop or online."
                },
                {
                    question: "What should my scout wear to meetings?",
                    answer: "Scouts should wear their Class A uniform (blue shirt with patches) or pack/den t-shirt if provided. Otherwise, comfortable clothes appropriate for activities are fine."
                },
                {
                    question: "Where do I get patches and badges?",
                    answer: "Rank badges and adventure loops are covered by your Pack Fee and will be distributed by den leaders. You'll need to purchase the den number, pack number, and council patches separately. Your den leader can provide guidance on placement."
                },
                {
                    question: "What should scouts bring to meetings?",
                    answer: "Scouts should bring their handbook (provided at registration), a water bottle, and any specific items requested by the den leader. A small backpack is helpful for carrying supplies."
                }
            ]
        },
        {
            category: "Advancement & Activities",
            questions: [
                {
                    question: "How does advancement work?",
                    answer: "Scouts earn rank badges and adventure loops by completing age-appropriate requirements in their handbook. Work is done at den meetings, pack meetings, and at home with parents. Leaders track progress and scouts are recognized at pack meetings."
                },
                {
                    question: "What is the Pinewood Derby?",
                    answer: "The Pinewood Derby is one of our most popular events! Scouts build and race wooden cars. We provide awards for speed, design, and even the slowest car. It's a great opportunity for scouts and parents to work together on a project. Visit our Pinewood Derby page for rules and tips."
                },
                {
                    question: "What camping trips does Pack 118 do?",
                    answer: "We organize family camping trips throughout the year at various locations. These are typically one-night trips and are designed to be beginner-friendly. No prior camping experience is necessary!"
                },
                {
                    question: "What is the Blue & Gold Banquet?",
                    answer: "The Blue & Gold Banquet is our annual spring celebration honoring Scouting America's birthday. It includes dinner, awards, and recognition of scouts' achievements throughout the year."
                }
            ]
        },
        {
            category: "Parent Involvement",
            questions: [
                {
                    question: "Do I need to volunteer?",
                    answer: "Pack 118 is entirely volunteer-run, so we rely on parent participation. While not every parent needs to be a leader, we ask all families to help with at least one activity or event during the year. Many hands make light work!"
                },
                {
                    question: "What if I want to become a leader?",
                    answer: "We always welcome new leaders! Den leaders, committee members, and activity coordinators are all needed. All leaders must complete an application, background check, and Youth Protection Training. Visit our Become a Leader page for details."
                },
                {
                    question: "Do I need camping experience to help?",
                    answer: "Not at all! Many of our leaders and parents were camping beginners. We learn together, and experienced scouts and leaders are always happy to help newcomers."
                }
            ]
        },
        {
            category: "Other Questions",
            questions: [
                {
                    question: "What fundraisers does Pack 118 participate in?",
                    answer: "We typically participate in popcorn sales and other fundraising activities. Funds raised help offset costs for special events, camping trips, and equipment. Participation is encouraged but not required."
                },
                {
                    question: "Can my scout's sibling attend meetings?",
                    answer: "Younger siblings are welcome to attend pack meetings with a parent/guardian, but den meetings are designed for the specific age group. We ask that siblings be supervised by parents and don't disrupt the meeting."
                },
                {
                    question: "What if my scout has special needs?",
                    answer: "We welcome all scouts! Please communicate with the Cubmaster or your den leader about any accommodations your scout may need. We'll work together to ensure everyone can participate."
                },
                {
                    question: "How can I stay informed about pack activities?",
                    answer: "Check our calendar page for upcoming events. Your den leader will also communicate via email or messaging apps. Make sure to provide current contact information when you register."
                }
            ]
        }
    ];
</script>

<svelte:head>
    <title>FAQ - Cub Scout Pack 118</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <!-- Page Header -->
    <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
        </h1>
        <p class="text-xl text-gray-600">
            Everything you need to know about Pack 118
        </p>
    </div>

    <!-- FAQ Sections -->
    {#each faqs as section, sectionIndex}
        <div class="mb-12">
            <h2 class="text-2xl font-bold text-scout-blue mb-6">
                {section.category}
            </h2>
            <div class="space-y-4">
                {#each section.questions as item, questionIndex}
                    {@const index = `${sectionIndex}-${questionIndex}`}
                    <div
                        class="bg-white border-2 border-gray-200 rounded-lg overflow-hidden"
                    >
                        <button
                            class="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                            on:click={() => toggleItem(index)}
                        >
                            <span class="font-semibold text-gray-900 pr-4">
                                {item.question}
                            </span>
                            <svg
                                class="w-5 h-5 text-scout-blue flex-shrink-0 transition-transform {openItems.has(
                                    index
                                )
                                    ? 'rotate-180'
                                    : ''}"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>
                        {#if openItems.has(index)}
                            <div class="px-6 pb-4 text-gray-700">
                                {item.answer}
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    {/each}

    <!-- Contact Section -->
    <div
        class="mt-16 bg-gradient-to-r from-scout-blue to-blue-600 text-white rounded-lg p-8 text-center"
    >
        <h2 class="text-2xl font-bold mb-4">Still Have Questions?</h2>
        <p class="text-lg mb-6">
            We're here to help! Reach out to us and we'll get back to you soon.
        </p>
        <a
            href="mailto:ElkGrovePack118@gmail.com"
            class="inline-block bg-white text-scout-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
            Contact Us
        </a>
    </div>
</div>
