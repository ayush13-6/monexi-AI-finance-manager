import { NextResponse } from "next/server";

// ✅ TEST KEYS (Sandbox)
const AMADEUS_CLIENT_ID = process.env.AMADEUS_CLIENT_ID || "GhXW2e1SI7sALsAkyII5jE0ZpOGIaKin";
const AMADEUS_CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET || "rSfpk3GhU0xlzzcI";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") || "DEL";
  const dest = searchParams.get("dest") || "BOM";
  const date = searchParams.get("date") || "2025-12-31";

  // 1. HELPER: Auth Token (Test Environment)
  const getAuthToken = async () => {
    try {
      const res = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=client_credentials&client_id=${AMADEUS_CLIENT_ID}&client_secret=${AMADEUS_CLIENT_SECRET}`,
      });
      const data = await res.json();
      return data.access_token;
    } catch (e) { return null; }
  };

  // 2. HELPER: Smart Mapper (Codes)
  const getIataCode = (city: string) => {
    const c = city.toLowerCase().trim();
    if (c.includes("patna")) return "PAT";
    if (c.includes("dehradun")) return "DED";
    if (c.includes("delhi")) return "DEL";
    if (c.includes("mumbai")) return "BOM";
    if (c.includes("bangalore")) return "BLR";
    if (c.includes("ranchi")) return "IXR";
    if (c.includes("goa")) return "GOI";
    return "DEL";
  };

  // 3. LOGIC: Realistic Data Generator
 
  const generateMarketFlights = (basePrice: number) => {
    return [
      {
        id: "gen-1", airline: "IndiGo", code: "6E-741",
        time: "10:30 - 12:45", duration: "2h 15m",
        price: Math.round(basePrice * 0.90), // Thoda sasta
        logo: "blue", type: "Non-stop"
      },
      {
        id: "gen-2", airline: "Vistara", code: "UK-889",
        time: "15:00 - 17:20", duration: "2h 20m",
        price: Math.round(basePrice * 1.10), // Premium
        logo: "purple", type: "Non-stop"
      },
      {
        id: "gen-3", airline: "SpiceJet", code: "SG-224",
        time: "19:15 - 21:30", duration: "2h 15m",
        price: Math.round(basePrice * 0.85), // Budget
        logo: "red", type: "Non-stop"
      }
    ];
  };

  try {
    const token = await getAuthToken();
    const originCode = getIataCode(from);
    const destCode = getIataCode(dest);
    
    console.log(`🔎 SEARCHING (Hybrid Mode): ${originCode} -> ${destCode}`);

    let flights: any[] = [];
    let marketPrice = 5500; // Default price agar API fail ho

    // 4. API CALL (Test Environment)
    if (token) {
      const url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originCode}&destinationLocationCode=${destCode}&departureDate=${date}&adults=1&max=5&currencyCode=INR`;
      
      const response = await fetch(url, { headers: { "Authorization": `Bearer ${token}` } });
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        // Real Data Process Karo
        flights = data.data.map((offer: any) => {
          const price = parseFloat(offer.price.total);
          marketPrice = price; // Reference ke liye save kar lo
          const seg = offer.itineraries[0].segments[0];
          
          return {
            id: offer.id,
            airline: "Air India", // Sandbox mostly AI deta hai
            code: `${seg.carrierCode}-${seg.number}`,
            time: `${seg.departure.at.split('T')[1].slice(0,5)} - ${seg.arrival.at.split('T')[1].slice(0,5)}`,
            duration: offer.itineraries[0].duration.slice(2).toLowerCase().replace('h', 'h ').replace('m', 'm'),
            price: Math.round(price),
            logo: "orange",
            type: "Non-stop"
          };
        });
      }
    }

    // 5. HYBRID MERGE
    
    if (flights.length < 3) {
      const extraFlights = generateMarketFlights(marketPrice);
      flights = [...flights, ...extraFlights];
    }

    
    flights.sort((a, b) => a.price - b.price);

    return NextResponse.json({ flights });

  } catch (error) {
    console.error("Hybrid Engine Error:", error);
    
    return NextResponse.json({ 
      flights: generateMarketFlights(6000) 
    });
  }
}