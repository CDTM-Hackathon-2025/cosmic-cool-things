# Republica - your personal advisor

## One Sentence Pitch

The only app you need to manage every part of your financial life, to democratize wealth. 

## Product Overview
Our project redefines banking by introducing Republica, a multimodal assistant integrated into the Trade Republic app. While traditional banks offer static interfaces, Republica enables intuitive interaction via speech and text, adapting to all users. It educates users on markets, offers investment insights, supports wealth building, and simplifies the German tax system. A personalized "For You" page additionally visualizes portfolio data, categorizes expenses, and delivers short market summaries and curated content. Republica transforms everyday banking into an interactive, intelligent, and accessible experience for everyone.

Click [here](https://preview--trade-republic-by-byteforce.lovable.app/) to launch the app or follow the steps below to install 

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

![Figma App](CDTM_TradeRepublic.png)

## Tech Stack

This project is built by embedding a fine-tuned LLM pipeline as a backbone to a custom-developed interface. The interface has been set up using Vite to handle builds and dev tooling, TypeScript for maintainable and developer-friendly code, React and shadcn-ui to provide ready-to-use UI components, and Tailwind CSS for styling. We have used various LLM-based tools to speed up development, such as Lovable and ChatGPT. Within the app, we enable an efficient structure for generating safe OpenAI API requests for interaction via voice and chat. We use models such as mistral-large-latest, gpt-4o-mini, whisper-1 and tts-1. Tools such as Beyond Presence and HeyGen have been employed for automated video content generation to enable user-friendly way of conveying essential information.   

## Challenges faced

- building a front end as developers with no front-end dev experience might result in a wild ride -> luckily, tools like [Lovable](https://lovable.dev/) can be impressively useful! most important thing is to focus on fast iteration instead of lengthy prompts

- making sure the other person really understands what you envision for how a feature should look like and be used when implemented -> use tools like [Figma](https://www.figma.com) to quickly visualize your idea so other people see what you are thinking about

## Applycation for CDTM Challenges
### "Best Use of La Plateforme/ Mistral models" by Mistral
By leveraging the capabilities of the newest Mistral LLM models, we enable more intuitive and efficient user interaction. Such integration ensures that the users receive the most relevant information and are able to make informed choices concerning their wealth management. 

### "Most potential to earn real money" by Visionaries Club
Streamline customer experience concerning wealth management by centralising core activities within one app. Integration of tax management within banking allows users to monitor, analyse and streamline related processes beyond what is feasible with currently used (separated) approaches. It's an industry-leading idea to revolutionise the future of private finance. 

### "Best Use of Real-Time Interactive Avatars" by Beyond Presence

Our vision to centralise and streamline wealth management with Tax processes integration in banking requires building new user interfaces. We believe that the future lies in enabling familiar user interaction concepts with the latest technologies. Interactive Avatars provide exactly that. We integrate Avatar as a friendly helper for Tax management, allowing clear and efficient interaction. 

### "Best use of AI to improve processes" by Celonis
In a human-in-the-loop setup to detect and classify tax-relevant information automatically. This enables a fully streamlined tax process within the Trade Republic app which, no one else can currently offer.

### "Why Not? Biggest Creative Risk" by Tanso
We should win this challenge because we took a huge development risk. Without prior UX or integration experience, we built a full user interface mirroring the Trade Republic app. Coming from a completely different background, we eagerly added every feature we could imagine. High risk, high reward—our bold approach sets us apart.

## Interesting Facts

This project took about 
- 250 Lovable-tokens to create.
- 4 people working about 24 hrs each.

# People Involved

- [Marko Alten](https://github.com/orgs/CDTM-Hackathon-2025/people/m4rk0401)
- [Finn Schäfer](https://github.com/orgs/CDTM-Hackathon-2025/people/finn1901)
- [Vasilije Rakčević](https://github.com/orgs/CDTM-Hackathon-2025/people/VasilyRakche)
- [Henri Höchter](https://github.com/orgs/CDTM-Hackathon-2025/people/henrihoechter)
