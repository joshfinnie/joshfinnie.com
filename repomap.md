# Repository Map
**Root:** `.`
**Files:** 67

---

## ./README.md
```markdown
L1   | h1         | joshfinnie.com                 | (2 lines)
L8   | h2         |   Tech Stack                   | (2 lines)
L18  | h2         |   Setup & Development          | (2 lines)
L20  | h3         |     Prerequisites              | (2 lines)
L25  | h3         |     Installation               | (2 lines)
L36  | h3         |     Development                | (2 lines)
L58  | h2         |   Working with Images          | (2 lines)
L62  | h3         |     Adding New Images          | (2 lines)
L105 | h3         |     Image Optimization         | (2 lines)
L112 | h2         |   Creating Blog Posts          | (2 lines)
L116 | h3         |     Post Template              | (2 lines)
L136 | h3         |     Required Fields            | (2 lines)
L143 | h3         |     Optional Fields            | (2 lines)
L151 | h2         |   Code Quality                 | (2 lines)
L153 | h3         |     Git Hooks                  | (2 lines)
L160 | h3         |     CI/CD Pipeline             | (2 lines)
L168 | h3         |     Formatting                 | (2 lines)
L181 | h2         |   Project Structure            | (2 lines)
L209 | h2         |   Environment Variables        | (2 lines)
L222 | h2         |   Deployment                   | (2 lines)
L230 | h2         |   Contributing                 | (2 lines)
L238 | h2         |   License                      | (2 lines)
L242 | h2         |   Contact                      | (2 lines)
```

## ./netlify/functions/currently-reading.ts
```typescript
L51  | interface_declaration | UserBook                       | (11 lines)
```

## ./scripts/rename.py
imports: glob, re, shutil

## ./scripts/update_image_refs.js
imports: fs-extra, glob, path, url
```javascript
L27  | function_declaration | toCloudinaryUrl                | (17 lines)
L48  | function_declaration | updateFile                     | (55 lines)
L107 | function_declaration | processAllFiles                | (40 lines)
```

## ./scripts/upload_to_cloudinary.js
imports: cloudinary, dotenv, fs-extra, path, url
```javascript
L37  | function_declaration | findAllImages                  | (26 lines)
L67  | function_declaration | uploadImage                    | (22 lines)
L93  | function_declaration | pathToPublicId                 | (5 lines)
L102 | function_declaration | uploadAllImages                | (101 lines)
```

## ./scripts/optimize_images.js
imports: glob, sharp

## ./scripts/sync-standard.js
imports: node:fs, node:path, @atproto/api, dotenv, glob, gray-matter, lodash.kebabcase
```javascript
L27  | function_declaration | sync                           | (140 lines)
```

## ./scripts/migrate_frontmatter.js
imports: fs-extra, glob, path, url
```javascript
L14  | function_declaration | updateFrontmatter              | (27 lines)
L45  | function_declaration | migrateAllFrontmatter          | (33 lines)
```

## ./scripts/cleanup_cloudinary.js
imports: dotenv, fs-extra, path, url
```javascript
L14  | function_declaration | cleanupUploadedImages          | (43 lines)
L58  | function_declaration | removeEmptyDirs                | (15 lines)
```

## ./src/config/nav.ts
```typescript
L1   | interface_declaration | NavLink                        | (4 lines)
```

## ./src/content.config.ts
imports: astro:content, astro/loaders, astro/zod

## ./src/components/starwind/card/index.ts
imports: ./Card.astro, ./CardAction.astro, ./CardContent.astro, ./CardDescription.astro, ./CardFooter.astro, ./CardHeader.astro, ./CardTitle.astro

## ./src/components/starwind/button/index.ts
imports: ./Button.astro

## ./src/components/starwind/collapsible/index.ts
imports: ./Collapsible.astro, ./CollapsibleContent.astro, ./CollapsibleTrigger.astro

## ./src/lib/cloudinary.ts
imports: @cloudinary/url-gen, @cloudinary/url-gen/actions/resize, @cloudinary/url-gen/qualifiers/format, @cloudinary/url-gen/qualifiers/gravity, @cloudinary/url-gen/qualifiers/quality
```typescript
L18  | function_declaration | getCloudinaryImageUrl          | (21 lines)
L43  | function_declaration | pathToPublicId                 | (6 lines)
L53  | function_declaration | getCloudName                   | (3 lines)
L60  | function_declaration | getCloudinaryBaseUrl           | (3 lines)
```

