import { useState, useEffect } from 'react'

const getLocation = () =>
{
  return new Promise<GeolocationCoordinates>((resolve, reject) =>
  {
    if (!navigator.geolocation)
    {
      reject(new Error("Geolocation is not supported by this browser."));
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
      {
        resolve(position.coords);
      },
      (error) =>
      {
        reject(error);
      }
    );
  });
};

export { getLocation }

interface OpenCageResult
{
  components: {
    country: string;
  }
}

const GetCountry = async (lat: number, lng: number): Promise<string | null> =>
{
  const apiKey = "c6f9dddba0a443ef92ce2a63edcfeecd";
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}&pretty=1&no_annotations=1`;
  const response = await fetch(url);
  const data: { results: OpenCageResult[] } = await response.json();

  if (data.results.length > 0)
  {
    return data.results[0].components.country;
  }
  return null;
};

export default GetCountry
