export interface BlogData {
  country: string;
  date: string;
  title: string;
  author?: string;
  excerpt?: string;
  content: string;
}

export const blogDatabase: BlogData[] = [
  // Today's test data (2025-12-24)
  {
    country: "USA",
    date: "2025-12-24",
    title: "Holiday Market Trading Insights",
    author: "Senior Trading Analyst",
    excerpt: "Year-end positioning drives strategic trading decisions as markets close out 2025.",
    content: "As we approach the close of the trading year, market participants are actively positioning for 2026. The US stock market has shown remarkable resilience throughout the year, with the S&P 500 reaching all-time highs. Tech stocks continue to lead the rally on optimism about AI adoption and productivity gains.\n\nTrading volume has been elevated despite the holiday season, with institutional investors fine-tuning their year-end portfolios. Risk sentiment remains constructive, though volatility has picked up slightly as traders square positions ahead of the New Year. The bond market has also shown stability with yields consolidating near key levels.\n\nLooking ahead to 2026, expectations are high for continued economic growth and corporate earnings expansion. The Fed's recent pause in rate hikes has provided confidence to equity investors, while careful monitoring of inflation data continues."
  },
  {
    country: "India",
    date: "2025-12-24",
    title: "Sensex Celebrates Record Closes This Year",
    author: "Market Reporter",
    excerpt: "Indian markets shine with strong performance as year-end rally gains momentum.",
    content: "The Indian stock market has delivered outstanding returns in 2025, with the Sensex crossing multiple psychological milestones throughout the year. Domestic institutional investors have been aggressive buyers, providing strong support to the broader market.\n\nBanking and IT sectors have led the rally, with financial services companies benefiting from robust credit growth and improved deposit dynamics. The financial sector's strength has been a key driver of the market's outperformance. Reforms and policy initiatives have also contributed to investor confidence.\n\nYear-end trading shows continued strength, with retail investors joining the rally. Market depth has improved with broader participation across various sectors including pharma, FMCG, and auto. The Rupee has also shown relative strength, supporting import-dependent businesses."
  },
  {
    country: "Japan",
    date: "2025-12-24",
    title: "Nikkei Finishes Strong on Year-End Rally",
    author: "Tokyo Financial Correspondent",
    excerpt: "Japanese equities close out the year with impressive gains as domestic strength supports valuations.",
    content: "The Nikkei 225 has completed a remarkable year with the index reaching fresh record highs. Year-end trading has been characterized by strong institutional buying, particularly in large-cap stocks and export-sensitive sectors. The continuation of the weak yen has provided persistent tailwinds to Japanese equities.\n\nDomestic consumers have shown resilience with strong holiday season sales, supporting retailers and consumer discretionary stocks. Manufacturing data has also improved, reflecting global demand recovery and the benefits of Japan's competitive export position. The BOJ's supportive monetary policy stance has remained accommodative throughout the year.\n\nAs traders position for 2026, expectations are for continued support from structural factors including the weak yen and strong corporate earnings. Market technicals remain constructive with rising breadth indicators signaling healthy market participation."
  },
  {
    country: "Crypto",
    date: "2025-12-24",
    title: "Bitcoin Consolidates Above Year-High Levels",
    author: "Digital Assets Editor",
    excerpt: "Cryptocurrency markets show year-end strength as institutional interest remains elevated.",
    content: "Bitcoin has delivered exceptional returns throughout 2025, with the digital asset consolidating above $48,000 levels heading into year-end trading. The sustained rally has been driven by improved institutional adoption, regulatory clarity in key jurisdictions, and positive technical momentum.\n\nEthereum has also performed strongly, reflecting growing interest in blockchain applications and DeFi protocols. The cryptocurrency market's maturation is evident in the improved infrastructure and custody solutions that appeal to institutional investors. Trading volumes have remained elevated despite the holiday season.\n\nYear-end positioning suggests continued strength heading into 2026, with many analysts bullish on cryptocurrency adoption trajectories. The improved regulatory environment in major markets has reduced tail risks and provided clearer pathways for institutional capital flows into the space."
  },
  // Additional test data for 2025-01-22
  {
    country: "USA",
    date: "2025-01-22",
    title: "US Market Rally Led by Tech Stocks",
    author: "Financial Analyst",
    excerpt: "Strong bullish momentum drives Nasdaq higher as investors gain confidence ahead of earnings season.",
    content: "Today the US stock market saw strong bullish momentum led by major tech companies. Nasdaq gained sharply while investors showed confidence ahead of earnings season. The S&P 500 closed near record levels, with mega-cap technology stocks driving the rally. Apple, Microsoft, and Nvidia all posted gains of 2-3%, reflecting investor optimism about AI developments and corporate profitability.\n\nThe bond market also stabilized with Treasury yields declining slightly, easing some of the recent concerns about higher-for-longer interest rates. Equity flows remained positive, with institutional investors rotating into quality growth names. Banking stocks also showed strength after recent weakness, suggesting improved sentiment across the board."
  },
  {
    country: "India",
    date: "2025-01-22",
    title: "Indian Markets End Flat Amid Global Cues",
    author: "Market Correspondent",
    excerpt: "Mixed performance across IT and banking sectors as global uncertainty weighs on investor sentiment.",
    content: "Indian markets traded sideways as global uncertainty weighed on investor sentiment. IT and banking stocks showed mixed performance with profit-taking evident in select names. The NSE Nifty 50 index consolidated within a narrow range, reflecting cautious positioning ahead of key economic data releases.\n\nIT sector stocks faced headwinds as global tech slowdown concerns resurfaced. However, pharmaceutical and consumer goods companies found support from domestic demand prospects. FII flows remained subdued, with overseas investors adopting a wait-and-watch approach to emerging markets. Banking stocks showed resilience with positive Q3 earnings surprises from select lenders providing support to the broader index."
  },
  {
    country: "Japan",
    date: "2025-01-22",
    title: "Japan Stocks Rise on Yen Weakness",
    author: "Tokyo Markets Desk",
    excerpt: "Nikkei climbs as weaker yen boosts export-driven companies amid strong buying interest.",
    content: "Japanese equities climbed as a weaker yen boosted export-driven companies. Nikkei closed higher with strong buying interest driven by positive momentum in the morning session. The Bank of Japan's accommodative stance continues to support the equity market, while currency weakness makes Japanese exports more competitive globally.\n\nAutomotive stocks led the advance, with Toyota and Honda benefiting from improved export prospects. Electronics makers also gained on currency tailwinds and positive semiconductor demand forecasts. Trading volume remained healthy despite the holiday-shortened year, suggesting strong institutional participation. Fixed income markets showed stable performance as yield levels consolidated around recent ranges."
  },
  {
    country: "Crypto",
    date: "2025-01-22",
    title: "Crypto Market Sees Mild Recovery",
    author: "Digital Assets Analyst",
    excerpt: "Bitcoin and Ethereum show signs of recovery after recent selling pressure as sentiment improves.",
    content: "Bitcoin and Ethereum showed signs of recovery after recent selling pressure. Altcoins remained volatile but sentiment improved slightly as technical support levels held. Bitcoin bounced from the 42,000 support level, with bulls defending the key psychological level and establishing higher lows throughout the session.\n\nEthereum also participated in the recovery, climbing above 2,400 levels on improving technical momentum. DeFi protocols showed renewed interest with TVL stabilizing after recent outflows. Staking rewards and yield opportunities attracted renewed attention from passive income seekers. Regulatory clarity improvements in select jurisdictions also provided a tailwind to sentiment as the market settled into a more constructive tone."
  },
  {
    country: "USA",
    date: "2025-01-23",
    title: "Fed Commentary Supports Risk Assets",
    author: "Economic Analyst",
    excerpt: "Market gains extend as Fed officials signal continued patience on interest rates.",
    content: "Positive remarks from Federal Reserve officials provided additional support to equities today. The Fed's dovish tilt boosted sentiment across risk assets as traders interpreted the comments as signaling a potential pause in rate hikes. The yield curve showed continued softness with long-duration bonds outperforming.\n\nTech stocks continued their positive momentum with the Nasdaq posting another solid advance. Energy stocks also benefited from improved risk appetite. Market breadth indicators showed healthy participation with advancing issues significantly outpacing declines. The VIX index compressed further, reflecting diminishing fear in the marketplace."
  },
  {
    country: "India",
    date: "2025-01-23",
    title: "RBI Actions Buoy Financial Stocks",
    author: "Mumbai Finance Desk",
    excerpt: "Reserve Bank's supportive measures lift banking sector and broader market sentiment.",
    content: "The Reserve Bank of India's supportive policy stance provided a boost to financial stocks today. Banking indices surged on expectations of improved lending growth and margin expansion. Private banks outperformed public sector banks on improved efficiency metrics and digital banking adoption.\n\nThe broader market also benefited from the positive momentum in financials, which form a significant weightage in benchmark indices. Liquidity conditions remained ample with system repo rates staying soft. Non-banking financial companies also showed strength, reflecting improved credit market conditions and appetite for higher-yielding assets."
  },
  {
    country: "Japan",
    date: "2025-01-23",
    title: "Corporate Earnings Drive Sentiment Higher",
    author: "Osaka Market Desk",
    excerpt: "Strong Q3 results from major corporations support continued strength in Japanese equities.",
    content: "Japanese stocks extended their winning streak on positive earnings surprises from major corporations. Industrial conglomerates posted strong results reflecting robust global demand for manufactured goods. The export-led recovery continued to benefit from the weak yen backdrop.\n\nRetail participation also picked up with individual investors showing renewed interest in equity investments. Market optimism reflected in rising breadth indicators and increasing participation across sectors. Morning trading sessions saw particularly strong buying interest, suggesting positive momentum is building."
  },
  {
    country: "Crypto",
    date: "2025-01-23",
    title: "Bitcoin Breaks Above 45,000 Resistance",
    author: "Crypto Markets Editor",
    excerpt: "Strong technical breakout above key resistance level signals renewed buyer confidence.",
    content: "Bitcoin staged an impressive breakout above the 45,000 resistance level on strong technical momentum and positive sentiment. The successful break above this key level attracted technical traders and momentum investors. Ethereum also benefited from the positive sentiment, climbing above 2,600 on improving technical outlook.\n\nAltcoins showed renewed strength with many layer-1 and layer-2 solutions posting double-digit gains. Trading volumes picked up significantly, reflecting genuine buyer participation rather than short-covering. The 4-hour and daily charts showed positive divergences developing, potentially setting up for further upside."
  }
];