## ./src/lib/utils.ts
imports: astro:content
```typescript
L3   | function_declaration | getPublishedPosts              | (6 lines)
L12  | function_declaration | getLeftistPosts                | (6 lines)
L19  | function_declaration | getTags                        | (5 lines)
L25  | function_declaration | getSeries                      | (5 lines)
```

## ./src/collections/blog/full-stack-rust-part-2.md
```markdown
L22  | h2         |   The Problem with In-Memory Storage | (2 lines)
L30  | h2         |   Why sqlx?                    | (2 lines)
L41  | h2         |   Why SQLite?                  | (2 lines)
L51  | h2         |   Updating Dependencies        | (2 lines)
L69  | h2         |   Setting Up the Database      | (2 lines)
L108 | h2         |   Updating Our Models          | (2 lines)
L133 | h2         |   Swapping the State           | (2 lines)
L146 | h2         |   Rewriting the Handlers       | (2 lines)
L151 | h3         |     Create a Short URL         | (2 lines)
L178 | h3         |     Redirect from a Slug       | (2 lines)
L204 | h3         |     List All URLs              | (2 lines)
L223 | h2         |   Updating main                | (2 lines)
L268 | h2         |   The Full Code                | (2 lines)
L373 | h2         |   Taking It for a Spin         | (2 lines)
L412 | h2         |   Wrapping Up                  | (2 lines)
```

## ./src/collections/blog/flat_flog_an_introduction.md
```markdown
L13  | h2         |   Introduction                 | (2 lines)
L17  | h2         |   Installation                 | (2 lines)
L35  | h2         |   Create a Post                | (2 lines)
L49  | h2         |   Create a Page                | (2 lines)
L61  | h2         |   Serve in development         | (2 lines)
L72  | h2         |   Create your Static Blog      | (2 lines)
L92  | h2         |   Things TODO                  | (2 lines)
```

## ./src/collections/blog/creating-a-also-enjoy-component.md
```markdown
L78  | h2         |   Conclusion                   | (2 lines)
```

## ./src/collections/blog/why-participate-in-advent-of-code-2022.md
```markdown
L16  | h2         |   Introduction                 | (2 lines)
L24  | h3         |     Let's You Have Fun         | (2 lines)
L34  | h3         |     Let's You Improve Our Problem Solving Skills | (2 lines)
L43  | h3         |     Let's You Get Ready for the Job Market | (2 lines)
L53  | h3         |     Let's You Learn Different Programming Languages | (2 lines)
L61  | h2         |   Conclusion                   | (2 lines)
```

## ./src/collections/blog/full-stack-rust-part-6.md
```markdown
L30  | h2         |   Serving the Frontend from Axum | (2 lines)
L78  | h2         |   Dockerizing the Application  | (2 lines)
L137 | h2         |   Deploying to Shuttle         | (2 lines)
L217 | h2         |   What We Built                | (2 lines)
L230 | h2         |   Where to Go from Here        | (2 lines)
L240 | h2         |   Thank You                    | (2 lines)
```

## ./src/collections/blog/setting_up_ssl_for_wwwjoshfinniecom.md
```markdown
L21  | h3         |     The Process                | (2 lines)
L72  | h3         |     Conclusion                 | (2 lines)
```

## ./src/collections/blog/setting_up_wsl_with_asdf.md
```markdown
L19  | h2         |   What is ASDF?                | (2 lines)
L23  | h2         |   How to use ASDF?             | (2 lines)
L59  | h2         |   Installing ASDF Plugins      | (2 lines)
L107 | h2         |   Conclusion                   | (2 lines)
L111 | h2         |   Also might enjoy             | (2 lines)
```

## ./src/collections/blog/2026-06-11-xteink-x4-gets-good.md
```markdown
L20  | h2         |   Pick your firmware: CrossPoint or CrossInk | (2 lines)
L30  | h2         |   Flashing it                  | (2 lines)
L42  | h2         |   Getting books on it: the Calibre workflow | (2 lines)
L54  | h2         |   Sleep screens: the free upgrade everyone forgets | (2 lines)
L66  | h2         |   Two hardware mods, zero dollars | (2 lines)
L76  | h2         |   What flashing will not fix   | (2 lines)
```

