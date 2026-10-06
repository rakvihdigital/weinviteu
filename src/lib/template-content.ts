/**
 * Template Content & Walkthrough Analyzer
 * Extracts and synthesizes the exact starting-to-end journey of an invitation template.
 */

export interface TemplateStepItem {
  step: number;
  title: string;
  badge: string;
  phase: 'start' | 'experience' | 'details' | 'interaction' | 'end';
  headline: string;
  description: string;
  whatGuestsExperience: string;
  customizableFields: string[];
  features: string[];
}

export interface TemplateWalkthrough {
  openingAction: string;
  openingDescription: string;
  hasAudio: boolean;
  audioDescription: string;
  totalSteps: number;
  steps: TemplateStepItem[];
  highlights: string[];
  techSpecs: {
    label: string;
    value: string;
  }[];
}

/** Specific rich metadata for bundled signature templates */
const SIGNATURE_TEMPLATES: Record<string, Partial<TemplateWalkthrough>> = {
  'temple-invitation.html': {
    openingAction: 'Royal Wax Seal Melt & Temple Entrance',
    openingDescription: 'Guests are greeted by an ornate wax seal on parchment. Tapping the seal melts it with realistic haptic animation, unveiling a towering 3D South Indian temple gopuram.',
    steps: [
      {
        step: 1,
        title: 'Wax Seal Reveal & 3D Gopuram',
        badge: 'START',
        phase: 'start',
        headline: 'Authentic 3D Temple Gateway Reveal',
        description: 'An interactive sealed invitation envelope that opens into an animated temple gateway with traditional brass diyas and temple architecture.',
        whatGuestsExperience: 'Guests break the wax seal with an authentic sound effect. The camera glides in 3D perspective into the illuminated temple courtyard.',
        customizableFields: ['Monogram initials', 'Wax seal color', 'Entrance subtitle text'],
        features: ['3D Camera perspective shift', 'Realistic sound effects', 'Wax seal animation']
      },
      {
        step: 2,
        title: 'Synchronized Nadaswaram & Ambient Audio',
        badge: 'AUDIO',
        phase: 'experience',
        headline: 'Sacred Temple Ambience & Music Player',
        description: 'Immersive background nadaswaram / shehnai soundtrack that sets a divine, auspicious mood instantly.',
        whatGuestsExperience: 'Autoplays or starts on guest interaction. Floating sound icon allows easy mute/unmute at any point.',
        customizableFields: ['Your choice of traditional instrumental or song (MP3/YouTube audio)'],
        features: ['Web Audio API', 'Volume ducking', 'Floating mute toggle']
      },
      {
        step: 3,
        title: 'Divine Blessings & Auspicious Muhurtham',
        badge: 'CEREMONY',
        phase: 'details',
        headline: 'Sacred Invocations & Auspicious Timings',
        description: 'Traditional shlokas ("With the blessings of the Almighty") announcing the exact lagna and muhurtham timings with live countdown.',
        whatGuestsExperience: 'Clear display of auspicious date, star, lagna, and time with elegant gold-bordered calligraphy.',
        customizableFields: ['Shloka/blessing text', 'Muhurtham date & time', 'Subha muhurtham star/lagna'],
        features: ['Live event countdown timer', 'Auspicious muhurtham badge', 'Bilingual text option']
      },
      {
        step: 4,
        title: 'Bride & Groom Spotlight with Family Lineage',
        badge: 'COUPLE',
        phase: 'details',
        headline: 'Honoring the Couple and Ancestral Heritage',
        description: 'Dedicated spotlight pages honoring the Bride (daughter & granddaughter of) and Groom with full family trees and names.',
        whatGuestsExperience: 'Graceful transition displaying the bride and groom lineages, parents, grandparents, and ancestral hometowns.',
        customizableFields: ['Bride full name & title', 'Groom full name & title', 'Parents & grandparents names', 'Hometowns'],
        features: ['Family tree tribute', 'Gold filigree framing', 'Lineage badges']
      },
      {
        step: 5,
        title: 'The Hosts Formal Welcome',
        badge: 'HOSTS',
        phase: 'details',
        headline: 'Formal Invitation from Both Families',
        description: 'Heartfelt formal greeting from parents and elders extending warm personal invitations to every guest.',
        whatGuestsExperience: 'Warm, respectful invitation wording inviting friends and family to grace the auspicious union.',
        customizableFields: ['Host names', 'Formal welcome wording', 'Special family notes'],
        features: ['Custom signatures', 'Royal script typography']
      },
      {
        step: 6,
        title: 'Events Itinerary & Ceremonies Breakdown',
        badge: 'SCHEDULE',
        phase: 'details',
        headline: 'Complete Multi-Ceremony Schedule',
        description: 'Chronological timeline of all wedding ceremonies (Vratham, Janavasam, Muhurtham, Saptapadi, Reception).',
        whatGuestsExperience: 'Guests can view each event date, time, venue hall, and suggested dress code in one clean view.',
        customizableFields: ['Event names', 'Dates & times', 'Dress code recommendations', 'Special instructions'],
        features: ['Ceremony timeline icons', 'Dress code cards', 'Add to Google Calendar button']
      },
      {
        step: 7,
        title: 'Mandapam & 1-Tap Google Maps Navigation',
        badge: 'VENUE',
        phase: 'interaction',
        headline: 'Interactive Mandapam Location with Instant Directions',
        description: 'Full mandapam address, landmark notes, and direct Google Maps navigation button for out-of-town guests.',
        whatGuestsExperience: 'Tapping "Open in Maps" opens Google Maps or Apple Maps directly with turn-by-turn navigation.',
        customizableFields: ['Mandapam name', 'Hall details', 'Full address & landmark', 'Google Maps link'],
        features: ['1-Tap GPS Navigation', 'Parking & valet instructions', 'Nearby accommodations']
      },
      {
        step: 8,
        title: 'Moments & Photo Story Gallery',
        badge: 'GALLERY',
        phase: 'experience',
        headline: 'Romantic Pre-Wedding Portrait Showcase',
        description: 'Curated photo gallery highlighting the couple’s portraits, engagement memories, and special moments.',
        whatGuestsExperience: 'Smooth, touch-friendly carousel displaying high-resolution couple photographs.',
        customizableFields: ['Upload up to 6 custom couple portraits/photos'],
        features: ['High-res responsive gallery', 'Touch swipe support', 'Subtle zoom transitions']
      },
      {
        step: 9,
        title: 'Interactive RSVP & Personal Blessings',
        badge: 'RSVP',
        phase: 'interaction',
        headline: 'Instant Guest Confirmations & Digital Guestbook',
        description: 'Guests can confirm attendance, specify headcount, and leave heartfelt blessing messages for the couple.',
        whatGuestsExperience: 'Easy 30-second form allowing guests to submit RSVP directly to the hosts on WhatsApp or email.',
        customizableFields: ['RSVP deadline date', 'Contact phone numbers', 'Attendance options'],
        features: ['Guest headcount counter', 'Wishes guestbook', 'Direct WhatsApp RSVP forward']
      },
      {
        step: 10,
        title: 'Important Guidelines & Digital Keepsake',
        badge: 'END',
        phase: 'end',
        headline: 'Hashtag, Guidelines & Permanent Keepsake Link',
        description: 'Official wedding hashtag (#KarthikMeena), live streaming link for remote guests, and permanent shareable link.',
        whatGuestsExperience: 'Guests receive a digital keepsake they can bookmark and revisit even years after the celebration.',
        customizableFields: ['Official hashtag', 'Live-stream link (YouTube/Zoom)', 'Thank you note'],
        features: ['1-Tap Link copy', 'Native WhatsApp share button', 'Permanent cloud archive']
      }
    ]
  },

  'invitation (2).html': {
    openingAction: 'Golden Key Drag & Unlock Royal Doors',
    openingDescription: 'A bespoke interactive lock mechanism where the guest drags a glowing 3D golden key into the lock to unlock the royal palace doors.',
    steps: [
      {
        step: 1,
        title: 'Ceremonial Golden Key Unlock',
        badge: 'START',
        phase: 'start',
        headline: 'Interactive 3D Key & Palace Doors Unlock',
        description: 'Guests drag the ornate golden key or tap Enter to unlock the gilded palace doors with realistic sound effects.',
        whatGuestsExperience: 'A tactile, playful experience that creates immediate intrigue and excitement for the celebration.',
        customizableFields: ['Couple monogram', 'Lock emblem text'],
        features: ['Draggable physics key', 'Door swinging animation', 'Unlocking chime']
      },
      {
        step: 2,
        title: 'Grand Palace Courtyard & Music',
        badge: 'AUDIO',
        phase: 'experience',
        headline: 'Cinematic Royal Atmosphere',
        description: 'Orchestral instrumental music plays in the background as the camera sweeps through the palace courtyard.',
        whatGuestsExperience: 'Cinematic immersion with elegant golden accents and floating petals.',
        customizableFields: ['Background soundtrack of your choice'],
        features: ['Floating sound player', 'Petal particle effects']
      },
      {
        step: 3,
        title: 'Couple Portrait & Royal Welcome',
        badge: 'COUPLE',
        phase: 'details',
        headline: 'High-Fashion Couple Portrait Reveal',
        description: 'Full-bleed portrait of the bride and groom framed in vintage gold filigree with their formal union announcement.',
        whatGuestsExperience: 'Striking portrait reveal with couple’s names, wedding hashtag, and heartfelt invitation quote.',
        customizableFields: ['Couple photo', 'Bride & Groom names', 'Welcome message'],
        features: ['Gold frame styling', 'Typography hierarchy']
      },
      {
        step: 4,
        title: 'Wedding Celebrations Timeline',
        badge: 'SCHEDULE',
        phase: 'details',
        headline: 'Complete Multi-Day Wedding Schedule',
        description: 'Detailed cards for Sangeet, Mehendi, Haldi, Wedding Ceremony, and Grand Reception.',
        whatGuestsExperience: 'Interactive event cards displaying dates, timings, venues, and dress codes for each ceremony.',
        customizableFields: ['Events list', 'Ceremony timings', 'Dress codes'],
        features: ['Individual event cards', 'Calendar sync']
      },
      {
        step: 5,
        title: 'Palace Venue & Interactive Maps',
        badge: 'VENUE',
        phase: 'interaction',
        headline: 'Venue Location & Instant Directions',
        description: 'Mandap location with full address, travel tips, and 1-tap Google Maps integration.',
        whatGuestsExperience: 'Guests tap the map button to get instant navigation directly to the celebration venue.',
        customizableFields: ['Palace/Hotel name', 'Full address', 'Google Maps link'],
        features: ['Google Maps button', 'Valet/parking notes']
      },
      {
        step: 6,
        title: 'Interactive RSVP & Wishes Registry',
        badge: 'RSVP',
        phase: 'interaction',
        headline: 'Digital RSVP & Personalized Guestbook',
        description: 'Built-in attendance submission and custom wishes guestbook.',
        whatGuestsExperience: 'Guests confirm attendance in seconds with headcount and personalized greetings.',
        customizableFields: ['RSVP deadline', 'Host contact numbers'],
        features: ['Attendance count', 'Instant WhatsApp submission']
      },
      {
        step: 7,
        title: 'Digital Keepsake & Closing Blessings',
        badge: 'END',
        phase: 'end',
        headline: 'Closing Family Gratitude & Shareable Link',
        description: 'Final blessings from both families and a permanent link that guests can share and keep forever.',
        whatGuestsExperience: 'Warm closing words with easy 1-tap link sharing for WhatsApp groups.',
        customizableFields: ['Closing blessing note', 'Family signatures'],
        features: ['1-Tap WhatsApp share', 'Permanent cloud hosting']
      }
    ]
  },

  'birthday-red-gold.html': {
    openingAction: 'Red Velvet Curtains & Glowing Heart Touch',
    openingDescription: 'A lavish rose-covered arch with deep red velvet curtains tied with gold. Touching the glowing heart parts the curtains to celebratory chimes.',
    steps: [
      {
        step: 1,
        title: 'Red Velvet Curtains & Glowing Heart',
        badge: 'START',
        phase: 'start',
        headline: 'Sensory Red Velvet Entrance Reveal',
        description: 'Guests touch the pulsing golden heart to part the luxurious red curtains and trigger celebratory sound effects.',
        whatGuestsExperience: 'Smooth curtain slide revealing the birthday star with golden confetti fireworks.',
        customizableFields: ['Birthday person’s name', 'Milestone age (e.g. 18th / 21st / 50th)'],
        features: ['Curtain physics animation', 'Confetti particle burst', 'Audio chime']
      },
      {
        step: 2,
        title: 'Celebration Beat & Ambient Music',
        badge: 'AUDIO',
        phase: 'experience',
        headline: 'Upbeat Party Music & Ambience',
        description: 'Energetic party soundtrack playing with on-screen sound controls.',
        whatGuestsExperience: 'Festive celebratory mood as soon as the curtains open.',
        customizableFields: ['Party song or custom MP3 track'],
        features: ['Audio player with mute toggle']
      },
      {
        step: 3,
        title: 'Birthday Star Spotlight & Milestone',
        badge: 'CELEBRANT',
        phase: 'details',
        headline: 'Honoring the Birthday Star',
        description: 'Prominent photo showcase with custom birthday title, age celebration, and heartwarming quote.',
        whatGuestsExperience: 'Vibrant tribute card highlighting the celebrant with regal gold typography.',
        customizableFields: ['Celebrant photo', 'Name & title', 'Age celebration message'],
        features: ['High-res portrait container', 'Golden typography']
      },
      {
        step: 4,
        title: 'Party Itinerary & Highlights',
        badge: 'SCHEDULE',
        phase: 'details',
        headline: 'Cake Cutting, DJ Night & Dinner Timeline',
        description: 'Clear timeline covering welcome drinks, cake cutting ceremony, dance floor, and dinner feast.',
        whatGuestsExperience: 'Chronological party schedule so guests know the evening program.',
        customizableFields: ['Event start time', 'Cake cutting time', 'Dinner timings', 'Dress code theme'],
        features: ['Party timeline icons', 'Theme dress code badge']
      },
      {
        step: 5,
        title: 'Party Venue & Google Maps Navigation',
        badge: 'VENUE',
        phase: 'interaction',
        headline: 'Lounge / Banquet Venue with 1-Tap Navigation',
        description: 'Venue name, room/banquet hall number, complete address, and GPS navigation.',
        whatGuestsExperience: 'Quick 1-tap route calculation to the party location on Google Maps.',
        customizableFields: ['Venue name', 'Full address & landmark', 'Google Maps link'],
        features: ['GPS Navigation', 'Parking directions']
      },
      {
        step: 6,
        title: 'RSVP Headcount & Wishes',
        badge: 'RSVP',
        phase: 'interaction',
        headline: 'Instant Headcount & Birthday Wishes',
        description: 'Guests RSVP their attendance and headcount for catering planning.',
        whatGuestsExperience: 'Quick form with guest count and birthday greetings for the birthday star.',
        customizableFields: ['RSVP deadline', 'Host phone numbers'],
        features: ['Guest count selector', 'Direct WhatsApp reply']
      },
      {
        step: 7,
        title: 'Social Share & Party Keepsake',
        badge: 'END',
        phase: 'end',
        headline: 'Event Hashtag & Permanent Party Link',
        description: 'Party hashtag, photo upload link, and permanent invite URL for all friends and family.',
        whatGuestsExperience: 'Easy link sharing with friends on WhatsApp and Instagram.',
        customizableFields: ['Party hashtag', 'Thank you note'],
        features: ['WhatsApp 1-tap share', 'Cloud hosted link']
      }
    ]
  },

  'baby-shower-invitation.html': {
    openingAction: 'Pastel Nursery Door & Floating Balloon Tap',
    openingDescription: 'A dreamy pastel nursery door framed with clouds and a floating balloon. Tapping the balloon opens the door into a wonderland of soft stars.',
    steps: [
      {
        step: 1,
        title: 'Pastel Nursery Door & Balloon Tap Reveal',
        badge: 'START',
        phase: 'start',
        headline: 'Whimsical Nursery Gateway Reveal',
        description: 'Guests tap the bobbing balloon or squeeze the teddy to open the charming nursery door with sweet music.',
        whatGuestsExperience: 'Gentle opening animation with floating clouds and twinkling golden stars.',
        customizableFields: ['Parents-to-be names', 'Baby shower theme wording'],
        features: ['Floating balloon physics', 'Gentle chime sound', 'Door opening reveal']
      },
      {
        step: 2,
        title: 'Lullaby / Soft Ambient Music',
        badge: 'AUDIO',
        phase: 'experience',
        headline: 'Heartwarming Musical Backdrop',
        description: 'Tender lullaby instrumental playing in the background with sound control.',
        whatGuestsExperience: 'Warm, emotional atmosphere welcoming friends and family.',
        customizableFields: ['Choice of soft background melody'],
        features: ['Mute/unmute floating button']
      },
      {
        step: 3,
        title: 'Welcoming the Little One',
        badge: 'BLESSING',
        phase: 'details',
        headline: 'Celebrating the New Arrival',
        description: '"We’re Over the Moon! A Grand Adventure is about to begin." Formal invitation from parents-to-be.',
        whatGuestsExperience: 'Sweet announcement card honoring the mother-to-be and family.',
        customizableFields: ['Parents names', 'Expected arrival message', 'Custom family note'],
        features: ['Gold star typography', 'Pastel border flourishes']
      },
      {
        step: 4,
        title: 'High Tea, Games & Ceremony Timeline',
        badge: 'SCHEDULE',
        phase: 'details',
        headline: 'Celebration Itinerary & Baby Shower Fun',
        description: 'Schedule of baby shower rituals, games, high tea, cake cutting, and gift shower.',
        whatGuestsExperience: 'Fun schedule layout letting guests know the activities planned.',
        customizableFields: ['Ceremony date', 'Timings', 'Dress code color palette (e.g. pastels)'],
        features: ['Baby-themed icons', 'Dress code pill']
      },
      {
        step: 5,
        title: 'Celebration Venue & Directions',
        badge: 'VENUE',
        phase: 'interaction',
        headline: 'Venue Location with 1-Tap Google Maps',
        description: 'Home or banquet hall address with direct map navigation button.',
        whatGuestsExperience: '1-tap directions straight to the celebration.',
        customizableFields: ['Venue name', 'Full address', 'Google Maps link'],
        features: ['1-Tap GPS Navigation']
      },
      {
        step: 6,
        title: 'RSVP & Heartfelt Wishes for Baby',
        badge: 'RSVP',
        phase: 'interaction',
        headline: 'Guest Headcount & Wishes Guestbook',
        description: 'Guests confirm attendance and write personalized blessing notes for the baby.',
        whatGuestsExperience: 'Simple form with instant WhatsApp forwarding.',
        customizableFields: ['RSVP deadline date', 'Contact numbers'],
        features: ['Headcount submission', 'Wishes guestbook']
      },
      {
        step: 7,
        title: 'Thank You & Shareable Keepsake',
        badge: 'END',
        phase: 'end',
        headline: 'Family Gratitude & Permanent Memory',
        description: 'Closing thank you note from the parents-to-be and permanent shareable link.',
        whatGuestsExperience: 'A digital keepsake parents can cherish forever.',
        customizableFields: ['Thank you message', 'Family names'],
        features: ['WhatsApp share', 'Cloud backup']
      }
    ]
  },

  'summit-invitation.html': {
    openingAction: 'Corporate Executive Wax Seal Melt',
    openingDescription: 'A sleek, minimalist executive envelope sealed with an official emblem. Touching the seal melts it with high-precision physics into the summit hall.',
    steps: [
      {
        step: 1,
        title: 'Executive Seal Melt & Keynote Intro',
        badge: 'START',
        phase: 'start',
        headline: 'Distinguished Executive Entrance',
        description: 'Guests melt the wax seal to open the executive briefing and conference dossier.',
        whatGuestsExperience: 'Sharp, modern corporate reveal with subtle ambient sound.',
        customizableFields: ['Conference name', 'Edition / Year', 'Organizing body logo'],
        features: ['Modern minimalism', 'Emblem seal animation']
      },
      {
        step: 2,
        title: 'The Evening & Executive Overview',
        badge: 'OVERVIEW',
        phase: 'details',
        headline: 'Summit Vision & Welcome Briefing',
        description: 'Executive summary detailing summit goals, industry focus, and delegate profile.',
        whatGuestsExperience: 'Clear, high-impact overview with keynote highlights.',
        customizableFields: ['Summit summary', 'Theme tagline'],
        features: ['Corporate typography', 'Key stats counter']
      },
      {
        step: 3,
        title: 'Programme & Session Schedule',
        badge: 'PROGRAMME',
        phase: 'details',
        headline: 'Comprehensive Summit Timeline',
        description: 'Detailed timetable covering registrations, opening keynote, panel discussions, networking lunch, and gala dinner.',
        whatGuestsExperience: 'Interactive session breakdown with track details and speaker allocations.',
        customizableFields: ['Agenda sessions', 'Timings', 'Hall allocations'],
        features: ['Session timeline', 'Add to calendar']
      },
      {
        step: 4,
        title: 'Keynote Speakers & Panelists',
        badge: 'SPEAKERS',
        phase: 'details',
        headline: 'Distinguished Speaker Lineup',
        description: 'Headshot cards, full names, official designations, and company affiliations of featured speakers.',
        whatGuestsExperience: 'Professional profile cards showcasing thought leaders and industry icons.',
        customizableFields: ['Speaker names', 'Designations', 'Company names', 'Headshot photos'],
        features: ['Speaker avatar cards', 'LinkedIn links']
      },
      {
        step: 5,
        title: 'Partners & Sponsor Ecosystem',
        badge: 'PARTNERS',
        phase: 'details',
        headline: 'Official Partner Showcase',
        description: 'Tiered partner logo wall showcasing Title, Gold, Technology, and Media sponsors.',
        whatGuestsExperience: 'High-visibility sponsor grid with verified partner badges.',
        customizableFields: ['Upload partner & sponsor logos'],
        features: ['Responsive logo grid', 'Partner tiers']
      },
      {
        step: 6,
        title: 'Attire & Access Passes',
        badge: 'ACCESS',
        phase: 'details',
        headline: 'Dress Code & Security Badge Instructions',
        description: 'Business attire guidelines, digital badge QR pickup, and security entry protocols.',
        whatGuestsExperience: 'Clear guest instructions for frictionless event check-in.',
        customizableFields: ['Dress code requirements', 'Badge pickup rules'],
        features: ['Pass instructions', 'QR check-in note']
      },
      {
        step: 7,
        title: 'Delegate Registration & RSVP',
        badge: 'REGISTER',
        phase: 'interaction',
        headline: 'Delegate Attendance Confirmation',
        description: 'Secure registration form for delegates to confirm attendance and dietary preferences.',
        whatGuestsExperience: '1-minute executive confirmation form.',
        customizableFields: ['Registration deadline', 'Secretariat email/phone'],
        features: ['Delegate counter', 'Instant confirmation']
      },
      {
        step: 8,
        title: 'Convention Centre Venue & GPS Navigation',
        badge: 'VENUE',
        phase: 'interaction',
        headline: 'Interactive Convention Location & Directions',
        description: 'Full convention center address, parking details, airport shuttle notes, and Google Maps button.',
        whatGuestsExperience: 'Instant navigation for out-of-town delegates.',
        customizableFields: ['Convention hall name', 'Full address', 'Google Maps link'],
        features: ['GPS navigation', 'Airport transit notes']
      },
      {
        step: 9,
        title: 'Closing Gratitude & Secretariat Contacts',
        badge: 'END',
        phase: 'end',
        headline: 'Organizer Contacts & Permanent Portal',
        description: 'Direct contact info for event secretariat, media inquiries, and permanent event link.',
        whatGuestsExperience: 'Official organizer details with direct email and phone.',
        customizableFields: ['Organizing committee contacts', 'Website link'],
        features: ['1-Tap Share', 'Secure cloud hosting']
      }
    ]
  }
};

