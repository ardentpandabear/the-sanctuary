import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Sun, 
  Moon, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  Snowflake, 
  Thermometer, 
  Wind, 
  Droplets, 
  RefreshCw, 
  MapPin, 
  ArrowRightLeft,
  Sparkles
} from 'lucide-react';

interface CityData {
  cityName: string;
  nativeName: string;
  country: string;
  countryFlag: string;
  timezone: string;
  lat: number;
  lon: number;
  partnerTag: string;
  partnerAvatar?: string;
  defaultTemp: number;
  defaultCondition: string;
  defaultHumidity: number;
  defaultWind: number;
  defaultCode: number;
}

const CITIES: { [key: string]: CityData } = {
  allahabad: {
    cityName: 'Allahabad',
    nativeName: 'Prayagraj',
    country: 'India',
    countryFlag: '🇮🇳',
    timezone: 'Asia/Kolkata',
    lat: 25.4358,
    lon: 81.8463,
    partnerTag: 'Sofs’ City',
    defaultTemp: 32,
    defaultCondition: 'Sunny & Warm',
    defaultHumidity: 62,
    defaultWind: 11,
    defaultCode: 0,
  },
  birmingham: {
    cityName: 'Birmingham',
    nativeName: 'Birmingham, UK',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    timezone: 'Europe/London',
    lat: 52.4862,
    lon: -1.8904,
    partnerTag: 'Mumu’ City',
    defaultTemp: 18,
    defaultCondition: 'Partly Cloudy',
    defaultHumidity: 74,
    defaultWind: 14,
    defaultCode: 2,
  },
};

interface WeatherState {
  temp: number;
  humidity: number;
  wind: number;
  weatherCode: number;
  conditionText: string;
  isLoading: boolean;
  error: boolean;
  lastUpdated: string;
}