## ./src/collections/blog/new_years_resolutions_for_2015_and_2014_review.md
```markdown
L16  | h2         |   My 2015 Resolutions          | (2 lines)
L32  | h2         |   My 2014 Resolutions          | (2 lines)
```

## ./src/collections/blog/my_coffee_setup.md
```markdown
L20  | h3         |     Grinders <small>[^](#top)</small> <a id="grinders" class="article-anchor"></a> | (2 lines)
L30  | h3         |     Vessels <small>[^](#top)</small> <a id="vessels" class="article-anchor"></a> | (2 lines)
L36  | h3         |     Kettles <small>[^](#top)</small> <a id="kettles" class="article-anchor"></a> | (2 lines)
L40  | h3         |     Espresso <small>[^](#top)</small> <a id="espresso" class="article-anchor"></a> | (2 lines)
L46  | h2         |   Conclusion                   | (2 lines)
```

## ./src/collections/blog/full-stack-rust-part-3.md
```markdown
L29  | h2         |   The Problem                  | (2 lines)
L42  | h2         |   Adding Dependencies          | (2 lines)
L61  | h2         |   Defining a Custom Error Type | (2 lines)
L81  | h2         |   Helper Constructors          | (2 lines)
L113 | h2         |   Implementing IntoResponse    | (2 lines)
L136 | h2         |   Converting sqlx Errors       | (2 lines)
L152 | h2         |   URL Validation               | (2 lines)
L176 | h2         |   Updating the Handlers        | (2 lines)
L248 | h2         |   The Full Code                | (2 lines)
L410 | h2         |   Testing the Error Responses  | (2 lines)
L456 | h2         |   Wrapping Up                  | (2 lines)
```

## ./src/collections/blog/a-command-line-application-in-rust.md
```markdown
L24  | h2         |   Application Creation         | (2 lines)
L50  | h2         |   Adding Crates                | (2 lines)
L153 | h2         |   Adding Features              | (2 lines)
L221 | h2         |   Building Features            | (2 lines)
L388 | h2         |   Conclusion                   | (2 lines)
L396 | h2         |   Epilogue                     | (2 lines)
```

## ./src/collections/blog/setting-up-aws-ses-with-custom-domain.md
```markdown
L24  | h2         |   Why SES?                     | (2 lines)
L40  | h2         |   Step 1: Add Your Domain to SES | (2 lines)
L55  | h2         |   Step 2: Configure DKIM       | (2 lines)
L78  | h2         |   Step 3: Add DNS Records      | (2 lines)
L96  | h3         |     Optional: DMARC            | (2 lines)
L110 | h2         |   Step 4: Wait for Verification | (2 lines)
L117 | h2         |   Step 5: Get Out of Sandbox Mode | (2 lines)
L134 | h2         |   Step 6: Create IAM Credentials | (2 lines)
L139 | h3         |     Option A: SMTP Credentials | (2 lines)
L176 | h3         |     Option B: IAM Access Keys (Recommended for AWS SDK) | (2 lines)
L206 | h2         |   Step 7: Send Your First Email | (2 lines)
L210 | h3         |     Node.js (AWS SDK v3)       | (2 lines)
L250 | h3         |     Python (boto3)             | (2 lines)
L290 | h2         |   Sending From Any Address on Your Domain | (2 lines)
L304 | h2         |   Handle Bounces and Complaints | (2 lines)
L316 | h2         |   Common Pitfalls              | (2 lines)
L326 | h2         |   Conclusion                   | (2 lines)
```

## ./src/collections/blog/obit-for-heroku.md
```markdown
L25  | h2         |   What now?                    | (2 lines)
L49  | h2         |   Conclusion                   | (2 lines)
```

## ./src/collections/blog/leaving-twitter-for-mastodon.md
```markdown
L21  | h2         |   Leaving Twitter              | (2 lines)
L39  | h2         |   What is Mastodon             | (2 lines)
L66  | h2         |   Getting on Mastodon is Hard  | (2 lines)
L104 | h2         |   Running your Own Instance    | (2 lines)
L123 | h2         |   Conclusion                   | (2 lines)
```

