import requests
from django.conf import settings

def geocode_address(address):
    if not address:
        return None, None

    url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        "address": address,
        "key": settings.GOOGLE_MAPS_API_KEY
    }

    response = requests.get(url).json()

    if response.get("status") != "OK":
        return None, None

    location = response["results"][0]["geometry"]["location"]
    return location["lat"], location["lng"]
