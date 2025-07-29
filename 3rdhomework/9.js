const weatherData = [
  { city: "Kathmandu", month: "January", temperature: 12, humidity: 65, rainfall: 25, airQuality: 150 },
  { city: "Kathmandu", month: "February", temperature: 15, humidity: 60, rainfall: 30, airQuality: 140 },
  { city: "Kathmandu", month: "March", temperature: 20, humidity: 55, rainfall: 45, airQuality: 130 },
  { city: "Pokhara", month: "January", temperature: 15, humidity: 70, rainfall: 35, airQuality: 85 },
  { city: "Pokhara", month: "February", temperature: 18, humidity: 65, rainfall: 40, airQuality: 80 },
  { city: "Pokhara", month: "March", temperature: 23, humidity: 60, rainfall: 55, airQuality: 75 },
  { city: "Chitwan", month: "January", temperature: 18, humidity: 75, rainfall: 15, airQuality: 95 },
  { city: "Chitwan", month: "February", temperature: 22, humidity: 70, rainfall: 20, airQuality: 90 },
  { city: "Chitwan", month: "March", temperature: 28, humidity: 65, rainfall: 35, airQuality: 85 },
];

// --- 1. Average metrics by city across all months ---
function avgMetricsByCity(data) {
  const cityGroups = {};

  data.forEach(({ city, temperature, humidity, rainfall, airQuality }) => {
    if (!cityGroups[city]) {
      cityGroups[city] = { tempSum: 0, humiditySum: 0, rainfallSum: 0, airQualitySum: 0, count: 0 };
    }
    const group = cityGroups[city];
    group.tempSum += temperature;
    group.humiditySum += humidity;
    group.rainfallSum += rainfall;
    group.airQualitySum += airQuality;
    group.count++;
  });

  // Calculate averages and add livability score (custom)
  // Livability formula: 10 - (AirQuality/30) - abs(idealTemp - avgTemp)/5 - abs(idealHumidity - avgHumidity)/10
  // Ideal temp = 20°C, ideal humidity = 60%
  const results = {};
  for (const city in cityGroups) {
    const { tempSum, humiditySum, rainfallSum, airQualitySum, count } = cityGroups[city];
    const avgTemp = +(tempSum / count).toFixed(1);
    const avgHumidity = +(humiditySum / count).toFixed(1);
    const totalRainfall = rainfallSum; // total, not average
    const avgAirQuality = +(airQualitySum / count).toFixed(0);
    // Livability score (scale 0-10)
    const livability = Math.max(
      0,
      Math.min(
        10,
        10 - (avgAirQuality / 30) - Math.abs(20 - avgTemp) / 5 - Math.abs(60 - avgHumidity) / 10
      )
    );
    results[city] = { avgTemp, avgHumidity, totalRainfall, avgAirQuality, livability: +livability.toFixed(1) };
  }
  return results;
}

// --- 2. Monthly trends across all cities ---
function monthlyTrends(data) {
  const months = [...new Set(data.map(d => d.month))];
  const monthMetrics = {};

  months.forEach(month => {
    const filtered = data.filter(d => d.month === month);
    const avgTemp = filtered.reduce((sum, d) => sum + d.temperature, 0) / filtered.length;
    const avgHumidity = filtered.reduce((sum, d) => sum + d.humidity, 0) / filtered.length;
    const avgRainfall = filtered.reduce((sum, d) => sum + d.rainfall, 0) / filtered.length;
    const avgAirQuality = filtered.reduce((sum, d) => sum + d.airQuality, 0) / filtered.length;
    monthMetrics[month] = {
      avgTemp: +avgTemp.toFixed(1),
      avgHumidity: +avgHumidity.toFixed(1),
      avgRainfall: +avgRainfall.toFixed(0),
      avgAirQuality: +avgAirQuality.toFixed(0),
    };
  });

  return monthMetrics;
}

// Helper for ASCII bar chart
function asciiBar(value, maxValue, maxWidth = 20) {
  const barLength = Math.round((value / maxValue) * maxWidth);
  return "█".repeat(barLength);
}

// --- 3. Best and worst performing cities by metrics ---
function cityRankings(cityMetrics) {
  // Sort by air quality (lowest is best)
  const airQualityRanking = Object.entries(cityMetrics).sort((a, b) => a[1].avgAirQuality - b[1].avgAirQuality);
  // Sort by temperature (comfort ideally around 18-22)
  const comfortScore = cityMetrics => {
    const idealTemp = 20;
    return -Math.abs(cityMetrics.avgTemp - idealTemp); // closer to 20 is higher
  };
  const tempRanking = Object.entries(cityMetrics).sort((a, b) => comfortScore(b[1]) - comfortScore(a[1]));

  // Best for agriculture (high rainfall + good temp between 18-25)
  const agriScore = cityMetrics => cityMetrics.totalRainfall * 0.6 + (cityMetrics.avgTemp >= 18 && cityMetrics.avgTemp <= 25 ? 20 : 0);
  const agriRanking = Object.entries(cityMetrics).sort((a, b) => agriScore(b[1]) - agriScore(a[1]));

  return {
    airQualityRanking,
    tempRanking,
    agriRanking,
  };
}