## ./src/collections/blog/getting-truffle-and-ganache-working-with-docker.md
```markdown
L20  | h2         |   Understanding the Technology | (2 lines)
L27  | h3         |     web3 &amp; Ethereum        | (2 lines)
L38  | h3         |     Solidity                   | (2 lines)
L44  | h3         |     Hardhat                    | (2 lines)
L49  | h3         |     Truffle                    | (2 lines)
L56  | h3         |     Ganache                    | (2 lines)
L65  | h2         |   The Problem                  | (2 lines)
L93  | h2         |   Docker                       | (2 lines)
L118 | h3         |     Dockerfile                 | (2 lines)
L225 | h3         |     docker-compose.yml         | (2 lines)
L258 | h2         |   Conclusion                   | (2 lines)
L267 | h2         |   Also might enjoy             | (2 lines)
```

## ./src/collections/blog/new_years_resolutions_for_2014.md
```markdown
L16  | h2         |   My Resolutions               | (2 lines)
```

## ./src/collections/blog/my-switch-from-gatsby-to-astro.md
```markdown
L25  | h2         |   Astro                        | (2 lines)
L31  | h3         |     Pros of Astro              | (2 lines)
L38  | h3         |     Cons of Astro              | (2 lines)
L45  | h2         |   An Aside                     | (2 lines)
L139 | h2         |   Emacs                        | (2 lines)
L149 | h2         |   Code                         | (2 lines)
L153 | h2         |   Conclusion                   | (2 lines)
```

## ./src/collections/blog/chrome-extensions-i-use-in-2022.md
```markdown
L20  | h2         |   Extensions                   | (2 lines)
L97  | h1         | Conclusion                     | (2 lines)
```

## ./src/collections/blog/new_years_resolutions_for_2016_and_2015_review.md
```markdown
L18  | h2         |   My 2016 Resolutions          | (2 lines)
L34  | h2         |   My 2015 Resolutions Results  | (2 lines)
L50  | h2         |   Conclusion                   | (2 lines)
```

## ./src/collections/blog/a_coders_lifestyle.md
```markdown
L12  | h2         |   Background                   | (2 lines)
L18  | h2         |   Today                        | (2 lines)
L22  | h2         |   How to Succeed               | (2 lines)
```

## ./src/collections/blog/taking-a-look-at-astro-2.md
```markdown
L25  | h2         |   Content Collections          | (2 lines)
L71  | h2         |   Improved Dev Server          | (2 lines)
L78  | h2         |   Vite 4.0                     | (2 lines)
L85  | h2         |   Conclusion                   | (2 lines)
```

## ./src/collections/blog/2026-06-09-united-wizards-of-the-coast.md
```markdown
L23  | h2         |   What These Workers Want      | (2 lines)
L35  | h2         |   How Management Responded     | (2 lines)
L53  | h2         |   A Larger Moment              | (2 lines)
```

## ./src/collections/blog/moving-from-oh-my-zsh-to-starship-and-fish-shell.md
```markdown
L27  | h2         |   Installing Starship.rs       | (2 lines)
L64  | h2         |   Installing Fish              | (2 lines)
L78  | h2         |   Configuring Fish             | (2 lines)
L106 | h2         |   Fish Oddities                | (2 lines)
L195 | h2         |   Benefits                     | (2 lines)
L208 | h3         |     Functions                  | (2 lines)
L261 | h2         |   Conclusion                   | (2 lines)
L270 | h2         |   Also Might Enjoy             | (2 lines)
```

## ./src/collections/blog/my-2021-books-in-review.md
```markdown
L32  | h2         |   The Books                    | (2 lines)
L132 | h3         |     Fiction                    | (2 lines)
L166 | h2         |   Conclusion                   | (2 lines)
L170 | h2         |   Also might enjoy:            | (2 lines)
```

## ./src/collections/blog/new_years_resolutions_for_2017_and_2016_review.md
```markdown
L18  | h2         |   My 2017 Resolutions          | (2 lines)
L26  | h2         |   My 2016 Resolutions Results  | (2 lines)
L42  | h2         |   Conclusion                   | (2 lines)
```

## ./src/collections/blog/setup_flask_and_restx_with_docker.md
```markdown
L23  | h2         |   Getting Started              | (2 lines)
L116 | h2         |   Flask and Restx              | (2 lines)
L305 | h2         |   Conclusion                   | (2 lines)
```

## ./src/collections/blog/hacktoberfest-is-awesome.md
```markdown
L30  | h2         |   Open Source Pull Requests    | (2 lines)
L37  | h3         |     Other PRs that have been submitted this month | (2 lines)
L53  | h2         |   Conclusion                   | (2 lines)
```

## ./src/collections/blog/latex-through-docker.md
```markdown
L28  | h2         |   Docker                       | (2 lines)
L61  | h2         |   Conclusion                   | (2 lines)
```