/** Default fallbacks tailored by category */
function getCategoryWalkthrough(category: string, title: string): TemplateStepItem[] {
  const cat = category.toLowerCase();
  
  if (cat.includes('wedding') || cat.includes('anniversary')) {
    return [
      {
        step: 1,
        title: 'Grand Interactive Entrance & Doors Reveal',
        badge: 'START',
        phase: 'start',
        headline: '3D Palace Doors / Wax Seal Reveal',
        description: 'Guests touch to unlock or open the royal doors with realistic depth and smooth animation.',
        whatGuestsExperience: 'Immediate wow-factor opening with sound effects and custom monogram.',
        customizableFields: ['Monogram', 'Cover text', 'Entrance subtitle'],
        features: ['3D Door animation', 'Sound effects', 'Interactive touch']
      },
      {
        step: 2,
        title: 'Cinematic Background Music & Audio',
        badge: 'AUDIO',
        phase: 'experience',
        headline: 'Soundtrack of Your Choice',
        description: 'High-quality audio player playing your favorite song or traditional melody.',
        whatGuestsExperience: 'Plays seamlessly with floating mute/unmute control for all guests.',
        customizableFields: ['Your favorite song or MP3 audio'],
        features: ['Audio streaming', 'Mute toggle']
      },
      {
        step: 3,
        title: 'Divine Blessings & Family Welcome',
        badge: 'BLESSINGS',
        phase: 'details',
        headline: 'Sacred Invocations & Warm Greetings',
        description: 'Traditional blessings from elders, shlokas, and formal welcome from both families.',
        whatGuestsExperience: 'Heartfelt, auspicious message setting the tone for the celebration.',
        customizableFields: ['Blessing text', 'Hosts names', 'Family greetings'],
        features: ['Gold calligraphy', 'Auspicious emblem']
      },
      {
        step: 4,
        title: 'Couple Spotlight & Family Lineage',
        badge: 'COUPLE',
        phase: 'details',
        headline: 'Honoring the Bride & Groom',
        description: 'High-resolution couple portrait with names, parents, and family heritage.',
        whatGuestsExperience: 'Dedicated showcase celebrating the couple and their union.',
        customizableFields: ['Couple portrait', 'Full names', 'Family lineages'],
        features: ['Portrait container', 'Family tree notes']
      },
      {
        step: 5,
        title: 'Ceremony Schedule & Auspicious Timings',
        badge: 'SCHEDULE',
        phase: 'details',
        headline: 'Multi-Event Wedding Timeline',
        description: 'Complete breakdown of Muhurtham, Sangeet, Mehendi, Haldi, and Reception timings.',
        whatGuestsExperience: 'Clear chronological schedule so guests never miss an auspicious moment.',
        customizableFields: ['Event names', 'Dates & timings', 'Dress codes'],
        features: ['Ceremony timeline cards', 'Dress code badges']
      },
      {
        step: 6,
        title: 'Wedding Mandapam & Google Maps Navigation',
        badge: 'VENUE',
        phase: 'interaction',
        headline: 'Venue Location & 1-Tap Navigation',
        description: 'Full mandapam address, parking tips, and 1-tap Google Maps directions button.',
        whatGuestsExperience: 'Turn-by-turn GPS navigation straight to the wedding venue.',
        customizableFields: ['Mandapam name', 'Address & landmark', 'Google Maps link'],
        features: ['1-Tap GPS Directions', 'Valet/parking notes']
      },
      {
        step: 7,
        title: 'Pre-Wedding Moments & Photo Gallery',
        badge: 'GALLERY',
        phase: 'experience',
        headline: 'High-Definition Photo Gallery',
        description: 'Swipeable photo carousel displaying the couple’s best memories and engagement pictures.',
        whatGuestsExperience: 'Interactive photo album guests can browse on their phone.',
        customizableFields: ['Upload up to 6 custom couple photos'],
        features: ['Touch swipe carousel', 'High-res display']
      },
      {
        step: 8,
        title: 'Interactive RSVP & Wishes Guestbook',
        badge: 'RSVP',
        phase: 'interaction',
        headline: 'Attendance Headcount & Personal Wishes',
        description: 'Guests confirm attendance and write personalized congratulatory blessings.',
        whatGuestsExperience: 'Quick 30-second form sent straight to hosts via WhatsApp.',
        customizableFields: ['RSVP cutoff date', 'Host contact numbers'],
        features: ['Headcount tally', 'Instant WhatsApp submission']
      },
      {
        step: 9,
        title: 'Digital Keepsake & Permanent Sharing Link',
        badge: 'END',
        phase: 'end',
        headline: 'Hashtag, Closing Gratitude & Keepsake',
        description: 'Official wedding hashtag, live stream links, and a permanent link to cherish forever.',
        whatGuestsExperience: 'A digital heirloom they can revisit anytime.',
        customizableFields: ['Wedding hashtag', 'Thank you note', 'Live-stream link'],
        features: ['1-Tap Link copy', 'Native WhatsApp share']
      }
    ];
  }

  // Default celebrations (Birthday, Traditional, Corporate, etc.)
  return [
    {
      step: 1,
      title: 'Grand Entrance & 3D Interactive Reveal',
      badge: 'START',
      phase: 'start',
      headline: 'Interactive Entrance Animation',
      description: 'Guests tap to trigger an immersive 3D entrance transition with sound effects.',
      whatGuestsExperience: 'Captivating start designed to delight guests upon opening the invitation.',
      customizableFields: ['Event title', 'Cover badge', 'Opening subtitle'],
      features: ['3D Transition', 'Audio chime', 'Interactive touch']
    },
    {
      step: 2,
      title: 'Ambient Music & Audio Player',
      badge: 'AUDIO',
      phase: 'experience',
      headline: 'Soundtrack of Your Choice',
      description: 'High-quality audio playing your celebration soundtrack with volume controls.',
      whatGuestsExperience: 'Sets a festive, premium mood from the very first second.',
      customizableFields: ['Choice of background song or instrumental'],
      features: ['Web Audio API', 'Floating mute button']
    },
    {
      step: 3,
      title: 'Formal Welcome & Event Spotlight',
      badge: 'DETAILS',
      phase: 'details',
      headline: 'Honoring the Host & Occasion',
      description: 'Prominent showcase of the celebrant or hosts with custom welcoming wording.',
      whatGuestsExperience: 'Elegant presentation of the celebration story.',
      customizableFields: ['Host/Celebrant name', 'Personal message', 'Theme title'],
      features: ['Luxury typography', 'Custom badge']
    },
    {
      step: 4,
      title: 'Celebration Timeline & Schedule',
      badge: 'SCHEDULE',
      phase: 'details',
      headline: 'Complete Event Program & Timings',
      description: 'Clear chronological schedule of all activities, rituals, and feast timings.',
      whatGuestsExperience: 'Guests can view exactly when each phase begins.',
      customizableFields: ['Activity timings', 'Program details', 'Dress code theme'],
      features: ['Timeline schedule', 'Theme dress code badge']
    },
    {
      step: 5,
      title: 'Venue Location & 1-Tap Google Maps',
      badge: 'VENUE',
      phase: 'interaction',
      headline: 'Venue Directions & GPS Navigation',
      description: 'Venue address, parking tips, and 1-tap navigation to open directly in Google Maps.',
      whatGuestsExperience: 'Guests get exact navigation with zero hassle.',
      customizableFields: ['Venue name', 'Full address', 'Google Maps link'],
      features: ['1-Tap GPS Navigation', 'Parking notes']
    },
    {
      step: 6,
      title: 'Interactive RSVP & Wishes Registry',
      badge: 'RSVP',
      phase: 'interaction',
      headline: 'Headcount & Guest Greetings',
      description: 'Guests confirm attendance, specify headcount, and write personal greeting messages.',
      whatGuestsExperience: 'Fast 30-second response forwarded directly to you.',
      customizableFields: ['RSVP deadline date', 'Contact numbers'],
      features: ['Headcount selector', 'Instant WhatsApp submission']
    },
    {
      step: 7,
      title: 'Digital Keepsake & Shareable Link',
      badge: 'END',
      phase: 'end',
      headline: 'Event Hashtag & Permanent Keepsake',
      description: 'Closing family gratitude and permanent private link hosted on high-speed cloud.',
      whatGuestsExperience: 'A digital memory that stays active for you and your guests.',
      customizableFields: ['Thank you message', 'Official hashtag'],
      features: ['1-Tap Link copy', 'WhatsApp sharing', '3 Months cloud hosting']
    }
  ];
}