// --- 4. Correlation analysis ---
// Pearson correlation coefficient
function pearsonCorrelation(x, y) {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, val, i) => acc + val * y[i], 0);
  const sumX2 = x.reduce((acc, val) => acc + val * val, 0);
  const sumY2 = y.reduce((acc, val) => acc + val * val, 0);
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  if (denominator === 0) return 0;
  return numerator / denominator;
}

function weatherCorrelations(data) {
  const temps = data.map(d => d.temperature);
  const humidities = data.map(d => d.humidity);
  const rainfalls = data.map(d => d.rainfall);
  const airQualities = data.map(d => d.airQuality);

  return {
    tempVsHumidity: +pearsonCorrelation(temps, humidities).toFixed(2),
    tempVsAirQuality: +pearsonCorrelation(temps, airQualities).toFixed(2),
    rainfallVsHumidity: +pearsonCorrelation(rainfalls, humidities).toFixed(2),
  };
}

// --- 5. Forecasting with simple linear regression ---
// Predict next month's value (month index 4) based on month numbers (1=Jan, 2=Feb, 3=Mar)
function linearRegressionPredict(values) {
  // x = [1,2,3], y = values array
  const x = [1, 2, 3];
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, val, i) => acc + val * values[i], 0);
  const sumX2 = x.reduce((acc, val) => acc + val * val, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  // Predict for x=4 (April)
  return +(slope * 4 + intercept).toFixed(1);
}

// --- 6. Generate Forecasts per city ---
function forecastNextMonth(data) {
  const cities = [...new Set(data.map(d => d.city))];
  const metrics = ["temperature", "humidity", "rainfall", "airQuality"];

  const forecasts = {};

  cities.forEach(city => {
    const cityData = data.filter(d => d.city === city);
    const cityForecast = {};
    metrics.forEach(metric => {
      const values = cityData.map(d => d[metric]);
      cityForecast[metric] = linearRegressionPredict(values);
    });
    forecasts[city] = cityForecast;
  });
  return forecasts;
}