## ./src/collections/blog/isort-setup.md
```markdown
L21  | h2         |   Why isort?                   | (2 lines)
L25  | h2         |   My Configuration             | (2 lines)
L54  | h2         |   Conclusion                   | (2 lines)
```

## ./src/collections/blog/basic-python-dockerfile.md
```markdown
L50  | h2         |   Special Considerations       | (2 lines)
L56  | h2         |   Conclusion                   | (2 lines)
```

## ./src/collections/blog/current-thoughts-on-mobile-website-support.md
```markdown
L20  | h2         |   Mobile First?                | (2 lines)
L45  | h2         |   What Does This Mean?         | (2 lines)
L59  | h2         |   Conclusion                   | (2 lines)
L72  | h2         |   An Aside                     | (2 lines)
L82  | h2         |   Also might enjoy:            | (2 lines)
```

## ./src/collections/blog/a-command-line-application-in-rust-2.md
```markdown
L24  | h2         |   Environment Variables        | (2 lines)
L70  | h2         |   Better Error handling        | (2 lines)
L100 | h2         |   Conclusion                   | (2 lines)
```

## ./src/collections/blog/upgrading-gatsby-to-mdx.md
```markdown
L18  | h2         |   What is Mdx?                 | (2 lines)
L38  | h2         |   What Do We Need To Changed?  | (2 lines)
L104 | h2         |   Why Make this Change?        | (2 lines)
L154 | h2         |   Conclusion                   | (2 lines)
```

## ./src/collections/blog/nodeschool_at_nationjs_postmortem.md
```markdown
L15  | h2         |   Preparations                 | (2 lines)
L19  | h3         |     Mentor Meetup              | (2 lines)
L23  | h3         |     NodeSchool Meetup          | (2 lines)
L27  | h3         |     Welcome Document           | (2 lines)
L31  | h3         |     Other Misc                 | (2 lines)
L35  | h3         |     Preparations Conclusion    | (2 lines)
L39  | h2         |   NodeSchool                   | (2 lines)
L43  | h3         |     What I'd Change            | (2 lines)
L47  | h2         |   Conclusion                   | (2 lines)
```

## ./src/collections/blog/reactjs_tutorial_part_4.md
```markdown
L17  | h2         |   Express Routes               | (2 lines)
L39  | h3         |     API Routes                 | (2 lines)
L114 | h2         |   React.js and APIs            | (2 lines)
L168 | h2         |   Conclusion                   | (2 lines)
```

## ./src/collections/blog/life_changes_and_another_start_with_jekyll.md
```markdown
L14  | h2         |   Hello, again.                | (2 lines)
L24  | h2         |   What’s new?                  | (2 lines)
L28  | h2         |   On the horizon               | (2 lines)
L64  | h2         |   In Closing                   | (2 lines)
```

## ./src/collections/blog/full-stack-rust-part-4.md
```markdown
L28  | h2         |   Why Authentication?          | (2 lines)
L34  | h2         |   Adding dotenvy               | (2 lines)
L62  | h2         |   Upgrading AppState           | (2 lines)
L91  | h2         |   Writing the Middleware       | (2 lines)
L129 | h2         |   Splitting Routes             | (2 lines)
L177 | h2         |   Updating the Handlers        | (2 lines)
L208 | h2         |   Testing It Out               | (2 lines)
L268 | h2         |   Wrapping Up                  | (2 lines)
```

## ./src/collections/blog/adding_markdown_to_jade_using_nodejs.md
```markdown
L14  | h3         |     **Update**                 | (2 lines)
L42  | h3         |     My Solution                | (2 lines)
L52  | h3         |     How To                     | (2 lines)
```

## ./src/collections/blog/using_bower.md
```markdown
L17  | h2         |   What is Bower                | (2 lines)
L44  | h2         |   Initial Setup                | (2 lines)
L62  | h3         |     Saving packages            | (2 lines)
L76  | h3         |     Versioning packages        | (2 lines)
L86  | h3         |     Customizations             | (2 lines)
L106 | h2         |   Benefits                     | (2 lines)
L110 | h3         |     Searching                  | (2 lines)
L131 | h2         |   Drawbacks                    | (2 lines)
L135 | h3         |     Dealing with the drawbacks | (2 lines)
L158 | h2         |   Conclusion                   | (2 lines)
```

