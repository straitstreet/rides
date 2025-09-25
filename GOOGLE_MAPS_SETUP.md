# Google Maps API Setup Guide

This guide will help you set up Google Maps API integration for the Rides car rental platform.

## 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Make sure billing is enabled for your project

## 2. Enable Required APIs

Enable the following APIs in the Google Cloud Console:

- **Maps JavaScript API** (for displaying maps)
- **Places API** (for location autocomplete)
- **Geocoding API** (for converting addresses to coordinates)

To enable APIs:
1. Go to "APIs & Services" > "Library"
2. Search for each API and click "Enable"

## 3. Create API Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key
4. (Recommended) Restrict the API key:
   - Go to "Edit API key"
   - Under "API restrictions", select "Restrict key"
   - Choose the APIs you enabled above
   - Under "Website restrictions", add your domain(s)

## 4. Configure Environment Variables

### Local Development

Add the API key to your `.env.local` file:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_actual_api_key_here"
```

### Production Deployment

For Google Cloud Platform deployment, add the API key as a build argument in your Cloud Build configuration:

```yaml
# In cloudbuild.yaml
substitutions:
  _NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: "your_actual_api_key_here"

steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: [
      'build',
      '--build-arg', 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=${_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}',
      # ... other build args
    ]
```

## 5. API Usage in the Application

The application includes the following Google Maps features:

### Location Autocomplete
- Search form on homepage
- Pickup location in booking modal
- Restricted to Nigerian cities for better UX

### Car Location Maps
- Shows car location in booking modal
- Displays markers for car positions
- Nigerian city coordinates pre-configured

### Components Available

```typescript
import {
  GoogleMap,
  LocationAutocomplete,
  CarLocationMap
} from '@/components/maps';
```

## 6. API Quota and Pricing

- Google Maps provides $200/month free credit
- Monitor usage in Google Cloud Console
- Set up billing alerts to avoid unexpected charges

## 7. Security Best Practices

1. **Restrict API key** to specific APIs and domains
2. **Use HTTP referrer restrictions** for web applications
3. **Monitor API usage** regularly
4. **Rotate API keys** periodically

## 8. Testing

After setup:

1. Start the development server: `yarn dev`
2. Check the browser console for any API errors
3. Test location autocomplete in the search form
4. Open a car booking modal to see the location map

## 9. Troubleshooting

### Common Issues

**"This page can't load Google Maps correctly"**
- Check if the API key is valid
- Ensure Maps JavaScript API is enabled
- Verify domain restrictions are correct

**Location autocomplete not working**
- Enable Places API
- Check console for JavaScript errors
- Verify API key has Places API access

**Map not displaying**
- Check Content Security Policy in next.config.js
- Ensure all required Google domains are whitelisted
- Verify component is rendered client-side (`'use client'`)

### Console Errors

Check browser console and Google Cloud Console API logs for detailed error messages.

## 10. Nigerian City Support

The application includes pre-configured coordinates for major Nigerian cities:

- Lagos, Abuja, Port Harcourt, Kano, Ibadan
- Benin City, Jos, Ilorin, Owerri, Calabar
- Enugu, Kaduna, Zaria, Warri, Akure

Additional cities can be added to the `NIGERIAN_CITY_COORDINATES` object in `/src/components/maps/car-location-map.tsx`.