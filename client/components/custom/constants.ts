export const sampleMessages = [
    {
        id:"1",
        role: "user",
        content: "I need a professional LinkedIn post about the impact of remote work on team collaboration. Can you help me draft something engaging?"
    },
    {
        id: "2",
        role: "assistant",
    content: "Of course! I'd be happy to help you create a compelling LinkedIn post about remote work and team collaboration.\n\nTo tailor this perfectly for you:\n\n📝 **Length**: Professional (2-3 paragraphs)\n🎯 **Tone**: Insightful & forward-looking\n🏷️ **Hashtags**: #RemoteWork #FutureOfWork #TeamCollaboration #DigitalTransformation #WorkFromHome\n\nWould you like me to proceed with these settings, or would you prefer a different approach?",
        metadata: {
            length: "professional",
            tone: "insightful",
            hashtags: ["RemoteWork", "FutureOfWork", "TeamCollaboration", "DigitalTransformation", "WorkFromHome"]
        },
        post: {
            platform: "linkedin",
            content: `The remote work revolution isn't just changing WHERE we work—it's transforming HOW we collaborate.

📊 Studies show that remote teams who prioritize intentional communication see:
• 45% increase in productivity
• 32% higher employee satisfaction
• 67% better work-life balance

The secret? It's not about replicating office culture online—it's about creating something entirely new. Virtual water cooler moments, async documentation, and clear communication protocols are becoming the foundation of successful distributed teams.

The future of work isn't about location—it's about connection. How is your team building meaningful collaboration in this new era?`,
            hashtags: ["#RemoteWork", "#FutureOfWork", "#TeamCollaboration", "#DigitalTransformation", "#WorkFromHome"],
            engagement: "12.4K views"
        }
    },
    {
        id: "3",

        role: "user",
        content: "Yes, that sounds good. Make it more data-driven and include some statistics if possible."
    },
    {
        id: "4",

        role: "assistant",
        content: "Great choice! Here's your data-driven LinkedIn post:\n\n\"The remote work revolution isn't just changing WHERE we work—it's transforming HOW we collaborate. \n\n📊 Recent studies show that 77% of remote workers report greater productivity, while 85% of businesses confirm that flexibility has become key to talent retention. \n\nBut here's the real insight: the most successful remote teams aren't just using better tools—they're building better communication habits. Daily check-ins, virtual coffee breaks, and clear async workflows are becoming the new normal.\n\nThe future isn't about returning to offices; it's about creating workspaces that transcend physical boundaries. How is your team adapting?\"\n\n🔖 #RemoteWork #FutureOfWork #TeamCollaboration #WorkFromHome #BusinessTransformation\n\nWould you like me to adjust the tone or add any specific points?",
        metadata: {
            length: "professional",
            tone: "data-driven",
            hashtags: ["RemoteWork", "FutureOfWork", "TeamCollaboration", "WorkFromHome", "BusinessTransformation"],
            includesStats: true
        },
        post: {
            platform: "linkedin",
            content: `The data is in: Remote work is revolutionizing collaboration, not hindering it.

📊 By the numbers:
• 77% of remote workers report higher productivity
• 85% of businesses say flexibility improves retention
• 68% of meetings could be async emails
• 42% increase in deep work hours

The most successful teams aren't just using Zoom—they're redesigning workflows from the ground up. Async documentation, clear communication protocols, and intentional connection points are replacing the traditional office.

The office isn't disappearing—it's evolving. And the data shows we're better for it.`,
            hashtags: ["#RemoteWork", "#FutureOfWork", "#TeamCollaboration", "#WorkFromHome", "#BusinessTransformation"],
            engagement: "8.2K views • 324 likes"
        }
    },
    {
        id: "5",
        role: "user",
        content: "This is good! Can you make a shorter version for Twitter/X? More punchy and engaging."
    },
    {
        id: "6",
        role: "assistant",
        content: "Absolutely! Here's a punchy Twitter version:\n\n\"Remote work isn't killing collaboration—it's reinventing it. 🚀\n\n77% of remote workers are MORE productive\n85% of companies say flexibility = better retention\n\nThe secret? Better habits > better offices\n\nHow's your team thriving remotely? 👇\"\n\n🔖 #RemoteWork #FutureOfWork #Teamwork #WFH",
        metadata: {
            platform: "twitter",
            length: "short",
            tone: "punchy",
            hashtags: ["RemoteWork", "FutureOfWork", "Teamwork", "WFH"],
            characterCount: 248
        },
        post: {
            platform: "twitter",
            content: `Remote work isn't killing collaboration—it's reinventing it. 🚀

77% of remote workers are MORE productive
85% of companies say flexibility = better retention

The secret? Better habits > better offices

How's your team thriving remotely? 👇`,
            hashtags: ["#RemoteWork", "#FutureOfWork", "#Teamwork", "#WFH"],
            engagement: "1.2K retweets • 4.8K likes"
        }
    },
    {
        id: "7",
        role: "user",
        content: "Perfect! Now create an Instagram carousel post concept about AI in healthcare with an inspirational tone."
    },
    {
        id: "8",
        role: "assistant",
        content: "Here's your Instagram carousel concept about AI in healthcare:\n\n**Carousel Concept: \"Healing with Intelligence\"**\n\nSlide 1 (Hook):\n\"When AI meets healthcare, miracles happen 💫\nSwipe to see how technology is saving lives →\"\n\nSlide 2 (Problem):\n\"The Challenge: \n• 8.6M people die from cancer yearly\n• Medical errors: 3rd leading cause of death\n• Healthcare worker burnout at 63%\"\n\nSlide 3 (AI Solution):\n\"The AI Revolution:\n• 99% accurate cancer detection\n• 30% faster diagnosis\n• Personalized treatment plans\n• 24/7 virtual health assistants\"\n\nSlide 4 (Inspiration):\n\"This isn't just technology—it's hope. It's second chances. It's the future of healing. \n\nWhat medical breakthrough inspires you most? 💙\"\n\n🔖 #AIinHealthcare #MedicalAI #HealthTech #FutureofMedicine #DigitalHealth #AIforGood\n\nWould you like me to create the actual carousel images or adjust any slides?",
        metadata: {
            platform: "instagram",
            format: "carousel",
            tone: "inspirational",
            hashtags: ["AIinHealthcare", "MedicalAI", "HealthTech", "FutureofMedicine", "DigitalHealth", "AIforGood"]
        },
        post: {
            platform: "instagram",
            content: `When AI meets healthcare, miracles happen 💫

This isn't just technology—it's hope. It's second chances. It's the future of healing.

🌟 AI breakthroughs changing lives:
• 99% accurate cancer detection
• 30% faster diagnosis times  
• Personalized treatment plans
• 24/7 virtual health assistants

What medical breakthrough inspires you most? 💙`,
            hashtags: ["#AIinHealthcare", "#MedicalAI", "#HealthTech", "#FutureofMedicine", "#DigitalHealth", "#AIforGood"],
            engagement: "24.5K likes • 892 comments"
        }
    },
    {
        id: "9",
        role: "user",
        content: "Create a Threads post about sustainable fashion, make it conversational and include a call-to-action."
    },
    {
        id: "10",

        role: "assistant",
        content: "Here's your conversational Threads post about sustainable fashion:\n\n\"Let's talk about the clothes in your closet 👕\n\nThread 1/5:\nEver stop to think about the journey of your favorite t-shirt? From cotton fields to factory floors to your wardrobe—it's traveled further than most of us!\n\nThread 2/5:\nThe fashion industry contributes to 10% of global carbon emissions. That's more than international flights AND maritime shipping combined. 😳\n\nThread 3/5:\nBut here's the good news: sustainable fashion isn't about buying less—it's about buying better. Quality over quantity, timeless over trendy.\n\nThread 4/5:\nThree simple switches that make a difference:\n• Choose natural fibers 🌿\n• Support ethical brands ✨\n• Embrace second-hand finds 🔄\n\nThread 5/5:\nYour turn! What's one sustainable fashion choice you've made recently? Share below—let's inspire each other! 👇\n\n🔖 #SustainableFashion #EthicalFashion #SlowFashion #ConsciousConsumer #FashionRevolution\"",
        metadata: {
            platform: "threads",
            tone: "conversational",
            hasCTA: true,
            hashtags: ["SustainableFashion", "EthicalFashion", "SlowFashion", "ConsciousConsumer", "FashionRevolution"]
        },
        post: {
            platform: "threads",
            content: `Let's talk about the clothes in your closet 👕

Ever stop to think about the journey of your favorite t-shirt? From cotton fields to factory floors to your wardrobe—it's traveled further than most of us!

The fashion industry contributes to 10% of global carbon emissions. That's more than international flights AND maritime shipping combined. 😳

But here's the good news: sustainable fashion isn't about buying less—it's about buying better. Quality over quantity, timeless over trendy.

Three simple switches that make a difference:
• Choose natural fibers 🌿
• Support ethical brands ✨  
• Embrace second-hand finds 🔄

Your turn! What's one sustainable fashion choice you've made recently? Share below—let's inspire each other! 👇`,
            hashtags: ["#SustainableFashion", "#EthicalFashion", "#SlowFashion", "#ConsciousConsumer", "#FashionRevolution"],
            engagement: "15.3K replies • 42.1K likes"
        }
    },
    {
        id: "11",
        role: "user",
        content: "Make a LinkedIn post for my personal brand about leadership in crisis situations. Professional but personal tone."
    },
    {
        id: "12",
        role: "assistant",
        content: "Here's your personal-brand leadership post for LinkedIn:\n\n\"Leading Through Storms: Lessons from the Front Lines\n\nI'll never forget March 2020. Overnight, our entire operational playbook became obsolete. Teams were scared, clients were anxious, and the future felt uncertain.\n\nBut crisis doesn't create character—it reveals it.\n\nHere's what I learned about leadership when everything was on the line:\n\n1. **Transparency builds trust** - I shared our challenges openly with the team\n2. **Empathy is strategy** - Understanding personal circumstances became business-critical\n3. **Decisive action creates calm** - Even imperfect decisions were better than paralysis\n\nThe most valuable lesson? Your team doesn't need you to have all the answers—they need you to create space for finding them together.\n\nWhat's your biggest leadership lesson from challenging times? I'd love to hear your experiences in the comments.\n\n#Leadership #CrisisManagement #TeamBuilding #BusinessStrategy #PersonalGrowth\"",
        metadata: {
            platform: "linkedin",
            tone: "professional_personal",
            length: "medium",
            hashtags: ["Leadership", "CrisisManagement", "TeamBuilding", "BusinessStrategy", "PersonalGrowth"]
        },
        post: {
            platform: "linkedin",
            content: `Leading Through Storms: Lessons from the Front Lines

I'll never forget March 2020. Overnight, our entire operational playbook became obsolete. Teams were scared, clients were anxious, and the future felt uncertain.

But crisis doesn't create character—it reveals it.

Here's what I learned about leadership when everything was on the line:

1. **Transparency builds trust** - I shared our challenges openly with the team
2. **Empathy is strategy** - Understanding personal circumstances became business-critical  
3. **Decisive action creates calm** - Even imperfect decisions were better than paralysis

The most valuable lesson? Your team doesn't need you to have all the answers—they need you to create space for finding them together.

What's your biggest leadership lesson from challenging times? I'd love to hear your experiences in the comments.`,
            hashtags: ["#Leadership", "#CrisisManagement", "#TeamBuilding", "#BusinessStrategy", "#PersonalGrowth"],
            engagement: "45.2K views • 1.8K likes"
        }
    },
    {
        id: "13",
        role: "user",
        content: "Generate a Twitter thread about crypto regulation that's educational but not too technical."
    },
    {
        id: "14",
        role: "assistant",
        content: "Here's your educational Twitter thread about crypto regulation:\n\n\"Crypto Regulation Explained (without the jargon) 🧵\n\n1/6\nThink of crypto regulation like traffic rules 🚦\n\nNo rules = chaos and crashes\nToo many rules = gridlock\nThe right rules = safe journey for everyone\n\n2/6\nWhy regulation matters:\n• Protects investors from scams\n• Prevents money laundering \n• Creates clear rules for businesses\n• Builds trust in the system\n\n3/6\nCurrent challenges:\n• Different countries, different rules 🌍\n• Technology moves faster than laws\n• Balancing innovation with protection\n\n4/6\nWhat good regulation looks like:\n• Clear guidelines for projects\n• Consumer protection measures\n• Support for legitimate innovation\n• International cooperation\n\n5/6\nThe future? Regulation isn't the enemy of crypto—it's the key to mass adoption. \n\nWhen grandma can safely buy Bitcoin, we'll know we've succeeded.\n\n6/6\nWhat's your biggest question about crypto regulation? Drop it below! 👇\n\n#Crypto #Blockchain #Regulation #Web3 #Fintech\"",
        metadata: {
            platform: "twitter",
            format: "thread",
            tone: "educational",
            hashtags: ["Crypto", "Blockchain", "Regulation", "Web3", "Fintech"]
        },
        post: {
            platform: "twitter",
            content: `Crypto Regulation Explained (without the jargon) 🧵

1/6
Think of crypto regulation like traffic rules 🚦

No rules = chaos and crashes
Too many rules = gridlock  
The right rules = safe journey for everyone

2/6
Why regulation matters:
• Protects investors from scams
• Prevents money laundering
• Creates clear rules for businesses
• Builds trust in the system

3/6
Current challenges:
• Different countries, different rules 🌍
• Technology moves faster than laws
• Balancing innovation with protection

4/6
What good regulation looks like:
• Clear guidelines for projects
• Consumer protection measures
• Support for legitimate innovation
• International cooperation

5/6
The future? Regulation isn't the enemy of crypto—it's the key to mass adoption.

When grandma can safely buy Bitcoin, we'll know we've succeeded.

6/6
What's your biggest question about crypto regulation? Drop it below! 👇`,
            hashtags: ["#Crypto", "#Blockchain", "#Regulation", "#Web3", "#Fintech"],
            engagement: "3.4K retweets • 12.8K likes"
        }
    },
    {
        id: "15",
        role: "user",
        content: "Create a Facebook post for a small business anniversary - 5 years in business. Emotional and grateful tone."
    },
    {
        id: "16",
        role: "assistant",
        content: "Here's your emotional Facebook anniversary post:\n\n\"5 Years. 1,825 Days. Countless Memories. ❤️\n\nToday, we're celebrating a milestone we once only dreamed of: 5 years in business!\n\nWhen we first opened our doors in 2019, we were just two people with a big idea and even bigger hopes. We never imagined we'd be here today, serving this incredible community.\n\nTo our amazing customers: You're not just clients—you've become family. Your support through late nights, challenging times, and global uncertainty has meant everything.\n\nTo our wonderful team: Your dedication and passion inspire us daily. You've turned our vision into reality.\n\nTo anyone thinking about starting their own business: Take that leap. The late nights are worth it. The challenges make you stronger. The community you build becomes your foundation.\n\nFrom the bottom of our hearts, thank you for being part of our story. Here's to the next chapter! 🥂\n\n#SmallBusiness #Anniversary #5YearsInBusiness #Grateful #Entrepreneurship #CommunityLove\"",
        metadata: {
            platform: "facebook",
            tone: "emotional_grateful",
            hashtags: ["SmallBusiness", "Anniversary", "5YearsInBusiness", "Grateful", "Entrepreneurship", "CommunityLove"]
        },
        post: {
            platform: "facebook",
            content: `5 Years. 1,825 Days. Countless Memories. ❤️

Today, we're celebrating a milestone we once only dreamed of: 5 years in business!

When we first opened our doors in 2019, we were just two people with a big idea and even bigger hopes. We never imagined we'd be here today, serving this incredible community.

To our amazing customers: You're not just clients—you've become family. Your support through late nights, challenging times, and global uncertainty has meant everything.

To our wonderful team: Your dedication and passion inspire us daily. You've turned our vision into reality.

From the bottom of our hearts, thank you for being part of our story. Here's to the next chapter! 🥂`,
            hashtags: ["#SmallBusiness", "#Anniversary", "#5YearsInBusiness", "#Grateful", "#Entrepreneurship", "#CommunityLove"],
            engagement: "2.4K reactions • 487 comments"
        }
    },
    {
        id: "17",
        role: "user",
        content: "Make a professional announcement post for LinkedIn about a new product launch at our tech startup."
    },
    {
        id: "18",
        role: "assistant",
        content: "Here's your professional product launch announcement for LinkedIn:\n\n\"Announcing a New Era in [Your Industry]: Introducing [Product Name] 🚀\n\nAfter 18 months of relentless innovation and customer collaboration, I'm thrilled to announce that [Company Name] is launching [Product Name]—the solution that's set to redefine how businesses approach [problem you solve].\n\nWhy this matters:\n• **3x faster** processing than current solutions\n• **67% reduction** in operational costs\n• **Enterprise-grade security** with startup agility\n• **Seamless integration** with existing workflows\n\nThis isn't just another product—it's the culmination of listening to our customers' biggest challenges and building the solution they truly need.\n\nI'm incredibly proud of our team's dedication and grateful to our early adopters who helped shape this vision into reality.\n\nReady to experience the future of [your industry]? \n👉 Learn more: [Your Website Link]\n👉 Schedule a demo: [Calendly Link]\n\nThe future is here, and we're just getting started.\n\n#ProductLaunch #TechInnovation #StartupLife #BusinessTransformation #SaaS #Innovation\"",
        metadata: {
            platform: "linkedin",
            tone: "professional_announcement",
            hasCTA: true,
            hashtags: ["ProductLaunch", "TechInnovation", "StartupLife", "BusinessTransformation", "SaaS", "Innovation"]
        },
        post: {
            platform: "linkedin",
            content: `Announcing a New Era in Tech: Introducing NovaAI 🚀

After 18 months of relentless innovation, I'm thrilled to announce that QuantumLeap is launching NovaAI—the solution that redefines how businesses approach workflow automation.

Why this matters:
• 3x faster processing than current solutions
• 67% reduction in operational costs
• Enterprise-grade security with startup agility
• Seamless integration with existing workflows

This isn't just another product—it's the culmination of listening to our customers' biggest challenges and building the solution they truly need.

Ready to experience the future of workflow automation?
👉 Learn more: quantumleap.ai/nova
👉 Schedule a demo: calendly.com/quantumleap

The future is here, and we're just getting started.`,
            hashtags: ["#ProductLaunch", "#TechInnovation", "#StartupLife", "#BusinessTransformation", "#SaaS", "#Innovation"],
            engagement: "89.4K views • 3.2K likes"
        }
    }
];