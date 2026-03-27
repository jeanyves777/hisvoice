const GEO_API_URL = process.env.GEO_API_URL || "http://ip-api.com/json";

interface GeoData {
  country: string | null;
  city: string | null;
  region: string | null;
  lat: number | null;
  lng: number | null;
  isp: string | null;
  timezone: string | null;
}

export async function getGeoFromIp(ip: string): Promise<GeoData> {
  const empty: GeoData = {
    country: null,
    city: null,
    region: null,
    lat: null,
    lng: null,
    isp: null,
    timezone: null,
  };

  if (!ip || ip === "unknown" || ip === "127.0.0.1" || ip === "::1") {
    return empty;
  }

  try {
    const res = await fetch(`${GEO_API_URL}/${ip}?fields=status,country,regionName,city,lat,lon,isp,timezone`, {
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) return empty;

    const data = await res.json();
    if (data.status !== "success") return empty;

    return {
      country: data.country ?? null,
      city: data.city ?? null,
      region: data.regionName ?? null,
      lat: data.lat ?? null,
      lng: data.lon ?? null,
      isp: data.isp ?? null,
      timezone: data.timezone ?? null,
    };
  } catch {
    return empty;
  }
}