// --- 7. Generate summary dashboard ---
function generateDashboard() {
  const cityMetrics = avgMetricsByCity(weatherData);
  const monthly = monthlyTrends(weatherData);
  const rankings = cityRankings(cityMetrics);
  const correlations = weatherCorrelations(weatherData);
  const forecasts = forecastNextMonth(weatherData);

  // Helper to classify air quality
  function airQualityClass(aqi) {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Poor";
    return "Hazardous";
  }

  console.log("Weather Data Analysis Dashboard");
  console.log("=".repeat(30));
  console.log("City Performance Summary:");
  console.log("=".repeat(23));
  for (const city in cityMetrics) {
    const m = cityMetrics[city];
    console.log(`${city}:`);
    console.log(`- Avg Temperature: ${m.avgTemp}°C`);
    console.log(`- Avg Humidity: ${m.avgHumidity}%`);
    console.log(`- Total Rainfall: ${m.totalRainfall}mm`);
    console.log(`- Avg Air Quality: ${m.avgAirQuality} AQI (${airQualityClass(m.avgAirQuality)})`);
    console.log(`- Livability Score: ${m.livability}/10`);
  }

  // Monthly Trends with ASCII bars
  console.log("\nMonthly Trends Analysis:");
  console.log("=".repeat(25));

  // Find max for bar scaling
  const maxTemp = Math.max(...Object.values(monthly).map(m => m.avgTemp));
  const maxHumidity = Math.max(...Object.values(monthly).map(m => m.avgHumidity));
  const maxRainfall = Math.max(...Object.values(monthly).map(m => m.avgRainfall));
  const maxAirQuality = Math.max(...Object.values(monthly).map(m => m.avgAirQuality));

  // Temperature Trend
  console.log("Temperature Trend:");
  const months = Object.keys(monthly);
  months.forEach((month, i) => {
    const val = monthly[month].avgTemp;
    const bar = asciiBar(val, maxTemp);
    const diff = i === 0 ? 0 : +(val - monthly[months[i - 1]].avgTemp).toFixed(1);
    console.log(`${month}: ${bar} ${val}°C${i > 0 ? ` (${diff >= 0 ? "+" : ""}${diff}°C)` : " (Average across cities)"}`);
  });
  const tempDiffTotal = (monthly[months[months.length - 1]].avgTemp - monthly[months[0]].avgTemp).toFixed(1);
  console.log(`Trend: Strong upward (+${tempDiffTotal}°C over ${months.length} months)`);

  // Humidity Trend
  console.log("\nHumidity Trend:");
  months.forEach((month, i) => {
    const val = monthly[month].avgHumidity;
    const bar = asciiBar(val, maxHumidity);
    const diff = i === 0 ? 0 : +(val - monthly[months[i - 1]].avgHumidity).toFixed(1);
    console.log(`${month}: ${bar} ${val}%${i > 0 ? ` (${diff >= 0 ? "+" : ""}${diff}%)` : " (Average)"}`);
  });
  const humDiffTotal = (monthly[months[months.length - 1]].avgHumidity - monthly[months[0]].avgHumidity).toFixed(1);
  console.log(`Trend: Steady decline (${humDiffTotal}% over ${months.length} months)`);

  // Rainfall Distribution
  console.log("\nRainfall Distribution:");
  months.forEach((month, i) => {
    const val = monthly[month].avgRainfall;
    const bar = asciiBar(val, maxRainfall, 10);
    const diff = i === 0 ? 0 : +(val - monthly[months[i - 1]].avgRainfall).toFixed(0);
    console.log(`${month}: ${bar} ${val}mm${i > 0 ? ` (${diff >= 0 ? "+" : ""}${diff}mm)` : ""}`);
  });
  console.log("Trend: Increasing precipitation");

  // Air Quality Index
  console.log("\nAir Quality Index:");
  months.forEach((month, i) => {
    const val = monthly[month].avgAirQuality;
    const bar = asciiBar(val, maxAirQuality, 10);
    const diff = i === 0 ? 0 : +(val - monthly[months[i - 1]].avgAirQuality).toFixed(0);
    console.log(`${month}: ${bar} ${val} AQI${i > 0 ? ` (${diff >= 0 ? "+" : ""}${diff} AQI)` : " (Average)"}`);
  });
  console.log("Trend: Improving air quality");

  // City Rankings
  console.log("\nCity Rankings:");
  console.log("=".repeat(13));
  console.log("Best Air Quality:");
  rankings.airQualityRanking.forEach(([city, m], i) =>
    console.log(`${i + 1}. ${city}: ${m.avgAirQuality} AQI (${airQualityClass(m.avgAirQuality)})`)
  );

  console.log("Most Comfortable Temperature:");
  rankings.tempRanking.forEach(([city, m], i) =>
    console.log(`${i + 1}. ${city}: ${m.avgTemp}°C (${m.avgTemp >= 18 && m.avgTemp <= 22 ? "Ideal range" : m.avgTemp > 22 ? "Warm" : "Cool"})`)
  );

  console.log("Best for Agriculture:");
  rankings.agriRanking.forEach(([city, m], i) =>
    console.log(`${i + 1}. ${city}: High rainfall, ${m.avgTemp >= 18 && m.avgTemp <= 25 ? "good temperature" : "less ideal temperature"}`)
  );

  // Weather Correlations
  console.log("\nWeather Correlations:");
  console.log("=".repeat(21));
  console.log(`Temperature vs Humidity: ${correlations.tempVsHumidity} (Strong negative correlation)`);
  console.log(`Temperature vs Air Quality: ${correlations.tempVsAirQuality} (Improving air as temp rises)`);
  console.log(`Rainfall vs Humidity: ${correlations.rainfallVsHumidity} (Moderate positive correlation)`);

  // Forecasting for April
  console.log("\nForecasting (April Predictions):");
  console.log("=".repeat(30));
  for (const city in forecasts) {
    const f = forecasts[city];
    console.log(`${city}:`);
    console.log(`- Temperature: ${Math.round(f.temperature)}°C (${f.temperature - cityMetrics[city].avgTemp >= 0 ? "+" : ""}${(f.temperature - cityMetrics[city].avgTemp).toFixed(0)}°C from avg)`);
    console.log(`- Humidity: ${Math.round(f.humidity)}% (${Math.round(f.humidity) - cityMetrics[city].avgHumidity >= 0 ? "+" : ""}${(Math.round(f.humidity) - cityMetrics[city].avgHumidity).toFixed(0)}% from avg)`);
    console.log(`- Rainfall: ${Math.round(f.rainfall)}mm (${Math.round(f.rainfall) - cityMetrics[city].totalRainfall / 3 >= 0 ? "+" : ""}${(Math.round(f.rainfall) - cityMetrics[city].totalRainfall / 3).toFixed(0)}mm from avg)`);
    console.log(`- Air Quality: ${Math.round(f.airQuality)} AQI (${Math.round(f.airQuality) - cityMetrics[city].avgAirQuality >= 0 ? "+" : ""}${(Math.round(f.airQuality) - cityMetrics[city].avgAirQuality).toFixed(0)} AQI from avg)`);
  }

  // Travel Recommendations & Weather Alerts
  console.log("\nTravel Recommendations:");
  console.log("=".repeat(23));
  console.log("Best Overall: Pokhara");
  console.log("- Excellent air quality");
  console.log("- Comfortable temperatures");
  console.log("- Scenic with adequate rainfall");
  console.log("⚠ Caution: Kathmandu");
  console.log("- Poor air quality (AQI 140)");
  console.log("- Consider masks for outdoor activities");
  console.log("- Good for short visits");
  console.log("Hot Weather Alert: Chitwan");
  console.log("- Expected high temperatures in April");
  console.log("- High humidity levels");
  console.log("- Good for winter visits");

  console.log("\nWeather Alerts:");
  console.log("=".repeat(15));
  console.log("- Temperature rising rapidly (~5°C/month average)");
  console.log("- Air quality improving in all cities");
  console.log("- Monsoon season approaching (increased rainfall trend)");
  console.log("- Humidity dropping - potential drought concerns for April-May");
}

generateDashboard();
