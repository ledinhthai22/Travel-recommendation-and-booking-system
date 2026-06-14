import * as signalR from "@microsoft/signalr";

const URL = import.meta.env.VITE_SIGNAL_URL;

export const connection =
    new signalR.HubConnectionBuilder()
        .withUrl(`${URL}/TravelRecommendationHub`)
        .withAutomaticReconnect()
        .build();