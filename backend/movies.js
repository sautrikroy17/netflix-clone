// Mock movie database for Netflix clone
const movies = [
  {
    "id": "stranger-things",
    "title": "Stranger Things",
    "type": "TV Series",
    "overview": "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl with telekinetic powers.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    "matchScore": 99,
    "year": "2024",
    "ageRating": "U/A 16+",
    "duration": "4 Seasons",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Sci-Fi",
      "Horror",
      "Nostalgic",
      "Teen Mystery"
    ],
    "cast": [
      "Winona Ryder",
      "David Harbour",
      "Millie Bobby Brown",
      "Finn Wolfhard"
    ],
    "creator": "The Duffer Brothers",
    "category": "trending",
    "isOriginal": true,
    "top10Rank": 1,
    "videoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "backupVideoUrl": "https://ia600104.us.archive.org/1/items/stranger-things-season-2-comic-con-trailer-2017/Stranger%20Things%20Season%202%20Comic-Con%20Trailer%20%282017%29%20-%20Thriller.ia.mp4",
    "youtubeTrailerId": "b9EkMc79ZSU",
    "subtitles": {
      "en": [
        {
          "time": 2,
          "text": "[ominous 80s synthesizer hums softly]"
        },
        {
          "time": 7,
          "text": "DUSTIN: Will, do you see the storm coming?"
        },
        {
          "time": 13,
          "text": "WILL: I felt it... it didn't feel like a dream."
        },
        {
          "time": 20,
          "text": "JOYCE: What happened to my boy in the Upside Down?!"
        },
        {
          "time": 28,
          "text": "VINCENT PRICE: Darkness falls across the land..."
        },
        {
          "time": 38,
          "text": "[Michael Jackson's Thriller beat erupts in Dolby Atmos]"
        },
        {
          "time": 48,
          "text": "HOPPER: Whatever is happening, it's spreading from the lab."
        },
        {
          "time": 60,
          "text": "MIKE: If they find us, they'll never let us leave."
        },
        {
          "time": 75,
          "text": "ELEVEN: I can fight it. I won't let them hurt you."
        },
        {
          "time": 90,
          "text": "[giant towering shadow monster rumbles across the sky]"
        }
      ],
      "hi": [
        {
          "time": 2,
          "text": "[गंभीर 80 के दशक का सिंथेसाइज़र संगीत बजता है]"
        },
        {
          "time": 7,
          "text": "डस्टिन: विल, क्या तुम वो तूफ़ान देख रहे हो?"
        },
        {
          "time": 13,
          "text": "विल: मुझे यह महसूस हुआ... यह कोई सपना नहीं था।"
        },
        {
          "time": 20,
          "text": "जॉयस: मेरे बच्चे के साथ उस उल्टी दुनिया में क्या हुआ?!"
        },
        {
          "time": 28,
          "text": "विंसेंट प्राइस: ज़मीन पर अंधेरा छा रहा है..."
        },
        {
          "time": 38,
          "text": "[माइकल जैक्सन का थ्रिलर संगीत गूंजता है]"
        },
        {
          "time": 48,
          "text": "हॉपर: जो कुछ भी हो रहा है, वह लैब से फैल रहा है।"
        },
        {
          "time": 60,
          "text": "माइक: अगर उन्होंने हमें ढूँढ लिया, तो जाने नहीं देंगे।"
        },
        {
          "time": 75,
          "text": "इलेवन: मैं इससे लड़ सकती हूँ। तुम्हें चोट नहीं पहुँचने दूँगी।"
        },
        {
          "time": 90,
          "text": "[विशाल छाया राक्षस आसमान में गरजता है]"
        }
      ],
      "es": [
        {
          "time": 2,
          "text": "[ominous 80s synthesizer hums softly - en español]"
        },
        {
          "time": 7,
          "text": "DUSTIN: Will, do you see the storm coming?"
        },
        {
          "time": 13,
          "text": "WILL: I felt it... it didn't feel like a dream."
        },
        {
          "time": 20,
          "text": "JOYCE: What happened to my boy in the Upside Down?!"
        },
        {
          "time": 28,
          "text": "VINCENT PRICE: Darkness falls across the land..."
        },
        {
          "time": 38,
          "text": "[Michael Jackson's Thriller beat erupts in Dolby Atmos - en español]"
        },
        {
          "time": 48,
          "text": "HOPPER: Whatever is happening, it's spreading from the lab."
        },
        {
          "time": 60,
          "text": "MIKE: If they find us, they'll never let us leave."
        },
        {
          "time": 75,
          "text": "ELEVEN: I can fight it. I won't let them hurt you."
        },
        {
          "time": 90,
          "text": "[giant towering shadow monster rumbles across the sky - en español]"
        }
      ]
    },
    "tmdbId": 66732
  },
  {
    "id": "squid-game",
    "title": "Squid Game",
    "type": "TV Series",
    "overview": "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/2meX1nMdScFOoV4370rqHWKmXhY.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/iE21DSI3n5vI6v1W2HT4feKoM97.jpg",
    "matchScore": 99,
    "year": "2024",
    "ageRating": "18+",
    "duration": "2 Seasons",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Thriller",
      "Suspense",
      "Dystopian",
      "Korean Drama"
    ],
    "cast": [
      "Lee Jung-jae",
      "Park Hae-soo",
      "Wi Ha-joon",
      "Jung Ho-yeon"
    ],
    "creator": "Hwang Dong-hyuk",
    "category": "trending",
    "isOriginal": true,
    "top10Rank": 2,
    "videoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "youtubeTrailerId": "oqxAJKy0ii4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[playful, chilling carnival chime plays]"
        },
        {
          "time": 5,
          "text": "FRONT MAN: Welcome to the 33rd Squid Game."
        },
        {
          "time": 9,
          "text": "GI-HUN: This is madness! People are dying!"
        },
        {
          "time": 14,
          "text": "SANG-WOO: Only one of us walks away with the money."
        },
        {
          "time": 19,
          "text": "[giant robotic doll sings in Korean]"
        },
        {
          "time": 24,
          "text": "[gunshot echoes through the arena]"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[डरावनी धुन बजती है]"
        },
        {
          "time": 5,
          "text": "फ्रंट मैन: 33वें स्क्विड गेम में आपका स्वागत है।"
        },
        {
          "time": 9,
          "text": "गी-हुन: यह पागलपन है! लोग मर रहे हैं!"
        },
        {
          "time": 14,
          "text": "सांग-वू: हममें से केवल एक ही यह पैसा लेकर जाएगा।"
        },
        {
          "time": 19,
          "text": "[विशाल गुड़िया गाना गाती है]"
        },
        {
          "time": 24,
          "text": "[मैदान में गोली की गूंज]"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[playful, chilling carnival chime plays - en español]"
        },
        {
          "time": 5,
          "text": "FRONT MAN: Welcome to the 33rd Squid Game."
        },
        {
          "time": 9,
          "text": "GI-HUN: This is madness! People are dying!"
        },
        {
          "time": 14,
          "text": "SANG-WOO: Only one of us walks away with the money."
        },
        {
          "time": 19,
          "text": "[giant robotic doll sings in Korean - en español]"
        },
        {
          "time": 24,
          "text": "[gunshot echoes through the arena - en español]"
        }
      ]
    },
    "tmdbId": 93405
  },
  {
    "id": "wednesday",
    "title": "Wednesday",
    "type": "TV Series",
    "overview": "Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree while making new friends — and foes — at Nevermore Academy.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/avzWIWe6FWZi7r1qJeQZcDTv3Ex.jpg",
    "matchScore": 98,
    "year": "2023",
    "ageRating": "U/A 13+",
    "duration": "1 Season",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Fantasy",
      "Comedy",
      "Dark Mystery",
      "Supernatural"
    ],
    "cast": [
      "Jenna Ortega",
      "Gwendoline Christie",
      "Riki Lindhome",
      "Christina Ricci"
    ],
    "creator": "Alfred Gough, Miles Millar",
    "category": "trending",
    "isOriginal": true,
    "top10Rank": 3,
    "videoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "backupVideoUrl": "https://archive.org/download/wednesday-season-2-part-2-official-trailer-netflix-720p/Wednesday__Season_2___Part_2_Official_Trailer___Netflix%28720p%29.mp4",
    "youtubeTrailerId": "Qa5kFRxBkNw",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[gothic cello music plays passionately]"
        },
        {
          "time": 5,
          "text": "WEDNESDAY: I don't bury the hatchet. I sharpen it."
        },
        {
          "time": 10,
          "text": "ENID: Wednesday! We're roomies! Give me a hug!"
        },
        {
          "time": 15,
          "text": "WEDNESDAY: Try it, and you'll lose that hand."
        },
        {
          "time": 20,
          "text": "[monster roars in the dark woods]"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[गॉथिक सेलो धुन बजती है]"
        },
        {
          "time": 5,
          "text": "वेडनसडे: मैं दुश्मनी नहीं भूलती, बदला लेती हूँ।"
        },
        {
          "time": 10,
          "text": "एनिड: वेडनसडे! हम रूममेट्स हैं! गले लगो!"
        },
        {
          "time": 15,
          "text": "वेडनसडे: कोशिश भी की तो हाथ गंवा बैठोगी।"
        },
        {
          "time": 20,
          "text": "[घने जंगल में राक्षस की दहाड़]"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[gothic cello music plays passionately - en español]"
        },
        {
          "time": 5,
          "text": "WEDNESDAY: I don't bury the hatchet. I sharpen it."
        },
        {
          "time": 10,
          "text": "ENID: Wednesday! We're roomies! Give me a hug!"
        },
        {
          "time": 15,
          "text": "WEDNESDAY: Try it, and you'll lose that hand."
        },
        {
          "time": 20,
          "text": "[monster roars in the dark woods - en español]"
        }
      ]
    },
    "tmdbId": 119051
  },
  {
    "id": "money-heist",
    "title": "Money Heist",
    "type": "TV Series",
    "overview": "Eight thieves take hostages and lock themselves in the Royal Mint of Spain as a criminal mastermind manipulates the police to carry out his plan.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/gFZriCkpJYsApPZEF3jhxL4yLzG.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
    "matchScore": 97,
    "year": "2023",
    "ageRating": "18+",
    "duration": "5 Parts",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Heist",
      "Thriller",
      "Action",
      "Spanish Drama"
    ],
    "cast": [
      "Úrsula Corberó",
      "Álvaro Morte",
      "Itziar Ituño",
      "Pedro Alonso"
    ],
    "creator": "Álex Pina",
    "category": "action",
    "isOriginal": true,
    "top10Rank": 4,
    "videoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[Bella Ciao plays in background]"
        },
        {
          "time": 4,
          "text": "PROFESSOR: This is not just a robbery. It's a statement."
        },
        {
          "time": 9,
          "text": "BERLIN: Gentlemen, today we make history."
        },
        {
          "time": 14,
          "text": "TOKYO: When the shooting started, love was our only shield."
        },
        {
          "time": 19,
          "text": "[police sirens wail loudly outside]"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[बेला चाओ की धुन बजती है]"
        },
        {
          "time": 4,
          "text": "प्रोफ़ेसर: यह सिर्फ डकैती नहीं है। यह एक क्रांति है।"
        },
        {
          "time": 9,
          "text": "बर्लिन: दोस्तों, आज हम इतिहास रचेंगे।"
        },
        {
          "time": 14,
          "text": "टोक्यो: जब गोलियां चलीं, तो प्यार ही हमारी ढाल था।"
        },
        {
          "time": 19,
          "text": "[बाहर पुलिस की गाड़ियाँ सायरन बजाती हैं]"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[Bella Ciao plays in background - en español]"
        },
        {
          "time": 4,
          "text": "PROFESSOR: This is not just a robbery. It's a statement."
        },
        {
          "time": 9,
          "text": "BERLIN: Gentlemen, today we make history."
        },
        {
          "time": 14,
          "text": "TOKYO: When the shooting started, love was our only shield."
        },
        {
          "time": 19,
          "text": "[police sirens wail loudly outside - en español]"
        }
      ]
    },
    "tmdbId": 71446,
    "youtubeTrailerId": "_InqQJRqGW4"
  },
  {
    "id": "cyberpunk-edgerunners",
    "title": "Cyberpunk: Edgerunners",
    "type": "TV Series",
    "overview": "A street kid trying to survive in a technology and body modification-obsessed city of the future. Having everything to lose, he chooses to stay alive by becoming an edgerunner.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/3UbHGmu9vIMSC5uNfnGt7DjetqT.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/7jSWOc6jWSw5hZ78HB8Hw3pJxuk.jpg",
    "matchScore": 98,
    "year": "2022",
    "ageRating": "18+",
    "duration": "1 Season",
    "quality": "4K Ultra HD",
    "audio": "5.1 Surround",
    "genres": [
      "Anime",
      "Action",
      "Cyberpunk",
      "Sci-Fi"
    ],
    "cast": [
      "KENN",
      "Aoi Yuuki",
      "Hiroki Touchi",
      "Zach Aguilar"
    ],
    "creator": "Studio Trigger",
    "category": "trending",
    "isOriginal": true,
    "videoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[neon techno synth bass drops heavy]"
        },
        {
          "time": 4,
          "text": "DAVID: I'm not running away anymore, Lucy."
        },
        {
          "time": 8,
          "text": "LUCY: David! Your cyberware is pushing you over the edge!"
        },
        {
          "time": 13,
          "text": "DAVID: I promised I'd take you to the moon."
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[तेज तकनीकी संगीत बजता है]"
        },
        {
          "time": 4,
          "text": "डेविड: मैं अब और भागने वाला नहीं हूँ, लूसी।"
        },
        {
          "time": 8,
          "text": "लूसी: डेविड! तुम्हारी मशीनें तुम्हें पागल कर देंगी!"
        },
        {
          "time": 13,
          "text": "डेविड: मैंने तुम्हें चांद पर ले जाने का वादा किया था।"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[neon techno synth bass drops heavy - en español]"
        },
        {
          "time": 4,
          "text": "DAVID: I'm not running away anymore, Lucy."
        },
        {
          "time": 8,
          "text": "LUCY: David! Your cyberware is pushing you over the edge!"
        },
        {
          "time": 13,
          "text": "DAVID: I promised I'd take you to the moon."
        }
      ]
    },
    "tmdbId": 105248,
    "youtubeTrailerId": "JtqIas3bYhg"
  },
  {
    "id": "arcane",
    "title": "Arcane",
    "type": "TV Series",
    "overview": "Set in the utopian region of Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League champions-and the power that will tear them apart.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/5cvnxEHT3e39DvT6ARw4GNCFrB0.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg",
    "matchScore": 99,
    "year": "2024",
    "ageRating": "16+",
    "duration": "2 Seasons",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Animation",
      "Steampunk",
      "Action",
      "Sci-Fi"
    ],
    "cast": [
      "Hailee Steinfeld",
      "Ella Purnell",
      "Kevin Alejandro",
      "Katie Leung"
    ],
    "creator": "Christian Linke, Alex Yee",
    "category": "trending",
    "isOriginal": true,
    "videoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[orchestral brass swells dramatically]"
        },
        {
          "time": 4,
          "text": "VI: Powder, whatever happens, we stick together."
        },
        {
          "time": 9,
          "text": "JINX: Powder fell down a well. I'm Jinx now."
        },
        {
          "time": 14,
          "text": "SILCO: Is there anything so undoing as a daughter?"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[नाटकीय ऑर्केस्ट्रा बजता है]"
        },
        {
          "time": 4,
          "text": "वी: पाउडर, चाहे कुछ भी हो, हम हमेशा साथ रहेंगे।"
        },
        {
          "time": 9,
          "text": "जिंक्स: पाउडर अब मर चुकी है। अब मैं जिंक्स हूँ।"
        },
        {
          "time": 14,
          "text": "सिल्को: क्या एक बेटी से ज्यादा कोई इंसान को कमजोर कर सकता है?"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[orchestral brass swells dramatically - en español]"
        },
        {
          "time": 4,
          "text": "VI: Powder, whatever happens, we stick together."
        },
        {
          "time": 9,
          "text": "JINX: Powder fell down a well. I'm Jinx now."
        },
        {
          "time": 14,
          "text": "SILCO: Is there anything so undoing as a daughter?"
        }
      ]
    },
    "tmdbId": 94605,
    "youtubeTrailerId": "fXmAurh012s"
  },
  {
    "id": "interstellar",
    "title": "Interstellar",
    "type": "Movie",
    "overview": "With humanity on the brink of extinction, a group of astronauts travels through a wormhole near Saturn in search of a new habitable world.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/8sNiAPPYU14PUepFNeSNGUTiHW.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg",
    "matchScore": 99,
    "year": "2014",
    "ageRating": "U/A 13+",
    "duration": "2h 49m",
    "quality": "4K Ultra HD",
    "audio": "IMAX Enhanced",
    "genres": [
      "Sci-Fi",
      "Drama",
      "Mind-Bending",
      "Space"
    ],
    "cast": [
      "Matthew McConaughey",
      "Anne Hathaway",
      "Jessica Chastain",
      "Michael Caine"
    ],
    "creator": "Christopher Nolan",
    "category": "scifi",
    "videoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "backupVideoUrl": "https://archive.org/download/interstellar-trailer-3/Interstellar_OfficialTrailer3_4K_51_prores.mp4",
    "youtubeTrailerId": "zSWdZVtXT7E",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[Hans Zimmer pipe organ plays intensely]"
        },
        {
          "time": 4,
          "text": "COOPER: We used to look up at the sky and wonder at our place in the stars."
        },
        {
          "time": 10,
          "text": "BRAND: Love is the one thing we're capable of perceiving that transcends dimensions."
        },
        {
          "time": 16,
          "text": "COOPER: Murph... I'm coming home."
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[गंभीर आर्गन धुन बजती है]"
        },
        {
          "time": 4,
          "text": "कूपर: हम सितारों को देखकर सोचते थे कि हमारा स्थान कहाँ है।"
        },
        {
          "time": 10,
          "text": "ब्रैंड: प्यार ही एक ऐसी चीज़ है जो समय और दूरी से परे है।"
        },
        {
          "time": 16,
          "text": "कूपर: मर्फ़... मैं वापस आ रहा हूँ।"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[Hans Zimmer pipe organ plays intensely - en español]"
        },
        {
          "time": 4,
          "text": "COOPER: We used to look up at the sky and wonder at our place in the stars."
        },
        {
          "time": 10,
          "text": "BRAND: Love is the one thing we're capable of perceiving that transcends dimensions."
        },
        {
          "time": 16,
          "text": "COOPER: Murph... I'm coming home."
        }
      ]
    },
    "tmdbId": 157336
  },
  {
    "id": "inception",
    "title": "Inception",
    "type": "Movie",
    "overview": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg",
    "matchScore": 98,
    "year": "2010",
    "ageRating": "U/A 16+",
    "duration": "2h 28m",
    "quality": "4K Ultra HD",
    "audio": "5.1 Surround",
    "genres": [
      "Action",
      "Sci-Fi",
      "Heist",
      "Psychological Thriller"
    ],
    "cast": [
      "Leonardo DiCaprio",
      "Joseph Gordon-Levitt",
      "Elliot Page",
      "Tom Hardy"
    ],
    "creator": "Christopher Nolan",
    "category": "scifi",
    "videoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[brass horn blast resounds deeply]"
        },
        {
          "time": 4,
          "text": "COBB: An idea is like a virus. Resilient. Highly contagious."
        },
        {
          "time": 10,
          "text": "ARTHUR: You want us to perform inception? It's impossible."
        },
        {
          "time": 15,
          "text": "COBB: It is possible. You just have to go deep enough."
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[गहरा हॉर्न गूंजता है]"
        },
        {
          "time": 4,
          "text": "कॉब: एक विचार एक वायरस की तरह होता है। बेहद संक्रामक।"
        },
        {
          "time": 10,
          "text": "आर्थर: तुम इंसेप्शन करना चाहते हो? यह नामुमकिन है।"
        },
        {
          "time": 15,
          "text": "कॉब: यह मुमकिन है। तुम्हें बस बहुत गहराई में जाना होगा।"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[brass horn blast resounds deeply - en español]"
        },
        {
          "time": 4,
          "text": "COBB: An idea is like a virus. Resilient. Highly contagious."
        },
        {
          "time": 10,
          "text": "ARTHUR: You want us to perform inception? It's impossible."
        },
        {
          "time": 15,
          "text": "COBB: It is possible. You just have to go deep enough."
        }
      ]
    },
    "tmdbId": 27205,
    "youtubeTrailerId": "YoHD9XEInc0"
  },
  {
    "id": "the-dark-knight",
    "title": "The Dark Knight",
    "type": "Movie",
    "overview": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/9FE5eD92WfVCiivM9Pq9GVSrlWk.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    "matchScore": 99,
    "year": "2008",
    "ageRating": "U/A 16+",
    "duration": "2h 32m",
    "quality": "4K Ultra HD",
    "audio": "5.1 Surround",
    "genres": [
      "Action",
      "Crime",
      "Superhero",
      "Drama"
    ],
    "cast": [
      "Christian Bale",
      "Heath Ledger",
      "Aaron Eckhart",
      "Michael Caine"
    ],
    "creator": "Christopher Nolan",
    "category": "action",
    "videoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "backupVideoUrl": "https://archive.org/download/yt-5s.com-the-batman-trailer-oficial/yt5s.com-THE%20BATMAN%20-%20Tr%C3%A1iler%20Oficial.mp4",
    "youtubeTrailerId": "EXeTwQWrcwY",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[cackling laugh echoes sinisterly]"
        },
        {
          "time": 4,
          "text": "JOKER: Why so serious?"
        },
        {
          "time": 8,
          "text": "BATMAN: You'll never break Gotham."
        },
        {
          "time": 12,
          "text": "GORDON: Because he's the hero Gotham deserves, but not the one it needs right now."
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[जोकर की भयानक हंसी गूंजती है]"
        },
        {
          "time": 4,
          "text": "जोकर: इतने गंभीर क्यों हो?"
        },
        {
          "time": 8,
          "text": "बैटमैन: तुम कभी गोथम को तोड़ नहीं पाओगे।"
        },
        {
          "time": 12,
          "text": "गॉर्डन: वह वह नायक है जिसका गोथम हकदार है, लेकिन जिसकी अभी उसे ज़रूरत नहीं है।"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[cackling laugh echoes sinisterly - en español]"
        },
        {
          "time": 4,
          "text": "JOKER: Why so serious?"
        },
        {
          "time": 8,
          "text": "BATMAN: You'll never break Gotham."
        },
        {
          "time": 12,
          "text": "GORDON: Because he's the hero Gotham deserves, but not the one it needs right now."
        }
      ]
    },
    "tmdbId": 155
  },
  {
    "id": "breaking-bad",
    "title": "Breaking Bad",
    "type": "TV Series",
    "overview": "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family's future.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/anFx9aTOOYqgS3v7x3R84Kz67ly.jpg",
    "matchScore": 99,
    "year": "2013",
    "ageRating": "18+",
    "duration": "5 Seasons",
    "quality": "4K Ultra HD",
    "audio": "5.1 Surround",
    "genres": [
      "Crime",
      "Drama",
      "Suspense",
      "Gritty"
    ],
    "cast": [
      "Bryan Cranston",
      "Aaron Paul",
      "Anna Gunn",
      "Giancarlo Esposito"
    ],
    "creator": "Vince Gilligan",
    "category": "drama",
    "videoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[desert wind blows across New Mexico]"
        },
        {
          "time": 4,
          "text": "WALTER: I am not in danger, Skyler. I am the danger."
        },
        {
          "time": 9,
          "text": "JESSE: Yeah science, b*tch!"
        },
        {
          "time": 14,
          "text": "WALTER: Say my name."
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[रेगिस्तानी हवा की सरसराहट]"
        },
        {
          "time": 4,
          "text": "वाल्टर: मैं खतरे में नहीं हूँ, स्काईलर। मैं ही खतरा हूँ।"
        },
        {
          "time": 9,
          "text": "जेसी: हाँ विज्ञान, यही है कमाल!"
        },
        {
          "time": 14,
          "text": "वाल्टर: मेरा नाम बोलो।"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[desert wind blows across New Mexico - en español]"
        },
        {
          "time": 4,
          "text": "WALTER: I am not in danger, Skyler. I am the danger."
        },
        {
          "time": 9,
          "text": "JESSE: Yeah science, b*tch!"
        },
        {
          "time": 14,
          "text": "WALTER: Say my name."
        }
      ]
    },
    "tmdbId": 1396,
    "youtubeTrailerId": "HhesaQXLuRY"
  },
  {
    "id": "the-witcher",
    "title": "The Witcher",
    "type": "TV Series",
    "overview": "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/foGkPxpw9h8zln81j63mix5B7m8.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/AoGsDM02UVt0npBA8OvpDcZbaMi.jpg",
    "matchScore": 95,
    "year": "2023",
    "ageRating": "18+",
    "duration": "3 Seasons",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Dark Fantasy",
      "Action",
      "Adventure",
      "Magic"
    ],
    "cast": [
      "Henry Cavill",
      "Anya Chalotra",
      "Freya Allan",
      "Joey Batey"
    ],
    "creator": "Lauren Schmidt Hissrich",
    "category": "action",
    "isOriginal": true,
    "videoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[silver sword draws with a metallic ring]"
        },
        {
          "time": 4,
          "text": "GERALT: Evil is evil. Lesser, greater, middling, it's all the same."
        },
        {
          "time": 9,
          "text": "JASKIER: Toss a coin to your witcher, O Valley of Plenty!"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[तलवार म्यान से निकलती है]"
        },
        {
          "time": 4,
          "text": "गेराल्ट: बुराई बुराई होती है। छोटी या बड़ी, सब एक जैसी है।"
        },
        {
          "time": 9,
          "text": "जैस्कियर: अपने जादूगर के लिए एक सिक्का उछालो!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[silver sword draws with a metallic ring - en español]"
        },
        {
          "time": 4,
          "text": "GERALT: Evil is evil. Lesser, greater, middling, it's all the same."
        },
        {
          "time": 9,
          "text": "JASKIER: Toss a coin to your witcher, O Valley of Plenty!"
        }
      ]
    },
    "tmdbId": 71912,
    "youtubeTrailerId": "ndl1W4ltcmg"
  },
  {
    "id": "peaky-blinders",
    "title": "Peaky Blinders",
    "type": "TV Series",
    "overview": "A notorious gang in 1919 Birmingham, England, is led by the fierce Tommy Shelby, a crime boss set on moving up in the world no matter the cost.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg",
    "matchScore": 97,
    "year": "2022",
    "ageRating": "18+",
    "duration": "6 Seasons",
    "quality": "4K Ultra HD",
    "audio": "5.1 Surround",
    "genres": [
      "Period Piece",
      "Crime",
      "Drama",
      "Gritty"
    ],
    "cast": [
      "Cillian Murphy",
      "Paul Anderson",
      "Helen McCrory",
      "Tom Hardy"
    ],
    "creator": "Steven Knight",
    "category": "drama",
    "videoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[Red Right Hand by Nick Cave plays]"
        },
        {
          "time": 4,
          "text": "TOMMY: By order of the Peaky Blinders!"
        },
        {
          "time": 8,
          "text": "ARTHUR: In the bleak midwinter..."
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[रेड राइट हैंड गीत बजता है]"
        },
        {
          "time": 4,
          "text": "टॉमी: पीकी ब्लाइंडर्स के हुक्म से!"
        },
        {
          "time": 8,
          "text": "आर्थर: कड़ाके की सर्द सर्दियों में..."
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[Red Right Hand by Nick Cave plays - en español]"
        },
        {
          "time": 4,
          "text": "TOMMY: By order of the Peaky Blinders!"
        },
        {
          "time": 8,
          "text": "ARTHUR: In the bleak midwinter..."
        }
      ]
    },
    "tmdbId": 60574,
    "youtubeTrailerId": "oVzVdvGIC7U"
  },
  {
    "id": "queens-gambit",
    "title": "The Queen's Gambit",
    "type": "TV Series",
    "overview": "Orphaned at the tender age of nine, prodigious introvert Beth Harmon discovers and masters the game of chess in 1960s USA. But child stardom comes at a price.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/ktZaQ4FEmKpRgetiBooZETYQbmQ.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/zU0htwkhNvBQdVSIKB9s6hgVeFK.jpg",
    "matchScore": 98,
    "year": "2020",
    "ageRating": "16+",
    "duration": "Limited Series",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Drama",
      "Intellectual",
      "Period Piece",
      "Psychological"
    ],
    "cast": [
      "Anya Taylor-Joy",
      "Bill Camp",
      "Marielle Heller"
    ],
    "creator": "Scott Frank, Allan Scott",
    "category": "drama",
    "isOriginal": true,
    "videoUrl": "https://media.w3.org/2010/05/sintel/trailer.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[clock ticking on the chess board]"
        },
        {
          "time": 4,
          "text": "BETH: Chess isn't always competitive. It can also be beautiful."
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[शतरंज की घड़ी टिक-टिक करती है]"
        },
        {
          "time": 4,
          "text": "बेथ: शतरंज सिर्फ मुकाबला नहीं है, यह एक खूबसूरत कला है।"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[clock ticking on the chess board - en español]"
        },
        {
          "time": 4,
          "text": "BETH: Chess isn't always competitive. It can also be beautiful."
        }
      ]
    },
    "tmdbId": 87739,
    "youtubeTrailerId": "oZn3qSgmLqI"
  },
  {
    "id": "all-of-us-are-dead",
    "title": "All of Us Are Dead",
    "type": "TV Series",
    "overview": "A high school becomes ground zero for a zombie virus outbreak. Trapped students must fight their way out or turn into one of the rabid infected.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/8hp2CuGnw1iP5dLBVMAPUv23swx.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/pTEFqAjLd5YTsMD6NSUxV6Dq7A6.jpg",
    "matchScore": 96,
    "year": "2022",
    "ageRating": "18+",
    "duration": "1 Season",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Horror",
      "Zombies",
      "Teen Drama",
      "Korean"
    ],
    "cast": [
      "Park Ji-hu",
      "Yoon Chan-young",
      "Cho Yi-hyun",
      "Lomon"
    ],
    "creator": "Chun Sung-il, Lee JQ",
    "category": "trending",
    "isOriginal": true,
    "videoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[snarls and screams echo down high school hallway]"
        },
        {
          "time": 4,
          "text": "CHEONG-SAN: Run! Don't let them bite you!"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[स्कूल के गलियारे में चीखें गूंजती हैं]"
        },
        {
          "time": 4,
          "text": "चेयोंग-सान: भागो! उन्हें काटने मत देना!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[snarls and screams echo down high school hallway - en español]"
        },
        {
          "time": 4,
          "text": "CHEONG-SAN: Run! Don't let them bite you!"
        }
      ]
    },
    "tmdbId": 99966,
    "youtubeTrailerId": "IN5TD4VRcSM"
  },
  {
    "id": "dune-2",
    "title": "Dune: Part Two",
    "type": "Movie",
    "overview": "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, facing a choice between love and the fate of the universe.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/eZ239CUp1d6OryZEBPnO2n87gMG.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/3HzGtM0JpfH2pWFGugJK22LRP6b.jpg",
    "matchScore": 99,
    "year": "2024",
    "ageRating": "U/A 13+",
    "duration": "2h 46m",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Sci-Fi",
      "Epic",
      "Action",
      "Adventure"
    ],
    "cast": [
      "Timothée Chalamet",
      "Zendaya",
      "Rebecca Ferguson",
      "Javier Bardem"
    ],
    "creator": "Denis Villeneuve",
    "category": "scifi",
    "videoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[sand dunes shift with deep bass vibration]"
        },
        {
          "time": 4,
          "text": "PAUL: Long live the fighters! Lead them to paradise!"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[रेत के टीले कंपन से कांपते हैं]"
        },
        {
          "time": 4,
          "text": "पॉल: योद्धा अमर रहें! इन्हें स्वर्ग की ओर ले चलो!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[sand dunes shift with deep bass vibration - en español]"
        },
        {
          "time": 4,
          "text": "PAUL: Long live the fighters! Lead them to paradise!"
        }
      ]
    },
    "tmdbId": 693134,
    "youtubeTrailerId": "Way9Dexny3w"
  },
  {
    "id": "rrr",
    "title": "RRR",
    "type": "Movie",
    "overview": "A fearless warrior on a perilous mission comes face to face with a steely cop serving British forces in pre-independent India in an explosive tale of brotherhood and rebellion.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/i0Y0wP8H6SRgjr6QmuwbtQbS24D.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/u0XUBNQWlOvrh0Gd97ARGpIkL0.jpg",
    "matchScore": 99,
    "year": "2022",
    "ageRating": "U/A 16+",
    "duration": "3h 7m",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Action",
      "Historical Drama",
      "Rebellion Epic"
    ],
    "cast": [
      "N.T. Rama Rao Jr.",
      "Ram Charan",
      "Alia Bhatt",
      "Ajay Devgn"
    ],
    "creator": "S. S. Rajamouli",
    "category": "trending",
    "isOriginal": false,
    "top10Rank": 5,
    "tmdbId": 579974,
    "youtubeTrailerId": "NgBoMJy386M",
    "videoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "backupVideoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[intense dhol beats and roaring flames]"
        },
        {
          "time": 4,
          "text": "BHEEM: For my people, I will tear down any empire!"
        },
        {
          "time": 9,
          "text": "RAJU: Look into my eyes. Fire and water will meet!"
        },
        {
          "time": 15,
          "text": "[Naatu Naatu rhythm kicks in wildly]"
        },
        {
          "time": 20,
          "text": "BHEEM & RAJU: Not just a fight, this is revolution!"
        },
        {
          "time": 26,
          "text": "[arrow strikes with explosive thunder]"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[धड़कते ढोल और धधकती लपटें]"
        },
        {
          "time": 4,
          "text": "भीम: अपने लोगों के लिए, मैं साम्राज्य को खाक कर दूँगा!"
        },
        {
          "time": 9,
          "text": "राजू: मेरी आँखों में देख। आग और पानी का मिलन होगा!"
        },
        {
          "time": 15,
          "text": "[नाटू नाटू की जोशीली थाप]"
        },
        {
          "time": 20,
          "text": "भीम और राजू: यह केवल युद्ध नहीं, यह क्रांति है!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[tambores arrolladores y fuego en combustión]"
        },
        {
          "time": 4,
          "text": "BHEEM: ¡Por mi gente, derribaré cualquier imperio!"
        },
        {
          "time": 9,
          "text": "RAJU: Mírame a los ojos. ¡El fuego y el agua colisionan!"
        },
        {
          "time": 15,
          "text": "[el ritmo triunfal de Naatu Naatu retumba]"
        }
      ]
    }
  },
  {
    "id": "leo",
    "title": "Leo: Bloody Sweet",
    "type": "Movie",
    "overview": "A mild-mannered cafe owner in Himachal Pradesh gets pulled into a violent underworld when ruthless mobsters suspect he is a legendary gangster from their bloody past.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/auXrHU6O17n9Tz11SHReoorjrU6.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/gSOVog7ydsaF1YpgAqBqnKYFGY.jpg",
    "matchScore": 97,
    "year": "2023",
    "ageRating": "A 18+",
    "duration": "2h 44m",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Action",
      "Crime Thriller",
      "Gangster"
    ],
    "cast": [
      "Thalapathy Vijay",
      "Sanjay Dutt",
      "Trisha Krishnan",
      "Arjun Sarja"
    ],
    "creator": "Lokesh Kanagaraj",
    "category": "trending",
    "isOriginal": false,
    "top10Rank": 6,
    "tmdbId": 1075794,
    "youtubeTrailerId": "Po3jStA673E",
    "videoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "backupVideoUrl": "https://media.w3.org/2010/05/sintel/trailer.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[atmospheric soundtrack swells - Leo: Bloody Sweet]"
        },
        {
          "time": 4,
          "text": "THALAPATHY VIJAY: Everything we fought for comes down to this moment."
        },
        {
          "time": 10,
          "text": "SANJAY DUTT: We cannot afford to back down now."
        },
        {
          "time": 16,
          "text": "[dramatic cinematic climax unfolds in Ultra HD]"
        },
        {
          "time": 22,
          "text": "THALAPATHY VIJAY: Hold the line! This is our destiny!"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[रोमांचक सिनेमाई संगीत - Leo: Bloody Sweet]"
        },
        {
          "time": 4,
          "text": "Thalapathy Vijay: हमने जो कुछ भी सहा है, उसका फैसला आज होगा।"
        },
        {
          "time": 10,
          "text": "Sanjay Dutt: अब पीछे हटने का कोई रास्ता नहीं है।"
        },
        {
          "time": 16,
          "text": "[भव्य दृश्य और धमाकेदार एक्शन]"
        },
        {
          "time": 22,
          "text": "Thalapathy Vijay: डटे रहो! यही हमारी मंजिल है!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[música cinematográfica envolvente - Leo: Bloody Sweet]"
        },
        {
          "time": 4,
          "text": "Thalapathy Vijay: Todo por lo que luchamos se decide en este momento."
        },
        {
          "time": 10,
          "text": "Sanjay Dutt: No podemos retroceder ahora."
        },
        {
          "time": 16,
          "text": "[acción espectacular en Ultra HD]"
        },
        {
          "time": 22,
          "text": "Thalapathy Vijay: ¡Mantengan la línea! ¡Este es nuestro destino!"
        }
      ]
    }
  },
  {
    "id": "jawan",
    "title": "Jawan",
    "type": "Movie",
    "overview": "A high-octane emotional journey of a prison officer who rectifies the wrongs in society with a team of six women inmates who take on corrupt politicians and arms dealers.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/5LtSjMNw6j3LkG29Oa4O0iY5U8.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/jFt1gS4BGHlK8xt76Y81Alp4dbt.jpg",
    "matchScore": 98,
    "year": "2023",
    "ageRating": "U/A 16+",
    "duration": "2h 49m",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Action",
      "Vigilante Thriller",
      "Masala Drama"
    ],
    "cast": [
      "Shah Rukh Khan",
      "Nayanthara",
      "Vijay Sethupathi",
      "Deepika Padukone"
    ],
    "creator": "Atlee",
    "category": "trending",
    "isOriginal": false,
    "top10Rank": 7,
    "tmdbId": 872906,
    "youtubeTrailerId": "MWOlnZSnXJo",
    "videoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "backupVideoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[whistling retro tune with heavy bass]"
        },
        {
          "time": 4,
          "text": "AZAD: Ready, chief!"
        },
        {
          "time": 8,
          "text": "VIKRAM RATHORE: Before touching the son, deal with the father."
        },
        {
          "time": 14,
          "text": "[machine gun bullets spray in slow motion]"
        },
        {
          "time": 20,
          "text": "AZAD: When I become a villain, no hero stands a chance."
        },
        {
          "time": 26,
          "text": "[cigar smoke drifts across burning rubble]"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[सीटी की धुन के साथ भारी बीट]"
        },
        {
          "time": 4,
          "text": "आज़ाद: तैयार हैं चीफ!"
        },
        {
          "time": 8,
          "text": "विक्रम राठौर: बेटे को हाथ लगाने से पहले, बाप से बात कर।"
        },
        {
          "time": 14,
          "text": "[गोलियों की ताबड़तोड़ बारिश]"
        },
        {
          "time": 20,
          "text": "आज़ाद: जब मैं विलेन बनता हूँ ना, तो किसी हीरो की नहीं चलती।"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[silbido retro con potente bajo cinematográfico]"
        },
        {
          "time": 4,
          "text": "AZAD: ¡Listo, jefe!"
        },
        {
          "time": 8,
          "text": "VIKRAM RATHORE: Antes de tocar al hijo, habla con el padre."
        },
        {
          "time": 14,
          "text": "[ráfagas de balas en cámara lenta]"
        }
      ]
    }
  },
  {
    "id": "animal",
    "title": "Animal",
    "type": "Movie",
    "overview": "A son's obsessive love for his distant industrialist father drives him to unleash an unprecedented wave of brutal violence when his father is targeted in an assassination attempt.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/lprsAHkwMxk2iC6VZxNmV0H7g1t.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/hr9rjR3J0xBBKmlJ4n3gHId9ccx.jpg",
    "matchScore": 96,
    "year": "2023",
    "ageRating": "A 18+",
    "duration": "3h 24m",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Action",
      "Crime Drama",
      "Psychological Thriller"
    ],
    "cast": [
      "Ranbir Kapoor",
      "Anil Kapoor",
      "Bobby Deol",
      "Rashmika Mandanna"
    ],
    "creator": "Sandeep Reddy Vanga",
    "category": "trending",
    "isOriginal": false,
    "top10Rank": 8,
    "tmdbId": 781732,
    "youtubeTrailerId": "Dydmpfo68DA",
    "videoUrl": "https://media.w3.org/2010/05/sintel/trailer.mp4",
    "backupVideoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[distorted acoustic strings and ominous bass]"
        },
        {
          "time": 4,
          "text": "RANVIJAY: Papa, you are my hero."
        },
        {
          "time": 8,
          "text": "BALBIR: You are not a normal boy, Ranvijay."
        },
        {
          "time": 13,
          "text": "RANVIJAY: If anyone touches my father, I will set this world on fire."
        },
        {
          "time": 19,
          "text": "[massive war machine fires with deafening blast]"
        },
        {
          "time": 25,
          "text": "RANVIJAY: Sunte ho sab log?! Main aa raha hoon!"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[गंभीर गिटार और खौफनाक सन्नाटा]"
        },
        {
          "time": 4,
          "text": "रणविजय: पापा, आप मेरे हीरो हैं।"
        },
        {
          "time": 8,
          "text": "बलबीर: तुम सामान्य लड़के नहीं हो, रणविजय।"
        },
        {
          "time": 13,
          "text": "रणविजय: अगर किसी ने मेरे पापा पर उंगली भी उठाई, तो मैं दुनिया जला दूँगा।"
        },
        {
          "time": 19,
          "text": "[विशालकाय मशीन गन की प्रचंड गर्जना]"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[acordes oscuros y tensión amenazante]"
        },
        {
          "time": 4,
          "text": "RANVIJAY: Papá, tú eres mi héroe."
        },
        {
          "time": 8,
          "text": "BALBIR: No eres un chico normal, Ranvijay."
        },
        {
          "time": 13,
          "text": "RANVIJAY: Si alguien toca a mi padre, quemaré este mundo."
        }
      ]
    }
  },
  {
    "id": "kalki-2898-ad",
    "title": "Kalki 2898 AD",
    "type": "Movie",
    "overview": "Set in a dystopian post-apocalyptic future in the desert city of Kasi, an ancient warrior awakens from deep slumber to protect the avatar destined to restore cosmic order.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/o8XSR1SONnjcsv84NRu6Mwsl5io.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/rstcAnBeCkxNQjNp3YXrF6IP1tW.jpg",
    "matchScore": 98,
    "year": "2024",
    "ageRating": "U/A 13+",
    "duration": "3h 1m",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Sci-Fi",
      "Mythological Epic",
      "Action"
    ],
    "cast": [
      "Prabhas",
      "Amitabh Bachchan",
      "Kamal Haasan",
      "Deepika Padukone"
    ],
    "creator": "Nag Ashwin",
    "category": "trending",
    "isOriginal": false,
    "top10Rank": 9,
    "tmdbId": 801688,
    "youtubeTrailerId": "y1-w1kUGuz8",
    "videoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "backupVideoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[futuristic conch shell resonates across desert]"
        },
        {
          "time": 4,
          "text": "ASHWATTHAMA: The final avatar has arrived."
        },
        {
          "time": 9,
          "text": "BHAIRAVA: In Kasi, units talk, not gods."
        },
        {
          "time": 14,
          "text": "BUJJII: Bujji online! Weapons armed, Bhairava!"
        },
        {
          "time": 19,
          "text": "[divine laser clashes with mystical staff]"
        },
        {
          "time": 25,
          "text": "ASHWATTHAMA: My time has come to fulfill my promise."
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[भविष्यवादी शंखनाद रेगिस्तान में गूंजता है]"
        },
        {
          "time": 4,
          "text": "अश्वत्थामा: अंतिम अवतार का आगमन हो चुका है।"
        },
        {
          "time": 9,
          "text": "भैरव: काशी में केवल यूनिट्स बोलते हैं, भगवान नहीं।"
        },
        {
          "time": 14,
          "text": "बुज्जी: बुज्जी तैयार है! हथियार लोड हैं, भैरव!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[eco místico de caracola sobre el desierto distópico]"
        },
        {
          "time": 4,
          "text": "ASHWATTHAMA: El avatar final ha llegado."
        },
        {
          "time": 9,
          "text": "BHAIRAVA: En Kasi solo valen las unidades, no los dioses."
        }
      ]
    }
  },
  {
    "id": "kgf-chapter-2",
    "title": "K.G.F: Chapter 2",
    "type": "Movie",
    "overview": "Rocky now commands the blood-soaked Kolar Gold Fields, but bloodthirsty enemies, including the brutal Adheera and prime minister Ramika Sen, emerge to take back control.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/nsV5Mfi9FAV4w8eDsdr7uqVswOk.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/khNVygolU0TxLIDWff5tQlAhZ23.jpg",
    "matchScore": 97,
    "year": "2022",
    "ageRating": "U/A 16+",
    "duration": "2h 48m",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Action",
      "Period Gangster",
      "Drama"
    ],
    "cast": [
      "Yash",
      "Sanjay Dutt",
      "Raveena Tandon",
      "Srinidhi Shetty"
    ],
    "creator": "Prashanth Neel",
    "category": "action",
    "isOriginal": false,
    "top10Rank": 10,
    "tmdbId": 587412,
    "youtubeTrailerId": "JKa05nyUmuQ",
    "videoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "backupVideoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[heavy metallic clang with thunderous drums]"
        },
        {
          "time": 4,
          "text": "ROCKY: Violence... Violence... Violence! I don't like it. I avoid."
        },
        {
          "time": 11,
          "text": "ROCKY: But... Violence likes me! I can't avoid!"
        },
        {
          "time": 17,
          "text": "ADHEERA: This gold mine was written in my blood."
        },
        {
          "time": 22,
          "text": "ROCKY: Tell the government that the Sultan of KGF is here."
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[भारी हथौड़े की चोट और गूंजते ढोल]"
        },
        {
          "time": 4,
          "text": "रॉकी: वायलेंस... वायलेंस... वायलेंस! मुझे पसंद नहीं, मैं बचता हूँ।"
        },
        {
          "time": 11,
          "text": "रॉकी: लेकिन... वायलेंस को मैं पसंद हूँ! मैं बच नहीं सकता!"
        },
        {
          "time": 17,
          "text": "अधीरा: यह सोने की खदान मेरे खून से लिखी गई थी।"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[golpe metálico masivo con tambores atronadores]"
        },
        {
          "time": 4,
          "text": "ROCKY: Violencia... violencia... ¡no me gusta, la evito!"
        },
        {
          "time": 11,
          "text": "ROCKY: ¡Pero a la violencia le gusto yo! ¡No puedo evitarla!"
        }
      ]
    }
  },
  {
    "id": "salaar",
    "title": "Salaar: Part 1 – Ceasefire",
    "type": "Movie",
    "overview": "A hardened gang leader pledges to uphold a sacred promise made to his dying childhood friend by taking on rival criminal empires in the dystopian sovereign city of Khansaar.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/xtOCTmGemASooRkAxRorYODig1p.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/nlu9WbcetNFRGXXPWITr30ob7W6.jpg",
    "matchScore": 96,
    "year": "2023",
    "ageRating": "A 18+",
    "duration": "2h 55m",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Action",
      "Crime Drama",
      "Dystopian Thriller"
    ],
    "cast": [
      "Prabhas",
      "Prithviraj Sukumaran",
      "Shruti Haasan",
      "Jagapathi Babu"
    ],
    "creator": "Prashanth Neel",
    "category": "action",
    "isOriginal": false,
    "tmdbId": 770906,
    "youtubeTrailerId": "4GPvYMKtrtI",
    "videoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "backupVideoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[atmospheric soundtrack swells - Salaar: Part 1 – Ceasefire]"
        },
        {
          "time": 4,
          "text": "PRABHAS: Everything we fought for comes down to this moment."
        },
        {
          "time": 10,
          "text": "PRITHVIRAJ SUKUMARAN: We cannot afford to back down now."
        },
        {
          "time": 16,
          "text": "[dramatic cinematic climax unfolds in Ultra HD]"
        },
        {
          "time": 22,
          "text": "PRABHAS: Hold the line! This is our destiny!"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[रोमांचक सिनेमाई संगीत - Salaar: Part 1 – Ceasefire]"
        },
        {
          "time": 4,
          "text": "Prabhas: हमने जो कुछ भी सहा है, उसका फैसला आज होगा।"
        },
        {
          "time": 10,
          "text": "Prithviraj Sukumaran: अब पीछे हटने का कोई रास्ता नहीं है।"
        },
        {
          "time": 16,
          "text": "[भव्य दृश्य और धमाकेदार एक्शन]"
        },
        {
          "time": 22,
          "text": "Prabhas: डटे रहो! यही हमारी मंजिल है!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[música cinematográfica envolvente - Salaar: Part 1 – Ceasefire]"
        },
        {
          "time": 4,
          "text": "Prabhas: Todo por lo que luchamos se decide en este momento."
        },
        {
          "time": 10,
          "text": "Prithviraj Sukumaran: No podemos retroceder ahora."
        },
        {
          "time": 16,
          "text": "[acción espectacular en Ultra HD]"
        },
        {
          "time": 22,
          "text": "Prabhas: ¡Mantengan la línea! ¡Este es nuestro destino!"
        }
      ]
    }
  },
  {
    "id": "oppenheimer",
    "title": "Oppenheimer",
    "type": "Movie",
    "overview": "The gripping story of American theoretical physicist J. Robert Oppenheimer and his role in the secretive Manhattan Project that developed the world's first nuclear weapons.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/neeNHeXjMF5fXoCJRsOmkNGC7q.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    "matchScore": 99,
    "year": "2023",
    "ageRating": "R 16+",
    "duration": "3h 0m",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Biography",
      "Historical Drama",
      "Suspense"
    ],
    "cast": [
      "Cillian Murphy",
      "Emily Blunt",
      "Matt Damon",
      "Robert Downey Jr."
    ],
    "creator": "Christopher Nolan",
    "category": "drama",
    "isOriginal": false,
    "tmdbId": 872585,
    "youtubeTrailerId": "uYPbbksJxIg",
    "videoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "backupVideoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[eerie theoretical physics hums in background]"
        },
        {
          "time": 4,
          "text": "LEWIS STRAUSS: What did you and Einstein talk about by the pond?"
        },
        {
          "time": 10,
          "text": "J. ROBERT OPPENHEIMER: We imagined a chain reaction..."
        },
        {
          "time": 16,
          "text": "OPPENHEIMER: ...one that would destroy the entire world."
        },
        {
          "time": 22,
          "text": "[atomic blast concussive wave shakes the room]"
        },
        {
          "time": 27,
          "text": "OPPENHEIMER: Now I am become Death, the destroyer of worlds."
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[परमाणु विस्फोट की गूंजती धड़कन]"
        },
        {
          "time": 4,
          "text": "स्ट्रॉस: तुमने और आइंस्टीन ने तालाब के किनारे क्या बात की?"
        },
        {
          "time": 10,
          "text": "ओपेनहाइमर: हमने एक ऐसी श्रृंखला की कल्पना की थी..."
        },
        {
          "time": 16,
          "text": "ओपेनहाइमर: ...जो इस पूरी दुनिया को नष्ट कर देगी।"
        },
        {
          "time": 22,
          "text": "[भीषण परमाणु शॉकवेव की गर्जना]"
        },
        {
          "time": 27,
          "text": "ओपेनहाइमर: अब मैं काल बन चुका हूँ, संसार का विनाशक।"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[resonancia cuántica y sintetizadores tensos]"
        },
        {
          "time": 4,
          "text": "STRAUSS: ¿De qué hablaron tú y Einstein junto al lago?"
        },
        {
          "time": 10,
          "text": "OPPENHEIMER: Imaginamos una reacción en cadena..."
        },
        {
          "time": 16,
          "text": "OPPENHEIMER: ...una que destruiría el mundo entero."
        },
        {
          "time": 22,
          "text": "[la onda expansiva nuclear sacude la tierra]"
        },
        {
          "time": 27,
          "text": "OPPENHEIMER: Ahora me he convertido en la muerte, destructora de mundos."
        }
      ]
    }
  },
  {
    "id": "dark",
    "title": "Dark",
    "type": "TV Series",
    "overview": "A missing child sets four intertwined families on a frantic search for answers as they unearth a mind-bending time travel mystery that spans across four generations in Winden.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/3lBDg3i6nn5R2NKICJ797Urpy5a.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg",
    "matchScore": 99,
    "year": "2020",
    "ageRating": "U/A 16+",
    "duration": "3 Seasons",
    "quality": "4K Ultra HD",
    "audio": "5.1 German/English",
    "genres": [
      "Sci-Fi",
      "Time Travel",
      "Mystery",
      "Supernatural Thriller"
    ],
    "cast": [
      "Louis Hofmann",
      "Oliver Masucci",
      "Jördis Triebel"
    ],
    "creator": "Baran bo Odar",
    "category": "scifi",
    "isOriginal": true,
    "tmdbId": 70523,
    "youtubeTrailerId": "rrwycJ08PSA",
    "videoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "backupVideoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[chilling clock ticking with heavy bass]"
        },
        {
          "time": 4,
          "text": "JONAS: The question isn't how, the question is when."
        },
        {
          "time": 9,
          "text": "H.G. TANNHOUSE: The distinction between past, present, and future is an illusion."
        },
        {
          "time": 16,
          "text": "MARTHA: We are not free in what we do, because we are not free in what we want."
        },
        {
          "time": 23,
          "text": "JONAS: The loop must be broken."
        },
        {
          "time": 28,
          "text": "[cave portal glows with temporal energy]"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[घड़ी की टिक-टिक के साथ भारी सन्नाटा]"
        },
        {
          "time": 4,
          "text": "जोनास: सवाल यह नहीं कि कैसे, सवाल यह है कि कब।"
        },
        {
          "time": 9,
          "text": "तानहौस: भूतकाल, वर्तमान और भविष्य के बीच का अंतर केवल एक भ्रम है।"
        },
        {
          "time": 16,
          "text": "मार्था: हम जो करते हैं उसमें स्वतंत्र नहीं हैं।"
        },
        {
          "time": 23,
          "text": "जोनास: इस चक्र को तोड़ना ही होगा।"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[el tictac del reloj resuena en la caverna]"
        },
        {
          "time": 4,
          "text": "JONAS: La pregunta no es cómo, la pregunta es cuándo."
        },
        {
          "time": 9,
          "text": "TANNHOUSE: La diferencia entre pasado, presente y futuro es una ilusión."
        },
        {
          "time": 16,
          "text": "MARTHA: No somos libres de lo que hacemos porque no somos libres de lo que deseamos."
        },
        {
          "time": 23,
          "text": "JONAS: El ciclo debe romperse."
        }
      ]
    }
  },
  {
    "id": "narcos",
    "title": "Narcos",
    "type": "TV Series",
    "overview": "The true story of Colombia's infamously violent and powerful drug cartels fuels this gritty gangster drama series.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/y9ekzkPFmWSqUU3Kj0wHmYUM8qu.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/rTmal9fDbwh5F0waol2hq35U4ah.jpg",
    "matchScore": 98,
    "year": "2017",
    "ageRating": "A",
    "duration": "3 Seasons",
    "quality": "4K Ultra HD",
    "audio": "Dolby VISION",
    "genres": [
      "TV Dramas",
      "US",
      "TV Action & Adventure"
    ],
    "cast": [
      "Wagner Moura",
      "Pedro Pascal",
      "Boyd Holbrook"
    ],
    "creator": "Chris Brancato",
    "category": "drama",
    "isOriginal": true,
    "videoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "tmdbId": 63351,
    "youtubeTrailerId": "RNWAKZzgbp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[atmospheric soundtrack swells - Narcos]"
        },
        {
          "time": 4,
          "text": "WAGNER MOURA: Everything we fought for comes down to this moment."
        },
        {
          "time": 10,
          "text": "PEDRO PASCAL: We cannot afford to back down now."
        },
        {
          "time": 16,
          "text": "[dramatic cinematic climax unfolds in Ultra HD]"
        },
        {
          "time": 22,
          "text": "WAGNER MOURA: Hold the line! This is our destiny!"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[रोमांचक सिनेमाई संगीत - Narcos]"
        },
        {
          "time": 4,
          "text": "Wagner Moura: हमने जो कुछ भी सहा है, उसका फैसला आज होगा।"
        },
        {
          "time": 10,
          "text": "Pedro Pascal: अब पीछे हटने का कोई रास्ता नहीं है।"
        },
        {
          "time": 16,
          "text": "[भव्य दृश्य और धमाकेदार एक्शन]"
        },
        {
          "time": 22,
          "text": "Wagner Moura: डटे रहो! यही हमारी मंजिल है!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[música cinematográfica envolvente - Narcos]"
        },
        {
          "time": 4,
          "text": "Wagner Moura: Todo por lo que luchamos se decide en este momento."
        },
        {
          "time": 10,
          "text": "Pedro Pascal: No podemos retroceder ahora."
        },
        {
          "time": 16,
          "text": "[acción espectacular en Ultra HD]"
        },
        {
          "time": 22,
          "text": "Wagner Moura: ¡Mantengan la línea! ¡Este es nuestro destino!"
        }
      ]
    }
  },
  {
    "id": "game-of-thrones",
    "title": "Game of Thrones",
    "type": "TV Series",
    "overview": "Nine noble houses fight for dominion over the Seven Kingdoms of Westeros, while an ancient white walker threat awakens in the far north after being dormant for thousands of years.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/zZqpAXxVSBtxV9qPBcscfXBcL2w.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
    "matchScore": 97,
    "year": "2019",
    "ageRating": "A 18+",
    "duration": "8 Seasons",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Fantasy",
      "Drama",
      "Medieval War Epic"
    ],
    "cast": [
      "Emilia Clarke",
      "Kit Harington",
      "Peter Dinklage",
      "Lena Headey"
    ],
    "creator": "David Benioff & D.B. Weiss",
    "category": "drama",
    "isOriginal": false,
    "tmdbId": 1399,
    "youtubeTrailerId": "KPLWWIOCOOQ",
    "videoUrl": "https://media.w3.org/2010/05/sintel/trailer.mp4",
    "backupVideoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[epic French horns and cellos swell]"
        },
        {
          "time": 5,
          "text": "NED STARK: The man who passes the sentence should swing the sword."
        },
        {
          "time": 11,
          "text": "CERSEI LANNISTER: When you play the game of thrones, you win or you die."
        },
        {
          "time": 17,
          "text": "DAENERYS TARGARYEN: Dracarys!"
        },
        {
          "time": 23,
          "text": "[dragon unleashes torrent of blazing fire]"
        },
        {
          "time": 28,
          "text": "JON SNOW: Winter is here."
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[राजसी सिम्फनी संगीत गूंजता है]"
        },
        {
          "time": 5,
          "text": "नेड स्टार्क: जो सजा सुनाता है, तलवार भी उसी को चलानी चाहिए।"
        },
        {
          "time": 11,
          "text": "सर्सी: तख्त के खेल में या तो जीत होती है, या मौत।"
        },
        {
          "time": 17,
          "text": "डैनेरिस: ड्रेकेरिस!"
        },
        {
          "time": 23,
          "text": "[ड्रैगन आग की भीषण लपटें उगलता है]"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[majestuoso tema de orquesta épica]"
        },
        {
          "time": 5,
          "text": "NED STARK: El hombre que dicta la sentencia debe blandir la espada."
        },
        {
          "time": 11,
          "text": "CERSEI: Cuando juegas al juego de tronos, ganas o mueres."
        },
        {
          "time": 17,
          "text": "DAENERYS: ¡Dracarys!"
        },
        {
          "time": 23,
          "text": "[el dragón exhala fuego rugiente]"
        }
      ]
    }
  },
  {
    "id": "better-call-saul",
    "title": "Better Call Saul",
    "type": "TV Series",
    "overview": "The trials and tribulations of criminal lawyer Jimmy McGill in the years leading up to his fateful run-in with Walter White and Jesse Pinkman in Albuquerque.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/hPea3Qy5Gd6Og4L2Vo6W9uP8z4J.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/fC2HDm5t0kHj7mTm73e2g6p2.jpg",
    "matchScore": 99,
    "year": "2022",
    "ageRating": "U/A 16+",
    "duration": "6 Seasons",
    "quality": "4K Ultra HD",
    "audio": "5.1 Surround",
    "genres": [
      "Crime",
      "Legal Drama",
      "Dark Comedy"
    ],
    "cast": [
      "Bob Odenkirk",
      "Rhea Seehorn",
      "Jonathan Banks",
      "Giancarlo Esposito"
    ],
    "creator": "Vince Gilligan & Peter Gould",
    "category": "drama",
    "isOriginal": true,
    "tmdbId": 60059,
    "youtubeTrailerId": "HN4oydykJFc",
    "videoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "backupVideoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[bluesy jazz guitar strums softly]"
        },
        {
          "time": 4,
          "text": "JIMMY MCGILL: S'all good, man!"
        },
        {
          "time": 9,
          "text": "CHUCK MCGILL: Slippin' Jimmy with a law degree is like a chimp with a machine gun!"
        },
        {
          "time": 15,
          "text": "MIKE EHRMANTRAUT: We all make our choices. And those choices put us on a road."
        },
        {
          "time": 22,
          "text": "KIM WEXLER: You don't save me, Jimmy. I save me."
        },
        {
          "time": 28,
          "text": "SAUL GOODMAN: Did you know that you have rights? The Constitution says you do!"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[जैज़ गिटार की हल्की धुन]"
        },
        {
          "time": 4,
          "text": "जिमी: सब बढ़िया है भाई!"
        },
        {
          "time": 9,
          "text": "चक: वकालत की डिग्री के साथ जिमी वैसा ही है जैसे बन्दूक लिए बंदर!"
        },
        {
          "time": 15,
          "text": "माइक: हम सभी फैसले लेते हैं। और वो फैसले एक राह चुनते हैं।"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[acordes de guitarra blues y ambiente desértico]"
        },
        {
          "time": 4,
          "text": "JIMMY: ¡Todo bien, amigo!"
        },
        {
          "time": 9,
          "text": "CHUCK: ¡Jimmy con título de abogado es como un chimpancé con metralleta!"
        },
        {
          "time": 15,
          "text": "MIKE: Todos tomamos decisiones. Y esas decisiones nos llevan por un camino."
        }
      ]
    }
  },
  {
    "id": "the-batman",
    "title": "The Batman",
    "type": "Movie",
    "overview": "When a sadistic serial killer known as the Riddler murders political figures in Gotham, the vigilante Batman is forced to plunge deep into the city's hidden criminal underworld.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    "matchScore": 96,
    "year": "2022",
    "ageRating": "U/A 16+",
    "duration": "2h 56m",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Action",
      "Neo-Noir",
      "Crime Detective"
    ],
    "cast": [
      "Robert Pattinson",
      "Zoë Kravitz",
      "Paul Dano",
      "Colin Farrell"
    ],
    "creator": "Matt Reeves",
    "category": "action",
    "isOriginal": false,
    "tmdbId": 414906,
    "youtubeTrailerId": "mqqft2x_Aa4",
    "videoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "backupVideoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[dark symphonic cello echoes in the rain]"
        },
        {
          "time": 5,
          "text": "BATMAN: Thursday, October 31st. The city streets are crowded for the holiday."
        },
        {
          "time": 11,
          "text": "BATMAN: Even with the rain. Hidden in the chaos is an element, waiting to strike."
        },
        {
          "time": 18,
          "text": "BATMAN: They think I am hiding in the shadows. But I am the shadows."
        },
        {
          "time": 25,
          "text": "RIDDLER: If you are justice, please do not lie. What is the price for your blind eye?"
        },
        {
          "time": 32,
          "text": "[Batmobile jet engine roars to life]"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[गंभीर सिम्फोनिक संगीत गॉथम की बारिश में गूंजता है]"
        },
        {
          "time": 5,
          "text": "बैटमैन: गुरुवार, इकतीस अक्टूबर। गोथम की सड़कें भरी हुई हैं।"
        },
        {
          "time": 11,
          "text": "बैटमैन: बारिश में भी, अंधेरे में कोई शिकार की तलाश में है।"
        },
        {
          "time": 18,
          "text": "बैटमैन: उन्हें लगता है मैं परछाइयों में छिपा हूँ। पर मैं ही परछाई हूँ।"
        },
        {
          "time": 25,
          "text": "रिडलर: अगर तुम न्याय हो, तो सच बताओ। क्या है तुम्हारी कीमत?"
        },
        {
          "time": 32,
          "text": "[बैटमोबाइल का जेट इंजन दनदना उठता है]"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[pesadas cuerdas dramáticas en la lluvia]"
        },
        {
          "time": 5,
          "text": "BATMAN: Jueves, 31 de octubre. Las calles están repletas."
        },
        {
          "time": 11,
          "text": "BATMAN: Oculto en el caos hay un elemento esperando atacar."
        },
        {
          "time": 18,
          "text": "BATMAN: Creen que me escondo en las sombras. Pero yo soy las sombras."
        },
        {
          "time": 25,
          "text": "RIDDLER: Si eres la justicia, no mientas. ¿Cuál es el precio de tu ceguera?"
        },
        {
          "time": 32,
          "text": "[el motor del Batimóvil ruge ferozmente]"
        }
      ]
    }
  },
  {
    "id": "fight-club",
    "title": "Fight Club",
    "type": "Movie",
    "overview": "A depressed, insomniac office worker seeking an escape from his consumerist existence meets an enigmatic soap salesman and together they establish an underground fight club.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    "matchScore": 98,
    "year": "1999",
    "ageRating": "A 18+",
    "duration": "2h 19m",
    "quality": "4K Ultra HD",
    "audio": "5.1 Surround",
    "genres": [
      "Psychological Thriller",
      "Cult Classic",
      "Dark Drama"
    ],
    "cast": [
      "Brad Pitt",
      "Edward Norton",
      "Helena Bonham Carter"
    ],
    "creator": "David Fincher",
    "category": "drama",
    "isOriginal": false,
    "tmdbId": 550,
    "youtubeTrailerId": "qtRKdVHc-cE",
    "videoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "backupVideoUrl": "https://media.w3.org/2010/05/sintel/trailer.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[industrial rock bassline throbs]"
        },
        {
          "time": 4,
          "text": "TYLER DURDEN: The first rule of Fight Club is: you do not talk about Fight Club."
        },
        {
          "time": 11,
          "text": "TYLER DURDEN: The second rule of Fight Club is: YOU DO NOT TALK ABOUT FIGHT CLUB."
        },
        {
          "time": 18,
          "text": "NARRATOR: Losing all hope was freedom."
        },
        {
          "time": 24,
          "text": "TYLER: The things you own end up owning you."
        },
        {
          "time": 30,
          "text": "[fists collide with raw bone impact]"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[अंडरग्राउंड रॉक संगीत की गूंज]"
        },
        {
          "time": 4,
          "text": "टायलर: फाइट क्लब का पहला नियम: फाइट क्लब के बारे में बात नहीं करना।"
        },
        {
          "time": 11,
          "text": "टायलर: फाइट क्लब का दूसरा नियम: फाइट क्लब के बारे में बिल्कुल बात नहीं करना।"
        },
        {
          "time": 18,
          "text": "नैरेटर: सारी उम्मीदें खो देना ही असली आज़ादी थी।"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[ritmo de bajo industrial potente]"
        },
        {
          "time": 4,
          "text": "TYLER DURDEN: La primera regla del Club de la Pelea es: no hablas del Club de la Pelea."
        },
        {
          "time": 11,
          "text": "TYLER: La segunda regla es: ¡NO HABLAS DEL CLUB DE LA PELEA!"
        },
        {
          "time": 18,
          "text": "NARRADOR: Perder toda esperanza fue la libertad."
        }
      ]
    }
  },
  {
    "id": "pulp-fiction",
    "title": "Pulp Fiction",
    "type": "Movie",
    "overview": "The lives of two philosophizing mob hitmen, a stylish boxer, a crime boss and his unpredictable wife intersect in four wildly entertaining and violent tales of Los Angeles.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    "matchScore": 99,
    "year": "1994",
    "ageRating": "A 18+",
    "duration": "2h 34m",
    "quality": "4K Ultra HD",
    "audio": "5.1 Surround",
    "genres": [
      "Crime",
      "Dark Comedy",
      "Cult Classic"
    ],
    "cast": [
      "John Travolta",
      "Samuel L. Jackson",
      "Uma Thurman",
      "Bruce Willis"
    ],
    "creator": "Quentin Tarantino",
    "category": "drama",
    "isOriginal": false,
    "tmdbId": 680,
    "youtubeTrailerId": "s7EdQ4FqbhY",
    "videoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "backupVideoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[surf guitar riff plays Misirlou]"
        },
        {
          "time": 4,
          "text": "JULES: Say 'what' again. SAY 'WHAT' AGAIN, I DARE YOU!"
        },
        {
          "time": 10,
          "text": "VINCENT: You know what they call a Quarter Pounder with cheese in Paris?"
        },
        {
          "time": 16,
          "text": "JULES: What'd they call it?"
        },
        {
          "time": 19,
          "text": "VINCENT: Royale with cheese."
        },
        {
          "time": 24,
          "text": "JULES: The path of the righteous man is beset on all sides..."
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[प्रसिद्ध सर्फ रॉक गिटार धुन]"
        },
        {
          "time": 4,
          "text": "ज्यूल्स: फिर से बोल 'क्या'। दोबारा बोल कर दिखा!"
        },
        {
          "time": 10,
          "text": "विंसेंट: तुम्हें पता है पेरिस में क्वार्टर पाउंडर को क्या कहते हैं?"
        },
        {
          "time": 16,
          "text": "विंसेंट: रोयाल विद चीज़।"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[icónico riff de guitarra surf Misirlou]"
        },
        {
          "time": 4,
          "text": "JULES: Di 'qué' otra vez. ¡Te reto, di 'qué' una vez más!"
        },
        {
          "time": 10,
          "text": "VINCENT: ¿Sabes cómo le llaman al Cuarto de Libra con queso en París?"
        },
        {
          "time": 16,
          "text": "VINCENT: Royale con queso."
        }
      ]
    }
  },
  {
    "id": "the-matrix",
    "title": "The Matrix",
    "type": "Movie",
    "overview": "When a hacker named Neo is contacted by mysterious rebel Morpheus, he awakens to discover humanity is trapped in a simulated reality engineered by sentient machines.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/l4QHerTSbMI7qgvej42P9FzD3Ac.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    "matchScore": 99,
    "year": "1999",
    "ageRating": "U/A 16+",
    "duration": "2h 16m",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Sci-Fi",
      "Cyberpunk",
      "Action Martial Arts"
    ],
    "cast": [
      "Keanu Reeves",
      "Laurence Fishburne",
      "Carrie-Anne Moss",
      "Hugo Weaving"
    ],
    "creator": "The Wachowskis",
    "category": "scifi",
    "isOriginal": false,
    "tmdbId": 603,
    "youtubeTrailerId": "vKQi3bBA1y8",
    "videoUrl": "https://media.w3.org/2010/05/sintel/trailer.mp4",
    "backupVideoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[digital green phosphor clicks and synth pads]"
        },
        {
          "time": 4,
          "text": "MORPHEUS: You take the blue pill, the story ends."
        },
        {
          "time": 9,
          "text": "MORPHEUS: You take the red pill, you stay in Wonderland, and I show you how deep the rabbit hole goes."
        },
        {
          "time": 17,
          "text": "NEO: I know kung fu."
        },
        {
          "time": 21,
          "text": "MORPHEUS: Show me."
        },
        {
          "time": 26,
          "text": "[bullet time sonic boom ripples the air]"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[डिजिटल कोड की सरसराहट]"
        },
        {
          "time": 4,
          "text": "मॉर्फियस: नीली गोली लोगे, कहानी खत्म।"
        },
        {
          "time": 9,
          "text": "मॉर्फियस: लाल गोली लोगे, और मैं दिखाऊँगा सच्चाई कितनी गहरी है।"
        },
        {
          "time": 17,
          "text": "नियो: मुझे कुंग फू आता है।"
        },
        {
          "time": 21,
          "text": "मॉर्फियस: करके दिखाओ।"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[sintetizador digital y código verde fluyendo]"
        },
        {
          "time": 4,
          "text": "MORFEO: Tomas la pastilla azul, la historia termina."
        },
        {
          "time": 9,
          "text": "MORFEO: Tomas la pastilla roja, y te muestro qué tan profundo es el agujero del conejo."
        },
        {
          "time": 17,
          "text": "NEO: Sé kung fu."
        },
        {
          "time": 21,
          "text": "MORFEO: Muéstramelo."
        }
      ]
    }
  },
  {
    "id": "avatar-way-of-water",
    "title": "Avatar: The Way of Water",
    "type": "Movie",
    "overview": "Jake Sully and Ney'tiri have formed a family on Pandora. But when an old threat returns to conquer their world, they must flee to the oceanic Metkayina clan.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    "matchScore": 97,
    "year": "2022",
    "ageRating": "U/A 13+",
    "duration": "3h 12m",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Sci-Fi",
      "Visual Masterpiece",
      "Adventure Fantasy"
    ],
    "cast": [
      "Sam Worthington",
      "Zoe Saldana",
      "Sigourney Weaver",
      "Kate Winslet"
    ],
    "creator": "James Cameron",
    "category": "scifi",
    "isOriginal": false,
    "tmdbId": 76600,
    "youtubeTrailerId": "d9MyW72ELq0",
    "videoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "backupVideoUrl": "https://media.w3.org/2010/05/sintel/trailer.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[atmospheric soundtrack swells - Avatar: The Way of Water]"
        },
        {
          "time": 4,
          "text": "SAM WORTHINGTON: Everything we fought for comes down to this moment."
        },
        {
          "time": 10,
          "text": "ZOE SALDANA: We cannot afford to back down now."
        },
        {
          "time": 16,
          "text": "[dramatic cinematic climax unfolds in Ultra HD]"
        },
        {
          "time": 22,
          "text": "SAM WORTHINGTON: Hold the line! This is our destiny!"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[रोमांचक सिनेमाई संगीत - Avatar: The Way of Water]"
        },
        {
          "time": 4,
          "text": "Sam Worthington: हमने जो कुछ भी सहा है, उसका फैसला आज होगा।"
        },
        {
          "time": 10,
          "text": "Zoe Saldana: अब पीछे हटने का कोई रास्ता नहीं है।"
        },
        {
          "time": 16,
          "text": "[भव्य दृश्य और धमाकेदार एक्शन]"
        },
        {
          "time": 22,
          "text": "Sam Worthington: डटे रहो! यही हमारी मंजिल है!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[música cinematográfica envolvente - Avatar: The Way of Water]"
        },
        {
          "time": 4,
          "text": "Sam Worthington: Todo por lo que luchamos se decide en este momento."
        },
        {
          "time": 10,
          "text": "Zoe Saldana: No podemos retroceder ahora."
        },
        {
          "time": 16,
          "text": "[acción espectacular en Ultra HD]"
        },
        {
          "time": 22,
          "text": "Sam Worthington: ¡Mantengan la línea! ¡Este es nuestro destino!"
        }
      ]
    }
  },
  {
    "id": "spider-man-spider-verse",
    "title": "Spider-Man: Across the Spider-Verse",
    "type": "Movie",
    "overview": "Miles Morales catapults across the Multiverse, joining forces with Gwen Stacy and an elite Spider-Society tasked with preventing timeline collapse.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    "matchScore": 99,
    "year": "2023",
    "ageRating": "U/A 13+",
    "duration": "2h 20m",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Animation",
      "Multiverse Sci-Fi",
      "Superhero Action"
    ],
    "cast": [
      "Shameik Moore",
      "Hailee Steinfeld",
      "Oscar Isaac",
      "Daniel Kaluuya"
    ],
    "creator": "Joaquim Dos Santos & Kemp Powers",
    "category": "action",
    "isOriginal": false,
    "tmdbId": 569094,
    "youtubeTrailerId": "cqGjhVJWtEg",
    "videoUrl": "https://media.w3.org/2010/05/sintel/trailer.mp4",
    "backupVideoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[atmospheric soundtrack swells - Spider-Man: Across the Spider-Verse]"
        },
        {
          "time": 4,
          "text": "SHAMEIK MOORE: Everything we fought for comes down to this moment."
        },
        {
          "time": 10,
          "text": "HAILEE STEINFELD: We cannot afford to back down now."
        },
        {
          "time": 16,
          "text": "[dramatic cinematic climax unfolds in Ultra HD]"
        },
        {
          "time": 22,
          "text": "SHAMEIK MOORE: Hold the line! This is our destiny!"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[रोमांचक सिनेमाई संगीत - Spider-Man: Across the Spider-Verse]"
        },
        {
          "time": 4,
          "text": "Shameik Moore: हमने जो कुछ भी सहा है, उसका फैसला आज होगा।"
        },
        {
          "time": 10,
          "text": "Hailee Steinfeld: अब पीछे हटने का कोई रास्ता नहीं है।"
        },
        {
          "time": 16,
          "text": "[भव्य दृश्य और धमाकेदार एक्शन]"
        },
        {
          "time": 22,
          "text": "Shameik Moore: डटे रहो! यही हमारी मंजिल है!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[música cinematográfica envolvente - Spider-Man: Across the Spider-Verse]"
        },
        {
          "time": 4,
          "text": "Shameik Moore: Todo por lo que luchamos se decide en este momento."
        },
        {
          "time": 10,
          "text": "Hailee Steinfeld: No podemos retroceder ahora."
        },
        {
          "time": 16,
          "text": "[acción espectacular en Ultra HD]"
        },
        {
          "time": 22,
          "text": "Shameik Moore: ¡Mantengan la línea! ¡Este es nuestro destino!"
        }
      ]
    }
  },
  {
    "id": "gladiator",
    "title": "Gladiator",
    "type": "Movie",
    "overview": "A betrayed Roman general Maximus Decimus Meridius is enslaved and trained as a gladiator, fighting his way to the Colosseum to avenge his slaughtered family.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/ArWn6HUv674z9Xm48RkO9k5f2Q.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
    "matchScore": 98,
    "year": "2000",
    "ageRating": "A 18+",
    "duration": "2h 35m",
    "quality": "4K Ultra HD",
    "audio": "5.1 Surround",
    "genres": [
      "Action",
      "Historical Epic",
      "Revenge Drama"
    ],
    "cast": [
      "Russell Crowe",
      "Joaquin Phoenix",
      "Connie Nielsen",
      "Oliver Reed"
    ],
    "creator": "Ridley Scott",
    "category": "action",
    "isOriginal": false,
    "tmdbId": 98,
    "youtubeTrailerId": "owK1qxDselE",
    "videoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "backupVideoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[atmospheric soundtrack swells - Gladiator]"
        },
        {
          "time": 4,
          "text": "RUSSELL CROWE: Everything we fought for comes down to this moment."
        },
        {
          "time": 10,
          "text": "JOAQUIN PHOENIX: We cannot afford to back down now."
        },
        {
          "time": 16,
          "text": "[dramatic cinematic climax unfolds in Ultra HD]"
        },
        {
          "time": 22,
          "text": "RUSSELL CROWE: Hold the line! This is our destiny!"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[रोमांचक सिनेमाई संगीत - Gladiator]"
        },
        {
          "time": 4,
          "text": "Russell Crowe: हमने जो कुछ भी सहा है, उसका फैसला आज होगा।"
        },
        {
          "time": 10,
          "text": "Joaquin Phoenix: अब पीछे हटने का कोई रास्ता नहीं है।"
        },
        {
          "time": 16,
          "text": "[भव्य दृश्य और धमाकेदार एक्शन]"
        },
        {
          "time": 22,
          "text": "Russell Crowe: डटे रहो! यही हमारी मंजिल है!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[música cinematográfica envolvente - Gladiator]"
        },
        {
          "time": 4,
          "text": "Russell Crowe: Todo por lo que luchamos se decide en este momento."
        },
        {
          "time": 10,
          "text": "Joaquin Phoenix: No podemos retroceder ahora."
        },
        {
          "time": 16,
          "text": "[acción espectacular en Ultra HD]"
        },
        {
          "time": 22,
          "text": "Russell Crowe: ¡Mantengan la línea! ¡Este es nuestro destino!"
        }
      ]
    }
  },
  {
    "id": "top-gun-maverick",
    "title": "Top Gun: Maverick",
    "type": "Movie",
    "overview": "Pete 'Maverick' Mitchell returns to train a detachment of TOPGUN graduates for an impossible strike mission deep inside enemy territory.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/odJ4hx6g6vBt4lBWKFD1tGLILBW.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    "matchScore": 99,
    "year": "2022",
    "ageRating": "U/A 13+",
    "duration": "2h 10m",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Action",
      "Aviation Thriller",
      "Adrenaline"
    ],
    "cast": [
      "Tom Cruise",
      "Miles Teller",
      "Jennifer Connelly",
      "Jon Hamm"
    ],
    "creator": "Joseph Kosinski",
    "category": "action",
    "isOriginal": false,
    "tmdbId": 361743,
    "youtubeTrailerId": "giXco2jaZ_4",
    "videoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "backupVideoUrl": "https://media.w3.org/2010/05/sintel/trailer.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[atmospheric soundtrack swells - Top Gun: Maverick]"
        },
        {
          "time": 4,
          "text": "TOM CRUISE: Everything we fought for comes down to this moment."
        },
        {
          "time": 10,
          "text": "MILES TELLER: We cannot afford to back down now."
        },
        {
          "time": 16,
          "text": "[dramatic cinematic climax unfolds in Ultra HD]"
        },
        {
          "time": 22,
          "text": "TOM CRUISE: Hold the line! This is our destiny!"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[रोमांचक सिनेमाई संगीत - Top Gun: Maverick]"
        },
        {
          "time": 4,
          "text": "Tom Cruise: हमने जो कुछ भी सहा है, उसका फैसला आज होगा।"
        },
        {
          "time": 10,
          "text": "Miles Teller: अब पीछे हटने का कोई रास्ता नहीं है।"
        },
        {
          "time": 16,
          "text": "[भव्य दृश्य और धमाकेदार एक्शन]"
        },
        {
          "time": 22,
          "text": "Tom Cruise: डटे रहो! यही हमारी मंजिल है!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[música cinematográfica envolvente - Top Gun: Maverick]"
        },
        {
          "time": 4,
          "text": "Tom Cruise: Todo por lo que luchamos se decide en este momento."
        },
        {
          "time": 10,
          "text": "Miles Teller: No podemos retroceder ahora."
        },
        {
          "time": 16,
          "text": "[acción espectacular en Ultra HD]"
        },
        {
          "time": 22,
          "text": "Tom Cruise: ¡Mantengan la línea! ¡Este es nuestro destino!"
        }
      ]
    }
  },
  {
    "id": "avengers-endgame",
    "title": "Avengers: Endgame",
    "type": "Movie",
    "overview": "After the devastating cosmic snap by Thanos wipes out half of all life, the surviving Avengers assemble to travel through time and undo the catastrophe.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    "matchScore": 98,
    "year": "2019",
    "ageRating": "U/A 13+",
    "duration": "3h 1m",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Action",
      "Superhero Epic",
      "Sci-Fi Fantasy"
    ],
    "cast": [
      "Robert Downey Jr.",
      "Chris Evans",
      "Mark Ruffalo",
      "Chris Hemsworth"
    ],
    "creator": "Anthony & Joe Russo",
    "category": "action",
    "isOriginal": false,
    "tmdbId": 299534,
    "youtubeTrailerId": "TcMBFSGVi1c",
    "videoUrl": "https://media.w3.org/2010/05/sintel/trailer.mp4",
    "backupVideoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[atmospheric soundtrack swells - Avengers: Endgame]"
        },
        {
          "time": 4,
          "text": "ROBERT DOWNEY JR.: Everything we fought for comes down to this moment."
        },
        {
          "time": 10,
          "text": "CHRIS EVANS: We cannot afford to back down now."
        },
        {
          "time": 16,
          "text": "[dramatic cinematic climax unfolds in Ultra HD]"
        },
        {
          "time": 22,
          "text": "ROBERT DOWNEY JR.: Hold the line! This is our destiny!"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[रोमांचक सिनेमाई संगीत - Avengers: Endgame]"
        },
        {
          "time": 4,
          "text": "Robert Downey Jr.: हमने जो कुछ भी सहा है, उसका फैसला आज होगा।"
        },
        {
          "time": 10,
          "text": "Chris Evans: अब पीछे हटने का कोई रास्ता नहीं है।"
        },
        {
          "time": 16,
          "text": "[भव्य दृश्य और धमाकेदार एक्शन]"
        },
        {
          "time": 22,
          "text": "Robert Downey Jr.: डटे रहो! यही हमारी मंजिल है!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[música cinematográfica envolvente - Avengers: Endgame]"
        },
        {
          "time": 4,
          "text": "Robert Downey Jr.: Todo por lo que luchamos se decide en este momento."
        },
        {
          "time": 10,
          "text": "Chris Evans: No podemos retroceder ahora."
        },
        {
          "time": 16,
          "text": "[acción espectacular en Ultra HD]"
        },
        {
          "time": 22,
          "text": "Robert Downey Jr.: ¡Mantengan la línea! ¡Este es nuestro destino!"
        }
      ]
    }
  },
  {
    "id": "titanic",
    "title": "Titanic",
    "type": "Movie",
    "overview": "A timeless romance blossoms between wealthy young rose and free-spirited artist Jack Dawson aboard the ill-fated maiden voyage of the unsinkable ship.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/yDIv5nDABnNsmGh978CrX3BglR5.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    "matchScore": 98,
    "year": "1997",
    "ageRating": "U/A 16+",
    "duration": "3h 14m",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Romance",
      "Historical Drama",
      "Disaster Classic"
    ],
    "cast": [
      "Leonardo DiCaprio",
      "Kate Winslet",
      "Billy Zane",
      "Kathy Bates"
    ],
    "creator": "James Cameron",
    "category": "drama",
    "isOriginal": false,
    "tmdbId": 597,
    "youtubeTrailerId": "kVrqfYjkTdQ",
    "videoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "backupVideoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[atmospheric soundtrack swells - Titanic]"
        },
        {
          "time": 4,
          "text": "LEONARDO DICAPRIO: Everything we fought for comes down to this moment."
        },
        {
          "time": 10,
          "text": "KATE WINSLET: We cannot afford to back down now."
        },
        {
          "time": 16,
          "text": "[dramatic cinematic climax unfolds in Ultra HD]"
        },
        {
          "time": 22,
          "text": "LEONARDO DICAPRIO: Hold the line! This is our destiny!"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[रोमांचक सिनेमाई संगीत - Titanic]"
        },
        {
          "time": 4,
          "text": "Leonardo DiCaprio: हमने जो कुछ भी सहा है, उसका फैसला आज होगा।"
        },
        {
          "time": 10,
          "text": "Kate Winslet: अब पीछे हटने का कोई रास्ता नहीं है।"
        },
        {
          "time": 16,
          "text": "[भव्य दृश्य और धमाकेदार एक्शन]"
        },
        {
          "time": 22,
          "text": "Leonardo DiCaprio: डटे रहो! यही हमारी मंजिल है!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[música cinematográfica envolvente - Titanic]"
        },
        {
          "time": 4,
          "text": "Leonardo DiCaprio: Todo por lo que luchamos se decide en este momento."
        },
        {
          "time": 10,
          "text": "Kate Winslet: No podemos retroceder ahora."
        },
        {
          "time": 16,
          "text": "[acción espectacular en Ultra HD]"
        },
        {
          "time": 22,
          "text": "Leonardo DiCaprio: ¡Mantengan la línea! ¡Este es nuestro destino!"
        }
      ]
    }
  },
  {
    "id": "baahubali-2",
    "title": "Baahubali 2: The Conclusion",
    "type": "Movie",
    "overview": "When Shiva learns of his royal lineage as Mahendra Baahubali, he sets out to overthrow the tyrannical ruler Bhallaladeva who murdered his noble father.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/whNjsTOUVg2lZLCKgGhnACnmV8E.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/21sC2assImQIYCEDA84Qh9d1RsK.jpg",
    "matchScore": 99,
    "year": "2017",
    "ageRating": "U/A 16+",
    "duration": "2h 47m",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Action",
      "Mythological Epic",
      "Historical Drama"
    ],
    "cast": [
      "Prabhas",
      "Rana Daggubati",
      "Anushka Shetty",
      "Tamannaah"
    ],
    "creator": "S. S. Rajamouli",
    "category": "action",
    "isOriginal": false,
    "tmdbId": 350312,
    "youtubeTrailerId": "G62HrubdD6o",
    "videoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "backupVideoUrl": "https://media.w3.org/2010/05/sintel/trailer.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[atmospheric soundtrack swells - Baahubali 2: The Conclusion]"
        },
        {
          "time": 4,
          "text": "PRABHAS: Everything we fought for comes down to this moment."
        },
        {
          "time": 10,
          "text": "RANA DAGGUBATI: We cannot afford to back down now."
        },
        {
          "time": 16,
          "text": "[dramatic cinematic climax unfolds in Ultra HD]"
        },
        {
          "time": 22,
          "text": "PRABHAS: Hold the line! This is our destiny!"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[रोमांचक सिनेमाई संगीत - Baahubali 2: The Conclusion]"
        },
        {
          "time": 4,
          "text": "Prabhas: हमने जो कुछ भी सहा है, उसका फैसला आज होगा।"
        },
        {
          "time": 10,
          "text": "Rana Daggubati: अब पीछे हटने का कोई रास्ता नहीं है।"
        },
        {
          "time": 16,
          "text": "[भव्य दृश्य और धमाकेदार एक्शन]"
        },
        {
          "time": 22,
          "text": "Prabhas: डटे रहो! यही हमारी मंजिल है!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[música cinematográfica envolvente - Baahubali 2: The Conclusion]"
        },
        {
          "time": 4,
          "text": "Prabhas: Todo por lo que luchamos se decide en este momento."
        },
        {
          "time": 10,
          "text": "Rana Daggubati: No podemos retroceder ahora."
        },
        {
          "time": 16,
          "text": "[acción espectacular en Ultra HD]"
        },
        {
          "time": 22,
          "text": "Prabhas: ¡Mantengan la línea! ¡Este es nuestro destino!"
        }
      ]
    }
  },
  {
    "id": "dangal",
    "title": "Dangal",
    "type": "Movie",
    "overview": "Former amateur wrestler Mahavir Singh Phogat coaches his young daughters Geeta and Babita to become world-class wrestling champions against all societal odds.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/l0fNAHLOFReQJsxCOmGWvJDnimn.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/cJRPOLEexI7qp2DKtFfCh7YaaUG.jpg",
    "matchScore": 99,
    "year": "2016",
    "ageRating": "U/A",
    "duration": "2h 41m",
    "quality": "4K Ultra HD",
    "audio": "5.1 Surround",
    "genres": [
      "Biography",
      "Sports Drama",
      "Inspirational"
    ],
    "cast": [
      "Aamir Khan",
      "Fatima Sana Shaikh",
      "Sanya Malhotra"
    ],
    "creator": "Nitesh Tiwari",
    "category": "drama",
    "isOriginal": false,
    "tmdbId": 360814,
    "youtubeTrailerId": "x_7YlGv9u1g",
    "videoUrl": "https://media.w3.org/2010/05/sintel/trailer.mp4",
    "backupVideoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[atmospheric soundtrack swells - Dangal]"
        },
        {
          "time": 4,
          "text": "AAMIR KHAN: Everything we fought for comes down to this moment."
        },
        {
          "time": 10,
          "text": "FATIMA SANA SHAIKH: We cannot afford to back down now."
        },
        {
          "time": 16,
          "text": "[dramatic cinematic climax unfolds in Ultra HD]"
        },
        {
          "time": 22,
          "text": "AAMIR KHAN: Hold the line! This is our destiny!"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[रोमांचक सिनेमाई संगीत - Dangal]"
        },
        {
          "time": 4,
          "text": "Aamir Khan: हमने जो कुछ भी सहा है, उसका फैसला आज होगा।"
        },
        {
          "time": 10,
          "text": "Fatima Sana Shaikh: अब पीछे हटने का कोई रास्ता नहीं है।"
        },
        {
          "time": 16,
          "text": "[भव्य दृश्य और धमाकेदार एक्शन]"
        },
        {
          "time": 22,
          "text": "Aamir Khan: डटे रहो! यही हमारी मंजिल है!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[música cinematográfica envolvente - Dangal]"
        },
        {
          "time": 4,
          "text": "Aamir Khan: Todo por lo que luchamos se decide en este momento."
        },
        {
          "time": 10,
          "text": "Fatima Sana Shaikh: No podemos retroceder ahora."
        },
        {
          "time": 16,
          "text": "[acción espectacular en Ultra HD]"
        },
        {
          "time": 22,
          "text": "Aamir Khan: ¡Mantengan la línea! ¡Este es nuestro destino!"
        }
      ]
    }
  },
  {
    "id": "three-idiots",
    "title": "3 Idiots",
    "type": "Movie",
    "overview": "Two engineering graduates embark on a road trip across India to locate their brilliant, non-conformist friend Rancho who challenged the rigid education system.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/u7kuUaySqXBVAtqEl9vkTkAzHV9.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/66A9MqXOyVFCssoloscw79z8Tew.jpg",
    "matchScore": 99,
    "year": "2009",
    "ageRating": "U/A",
    "duration": "2h 50m",
    "quality": "1080p Full HD",
    "audio": "5.1 Surround",
    "genres": [
      "Comedy",
      "Inspirational Drama",
      "Coming-of-Age"
    ],
    "cast": [
      "Aamir Khan",
      "R. Madhavan",
      "Sharman Joshi",
      "Kareena Kapoor"
    ],
    "creator": "Rajkumar Hirani",
    "category": "drama",
    "isOriginal": false,
    "tmdbId": 20453,
    "youtubeTrailerId": "K0eDlFX9GMc",
    "videoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "backupVideoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[atmospheric soundtrack swells - 3 Idiots]"
        },
        {
          "time": 4,
          "text": "AAMIR KHAN: Everything we fought for comes down to this moment."
        },
        {
          "time": 10,
          "text": "R. MADHAVAN: We cannot afford to back down now."
        },
        {
          "time": 16,
          "text": "[dramatic cinematic climax unfolds in Ultra HD]"
        },
        {
          "time": 22,
          "text": "AAMIR KHAN: Hold the line! This is our destiny!"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[रोमांचक सिनेमाई संगीत - 3 Idiots]"
        },
        {
          "time": 4,
          "text": "Aamir Khan: हमने जो कुछ भी सहा है, उसका फैसला आज होगा।"
        },
        {
          "time": 10,
          "text": "R. Madhavan: अब पीछे हटने का कोई रास्ता नहीं है।"
        },
        {
          "time": 16,
          "text": "[भव्य दृश्य और धमाकेदार एक्शन]"
        },
        {
          "time": 22,
          "text": "Aamir Khan: डटे रहो! यही हमारी मंजिल है!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[música cinematográfica envolvente - 3 Idiots]"
        },
        {
          "time": 4,
          "text": "Aamir Khan: Todo por lo que luchamos se decide en este momento."
        },
        {
          "time": 10,
          "text": "R. Madhavan: No podemos retroceder ahora."
        },
        {
          "time": 16,
          "text": "[acción espectacular en Ultra HD]"
        },
        {
          "time": 22,
          "text": "Aamir Khan: ¡Mantengan la línea! ¡Este es nuestro destino!"
        }
      ]
    }
  },
  {
    "id": "vikram",
    "title": "Vikram",
    "type": "Movie",
    "overview": "A black-ops squad leader investigates a string of vigilante assassinations of high-ranking police officials, uncovering a sprawling drug syndicate conspiracy.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/dkIX4dSMuVqjfrPGunBJUR7K3LQ.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/774UV1aCURb4s4JfEFg3IEMu5Zj.jpg",
    "matchScore": 97,
    "year": "2022",
    "ageRating": "A 18+",
    "duration": "2h 54m",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Action",
      "Neo-Noir",
      "Crime Thriller"
    ],
    "cast": [
      "Kamal Haasan",
      "Vijay Sethupathi",
      "Fahadh Faasil",
      "Suriya"
    ],
    "creator": "Lokesh Kanagaraj",
    "category": "action",
    "isOriginal": false,
    "tmdbId": 743563,
    "youtubeTrailerId": "OKBMCL-frPU",
    "videoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "backupVideoUrl": "https://media.w3.org/2010/05/sintel/trailer.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[atmospheric soundtrack swells - Vikram]"
        },
        {
          "time": 4,
          "text": "KAMAL HAASAN: Everything we fought for comes down to this moment."
        },
        {
          "time": 10,
          "text": "VIJAY SETHUPATHI: We cannot afford to back down now."
        },
        {
          "time": 16,
          "text": "[dramatic cinematic climax unfolds in Ultra HD]"
        },
        {
          "time": 22,
          "text": "KAMAL HAASAN: Hold the line! This is our destiny!"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[रोमांचक सिनेमाई संगीत - Vikram]"
        },
        {
          "time": 4,
          "text": "Kamal Haasan: हमने जो कुछ भी सहा है, उसका फैसला आज होगा।"
        },
        {
          "time": 10,
          "text": "Vijay Sethupathi: अब पीछे हटने का कोई रास्ता नहीं है।"
        },
        {
          "time": 16,
          "text": "[भव्य दृश्य और धमाकेदार एक्शन]"
        },
        {
          "time": 22,
          "text": "Kamal Haasan: डटे रहो! यही हमारी मंजिल है!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[música cinematográfica envolvente - Vikram]"
        },
        {
          "time": 4,
          "text": "Kamal Haasan: Todo por lo que luchamos se decide en este momento."
        },
        {
          "time": 10,
          "text": "Vijay Sethupathi: No podemos retroceder ahora."
        },
        {
          "time": 16,
          "text": "[acción espectacular en Ultra HD]"
        },
        {
          "time": 22,
          "text": "Kamal Haasan: ¡Mantengan la línea! ¡Este es nuestro destino!"
        }
      ]
    }
  },
  {
    "id": "kantara",
    "title": "Kantara",
    "type": "Movie",
    "overview": "In a coastal village bordered by ancient sacred forests, a rebellious youth must embrace the spiritual deity of his ancestors when a greedy landlord claims the holy land.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/kXElm7wt2kAXEVwJqW4cFhP43nW.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/jIsKmkxMzdCZ0Ux1GVSnu8m6Na6.jpg",
    "matchScore": 98,
    "year": "2022",
    "ageRating": "U/A 16+",
    "duration": "2h 28m",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Action",
      "Folklore Drama",
      "Supernatural Mystery"
    ],
    "cast": [
      "Rishab Shetty",
      "Sapthami Gowda",
      "Kishore"
    ],
    "creator": "Rishab Shetty",
    "category": "drama",
    "isOriginal": false,
    "tmdbId": 858485,
    "youtubeTrailerId": "6oKFao0aISA",
    "videoUrl": "https://media.w3.org/2010/05/sintel/trailer.mp4",
    "backupVideoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[atmospheric soundtrack swells - Kantara]"
        },
        {
          "time": 4,
          "text": "RISHAB SHETTY: Everything we fought for comes down to this moment."
        },
        {
          "time": 10,
          "text": "SAPTHAMI GOWDA: We cannot afford to back down now."
        },
        {
          "time": 16,
          "text": "[dramatic cinematic climax unfolds in Ultra HD]"
        },
        {
          "time": 22,
          "text": "RISHAB SHETTY: Hold the line! This is our destiny!"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[रोमांचक सिनेमाई संगीत - Kantara]"
        },
        {
          "time": 4,
          "text": "Rishab Shetty: हमने जो कुछ भी सहा है, उसका फैसला आज होगा।"
        },
        {
          "time": 10,
          "text": "Sapthami Gowda: अब पीछे हटने का कोई रास्ता नहीं है।"
        },
        {
          "time": 16,
          "text": "[भव्य दृश्य और धमाकेदार एक्शन]"
        },
        {
          "time": 22,
          "text": "Rishab Shetty: डटे रहो! यही हमारी मंजिल है!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[música cinematográfica envolvente - Kantara]"
        },
        {
          "time": 4,
          "text": "Rishab Shetty: Todo por lo que luchamos se decide en este momento."
        },
        {
          "time": 10,
          "text": "Sapthami Gowda: No podemos retroceder ahora."
        },
        {
          "time": 16,
          "text": "[acción espectacular en Ultra HD]"
        },
        {
          "time": 22,
          "text": "Rishab Shetty: ¡Mantengan la línea! ¡Este es nuestro destino!"
        }
      ]
    }
  },
  {
    "id": "pushpa-the-rise",
    "title": "Pushpa: The Rise",
    "type": "Movie",
    "overview": "A fiery red sandalwood laborer in Andhra Pradesh rises to the top of an international smuggling syndicate, facing off against ruthless cops and rival crime bosses.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/jQIcn51nsvMrpB9NFwEOb9QHhFt.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/cLCPRzTFBM9azgD46m2MxYSx5wX.jpg",
    "matchScore": 96,
    "year": "2021",
    "ageRating": "U/A 16+",
    "duration": "2h 59m",
    "quality": "4K Ultra HD",
    "audio": "5.1 Surround",
    "genres": [
      "Action",
      "Crime Thriller",
      "Gangster"
    ],
    "cast": [
      "Allu Arjun",
      "Rashmika Mandanna",
      "Fahadh Faasil"
    ],
    "creator": "Sukumar",
    "category": "action",
    "isOriginal": false,
    "tmdbId": 690957,
    "youtubeTrailerId": "Q1NKMPhP8PY",
    "videoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "backupVideoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[atmospheric soundtrack swells - Pushpa: The Rise]"
        },
        {
          "time": 4,
          "text": "ALLU ARJUN: Everything we fought for comes down to this moment."
        },
        {
          "time": 10,
          "text": "RASHMIKA MANDANNA: We cannot afford to back down now."
        },
        {
          "time": 16,
          "text": "[dramatic cinematic climax unfolds in Ultra HD]"
        },
        {
          "time": 22,
          "text": "ALLU ARJUN: Hold the line! This is our destiny!"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[रोमांचक सिनेमाई संगीत - Pushpa: The Rise]"
        },
        {
          "time": 4,
          "text": "Allu Arjun: हमने जो कुछ भी सहा है, उसका फैसला आज होगा।"
        },
        {
          "time": 10,
          "text": "Rashmika Mandanna: अब पीछे हटने का कोई रास्ता नहीं है।"
        },
        {
          "time": 16,
          "text": "[भव्य दृश्य और धमाकेदार एक्शन]"
        },
        {
          "time": 22,
          "text": "Allu Arjun: डटे रहो! यही हमारी मंजिल है!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[música cinematográfica envolvente - Pushpa: The Rise]"
        },
        {
          "time": 4,
          "text": "Allu Arjun: Todo por lo que luchamos se decide en este momento."
        },
        {
          "time": 10,
          "text": "Rashmika Mandanna: No podemos retroceder ahora."
        },
        {
          "time": 16,
          "text": "[acción espectacular en Ultra HD]"
        },
        {
          "time": 22,
          "text": "Allu Arjun: ¡Mantengan la línea! ¡Este es nuestro destino!"
        }
      ]
    }
  },
  {
    "id": "attack-on-titan",
    "title": "Attack on Titan",
    "type": "TV Series",
    "overview": "When colossal man-eating Titans breach the outermost protective wall, Eren Jaeger enlists in the elite Scout Regiment to fight back and uncover the true origin of their world.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/8tAB9vj4v96fS4a4a1w5y7e8.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg",
    "matchScore": 99,
    "year": "2023",
    "ageRating": "A 18+",
    "duration": "4 Seasons",
    "quality": "1080p Full HD",
    "audio": "Japanese & English Dub",
    "genres": [
      "Anime",
      "Dark Fantasy",
      "Military Sci-Fi"
    ],
    "cast": [
      "Yuki Kaji",
      "Yui Ishikawa",
      "Marina Inoue",
      "Hiroshi Kamiya"
    ],
    "creator": "Hajime Isayama",
    "category": "scifi",
    "isOriginal": false,
    "tmdbId": 1429,
    "youtubeTrailerId": "MGRm4IzK1SQ",
    "videoUrl": "https://media.w3.org/2010/05/sintel/trailer.mp4",
    "backupVideoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[Sawano choral battle chant thunders]"
        },
        {
          "time": 4,
          "text": "EREN: If we kill all our enemies over there... will we finally be free?"
        },
        {
          "time": 10,
          "text": "LEVI: Give up on your dream and die for us."
        },
        {
          "time": 15,
          "text": "EREN: TATAKAE! Keep moving forward until all my enemies are destroyed!"
        },
        {
          "time": 22,
          "text": "[Wall Titan footsteps shake the continents]"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[विशालकाय महाकाव्य संगीत]"
        },
        {
          "time": 4,
          "text": "एरेन: अगर हम समंदर पार के सारे दुश्मनों को खत्म कर दें... क्या हम आज़ाद हो जाएँगे?"
        },
        {
          "time": 10,
          "text": "लेवाई: अपने सपनों को छोड़ो और लड़ते हुए मरो।"
        },
        {
          "time": 15,
          "text": "एरेन: ताताकाए! लड़ो और आगे बढ़ते रहो!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[coro orquestal épico y atronador]"
        },
        {
          "time": 4,
          "text": "EREN: Si matamos a todos los enemigos allá... ¿seremos finalmente libres?"
        },
        {
          "time": 10,
          "text": "LEVI: Renuncia a tus sueños y muere por nosotros."
        },
        {
          "time": 15,
          "text": "EREN: ¡TATAKAE! ¡Sigue adelante hasta destruir a cada enemigo!"
        }
      ]
    }
  },
  {
    "id": "death-note",
    "title": "Death Note",
    "type": "TV Series",
    "overview": "High school prodigy Light Yagami finds a supernatural notebook that kills anyone whose name is written in it, igniting an intense game of cat-and-mouse with master detective L.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/iKp91h0fQ5fF2A9o8g7w5y4.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/tCZFjgkdRLjsnb1mWC0h7j7rZ8.jpg",
    "matchScore": 99,
    "year": "2007",
    "ageRating": "U/A 16+",
    "duration": "1 Season",
    "quality": "1080p Full HD",
    "audio": "Japanese & English Dub",
    "genres": [
      "Anime",
      "Psychological Thriller",
      "Supernatural Mystery"
    ],
    "cast": [
      "Mamoru Miyano",
      "Kappei Yamaguchi",
      "Brad Swaile"
    ],
    "creator": "Tsugumi Ohba",
    "category": "drama",
    "isOriginal": false,
    "tmdbId": 13916,
    "youtubeTrailerId": "NlJZ-YgAt-c",
    "videoUrl": "https://media.w3.org/2010/05/sintel/trailer.mp4",
    "backupVideoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[atmospheric soundtrack swells - Death Note]"
        },
        {
          "time": 4,
          "text": "MAMORU MIYANO: Everything we fought for comes down to this moment."
        },
        {
          "time": 10,
          "text": "KAPPEI YAMAGUCHI: We cannot afford to back down now."
        },
        {
          "time": 16,
          "text": "[dramatic cinematic climax unfolds in Ultra HD]"
        },
        {
          "time": 22,
          "text": "MAMORU MIYANO: Hold the line! This is our destiny!"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[रोमांचक सिनेमाई संगीत - Death Note]"
        },
        {
          "time": 4,
          "text": "Mamoru Miyano: हमने जो कुछ भी सहा है, उसका फैसला आज होगा।"
        },
        {
          "time": 10,
          "text": "Kappei Yamaguchi: अब पीछे हटने का कोई रास्ता नहीं है।"
        },
        {
          "time": 16,
          "text": "[भव्य दृश्य और धमाकेदार एक्शन]"
        },
        {
          "time": 22,
          "text": "Mamoru Miyano: डटे रहो! यही हमारी मंजिल है!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[música cinematográfica envolvente - Death Note]"
        },
        {
          "time": 4,
          "text": "Mamoru Miyano: Todo por lo que luchamos se decide en este momento."
        },
        {
          "time": 10,
          "text": "Kappei Yamaguchi: No podemos retroceder ahora."
        },
        {
          "time": 16,
          "text": "[acción espectacular en Ultra HD]"
        },
        {
          "time": 22,
          "text": "Mamoru Miyano: ¡Mantengan la línea! ¡Este es nuestro destino!"
        }
      ]
    }
  },
  {
    "id": "demon-slayer",
    "title": "Demon Slayer: Kimetsu no Yaiba",
    "type": "TV Series",
    "overview": "After demons slaughter his family and infect his sister Nezuko, Tanjiro Kamado trains to become a Demon Slayer to save his sister and defeat the demonic king Muzan.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/3GQk6F8fP3f3A5o9g7w5y4.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/xUfRZu2mi8jH69hmV1fbu37x9qd.jpg",
    "matchScore": 98,
    "year": "2024",
    "ageRating": "U/A 16+",
    "duration": "4 Seasons",
    "quality": "4K Ultra HD",
    "audio": "Japanese & Hindi Dub",
    "genres": [
      "Anime",
      "Action Fantasy",
      "Supernatural Martial Arts"
    ],
    "cast": [
      "Natsuki Hanae",
      "Akari Kito",
      "Hiro Shimono"
    ],
    "creator": "Koyoharu Gotouge",
    "category": "action",
    "isOriginal": false,
    "tmdbId": 85937,
    "youtubeTrailerId": "VQGCKyvzIM4",
    "videoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "backupVideoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[traditional Japanese flute and soaring strings]"
        },
        {
          "time": 4,
          "text": "TANJIRO: Total Concentration Breathing... Hinokami Kagura!"
        },
        {
          "time": 10,
          "text": "NEZUKO: [demon roar of fierce protection]"
        },
        {
          "time": 15,
          "text": "RENGOKU: Set your heart ablaze! Go beyond your limits!"
        },
        {
          "time": 21,
          "text": "[flame wheel slashes through darkness with brilliant sparks]"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[पारंपरिक जापानी बांसुरी और सिम्फनी]"
        },
        {
          "time": 4,
          "text": "तान्जिरो: पूर्ण एकाग्रता श्वास... हिनोकामी कागुरा!"
        },
        {
          "time": 10,
          "text": "नेज़ुको: [राक्षसी गर्जना के साथ रक्षा करती है]"
        },
        {
          "time": 15,
          "text": "रेंगोकु: अपने दिल में आग जलाओ! अपनी सीमाओं से आगे बढ़ो!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[flauta japonesa tradicional y cuerdas dinámicas]"
        },
        {
          "time": 4,
          "text": "TANJIRO: ¡Respiración de Enfoque Total... Hinokami Kagura!"
        },
        {
          "time": 15,
          "text": "RENGOKU: ¡Enciende tu corazón! ¡Supera tus límites!"
        }
      ]
    }
  },
  {
    "id": "jujutsu-kaisen",
    "title": "Jujutsu Kaisen",
    "type": "TV Series",
    "overview": "Yuji Itadori swallows the cursed finger of Ryomen Sukuna and is initiated into Tokyo Jujutsu High to battle deadly curses threatening humankind.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/qpin8cASXEVtwhzNsprHYFiOAGk.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/6qQzMJG27XOJsyAEEIisoJB45j2.jpg",
    "matchScore": 98,
    "year": "2023",
    "ageRating": "U/A 16+",
    "duration": "2 Seasons",
    "quality": "1080p Full HD",
    "audio": "Japanese & English Dub",
    "genres": [
      "Anime",
      "Supernatural Action",
      "Dark Fantasy"
    ],
    "cast": [
      "Junya Enoki",
      "Yuma Uchida",
      "Asami Seto"
    ],
    "creator": "Gege Akutami",
    "category": "action",
    "isOriginal": false,
    "tmdbId": 95479,
    "youtubeTrailerId": "VpO6APNqY1c",
    "videoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "backupVideoUrl": "https://media.w3.org/2010/05/sintel/trailer.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[atmospheric soundtrack swells - Jujutsu Kaisen]"
        },
        {
          "time": 4,
          "text": "JUNYA ENOKI: Everything we fought for comes down to this moment."
        },
        {
          "time": 10,
          "text": "YUMA UCHIDA: We cannot afford to back down now."
        },
        {
          "time": 16,
          "text": "[dramatic cinematic climax unfolds in Ultra HD]"
        },
        {
          "time": 22,
          "text": "JUNYA ENOKI: Hold the line! This is our destiny!"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[रोमांचक सिनेमाई संगीत - Jujutsu Kaisen]"
        },
        {
          "time": 4,
          "text": "Junya Enoki: हमने जो कुछ भी सहा है, उसका फैसला आज होगा।"
        },
        {
          "time": 10,
          "text": "Yuma Uchida: अब पीछे हटने का कोई रास्ता नहीं है।"
        },
        {
          "time": 16,
          "text": "[भव्य दृश्य और धमाकेदार एक्शन]"
        },
        {
          "time": 22,
          "text": "Junya Enoki: डटे रहो! यही हमारी मंजिल है!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[música cinematográfica envolvente - Jujutsu Kaisen]"
        },
        {
          "time": 4,
          "text": "Junya Enoki: Todo por lo que luchamos se decide en este momento."
        },
        {
          "time": 10,
          "text": "Yuma Uchida: No podemos retroceder ahora."
        },
        {
          "time": 16,
          "text": "[acción espectacular en Ultra HD]"
        },
        {
          "time": 22,
          "text": "Junya Enoki: ¡Mantengan la línea! ¡Este es nuestro destino!"
        }
      ]
    }
  },
  {
    "id": "the-boys",
    "title": "The Boys",
    "type": "TV Series",
    "overview": "A ragtag squad of vigilantes known as 'The Boys' embark on a bloody quest to take down the corrupt, celebrity superheroes managed by the sinister conglomerate Vought.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/bq28ajZaoMyzEIm6REelqyqtEDZ.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/in1R2dDc421JxsoRWaIIAqVI2KE.jpg",
    "matchScore": 98,
    "year": "2024",
    "ageRating": "A 18+",
    "duration": "4 Seasons",
    "quality": "4K Ultra HD",
    "audio": "5.1 Surround",
    "genres": [
      "Action",
      "Dark Satire",
      "Superhero Drama"
    ],
    "cast": [
      "Karl Urban",
      "Jack Quaid",
      "Antony Starr",
      "Erin Moriarty"
    ],
    "creator": "Eric Kripke",
    "category": "action",
    "isOriginal": false,
    "tmdbId": 76479,
    "youtubeTrailerId": "tcrNsIaQkb4",
    "videoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "backupVideoUrl": "https://media.w3.org/2010/05/sintel/trailer.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[gritty punk rock guitar explodes]"
        },
        {
          "time": 4,
          "text": "BILLY BUTCHER: Scorched earth, mate."
        },
        {
          "time": 8,
          "text": "HOMELANDER: I'm the Homelander. And I can do whatever I want."
        },
        {
          "time": 14,
          "text": "HUGHIE: We can't cross that line, Butcher!"
        },
        {
          "time": 19,
          "text": "BUTCHER: When you stand in front of monsters, you become the bastard they fear."
        },
        {
          "time": 25,
          "text": "[lasers burn through concrete with blinding light]"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[जोशीला पंक रॉक संगीत]"
        },
        {
          "time": 4,
          "text": "बिली बुचर: अब सब कुछ तबाह होगा, दोस्त।"
        },
        {
          "time": 8,
          "text": "होमलैंडर: मैं होमलैंडर हूँ। और मैं जो चाहे वो कर सकता हूँ।"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[guitarra punk agresiva y distorsión]"
        },
        {
          "time": 4,
          "text": "BUTCHER: Tierra quemada, amigo."
        },
        {
          "time": 8,
          "text": "HOMELANDER: Soy Homelander. Y puedo hacer lo que se me dé la gana."
        }
      ]
    }
  },
  {
    "id": "black-mirror",
    "title": "Black Mirror",
    "type": "TV Series",
    "overview": "A mind-bending sci-fi anthology series exploring humanity's greatest technological innovations and darkest impulses across unsettling dystopian scenarios.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/dg3OindVAGZBjlT3xYKqIAdukPL.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/seN6rRfN0I6n8iDXjlSMk1QjNcq.jpg",
    "matchScore": 97,
    "year": "2023",
    "ageRating": "A 18+",
    "duration": "6 Seasons",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Sci-Fi",
      "Dystopian Anthology",
      "Psychological Suspense"
    ],
    "cast": [
      "Daniel Kaluuya",
      "Jon Hamm",
      "Bryce Dallas Howard",
      "Aaron Paul"
    ],
    "creator": "Charlie Brooker",
    "category": "scifi",
    "isOriginal": true,
    "tmdbId": 42009,
    "youtubeTrailerId": "1iqra1ojEvM",
    "videoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "backupVideoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[atmospheric soundtrack swells - Black Mirror]"
        },
        {
          "time": 4,
          "text": "DANIEL KALUUYA: Everything we fought for comes down to this moment."
        },
        {
          "time": 10,
          "text": "JON HAMM: We cannot afford to back down now."
        },
        {
          "time": 16,
          "text": "[dramatic cinematic climax unfolds in Ultra HD]"
        },
        {
          "time": 22,
          "text": "DANIEL KALUUYA: Hold the line! This is our destiny!"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[रोमांचक सिनेमाई संगीत - Black Mirror]"
        },
        {
          "time": 4,
          "text": "Daniel Kaluuya: हमने जो कुछ भी सहा है, उसका फैसला आज होगा।"
        },
        {
          "time": 10,
          "text": "Jon Hamm: अब पीछे हटने का कोई रास्ता नहीं है।"
        },
        {
          "time": 16,
          "text": "[भव्य दृश्य और धमाकेदार एक्शन]"
        },
        {
          "time": 22,
          "text": "Daniel Kaluuya: डटे रहो! यही हमारी मंजिल है!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[música cinematográfica envolvente - Black Mirror]"
        },
        {
          "time": 4,
          "text": "Daniel Kaluuya: Todo por lo que luchamos se decide en este momento."
        },
        {
          "time": 10,
          "text": "Jon Hamm: No podemos retroceder ahora."
        },
        {
          "time": 16,
          "text": "[acción espectacular en Ultra HD]"
        },
        {
          "time": 22,
          "text": "Daniel Kaluuya: ¡Mantengan la línea! ¡Este es nuestro destino!"
        }
      ]
    }
  },
  {
    "id": "dunki",
    "title": "Dunki",
    "type": "Movie",
    "overview": "Four close friends in rural Punjab venture on an arduous backdoor donkey flight journey across borders to reach London, guided by an ex-soldier seeking to fulfill a promise.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/jXJxMcVoTTg5upA505z2U29rUIn.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    "matchScore": 95,
    "year": "2023",
    "ageRating": "U/A 13+",
    "duration": "2h 41m",
    "quality": "4K Ultra HD",
    "audio": "5.1 Surround",
    "genres": [
      "Comedy",
      "Social Drama",
      "Emotional Journey"
    ],
    "cast": [
      "Shah Rukh Khan",
      "Taapsee Pannu",
      "Vicky Kaushal",
      "Boman Irani"
    ],
    "creator": "Rajkumar Hirani",
    "category": "drama",
    "isOriginal": false,
    "tmdbId": 1071489,
    "youtubeTrailerId": "ACKQDAlAfFE",
    "videoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "backupVideoUrl": "https://media.w3.org/2010/05/sintel/trailer.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[atmospheric soundtrack swells - Dunki]"
        },
        {
          "time": 4,
          "text": "SHAH RUKH KHAN: Everything we fought for comes down to this moment."
        },
        {
          "time": 10,
          "text": "TAAPSEE PANNU: We cannot afford to back down now."
        },
        {
          "time": 16,
          "text": "[dramatic cinematic climax unfolds in Ultra HD]"
        },
        {
          "time": 22,
          "text": "SHAH RUKH KHAN: Hold the line! This is our destiny!"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[रोमांचक सिनेमाई संगीत - Dunki]"
        },
        {
          "time": 4,
          "text": "Shah Rukh Khan: हमने जो कुछ भी सहा है, उसका फैसला आज होगा।"
        },
        {
          "time": 10,
          "text": "Taapsee Pannu: अब पीछे हटने का कोई रास्ता नहीं है।"
        },
        {
          "time": 16,
          "text": "[भव्य दृश्य और धमाकेदार एक्शन]"
        },
        {
          "time": 22,
          "text": "Shah Rukh Khan: डटे रहो! यही हमारी मंजिल है!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[música cinematográfica envolvente - Dunki]"
        },
        {
          "time": 4,
          "text": "Shah Rukh Khan: Todo por lo que luchamos se decide en este momento."
        },
        {
          "time": 10,
          "text": "Taapsee Pannu: No podemos retroceder ahora."
        },
        {
          "time": 16,
          "text": "[acción espectacular en Ultra HD]"
        },
        {
          "time": 22,
          "text": "Shah Rukh Khan: ¡Mantengan la línea! ¡Este es nuestro destino!"
        }
      ]
    }
  },
  {
    "id": "drishyam",
    "title": "Drishyam",
    "type": "Movie",
    "overview": "When the son of an influential IG goes missing, a desperate father uses his wits and knowledge gained from cinema to protect his family from relentless interrogation.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/5jxesZtbjNtsDitSBvK1amtd7o2.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/gIClWRv5OSe8rl5Koi0AeUcCZ9Z.jpg",
    "matchScore": 98,
    "year": "2015",
    "ageRating": "U/A 16+",
    "duration": "2h 43m",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Crime",
      "Mystery",
      "Thriller",
      "Indian Mega Blockbusters"
    ],
    "cast": [
      "Ajay Devgn",
      "Tabu",
      "Shriya Saran",
      "Ishita Dutta"
    ],
    "creator": "Nishikant Kamat",
    "category": "trending",
    "isOriginal": false,
    "top10Rank": 3,
    "tmdbId": 352173,
    "youtubeTrailerId": "64xJLmcA2K8",
    "videoUrl": "https://media.w3.org/2010/05/sintel/trailer.mp4",
    "backupVideoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[atmospheric soundtrack swells - Drishyam]"
        },
        {
          "time": 4,
          "text": "AJAY DEVGN: Everything we fought for comes down to this moment."
        },
        {
          "time": 10,
          "text": "TABU: We cannot afford to back down now."
        },
        {
          "time": 16,
          "text": "[dramatic cinematic climax unfolds in Ultra HD]"
        },
        {
          "time": 22,
          "text": "AJAY DEVGN: Hold the line! This is our destiny!"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[रोमांचक सिनेमाई संगीत - Drishyam]"
        },
        {
          "time": 4,
          "text": "Ajay Devgn: हमने जो कुछ भी सहा है, उसका फैसला आज होगा।"
        },
        {
          "time": 10,
          "text": "Tabu: अब पीछे हटने का कोई रास्ता नहीं है।"
        },
        {
          "time": 16,
          "text": "[भव्य दृश्य और धमाकेदार एक्शन]"
        },
        {
          "time": 22,
          "text": "Ajay Devgn: डटे रहो! यही हमारी मंजिल है!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[música cinematográfica envolvente - Drishyam]"
        },
        {
          "time": 4,
          "text": "Ajay Devgn: Todo por lo que luchamos se decide en este momento."
        },
        {
          "time": 10,
          "text": "Tabu: No podemos retroceder ahora."
        },
        {
          "time": 16,
          "text": "[acción espectacular en Ultra HD]"
        },
        {
          "time": 22,
          "text": "Ajay Devgn: ¡Mantengan la línea! ¡Este es nuestro destino!"
        }
      ]
    }
  },
  {
    "id": "drishyam-2",
    "title": "Drishyam 2",
    "type": "Movie",
    "overview": "Seven years after the sensational case, Vijay Salgaonkar and his family find themselves in the crosshairs of a new IG determined to reopen the investigation.",
    "backdrop": "https://image.tmdb.org/t/p/w1280/498aYGlnvjvoiqXYhCNHrZERi4l.jpg",
    "poster": "https://image.tmdb.org/t/p/w780/wk8Vu0DI0MiNLaXXiVqAwjLRKL5.jpg",
    "matchScore": 97,
    "year": "2022",
    "ageRating": "U/A 16+",
    "duration": "2h 20m",
    "quality": "4K Ultra HD",
    "audio": "Dolby Atmos",
    "genres": [
      "Crime",
      "Mystery",
      "Thriller",
      "Indian Mega Blockbusters"
    ],
    "cast": [
      "Ajay Devgn",
      "Akshaye Khanna",
      "Tabu",
      "Shriya Saran"
    ],
    "creator": "Abhishek Pathak",
    "category": "trending",
    "isOriginal": false,
    "top10Rank": 4,
    "tmdbId": 1029827,
    "youtubeTrailerId": "cxA2y9Tgl7o",
    "videoUrl": "https://vjs.zencdn.net/v/oceans.mp4",
    "backupVideoUrl": "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4",
    "subtitles": {
      "en": [
        {
          "time": 1,
          "text": "[atmospheric soundtrack swells - Drishyam 2]"
        },
        {
          "time": 4,
          "text": "AJAY DEVGN: Everything we fought for comes down to this moment."
        },
        {
          "time": 10,
          "text": "AKSHAYE KHANNA: We cannot afford to back down now."
        },
        {
          "time": 16,
          "text": "[dramatic cinematic climax unfolds in Ultra HD]"
        },
        {
          "time": 22,
          "text": "AJAY DEVGN: Hold the line! This is our destiny!"
        }
      ],
      "hi": [
        {
          "time": 1,
          "text": "[रोमांचक सिनेमाई संगीत - Drishyam 2]"
        },
        {
          "time": 4,
          "text": "Ajay Devgn: हमने जो कुछ भी सहा है, उसका फैसला आज होगा।"
        },
        {
          "time": 10,
          "text": "Akshaye Khanna: अब पीछे हटने का कोई रास्ता नहीं है।"
        },
        {
          "time": 16,
          "text": "[भव्य दृश्य और धमाकेदार एक्शन]"
        },
        {
          "time": 22,
          "text": "Ajay Devgn: डटे रहो! यही हमारी मंजिल है!"
        }
      ],
      "es": [
        {
          "time": 1,
          "text": "[música cinematográfica envolvente - Drishyam 2]"
        },
        {
          "time": 4,
          "text": "Ajay Devgn: Todo por lo que luchamos se decide en este momento."
        },
        {
          "time": 10,
          "text": "Akshaye Khanna: No podemos retroceder ahora."
        },
        {
          "time": 16,
          "text": "[acción espectacular en Ultra HD]"
        },
        {
          "time": 22,
          "text": "Ajay Devgn: ¡Mantengan la línea! ¡Este es nuestro destino!"
        }
      ]
    }
  }
];

module.exports = movies;