## ./src/collections/blog/using-webassembly-created-in-rust-for-fast-react-components.md
```markdown
L19  | h2         |   Introduction to Wasm         | (2 lines)
L45  | h2         |   The Tutorial                 | (2 lines)
L174 | h3         |     Getting Rusty              | (2 lines)
L263 | h3         |     React and Wasm             | (2 lines)
L392 | h2         |   Conclusion                   | (2 lines)
```

## ./src/collections/blog/installing_mezzanine_on_heroku.md
```markdown
L21  | h2         |   Setting up the Database      | (2 lines)
L30  | h2         |   Serving Static Media         | (2 lines)
L81  | h2         |   The requirements.txt         | (2 lines)
L103 | h2         |   Conclusion                   | (2 lines)
```

## ./src/collections/blog/postmortem_on_howoldisthismetrocarcom.md
```markdown
L13  | h2         |   Background                   | (2 lines)
L17  | h2         |   Why I chose Angular?         | (2 lines)
L21  | h2         |   Why I chose S3               | (2 lines)
L25  | h2         |   What I learned               | (2 lines)
L31  | h2         |   End Numbers                  | (2 lines)
L37  | h2         |   Conclusion                   | (2 lines)
```

## ./src/collections/blog/new_years_resolutions_for_2018_and_2017_review.md
```markdown
L18  | h2         |   My 2018 Quarter 1 Resolutions | (2 lines)
L25  | h2         |   My 2017 Resolutions Results  | (2 lines)
L33  | h2         |   Conclusion                   | (2 lines)
```

## ./src/collections/blog/full-stack-rust-part-1.md
```markdown
L28  | h2         |   Introduction to Axum         | (2 lines)
L59  | h2         |   Our URL Shortener            | (2 lines)
L70  | h3         |     Project Setup              | (2 lines)
L97  | h3         |     Shared State               | (2 lines)
L112 | h3         |     Models                     | (2 lines)
L133 | h3         |     Handlers                   | (2 lines)
L204 | h3         |     Wiring It All Together     | (2 lines)
L231 | h3         |     Taking It for a Spin       | (2 lines)
L261 | h3         |     The Full Code              | (2 lines)
L350 | h2         |   Wrapping Up                  | (2 lines)
```

## ./src/collections/blog/reactjs_tutorial_part_(interlude_2).md
```markdown
L17  | h2         |   Reviewing Your Application   | (2 lines)
L94  | h2         |   Upgrading a Package          | (2 lines)
L124 | h2         |   Conclusion                   | (2 lines)
```

## ./src/collections/blog/setting_up_https_security.md
```markdown
L16  | h2         |   What is HTTPS?               | (2 lines)
L20  | h2         |   Setting up HTTPS on your server | (2 lines)
L44  | h3         |     Setting up Apache          | (2 lines)
L57  | h3         |     Setting up Nginx           | (2 lines)
L69  | h2         |   Hardening your HTTPS connection | (2 lines)
L73  | h3         |     Hardening Apache           | (2 lines)
L82  | h3         |     Hardening Nginx            | (2 lines)
L93  | h2         |   Conclusion                   | (2 lines)
L97  | h2         |   Further Reading and Resources | (2 lines)
```

## ./src/collections/blog/full-stack-rust-part-5.md
```markdown
L30  | h2         |   What is Yew?                 | (2 lines)
L36  | h2         |   Restructuring into a Workspace | (2 lines)
L75  | h2         |   Frontend Dependencies        | (2 lines)
L99  | h2         |   Installing Trunk             | (2 lines)
L125 | h2         |   Shared Types                 | (2 lines)
L146 | h2         |   The URL List Component       | (2 lines)
L223 | h2         |   The Create Form Component    | (2 lines)
L334 | h2         |   The App Component            | (2 lines)
L377 | h2         |   Adding CORS to the Backend   | (2 lines)
L407 | h2         |   Running the Full Stack       | (2 lines)
L427 | h2         |   Wrapping Up                  | (2 lines)
```

## ./src/pages/blog/og/[id].ts
imports: astro:content, astro-og-canvas

## ./src/pages/uses.md
```markdown
L8   | h2         |   Hardware                     | (2 lines)
L30  | h2         |   Software                     | (2 lines)
```

## ./src/pages/rss.xml.ts
imports: @astrojs/rss, @lib/utils
```typescript
L4   | function_declaration | GET                            | (14 lines)
```