export const CityTimeWeatherWidget: React.FC = () => {
  // Live ticking times
  const [allahabadTime, setAllahabadTime] = useState<{ timeStr: string; dateStr: string; isNight: boolean }>({
    timeStr: '--:--:--',
    dateStr: '',
    isNight: false,
  });

  const [birminghamTime, setBirminghamTime] = useState<{ timeStr: string; dateStr: string; isNight: boolean }>({
    timeStr: '--:--:--',
    dateStr: '',
    isNight: false,
  });

  const [timeDiffText, setTimeDiffText] = useState<string>('');

  // Weather state for both cities
  const [weatherData, setWeatherData] = useState<{ [key: string]: WeatherState }>({
    allahabad: {
      temp: CITIES.allahabad.defaultTemp,
      humidity: CITIES.allahabad.defaultHumidity,
      wind: CITIES.allahabad.defaultWind,
      weatherCode: CITIES.allahabad.defaultCode,
      conditionText: CITIES.allahabad.defaultCondition,
      isLoading: false,
      error: false,
      lastUpdated: 'Just now',
    },
    birmingham: {
      temp: CITIES.birmingham.defaultTemp,
      humidity: CITIES.birmingham.defaultHumidity,
      wind: CITIES.birmingham.defaultWind,
      weatherCode: CITIES.birmingham.defaultCode,
      conditionText: CITIES.birmingham.defaultCondition,
      isLoading: false,
      error: false,
      lastUpdated: 'Just now',
    },
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update clocks every second
  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();

      // Allahabad Time
      try {
        const timeStr = now.toLocaleTimeString('en-US', {
          timeZone: CITIES.allahabad.timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });
        const dateStr = now.toLocaleDateString('en-US', {
          timeZone: CITIES.allahabad.timezone,
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });
        
        const hour = parseInt(
          now.toLocaleTimeString('en-US', { timeZone: CITIES.allahabad.timezone, hour: '2-digit', hour12: false }),
          10
        );
        const isNight = hour < 6 || hour >= 19;

        setAllahabadTime({ timeStr, dateStr, isNight });
      } catch (e) {
        console.error(e);
      }

      // Birmingham Time
      try {
        const timeStr = now.toLocaleTimeString('en-US', {
          timeZone: CITIES.birmingham.timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });
        const dateStr = now.toLocaleDateString('en-US', {
          timeZone: CITIES.birmingham.timezone,
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });

        const hour = parseInt(
          now.toLocaleTimeString('en-US', { timeZone: CITIES.birmingham.timezone, hour: '2-digit', hour12: false }),
          10
        );
        const isNight = hour < 6 || hour >= 20;

        setBirminghamTime({ timeStr, dateStr, isNight });
      } catch (e) {
        console.error(e);
      }

      // Compute offset difference
      try {
        const getOffsetMinutes = (tz: string) => {
          const date = new Date();
          const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
          const tzDate = new Date(date.toLocaleString('en-US', { timeZone: tz }));
          return (tzDate.getTime() - utcDate.getTime()) / 60000;
        };

        const diffMinutes = getOffsetMinutes(CITIES.allahabad.timezone) - getOffsetMinutes(CITIES.birmingham.timezone);
        const hours = Math.floor(Math.abs(diffMinutes) / 60);
        const mins = Math.abs(diffMinutes) % 60;
        
        let text = '';
        if (diffMinutes > 0) {
          text = `Allahabad is ${hours}h ${mins ? `${mins}m ` : ''}ahead of Birmingham`;
        } else if (diffMinutes < 0) {
          text = `Birmingham is ${hours}h ${mins ? `${mins}m ` : ''}ahead of Allahabad`;
        } else {
          text = `Both cities are in the same time zone`;
        }
        setTimeDiffText(text);
      } catch (e) {
        setTimeDiffText('Allahabad is 4h 30m ahead of Birmingham');
      }
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch weather from Open-Meteo
  const fetchCityWeather = async (cityKey: 'allahabad' | 'birmingham') => {
    const city = CITIES[cityKey];
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=${encodeURIComponent(
          city.timezone
        )}`
      );
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      if (data && data.current) {
        const temp = Math.round(data.current.temperature_2m);
        const humidity = Math.round(data.current.relative_humidity_2m || city.defaultHumidity);
        const wind = Math.round(data.current.wind_speed_10m || city.defaultWind);
        const code = data.current.weather_code ?? 0;
        const conditionText = getWeatherTextFromCode(code);

        setWeatherData(prev => ({
          ...prev,
          [cityKey]: {
            temp,
            humidity,
            wind,
            weatherCode: code,
            conditionText,
            isLoading: false,
            error: false,
            lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        }));
      }
    } catch (err) {
      console.warn(`Could not fetch live weather for ${cityKey}, using standard estimates.`, err);
    }
  };

  const fetchAllWeather = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchCityWeather('allahabad'), fetchCityWeather('birmingham')]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    fetchAllWeather();
  }, []);

  // Helper for weather icons and text
  const getWeatherTextFromCode = (code: number): string => {
    if (code === 0) return 'Clear Skies';
    if (code >= 1 && code <= 3) return 'Partly Cloudy';
    if (code === 45 || code === 48) return 'Misty / Foggy';
    if (code >= 51 && code <= 67) return 'Gentle Rain';
    if (code >= 71 && code <= 77) return 'Snowy';
    if (code >= 80 && code <= 82) return 'Rain Showers';
    if (code >= 95) return 'Thunderstorm';
    return 'Pleasant';
  };

  const renderWeatherIcon = (code: number, isNight: boolean) => {
    if (code === 0) {
      return isNight ? <Moon className="w-6 h-6 text-[#f3e7c4]" /> : <Sun className="w-6 h-6 text-amber-400 animate-spin-slow" />;
    }
    if (code >= 1 && code <= 3) {
      return isNight ? <Cloud className="w-6 h-6 text-slate-300" /> : <CloudSun className="w-6 h-6 text-amber-300" />;
    }
    if (code >= 51 && code <= 82) {
      return <CloudRain className="w-6 h-6 text-cyan-400" />;
    }
    if (code >= 95) {
      return <CloudLightning className="w-6 h-6 text-amber-300" />;
    }
    if (code >= 71 && code <= 77) {
      return <Snowflake className="w-6 h-6 text-sky-200" />;
    }
    return <Sun className="w-6 h-6 text-amber-400" />;
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#d4af37]/25 relative overflow-hidden bg-gradient-to-br from-[#161822] via-[#12141d] to-[#1a1712] shadow-2xl space-y-6">
      
      {/* Background Accent Glows */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-60 h-60 bg-[#4a321a]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#d4af37]/15 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs text-[#d4af37] font-semibold uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4" />
            <span>Dual World Clocks & Live Climate</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-semibold text-[#fff8e7] flex items-center gap-2">
            Allahabad <span className="text-[#d4af37] font-serif italic text-base">vs</span> Birmingham
          </h3>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#1e212d]/80 border border-[#d4af37]/30 text-xs text-[#d4af37]">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span className="font-medium text-[11px] sm:text-xs">{timeDiffText || '4h 30m Time Difference'}</span>
          </div>

          <button
            onClick={fetchAllWeather}
            disabled={isRefreshing}
            title="Refresh Live Weather"
            className="p-2 rounded-xl bg-[#1e202d] border border-[#d4af37]/30 text-[#f3e7c4] hover:text-[#d4af37] hover:border-[#d4af37] transition cursor-pointer shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#d4af37]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Two Cities Side by Side Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CITY 1: ALLAHABAD */}
        <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-b from-[#1c1d29]/90 to-[#12141d]/90 border border-[#d4af37]/20 hover:border-[#d4af37]/40 transition space-y-4 shadow-lg group">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="text-2xl">{CITIES.allahabad.countryFlag}</span>
              <div>
                <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/15 text-[#d4af37] text-[10px] font-semibold uppercase border border-[#d4af37]/20">
                  {CITIES.allahabad.partnerTag}
                </span>
                <h4 className="text-xl font-display font-bold text-[#fff8e7] mt-0.5">
                  {CITIES.allahabad.cityName} <span className="text-xs font-sans font-normal text-[#a39780]">({CITIES.allahabad.nativeName})</span>
                </h4>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-[#222533] border border-[#d4af37]/20 shadow-inner">
              {renderWeatherIcon(weatherData.allahabad.weatherCode, allahabadTime.isNight)}
            </div>
          </div>

          {/* Time Display */}
          <div className="space-y-0.5 pt-1">
            <div className="text-3xl sm:text-4xl font-mono font-bold text-[#f3e7c4] tracking-tight flex items-baseline justify-between">
              <span>{allahabadTime.timeStr}</span>
              <span className="text-xs font-sans font-medium text-[#d4af37] uppercase bg-[#181a24] px-2 py-0.5 rounded-md border border-[#d4af37]/20">IST</span>
            </div>
            <p className="text-xs text-[#a39780] font-sans flex items-center justify-between">
              <span>📅 {allahabadTime.dateStr}</span>
              <span>{allahabadTime.isNight ? '🌙 Nighttime' : '☀️ Daylight'}</span>
            </p>
          </div>

          {/* Temperature & Conditions */}
          <div className="pt-3 border-t border-[#d4af37]/15 grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-[#141620] border border-[#d4af37]/15 space-y-1">
              <span className="text-[10px] text-[#a39780] uppercase tracking-wider block">Temperature</span>
              <div className="text-xl font-bold text-[#fff8e7] flex items-center space-x-1">
                <Thermometer className="w-4 h-4 text-[#d4af37]" />
                <span>{weatherData.allahabad.temp}°C</span>
              </div>
              <span className="text-[10px] text-[#d4af37] block font-serif italic truncate">{weatherData.allahabad.conditionText}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#141620] border border-[#d4af37]/15 space-y-1">
              <span className="text-[10px] text-[#a39780] uppercase tracking-wider block">Atmosphere</span>
              <div className="flex items-center justify-between text-[11px] text-[#c8bfab]">
                <span className="flex items-center gap-1"><Droplets className="w-3 h-3 text-cyan-400" /> {weatherData.allahabad.humidity}%</span>
                <span className="flex items-center gap-1"><Wind className="w-3 h-3 text-emerald-400" /> {weatherData.allahabad.wind}km/h</span>
              </div>
              <span className="text-[9px] text-[#736a58] block truncate pt-0.5">Updated {weatherData.allahabad.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* CITY 2: BIRMINGHAM */}
        <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-b from-[#1c1d29]/90 to-[#12141d]/90 border border-[#d4af37]/20 hover:border-[#d4af37]/40 transition space-y-4 shadow-lg group">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="text-2xl">{CITIES.birmingham.countryFlag}</span>
              <div>
                <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/15 text-[#d4af37] text-[10px] font-semibold uppercase border border-[#d4af37]/20">
                  {CITIES.birmingham.partnerTag}
                </span>
                <h4 className="text-xl font-display font-bold text-[#fff8e7] mt-0.5">
                  {CITIES.birmingham.cityName} <span className="text-xs font-sans font-normal text-[#a39780]">(UK)</span>
                </h4>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-[#222533] border border-[#d4af37]/20 shadow-inner">
              {renderWeatherIcon(weatherData.birmingham.weatherCode, birminghamTime.isNight)}
            </div>
          </div>

          {/* Time Display */}
          <div className="space-y-0.5 pt-1">
            <div className="text-3xl sm:text-4xl font-mono font-bold text-[#f3e7c4] tracking-tight flex items-baseline justify-between">
              <span>{birminghamTime.timeStr}</span>
              <span className="text-xs font-sans font-medium text-[#d4af37] uppercase bg-[#181a24] px-2 py-0.5 rounded-md border border-[#d4af37]/20">UK</span>
            </div>
            <p className="text-xs text-[#a39780] font-sans flex items-center justify-between">
              <span>📅 {birminghamTime.dateStr}</span>
              <span>{birminghamTime.isNight ? '🌙 Nighttime' : '☀️ Daylight'}</span>
            </p>
          </div>

          {/* Temperature & Conditions */}
          <div className="pt-3 border-t border-[#d4af37]/15 grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-[#141620] border border-[#d4af37]/15 space-y-1">
              <span className="text-[10px] text-[#a39780] uppercase tracking-wider block">Temperature</span>
              <div className="text-xl font-bold text-[#fff8e7] flex items-center space-x-1">
                <Thermometer className="w-4 h-4 text-[#d4af37]" />
                <span>{weatherData.birmingham.temp}°C</span>
              </div>
              <span className="text-[10px] text-[#d4af37] block font-serif italic truncate">{weatherData.birmingham.conditionText}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#141620] border border-[#d4af37]/15 space-y-1">
              <span className="text-[10px] text-[#a39780] uppercase tracking-wider block">Atmosphere</span>
              <div className="flex items-center justify-between text-[11px] text-[#c8bfab]">
                <span className="flex items-center gap-1"><Droplets className="w-3 h-3 text-cyan-400" /> {weatherData.birmingham.humidity}%</span>
                <span className="flex items-center gap-1"><Wind className="w-3 h-3 text-emerald-400" /> {weatherData.birmingham.wind}km/h</span>
              </div>
              <span className="text-[9px] text-[#736a58] block truncate pt-0.5">Updated {weatherData.birmingham.lastUpdated}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Love Note */}
      <div className="relative z-10 flex items-center justify-between text-xs text-[#c8bfab] pt-2 border-t border-[#d4af37]/10 font-serif italic">
        <span className="flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>"Miles apart under the same sun and stars — connected by heartbeats."</span>
        </span>
        <span className="hidden sm:inline-block text-[#d4af37] font-sans text-[11px]">
          Allahabad ✈️ Birmingham
        </span>
      </div>

    </div>
  );
};
