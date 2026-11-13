# Midnight Studio

A GitHub Pages gallery for a daily 1024 × 1024 image, with a separate date-based prompt planner. GitHub Actions calls the OpenAI Images API using a repository secret.

## Publish

1. Push these files to the main branch of a new public GitHub repository.
2. In **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**.
3. In **Settings → Secrets and variables → Actions**, add a repository secret named **OPENAI_API_KEY**. Use a key from an OpenAI API project with billing and image-model access. Keep it out of prompts, source files, and chat.
4. Open **Actions → Midnight Studio → Run workflow** on main to deploy immediately. The Pages URL appears under **Settings → Pages** after deployment.

## Schedule images

Open **Schedule prompts**, choose an India date, and follow the GitHub editor link to create or edit the dated prompt file. Commit the prompt to main before midnight India time. Only repository collaborators with write access can commit directly. The prompts and published images are public.

The daily trigger is 18:30 UTC, which is midnight India time on the next calendar date. For example, 18:30 UTC on 1 November triggers the 2 November prompt. GitHub can delay or skip a scheduled run. OpenAI generation and Pages deployment take additional time. If a date is missed, manually run the workflow with that India date. A date with an existing image skips generation, as does a date without a prompt. The gallery keeps showing the latest available image with its date.

OpenAI API charges apply on generation. GitHub can disable scheduled workflows in public repos after 60 days without repository activity.

