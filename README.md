# Weathex: Weather Dashboard Application

## User Story

As a traveler,  
I want to view the weather outlook for multiple cities,  
So that I can plan my trips accordingly.

## Acceptance Criteria

- **Given** a weather dashboard with form inputs:  
  - **When** I search for a city,  
    - **Then** I am presented with the current and future weather conditions for that city, and the city is added to the search history.

- **When** I view the current weather conditions for a city:  
  - **Then** I am presented with:
    - The city name
    - The date
    - An icon representing the weather conditions
    - A description of the weather for the icon's `alt` tag
    - The temperature
    - The humidity
    - The wind speed

- **When** I view the future weather conditions for a city:  
  - **Then** I am presented with a 5-day forecast that includes:
    - The date
    - An icon representing the weather conditions
    - The temperature
    - The wind speed
    - The humidity

- **When** I click on a city in the search history:  
  - **Then** I am presented again with the current and future weather conditions for that city.