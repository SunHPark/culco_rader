import { NextResponse } from "next/server";

function getDropsData() {
  const today = new Date();
  
  const generateDate = (daysFromNow) => {
    const date = new Date(today);
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split("T")[0];
  };

  return [
    {
      id: 1,
      date: generateDate(2),
      title: "Pokemon TCG: Prismatic Evolutions",
      platform: "Pokemon Center",
      type: "New Set",
      hot: true,
      category: "pokemon",
      region: "Global",
    },
    {
      id: 2,
      date: generateDate(4),
      title: "Charizard ex Premium Collection",
      platform: "Target / Walmart / Amazon",
      type: "Limited",
      hot: true,
      category: "pokemon",
      region: "NA",
      msrp: "$49.99",
    },
    {
      id: 3,
      date: generateDate(5),
      title: "Journey Together Booster Box",
      platform: "Pokemon Center Japan",
      type: "New Set",
      hot: false,
      category: "pokemon",
      region: "JP",
      msrp: "¥5,400",
    },
    {
      id: 4,
      date: generateDate(7),
      title: "Scarlet & Violet 151 Restock",
      platform: "Amazon / GameStop",
      type: "Restock",
      hot: true,
      category: "pokemon",
      region: "Global",
      notes: "ETB, Booster Bundle included",
    },
    {
      id: 5,
      date: generateDate(9),
      title: "Crown Zenith Elite Trainer Box",
      platform: "Best Buy",
      type: "Restock",
      hot: false,
      category: "pokemon",
      region: "NA",
    },
    {
      id: 6,
      date: generateDate(10),
      title: "Pikachu VMAX Figure Collection",
      platform: "Pokemon Center",
      type: "Limited",
      hot: true,
      category: "pokemon",
      region: "Global",
      msrp: "$34.99",
    },
    {
      id: 7,
      date: generateDate(12),
      title: "Temporal Forces Booster Box",
      platform: "Multiple Retailers",
      type: "Regular",
      hot: false,
      category: "pokemon",
      region: "Global",
    },
    {
      id: 8,
      date: generateDate(14),
      title: "Paldean Fates ETB Restock",
      platform: "Costco / Sam's Club",
      type: "Restock",
      hot: true,
      category: "pokemon",
      region: "NA",
      notes: "Mass restock expected",
    },
  ];
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days")) || 14;
    const category = searchParams.get("category") || "all";
    const region = searchParams.get("region") || "all";

    let drops = getDropsData();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + days);

    drops = drops.filter((drop) => {
      const dropDate = new Date(drop.date);
      return dropDate >= today && dropDate <= endDate;
    });

    if (category !== "all") {
      drops = drops.filter((drop) => drop.category === category);
    }

    if (region !== "all") {
      drops = drops.filter(
        (drop) => drop.region === region || drop.region === "Global"
      );
    }

    drops.sort((a, b) => new Date(a.date) - new Date(b.date));

    return NextResponse.json({
      success: true,
      data: drops,
      filters: { days, category, region },
      totalCount: drops.length,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Drops API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    const newDrop = {
      id: Date.now(),
      ...body,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Drop schedule added successfully",
      data: newDrop,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
