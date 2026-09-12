// National Disaster Response Force (NDRF), SDRF, Coast Guard and Emergency Contacts Database

export const EMERGENCY_HOTLINES = [
  {
    code: "112",
    title: "National Emergency Unified Helpline",
    agency: "Ministry of Home Affairs",
    type: "Police, Fire, Medical, Disaster",
    desc: "Single emergency response number across all states of India.",
    primary: true,
    color: "#dc2626"
  },
  {
    code: "1078",
    title: "NDMA National Disaster Helpline",
    agency: "National Disaster Management Authority",
    type: "Floods, Cyclones, Earthquakes, Landslides",
    desc: "Direct round-the-clock national emergency control room.",
    primary: true,
    color: "#ea580c"
  },
  {
    code: "1070",
    title: "State Relief Commissioner (SDMA)",
    agency: "State Disaster Management Authorities",
    type: "State Level Evacuation & Rescue",
    desc: "Connects directly to the respective State Disaster Control Room.",
    primary: true,
    color: "#0284c7"
  },
  {
    code: "1554",
    title: "Indian Coast Guard (ICG) Search & Rescue",
    agency: "Ministry of Defence",
    type: "Maritime / Fishermen High-Seas SAR",
    desc: "24/7 Maritime Rescue Co-ordination Centres (MRCC Mumbai, Chennai, Port Blair).",
    primary: false,
    color: "#0369a1"
  },
  {
    code: "108",
    title: "Disaster Medical & Emergency Ambulance",
    agency: "National Health Mission",
    type: "Emergency Medical Triage & Evacuation",
    desc: "Immediate mobile ICU and emergency patient transit.",
    primary: false,
    color: "#16a34a"
  },
  {
    code: "011-24363260",
    title: "NDRF HQ 24x7 Operations Room",
    agency: "National Disaster Response Force HQ",
    type: "Disaster Deployment Dispatch",
    desc: "HQ New Delhi specialized search and rescue coordination.",
    primary: false,
    color: "#b91c1c"
  }
];

export const REGIONAL_RESCUE_BATTALIONS = [
  {
    region: "Gujarat & Saurashtra Coastal Belt",
    battalion: "NDRF 6th Battalion (Vadodara & Gandhinagar)",
    dutyOfficer: "+91 265 2830101 / +91 94273 04510",
    specialty: "Flood Inundation & Cyclone Landfall SAR Boats, Deep Divers, Tree Clearance",
    status: "Pre-positioned & High Alert"
  },
  {
    region: "Maharashtra & Konkan Coastal Division",
    battalion: "NDRF 5th Battalion (Pune & Mumbai Base Unit)",
    dutyOfficer: "+91 2114 247000 / +91 94235 73000",
    specialty: "Urban Waterlogging, Ghat Landslide Rescue, Collapsed Structure SAR (CSSR)",
    status: "Active Deployment"
  },
  {
    region: "Odisha & Andhra Pradesh Coastal Corridors",
    battalion: "NDRF 3rd Bn (Mundali) & 10th Bn (Guntur)",
    dutyOfficer: "+91 671 2879710 / +91 863 2293100",
    specialty: "Bay of Bengal Cyclone Storm Surge Evacuation, Inflatable Zodiac Boats",
    status: "Standby with 18 Flood Rescue Teams"
  },
  {
    region: "Uttarakhand & Himachal Himalayan Region",
    battalion: "NDRF 8th Bn (Ghaziabad / Dehradun Base) & SDRF UK",
    dutyOfficer: "+91 135 2710334 / +91 94111 12973",
    specialty: "High-Altitude Mountain Rescue, Flash Flood Swift Water, Cloudburst Response",
    status: "24x7 Heli-Rescue Standby"
  },
  {
    region: "Assam & North-East Riverine Valleys",
    battalion: "NDRF 1st Battalion (Guwahati)",
    dutyOfficer: "+91 361 2840027 / +91 94351 17246",
    specialty: "Brahmaputra Basin Flood Relief, Submersible Rescue, Medical First Responders",
    status: "Operational"
  }
];

export const DISASTER_SURVIVAL_GUIDELINES = {
  cyclone: [
    "Board up windows, secure loose rooftop tins, solar panels and hoardings.",
    "Disconnect electrical mains and gas cylinders before landfall.",
    "Keep emergency battery torches, canned food, clean potable water and medicines handy.",
    "Do NOT venture outside when the 'Eye of the Cyclone' passes (winds calm temporarily, then reverse with extreme ferocity)."
  ],
  flood: [
    "Never attempt to walk, swim, or drive through flowing floodwaters ('Turn Around, Don't Drown').",
    "Move to upper floors or designated relief shelters immediately upon Red Alert issuance.",
    "Boil drinking water or use water purification tablets to prevent waterborne contamination.",
    "Watch out for snakes and poisonous reptiles seeking refuge on higher dry ground."
  ],
  lightning: [
    "Follow the 30-30 Rule: If time between lightning flash and thunder is < 30 seconds, seek substantial indoor shelter.",
    "Stay away from tall solitary trees, metal fences, cell towers, and water bodies.",
    "If caught in open field with no shelter: Crouch low on balls of your feet with hands on knees (do not lie flat)."
  ]
};
