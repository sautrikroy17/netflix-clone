// Official Netflix Curated Catalog with Verified HD Assets & Video Streams
const movies = [
  {
    id: "stranger-things",
    title: "Stranger Things",
    type: "TV Series",
    overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl with telekinetic powers.",
    backdrop: "https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    poster: "https://image.tmdb.org/t/p/w780/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    matchScore: 99,
    year: "2024",
    ageRating: "U/A 16+",
    duration: "4 Seasons",
    quality: "4K Ultra HD",
    audio: "Dolby Atmos",
    genres: ["Sci-Fi", "Horror", "Nostalgic", "Teen Mystery"],
    cast: ["Winona Ryder", "David Harbour", "Millie Bobby Brown", "Finn Wolfhard"],
    creator: "The Duffer Brothers",
    category: "trending",
    isOriginal: true,
    top10Rank: 1,
    videoUrl: "/trailers/stranger-things.mp4",
    backupVideoUrl: "https://ia600104.us.archive.org/1/items/stranger-things-season-2-comic-con-trailer-2017/Stranger%20Things%20Season%202%20Comic-Con%20Trailer%20%282017%29%20-%20Thriller.ia.mp4",
    youtubeTrailerId: "b9EkMc79ZSU",
    subtitles: {
      en: [
        { time: 2, text: "[ominous 80s synthesizer hums softly]" },
        { time: 7, text: "DUSTIN: Will, do you see the storm coming?" },
        { time: 13, text: "WILL: I felt it... it didn't feel like a dream." },
        { time: 20, text: "JOYCE: What happened to my boy in the Upside Down?!" },
        { time: 28, text: "VINCENT PRICE: Darkness falls across the land..." },
        { time: 38, text: "[Michael Jackson's Thriller beat erupts in Dolby Atmos]" },
        { time: 48, text: "HOPPER: Whatever is happening, it's spreading from the lab." },
        { time: 60, text: "MIKE: If they find us, they'll never let us leave." },
        { time: 75, text: "ELEVEN: I can fight it. I won't let them hurt you." },
        { time: 90, text: "[giant towering shadow monster rumbles across the sky]" }
      ],
      hi: [
        { time: 2, text: "[गंभीर 80 के दशक का सिंथेसाइज़र संगीत बजता है]" },
        { time: 7, text: "डस्टिन: विल, क्या तुम वो तूफ़ान देख रहे हो?" },
        { time: 13, text: "विल: मुझे यह महसूस हुआ... यह कोई सपना नहीं था।" },
        { time: 20, text: "जॉयस: मेरे बच्चे के साथ उस उल्टी दुनिया में क्या हुआ?!" },
        { time: 28, text: "विंसेंट प्राइस: ज़मीन पर अंधेरा छा रहा है..." },
        { time: 38, text: "[माइकल जैक्सन का थ्रिलर संगीत गूंजता है]" },
        { time: 48, text: "हॉपर: जो कुछ भी हो रहा है, वह लैब से फैल रहा है।" },
        { time: 60, text: "माइक: अगर उन्होंने हमें ढूँढ लिया, तो जाने नहीं देंगे।" },
        { time: 75, text: "इलेवन: मैं इससे लड़ सकती हूँ। तुम्हें चोट नहीं पहुँचने दूँगी।" },
        { time: 90, text: "[विशाल छाया राक्षस आसमान में गरजता है]" }
      ]
    }
  },
  {
    id: "squid-game",
    title: "Squid Game",
    type: "TV Series",
    overview: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.",
    backdrop: "https://image.tmdb.org/t/p/w1280/2meX1nMdScFOoV4370rqHWKmXhY.jpg",
    poster: "https://image.tmdb.org/t/p/w780/iE21DSI3n5vI6v1W2HT4feKoM97.jpg",
    matchScore: 99,
    year: "2024",
    ageRating: "18+",
    duration: "2 Seasons",
    quality: "4K Ultra HD",
    audio: "Dolby Atmos",
    genres: ["Thriller", "Suspense", "Dystopian", "Korean Drama"],
    cast: ["Lee Jung-jae", "Park Hae-soo", "Wi Ha-joon", "Jung Ho-yeon"],
    creator: "Hwang Dong-hyuk",
    category: "trending",
    isOriginal: true,
    top10Rank: 2,
    videoUrl: "https://vjs.zencdn.net/v/oceans.mp4",
    youtubeTrailerId: "oqxAJKy0ii4",
    subtitles: {
      en: [
        { time: 1, text: "[playful, chilling carnival chime plays]" },
        { time: 5, text: "FRONT MAN: Welcome to the 33rd Squid Game." },
        { time: 9, text: "GI-HUN: This is madness! People are dying!" },
        { time: 14, text: "SANG-WOO: Only one of us walks away with the money." },
        { time: 19, text: "[giant robotic doll sings in Korean]" },
        { time: 24, text: "[gunshot echoes through the arena]" }
      ],
      hi: [
        { time: 1, text: "[डरावनी धुन बजती है]" },
        { time: 5, text: "फ्रंट मैन: 33वें स्क्विड गेम में आपका स्वागत है।" },
        { time: 9, text: "गी-हुन: यह पागलपन है! लोग मर रहे हैं!" },
        { time: 14, text: "सांग-वू: हममें से केवल एक ही यह पैसा लेकर जाएगा।" },
        { time: 19, text: "[विशाल गुड़िया गाना गाती है]" },
        { time: 24, text: "[मैदान में गोली की गूंज]" }
      ]
    }
  },
  {
    id: "wednesday",
    title: "Wednesday",
    type: "TV Series",
    overview: "Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree while making new friends — and foes — at Nevermore Academy.",
    backdrop: "https://image.tmdb.org/t/p/w1280/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg",
    poster: "https://image.tmdb.org/t/p/w780/avzWIWe6FWZi7r1qJeQZcDTv3Ex.jpg",
    matchScore: 98,
    year: "2023",
    ageRating: "U/A 13+",
    duration: "1 Season",
    quality: "4K Ultra HD",
    audio: "Dolby Atmos",
    genres: ["Fantasy", "Comedy", "Dark Mystery", "Supernatural"],
    cast: ["Jenna Ortega", "Gwendoline Christie", "Riki Lindhome", "Christina Ricci"],
    creator: "Alfred Gough, Miles Millar",
    category: "trending",
    isOriginal: true,
    top10Rank: 3,
    videoUrl: "/trailers/wednesday.mp4",
    backupVideoUrl: "https://archive.org/download/wednesday-season-2-part-2-official-trailer-netflix-720p/Wednesday__Season_2___Part_2_Official_Trailer___Netflix%28720p%29.mp4",
    youtubeTrailerId: "Di310BC8zMg",
    subtitles: {
      en: [
        { time: 1, text: "[gothic cello music plays passionately]" },
        { time: 5, text: "WEDNESDAY: I don't bury the hatchet. I sharpen it." },
        { time: 10, text: "ENID: Wednesday! We're roomies! Give me a hug!" },
        { time: 15, text: "WEDNESDAY: Try it, and you'll lose that hand." },
        { time: 20, text: "[monster roars in the dark woods]" }
      ],
      hi: [
        { time: 1, text: "[गॉथिक सेलो धुन बजती है]" },
        { time: 5, text: "वेडनसडे: मैं दुश्मनी नहीं भूलती, बदला लेती हूँ।" },
        { time: 10, text: "एनिड: वेडनसडे! हम रूममेट्स हैं! गले लगो!" },
        { time: 15, text: "वेडनसडे: कोशिश भी की तो हाथ गंवा बैठोगी।" },
        { time: 20, text: "[घने जंगल में राक्षस की दहाड़]" }
      ]
    }
  },
  {
    id: "money-heist",
    title: "Money Heist",
    type: "TV Series",
    overview: "Eight thieves take hostages and lock themselves in the Royal Mint of Spain as a criminal mastermind manipulates the police to carry out his plan.",
    backdrop: "https://image.tmdb.org/t/p/w1280/gFZriCkpJYsApPZEF3jhxL4yLzG.jpg",
    poster: "https://image.tmdb.org/t/p/w780/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
    matchScore: 97,
    year: "2023",
    ageRating: "18+",
    duration: "5 Parts",
    quality: "4K Ultra HD",
    audio: "Dolby Atmos",
    genres: ["Heist", "Thriller", "Action", "Spanish Drama"],
    cast: ["Úrsula Corberó", "Álvaro Morte", "Itziar Ituño", "Pedro Alonso"],
    creator: "Álex Pina",
    category: "action",
    isOriginal: true,
    top10Rank: 4,
    videoUrl: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    subtitles: {
      en: [
        { time: 1, text: "[Bella Ciao plays in background]" },
        { time: 4, text: "PROFESSOR: This is not just a robbery. It's a statement." },
        { time: 9, text: "BERLIN: Gentlemen, today we make history." },
        { time: 14, text: "TOKYO: When the shooting started, love was our only shield." },
        { time: 19, text: "[police sirens wail loudly outside]" }
      ],
      hi: [
        { time: 1, text: "[बेला चाओ की धुन बजती है]" },
        { time: 4, text: "प्रोफ़ेसर: यह सिर्फ डकैती नहीं है। यह एक क्रांति है।" },
        { time: 9, text: "बर्लिन: दोस्तों, आज हम इतिहास रचेंगे।" },
        { time: 14, text: "टोक्यो: जब गोलियां चलीं, तो प्यार ही हमारी ढाल था।" },
        { time: 19, text: "[बाहर पुलिस की गाड़ियाँ सायरन बजाती हैं]" }
      ]
    }
  },
  {
    id: "cyberpunk-edgerunners",
    title: "Cyberpunk: Edgerunners",
    type: "TV Series",
    overview: "A street kid trying to survive in a technology and body modification-obsessed city of the future. Having everything to lose, he chooses to stay alive by becoming an edgerunner.",
    backdrop: "https://image.tmdb.org/t/p/w1280/3UbHGmu9vIMSC5uNfnGt7DjetqT.jpg",
    poster: "https://image.tmdb.org/t/p/w780/7jSWOc6jWSw5hZ78HB8Hw3pJxuk.jpg",
    matchScore: 98,
    year: "2022",
    ageRating: "18+",
    duration: "1 Season",
    quality: "4K Ultra HD",
    audio: "5.1 Surround",
    genres: ["Anime", "Action", "Cyberpunk", "Sci-Fi"],
    cast: ["KENN", "Aoi Yuuki", "Hiroki Touchi", "Zach Aguilar"],
    creator: "Studio Trigger",
    category: "trending",
    isOriginal: true,
    top10Rank: 5,
    videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_5MB.mp4",
    subtitles: {
      en: [
        { time: 1, text: "[neon techno synth bass drops heavy]" },
        { time: 4, text: "DAVID: I'm not running away anymore, Lucy." },
        { time: 8, text: "LUCY: David! Your cyberware is pushing you over the edge!" },
        { time: 13, text: "DAVID: I promised I'd take you to the moon." }
      ],
      hi: [
        { time: 1, text: "[तेज तकनीकी संगीत बजता है]" },
        { time: 4, text: "डेविड: मैं अब और भागने वाला नहीं हूँ, लूसी।" },
        { time: 8, text: "लूसी: डेविड! तुम्हारी मशीनें तुम्हें पागल कर देंगी!" },
        { time: 13, text: "डेविड: मैंने तुम्हें चांद पर ले जाने का वादा किया था।" }
      ]
    }
  },
  {
    id: "arcane",
    title: "Arcane",
    type: "TV Series",
    overview: "Set in the utopian region of Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League champions-and the power that will tear them apart.",
    backdrop: "https://image.tmdb.org/t/p/w1280/5cvnxEHT3e39DvT6ARw4GNCFrB0.jpg",
    poster: "https://image.tmdb.org/t/p/w780/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg",
    matchScore: 99,
    year: "2024",
    ageRating: "16+",
    duration: "2 Seasons",
    quality: "4K Ultra HD",
    audio: "Dolby Atmos",
    genres: ["Animation", "Steampunk", "Action", "Sci-Fi"],
    cast: ["Hailee Steinfeld", "Ella Purnell", "Kevin Alejandro", "Katie Leung"],
    creator: "Christian Linke, Alex Yee",
    category: "trending",
    isOriginal: true,
    top10Rank: 6,
    videoUrl: "https://vjs.zencdn.net/v/oceans.mp4",
    subtitles: {
      en: [
        { time: 1, text: "[orchestral brass swells dramatically]" },
        { time: 4, text: "VI: Powder, whatever happens, we stick together." },
        { time: 9, text: "JINX: Powder fell down a well. I'm Jinx now." },
        { time: 14, text: "SILCO: Is there anything so undoing as a daughter?" }
      ],
      hi: [
        { time: 1, text: "[नाटकीय ऑर्केस्ट्रा बजता है]" },
        { time: 4, text: "वी: पाउडर, चाहे कुछ भी हो, हम हमेशा साथ रहेंगे।" },
        { time: 9, text: "जिंक्स: पाउडर अब मर चुकी है। अब मैं जिंक्स हूँ।" },
        { time: 14, text: "सिल्को: क्या एक बेटी से ज्यादा कोई इंसान को कमजोर कर सकता है?" }
      ]
    }
  },
  {
    id: "interstellar",
    title: "Interstellar",
    type: "Movie",
    overview: "With humanity on the brink of extinction, a group of astronauts travels through a wormhole near Saturn in search of a new habitable world.",
    backdrop: "https://image.tmdb.org/t/p/w1280/8sNiAPPYU14PUepFNeSNGUTiHW.jpg",
    poster: "https://image.tmdb.org/t/p/w780/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg",
    matchScore: 99,
    year: "2014",
    ageRating: "U/A 13+",
    duration: "2h 49m",
    quality: "4K Ultra HD",
    audio: "IMAX Enhanced",
    genres: ["Sci-Fi", "Drama", "Mind-Bending", "Space"],
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
    creator: "Christopher Nolan",
    category: "scifi",
    top10Rank: 7,
    videoUrl: "/trailers/interstellar.mp4",
    backupVideoUrl: "https://archive.org/download/interstellar-trailer-3/Interstellar_OfficialTrailer3_4K_51_prores.mp4",
    youtubeTrailerId: "2Sm7e2v9Mzg",
    subtitles: {
      en: [
        { time: 1, text: "[Hans Zimmer pipe organ plays intensely]" },
        { time: 4, text: "COOPER: We used to look up at the sky and wonder at our place in the stars." },
        { time: 10, text: "BRAND: Love is the one thing we're capable of perceiving that transcends dimensions." },
        { time: 16, text: "COOPER: Murph... I'm coming home." }
      ],
      hi: [
        { time: 1, text: "[गंभीर आर्गन धुन बजती है]" },
        { time: 4, text: "कूपर: हम सितारों को देखकर सोचते थे कि हमारा स्थान कहाँ है।" },
        { time: 10, text: "ब्रैंड: प्यार ही एक ऐसी चीज़ है जो समय और दूरी से परे है।" },
        { time: 16, text: "कूपर: मर्फ़... मैं वापस आ रहा हूँ।" }
      ]
    }
  },
  {
    id: "inception",
    title: "Inception",
    type: "Movie",
    overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    backdrop: "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    poster: "https://image.tmdb.org/t/p/w780/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg",
    matchScore: 98,
    year: "2010",
    ageRating: "U/A 16+",
    duration: "2h 28m",
    quality: "4K Ultra HD",
    audio: "5.1 Surround",
    genres: ["Action", "Sci-Fi", "Heist", "Psychological Thriller"],
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy"],
    creator: "Christopher Nolan",
    category: "scifi",
    top10Rank: 8,
    videoUrl: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    subtitles: {
      en: [
        { time: 1, text: "[brass horn blast resounds deeply]" },
        { time: 4, text: "COBB: An idea is like a virus. Resilient. Highly contagious." },
        { time: 10, text: "ARTHUR: You want us to perform inception? It's impossible." },
        { time: 15, text: "COBB: It is possible. You just have to go deep enough." }
      ],
      hi: [
        { time: 1, text: "[गहरा हॉर्न गूंजता है]" },
        { time: 4, text: "कॉब: एक विचार एक वायरस की तरह होता है। बेहद संक्रामक।" },
        { time: 10, text: "आर्थर: तुम इंसेप्शन करना चाहते हो? यह नामुमकिन है।" },
        { time: 15, text: "कॉब: यह मुमकिन है। तुम्हें बस बहुत गहराई में जाना होगा।" }
      ]
    }
  },
  {
    id: "the-dark-knight",
    title: "The Dark Knight",
    type: "Movie",
    overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
    backdrop: "https://image.tmdb.org/t/p/w1280/9FE5eD92WfVCiivM9Pq9GVSrlWk.jpg",
    poster: "https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    matchScore: 99,
    year: "2008",
    ageRating: "U/A 16+",
    duration: "2h 32m",
    quality: "4K Ultra HD",
    audio: "5.1 Surround",
    genres: ["Action", "Crime", "Superhero", "Drama"],
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Michael Caine"],
    creator: "Christopher Nolan",
    category: "action",
    top10Rank: 9,
    videoUrl: "/trailers/the-batman.mp4",
    backupVideoUrl: "https://archive.org/download/yt-5s.com-the-batman-trailer-oficial/yt5s.com-THE%20BATMAN%20-%20Tr%C3%A1iler%20Oficial.mp4",
    youtubeTrailerId: "EXeTwQWrcwY",
    subtitles: {
      en: [
        { time: 1, text: "[cackling laugh echoes sinisterly]" },
        { time: 4, text: "JOKER: Why so serious?" },
        { time: 8, text: "BATMAN: You'll never break Gotham." },
        { time: 12, text: "GORDON: Because he's the hero Gotham deserves, but not the one it needs right now." }
      ],
      hi: [
        { time: 1, text: "[जोकर की भयानक हंसी गूंजती है]" },
        { time: 4, text: "जोकर: इतने गंभीर क्यों हो?" },
        { time: 8, text: "बैटमैन: तुम कभी गोथम को तोड़ नहीं पाओगे।" },
        { time: 12, text: "गॉर्डन: वह वह नायक है जिसका गोथम हकदार है, लेकिन जिसकी अभी उसे ज़रूरत नहीं है।" }
      ]
    }
  },
  {
    id: "breaking-bad",
    title: "Breaking Bad",
    type: "TV Series",
    overview: "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family's future.",
    backdrop: "https://image.tmdb.org/t/p/w1280/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    poster: "https://image.tmdb.org/t/p/w780/anFx9aTOOYqgS3v7x3R84Kz67ly.jpg",
    matchScore: 99,
    year: "2013",
    ageRating: "18+",
    duration: "5 Seasons",
    quality: "4K Ultra HD",
    audio: "5.1 Surround",
    genres: ["Crime", "Drama", "Suspense", "Gritty"],
    cast: ["Bryan Cranston", "Aaron Paul", "Anna Gunn", "Giancarlo Esposito"],
    creator: "Vince Gilligan",
    category: "drama",
    top10Rank: 10,
    videoUrl: "https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_5MB.mp4",
    subtitles: {
      en: [
        { time: 1, text: "[desert wind blows across New Mexico]" },
        { time: 4, text: "WALTER: I am not in danger, Skyler. I am the danger." },
        { time: 9, text: "JESSE: Yeah science, b*tch!" },
        { time: 14, text: "WALTER: Say my name." }
      ],
      hi: [
        { time: 1, text: "[रेगिस्तानी हवा की सरसराहट]" },
        { time: 4, text: "वाल्टर: मैं खतरे में नहीं हूँ, स्काईलर। मैं ही खतरा हूँ।" },
        { time: 9, text: "जेसी: हाँ विज्ञान, यही है कमाल!" },
        { time: 14, text: "वाल्टर: मेरा नाम बोलो।" }
      ]
    }
  },
  {
    id: "the-witcher",
    title: "The Witcher",
    type: "TV Series",
    overview: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
    backdrop: "https://image.tmdb.org/t/p/w1280/foGkPxpw9h8zln81j63mix5B7m8.jpg",
    poster: "https://image.tmdb.org/t/p/w780/AoGsDM02UVt0npBA8OvpDcZbaMi.jpg",
    matchScore: 95,
    year: "2023",
    ageRating: "18+",
    duration: "3 Seasons",
    quality: "4K Ultra HD",
    audio: "Dolby Atmos",
    genres: ["Dark Fantasy", "Action", "Adventure", "Magic"],
    cast: ["Henry Cavill", "Anya Chalotra", "Freya Allan", "Joey Batey"],
    creator: "Lauren Schmidt Hissrich",
    category: "action",
    isOriginal: true,
    videoUrl: "https://vjs.zencdn.net/v/oceans.mp4",
    subtitles: {
      en: [
        { time: 1, text: "[silver sword draws with a metallic ring]" },
        { time: 4, text: "GERALT: Evil is evil. Lesser, greater, middling, it's all the same." },
        { time: 9, text: "JASKIER: Toss a coin to your witcher, O Valley of Plenty!" }
      ],
      hi: [
        { time: 1, text: "[तलवार म्यान से निकलती है]" },
        { time: 4, text: "गेराल्ट: बुराई बुराई होती है। छोटी या बड़ी, सब एक जैसी है।" },
        { time: 9, text: "जैस्कियर: अपने जादूगर के लिए एक सिक्का उछालो!" }
      ]
    }
  },
  {
    id: "peaky-blinders",
    title: "Peaky Blinders",
    type: "TV Series",
    overview: "A notorious gang in 1919 Birmingham, England, is led by the fierce Tommy Shelby, a crime boss set on moving up in the world no matter the cost.",
    backdrop: "https://image.tmdb.org/t/p/w1280/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg",
    poster: "https://image.tmdb.org/t/p/w780/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg",
    matchScore: 97,
    year: "2022",
    ageRating: "18+",
    duration: "6 Seasons",
    quality: "4K Ultra HD",
    audio: "5.1 Surround",
    genres: ["Period Piece", "Crime", "Drama", "Gritty"],
    cast: ["Cillian Murphy", "Paul Anderson", "Helen McCrory", "Tom Hardy"],
    creator: "Steven Knight",
    category: "drama",
    videoUrl: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    subtitles: {
      en: [
        { time: 1, text: "[Red Right Hand by Nick Cave plays]" },
        { time: 4, text: "TOMMY: By order of the Peaky Blinders!" },
        { time: 8, text: "ARTHUR: In the bleak midwinter..." }
      ],
      hi: [
        { time: 1, text: "[रेड राइट हैंड गीत बजता है]" },
        { time: 4, text: "टॉमी: पीकी ब्लाइंडर्स के हुक्म से!" },
        { time: 8, text: "आर्थर: कड़ाके की सर्द सर्दियों में..." }
      ]
    }
  },
  {
    id: "queens-gambit",
    title: "The Queen's Gambit",
    type: "TV Series",
    overview: "Orphaned at the tender age of nine, prodigious introvert Beth Harmon discovers and masters the game of chess in 1960s USA. But child stardom comes at a price.",
    backdrop: "https://image.tmdb.org/t/p/w1280/ktZaQ4FEmKpRgetiBooZETYQbmQ.jpg",
    poster: "https://image.tmdb.org/t/p/w780/zU0htwkhNvBQdVSIKB9s6hgVeFK.jpg",
    matchScore: 98,
    year: "2020",
    ageRating: "16+",
    duration: "Limited Series",
    quality: "4K Ultra HD",
    audio: "Dolby Atmos",
    genres: ["Drama", "Intellectual", "Period Piece", "Psychological"],
    cast: ["Anya Taylor-Joy", "Bill Camp", "Marielle Heller"],
    creator: "Scott Frank, Allan Scott",
    category: "drama",
    isOriginal: true,
    videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    subtitles: {
      en: [
        { time: 1, text: "[clock ticking on the chess board]" },
        { time: 4, text: "BETH: Chess isn't always competitive. It can also be beautiful." }
      ],
      hi: [
        { time: 1, text: "[शतरंज की घड़ी टिक-टिक करती है]" },
        { time: 4, text: "बेथ: शतरंज सिर्फ मुकाबला नहीं है, यह एक खूबसूरत कला है।" }
      ]
    }
  },
  {
    id: "all-of-us-are-dead",
    title: "All of Us Are Dead",
    type: "TV Series",
    overview: "A high school becomes ground zero for a zombie virus outbreak. Trapped students must fight their way out or turn into one of the rabid infected.",
    backdrop: "https://image.tmdb.org/t/p/w1280/8hp2CuGnw1iP5dLBVMAPUv23swx.jpg",
    poster: "https://image.tmdb.org/t/p/w780/pTEFqAjLd5YTsMD6NSUxV6Dq7A6.jpg",
    matchScore: 96,
    year: "2022",
    ageRating: "18+",
    duration: "1 Season",
    quality: "4K Ultra HD",
    audio: "Dolby Atmos",
    genres: ["Horror", "Zombies", "Teen Drama", "Korean"],
    cast: ["Park Ji-hu", "Yoon Chan-young", "Cho Yi-hyun", "Lomon"],
    creator: "Chun Sung-il, Lee JQ",
    category: "trending",
    isOriginal: true,
    videoUrl: "https://vjs.zencdn.net/v/oceans.mp4",
    subtitles: {
      en: [
        { time: 1, text: "[snarls and screams echo down high school hallway]" },
        { time: 4, text: "CHEONG-SAN: Run! Don't let them bite you!" }
      ],
      hi: [
        { time: 1, text: "[स्कूल के गलियारे में चीखें गूंजती हैं]" },
        { time: 4, text: "चेयोंग-सान: भागो! उन्हें काटने मत देना!" }
      ]
    }
  },
  {
    id: "dune-2",
    title: "Dune: Part Two",
    type: "Movie",
    overview: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, facing a choice between love and the fate of the universe.",
    backdrop: "https://image.tmdb.org/t/p/w1280/eZ239CUp1d6OryZEBPnO2n87gMG.jpg",
    poster: "https://image.tmdb.org/t/p/w780/3HzGtM0JpfH2pWFGugJK22LRP6b.jpg",
    matchScore: 99,
    year: "2024",
    ageRating: "U/A 13+",
    duration: "2h 46m",
    quality: "4K Ultra HD",
    audio: "Dolby Atmos",
    genres: ["Sci-Fi", "Epic", "Action", "Adventure"],
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Javier Bardem"],
    creator: "Denis Villeneuve",
    category: "scifi",
    videoUrl: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    subtitles: {
      en: [
        { time: 1, text: "[sand dunes shift with deep bass vibration]" },
        { time: 4, text: "PAUL: Long live the fighters! Lead them to paradise!" }
      ],
      hi: [
        { time: 1, text: "[रेत के टीले कंपन से कांपते हैं]" },
        { time: 4, text: "पॉल: योद्धा अमर रहें! इन्हें स्वर्ग की ओर ले चलो!" }
      ]
    }
  }
];

module.exports = movies;