/**
 * Build complete, accurate, start-to-end walkthrough for any template
 */
export function getTemplateWalkthrough(template: {
  filename: string;
  title: string;
  category: string;
  badge?: string;
}): TemplateWalkthrough {
  const fileKey = template.filename.startsWith('http')
    ? template.filename.split('/').pop() || ''
    : template.filename;

  const signature = SIGNATURE_TEMPLATES[fileKey];

  const steps = signature?.steps || getCategoryWalkthrough(template.category, template.title);
  const openingAction = signature?.openingAction || '3D Interactive Door & Curtain Reveal';
  const openingDescription = signature?.openingDescription ||
    'Guests tap to open the 3D interactive invitation with realistic depth, animated entrance effects, and synchronized audio.';

  const highlights = [
    '✨ 100% Mobile & WhatsApp Compatible (No app installation required for guests)',
    '🎵 Background Music Included (Use any song or traditional instrumental)',
    '📍 1-Tap Google Maps Directions (Guests easily navigate directly to the venue)',
    '✍️ Full Customization with your Names, Photos, Timings & Venue',
    '⚡ Fast 24-Hour Express Turnaround by our Studio Designers',
    '♾️ Unlimited Guest Shares via WhatsApp, Instagram & Email',
    '🛡️ 3 Months Guaranteed Cloud Hosting post-event with 2 revision rounds',
  ];

  const techSpecs = [
    { label: 'Technology', value: '3D WebGL / CSS3 60FPS Engine' },
    { label: 'Mobile Compatibility', value: '100% iPhone & Android Optimized' },
    { label: 'Music & Audio', value: 'Synchronized Web Audio Player' },
    { label: 'Maps Integration', value: 'Native Google Maps & Apple Maps' },
    { label: 'RSVP Support', value: 'Interactive Form with WhatsApp Relay' },
    { label: 'Hosting & CDN', value: 'Global High-Speed Cloud CDN' },
    { label: 'Delivery Time', value: '24 to 48 Hours Express Delivery' },
    { label: 'Revisions', value: '2 Complimentary Revision Rounds' },
  ];

  return {
    openingAction,
    openingDescription,
    hasAudio: true,
    audioDescription: 'Background soundtrack plays seamlessly with a floating mute/unmute icon for guest control.',
    totalSteps: steps.length,
    steps,
    highlights,
    techSpecs,
  };
}
