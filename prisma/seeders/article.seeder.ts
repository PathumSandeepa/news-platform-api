import { PrismaClient, Category } from '@prisma/client';

interface ArticleSeedData {
   title: string;
   slug: string;
   content: string;
   category: Category;
   coverImage: string;
}

const ARTICLES_DATA: ArticleSeedData[] = [
   {
      title: 'Jamie Siddons Appointed Head Coach of Sri Lanka Women’s Team',
      slug: 'jamie-siddons-appointed-head-coach-of-sri-lanka-womens-team',
      content:
         'Sri Lanka Cricket has announced the appointment of former Australian cricketer Jamie Siddons as the new Head Coach of the Sri Lanka National Women’s Team. The one-year contract will take effect on 16 March 2026, positioning Siddons to lead the team through a crucial period of development and international competition. His first major assignment will be guiding the side during the Sri Lanka Women’s Tour of Bangladesh in April–May 2026, followed by preparations for the prestigious ICC Women’s T20 World Cup 2026 in England this June.\n\n' +
         'Siddons brings a wealth of experience to the role, having previously served as Head Coach of the Bangladesh National Men’s Team from 2007 to 2011 — his highest-profile international coaching stint. A Level 3 qualified coach, he also led the South Australia Cricket Team (Redbacks) from 2015 to 2020 and the Wellington Firebirds in New Zealand from 2011 to 2015. Before transitioning to coaching, Siddons enjoyed a successful first-class career in Australia, captaining both South Australia and Victoria. His appointment is seen as a strategic move to inject fresh expertise and tactical acumen into the women’s setup, especially after recent encouraging performances such as clinching the ODI series against West Indies 2-1 despite a final-match loss.\n\n' +
         'Sri Lanka Cricket officials believe Siddons’ proven track record at international and domestic levels will help elevate the women’s team’s performance on the global stage. With the T20 World Cup on the horizon, the focus will be on building a cohesive unit capable of competing against the world’s best. Fans and analysts alike are optimistic that this appointment marks the beginning of a new chapter for Sri Lankan women’s cricket, fostering greater professionalism and strategic depth in all formats.',
      category: Category.SPORTS,
      coverImage: 'https://picsum.photos/seed/sports-cricket-women-coach/800/400',
   },
   {
      title: 'Colombo Stock Exchange Forges Strategic Partnership with NSEIX to Expand Capital Market Access',
      slug: 'colombo-stock-exchange-forges-strategic-partnership-with-nseix-to-expand-capital-market-access',
      content:
         'The Colombo Stock Exchange (CSE) has entered into a strategic partnership with NSEIX, marking a significant step towards broadening access to capital markets and enhancing investment opportunities across Sri Lanka. Announced on 6 March 2026, the collaboration aims to facilitate greater participation from both local and international investors, creating new avenues for capital flow and market growth. This move comes at a time when the CSE continues to show resilience, with the All Share Price Index (ASPI) recently climbing to 22,834 points on 5 March — a 1.74% daily gain that underscores growing investor confidence amid broader economic stabilization.\n\n' +
         'Complementing this development, Capital Alliance has deepened its footprint in the capital markets by listing its third closed-end fund on the CSE earlier in February 2026. These initiatives reflect a concerted push to strengthen Sri Lanka’s financial ecosystem, building on positive economic indicators such as a 33% surge in worker remittances to US$729 million in February 2026. Analysts note that improved foreign reserves, successful debt restructuring, and government fiscal reforms have created a more attractive environment for investment, with key sectors like banking, manufacturing, and tourism driving recent momentum.\n\n' +
         'The partnership with NSEIX is expected to introduce innovative products, improved trading mechanisms, and expanded market linkages that will benefit retail investors, institutions, and SMEs alike. As Sri Lanka’s economy continues its recovery trajectory, these capital market advancements signal strong potential for sustained growth and position the CSE as a more dynamic player in the regional financial landscape. Investors are closely watching how these developments translate into increased liquidity and long-term value creation for the market.',
      category: Category.BUSINESS,
      coverImage: 'https://picsum.photos/seed/business-stock-partnership/800/400',
   },
   {
      title: 'Sri Lankan Documentary on Economic Crisis Wins Best Social Film and Screenplay at Indian Festival',
      slug: 'sri-lankan-documentary-on-economic-crisis-wins-best-social-film-and-screenplay-at-indian-festival',
      content:
         'In a major boost for Sri Lankan cinema, the Pulitzer Center-supported documentary *Democracy in Debt: Sri Lanka Beyond the Headlines* has been awarded ‘Best Social Film’ and ‘Best Screenplay’ at the Second Jalgaon International Film Festival in India. The awards will be presented on 1 March 2026 at the Abdul Kalam Azad Research Centre in Aurangabad, Maharashtra, with winners receiving a trophy, certificate, and traditional Maharashtra pagri. The film was selected from over 2,500 submissions from 75 countries, with only 250 entries chosen by an international jury comprising professionals from India, Iran, Egypt, Portugal, and the Netherlands.\n\n' +
         'Produced by Boston-based Pakistani journalist and filmmaker Beena Sarwar in collaboration with Sri Lankan historian and filmmaker Sinha Raja Tammita Delgoda (who served as co-director, co-scriptwriter, special consultant, and project conceptualizer) and researcher Uditha Devapriya, the documentary explores the social and political dimensions of Sri Lanka’s economic crisis. It premiered privately at the Barberyn Ayurveda resort in Weligama in July 2024, followed by a high-profile Colombo cinema premiere hosted by Factum International. The film has since been screened at over 80 events across 25 countries on five continents, including prestigious venues such as Emerson College and Cornell University in the United States, as well as screenings in Karachi, Lahore, New Delhi, Dhaka, and Kathmandu.\n\n' +
         'This recognition highlights the global relevance of Sri Lankan storytelling and the power of independent cinema to address pressing national issues. As the first production under the Southasia Peace Action Network and Sapan News, the documentary underscores the importance of cross-border collaboration in documenting democratic and economic challenges. The awards not only celebrate the film’s artistic excellence but also amplify Sri Lanka’s voice on the international stage, paving the way for greater visibility of local talent and thought-provoking narratives in global film circles.',
      category: Category.ENTERTAINMENT,
      coverImage: 'https://picsum.photos/seed/entertainment-documentary-awards/800/400',
   },
   {
      title: 'AI-Driven Entrepreneurship Will Transform Sri Lanka’s Economy, Says Deputy Minister',
      slug: 'ai-driven-entrepreneurship-will-transform-sri-lankas-economy-says-deputy-minister',
      content:
         'Sri Lanka’s economic future lies in AI-powered entrepreneurship, according to Deputy Minister of Digital Economy Eng. Eranga Weeraratne. Speaking as Chief Guest at the ITAM–32 International Conference organized by the University of Vavuniya on 26 February 2026 under the theme “Technology-Based Entrepreneurship for Inclusive Growth in the AI Era,” the Deputy Minister outlined a bold vision for leveraging artificial intelligence to drive national transformation. He emphasized that the global economy is undergoing a massive shift centered on AI, where data functions as capital and innovation serves as the primary currency.\n\n' +
         'Weeraratne stressed the need to move beyond traditional small and medium enterprises by encouraging startups that harness modern technologies such as cloud computing and data analytics. He compared AI’s transformative potential to that of electricity or the internet, noting its direct applications in healthcare (medical diagnostics), agriculture (precision farming), finance (digital payments), and public services (improved efficiency). As a developing nation, Sri Lanka has a unique opportunity to “leapfrog” traditional development stages and accelerate progress through responsible AI adoption. The government is prioritizing data infrastructure — akin to roads and ports — alongside robust cybersecurity, ethical AI frameworks, and responsible data governance.\n\n' +
         'Addressing concerns about job displacement from automation, the Deputy Minister highlighted the importance of upskilling the workforce through enhanced digital literacy and lifelong learning programs. He underscored the government’s commitment to reducing the urban-rural digital divide by expanding affordable broadband and digital financial systems, ensuring equal opportunities for rural entrepreneurs, women, and youth. “National progress should not be measured solely by GDP growth, but also by the extent to which technology improves the quality of life of the people,” he stated. This forward-looking strategy positions Sri Lanka to build an inclusive digital economy where innovation benefits every segment of society.',
      category: Category.TECHNOLOGY,
      coverImage: 'https://picsum.photos/seed/tech-ai-entrepreneurship/800/400',
   },
   {
      title: 'Sri Lanka Parliament Scraps Lawmaker Pensions in Landmark Reform to Cut Politician Perks',
      slug: 'sri-lanka-parliament-scraps-lawmaker-pensions-in-landmark-reform-to-cut-politician-perks',
      content:
         'In a historic move to reduce privileges for politicians, Sri Lanka’s Parliament has abolished pensions for all legislators and their widows. The 225-member legislature, where the ruling party holds a two-thirds majority, passed the repeal of the 49-year-old Parliamentary Pensions Act on Tuesday with 154 votes in favour and only two against. Justice Minister Harsana Nanayakkara justified the decision by stating, “When people see the quality of debate and what members say in this House, they don’t think MPs deserve a pension.”\n\n' +
         'The reform aligns with the leftist government’s pledge under President Anura Kumara Dissanayake to prune excessive perks enjoyed by politicians. It follows the recent withdrawal of housing, luxury vehicles, fuel allowances, secretarial staff, and thousands of bodyguards from former presidents — a process accelerated after former President Mahinda Rajapaksa refused to vacate a state bungalow. In 2021, Rajapaksa reportedly spent around 800 million rupees refurbishing a government residence. Similar privileges previously extended to Gotabaya Rajapaksa were also curtailed after his 2022 resignation amid economic turmoil.\n\n' +
         'Opposition Leader Sajith Premadasa objected to the move, arguing that a pension provides necessary social security and prevents lawmakers from turning to corruption for retirement security. Under the old law, MPs qualified for pensions after just five years in office — half the requirement for ordinary state employees. The changes mark a significant step towards greater accountability and fiscal responsibility. Many observers view this as part of a broader effort to restore public trust in governance, especially in the wake of the country’s recent economic crisis. The repeal takes immediate effect and is expected to set a precedent for further reforms in political entitlements.',
      category: Category.POLITICS,
      coverImage: 'https://picsum.photos/seed/politics-pensions-reform/800/400',
   },
];

export async function seedArticles(
   prisma: PrismaClient,
   authorId: string,
): Promise<void> {
   if (!authorId) {
      console.log('   No author ID provided. Skipping article seeding.');
      return;
   }

   console.log('\n Seeding articles...');

   for (const articleData of ARTICLES_DATA) {
      const article = await prisma.article.upsert({
         where: { slug: articleData.slug },
         update: {},
         create: {
            title: articleData.title,
            slug: articleData.slug,
            content: articleData.content,
            category: articleData.category,
            coverImage: articleData.coverImage,
            published: true,
            publishedAt: new Date(),
            authorId,
         },
      });

      console.log(`   Article: "${article.title}" [${article.category}]`);
   }

   console.log(`Articles seeding completed. Total: ${ARTICLES_DATA.length}`);
}
