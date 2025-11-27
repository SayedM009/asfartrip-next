"use client";

import { motion } from "framer-motion";
import { PlaneTakeoff, PlaneLanding, Luggage, Plane } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useAirportTranslation } from "@/app/_hooks/useAirportTranslation";
import { useDateFormatter } from "@/app/_hooks/useDisplayShortDate";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import { useFormatBaggage } from "@/app/_hooks/useFormatBaggage";
import { getAirlineLogo } from "@/app/_modules/flight/results/utils/flightHelpers";
import { formatTime } from "@/app/_modules/flight/results/utils/flightTime";

/**
 * Flight Segment - Compact and clean flight segment display
 * @param {Object} props
 * @param {Object} props.segment - Segment data
 * @param {number} props.index - Segment index
 */
export default function FlightSegment({ segment, index }) {
    const t = useTranslations("FlightStatus");
    const tFlight = useTranslations("Flight");
    const { getCityName, getAirportName } = useAirportTranslation();
    const formatDate = useDateFormatter();
    const { isRTL } = useCheckLocal();
    const { formatBaggage } = useFormatBaggage();
    
    // Get translated names
    const originCity = getCityName(segment.Origin);
    const destinationCity = getCityName(segment.Destination);
    const originAirport = getAirportName(segment.Origin);
    const destinationAirport = getAirportName(segment.Destination);
    
    // Format dates
    const departureDate = formatDate(segment.DepartureTime, { 
        pattern: isRTL ? "EEEE d MMMM yyyy" : "EEE, MMM d, yyyy" 
    });
    const arrivalDate = formatDate(segment.ArrivalTime, { 
        pattern: isRTL ? "EEEE d MMMM yyyy" : "EEE, MMM d, yyyy" 
    });
    
    // Format times
    const departureTime = formatTime(segment.DepartureTime);
    const arrivalTime = formatTime(segment.ArrivalTime);
    
    // Format baggage
    const formattedBaggage = segment.BaggageAllowance 
        ? formatBaggage(segment.BaggageAllowance) 
        : tFlight('booking.no_baggage');
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="mb-4 last:mb-0"
        >
            {/* Compact Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                
                {/* Header: Airline + Duration */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                    {/* Airline Info */}
                    <div className="flex items-center gap-3">
                        <Image
                            src={`/airline_logo/${segment.Carrier}.png`}
                            alt={segment.Carrier}
                            className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-700 p-1.5"
                            width={40}
                            height={40}
                            loading="lazy"
                            onError={(e) => {
                                e.currentTarget.src = getAirlineLogo(segment.Carrier);
                            }}
                        />
                        <div>
                            <div className="font-semibold text-sm text-gray-900 dark:text-white">
                                {tFlight(`airlines.${segment.Carrier}`) || segment.Carrier}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {segment.Carrier} {segment.FlightNumber} • {tFlight(`ticket_class.${String(segment.CabinClass).toLowerCase()}`)}
                            </div>
                        </div>
                    </div>
                    
                    {/* Duration Badge */}
                    <div className="px-3 py-1.5 bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 rounded-lg text-sm font-semibold">
                        {segment.Duration}
                    </div>
                </div>
                
                {/* Flight Route - Compact Timeline */}
                <div className="p-4">
                    <div className="grid grid-cols-[1fr_1fr] gap-3 items-center mb-4">
                        {/* Departure */}
                        <div>
                            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs mb-1 rtl:flex-row-reverse rtl:justify-end">
                                <PlaneTakeoff className="w-3.5 h-3.5 rtl:scale-x-[-1]" />
                                <span>{t('departure')}</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-0.5">
                                {departureTime}
                            </div>
                            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {originCity}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {departureDate}
                            </div>
                        </div>
                        
                        {/* Arrival */}
                        <div className="">
                            <div className="flex items-center gap-1.5 justify-start text-gray-500 dark:text-gray-400 text-xs mb-1">
                                <span>{t('arrival')}</span>
                                <PlaneLanding className="w-3.5 h-3.5 rtl:scale-x-[-1]" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-0.5">
                                {arrivalTime}
                            </div>
                            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {destinationCity}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {arrivalDate}
                            </div>
                        </div>
                    </div>
                    
                    {/* Additional Details - Compact Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                        {/* Origin Airport */}
                        <div className="flex items-start gap-2 text-xs">
                            <PlaneTakeoff className="w-3.5 h-3.5 text-accent-500 flex-shrink-0 mt-0.5 rtl:scale-x-[-1]" />
                            <div className="min-w-0 flex flex-col sm:flex-row gap-2">
                                <div className="text-gray-500 dark:text-gray-400">{t('from')}</div>
                                <div className="text-gray-900 dark:text-white font-medium truncate">
                                    {originAirport}
                                </div>
                            </div>
                        </div>
                        
                        {/* Destination Airport */}
                        <div className="flex items-start gap-2 text-xs">
                            <PlaneLanding className="w-3.5 h-3.5 text-accent-500 flex-shrink-0 mt-0.5 rtl:scale-x-[-1]" />
                            <div className="min-w-0 flex flex-col sm:flex-row gap-2">
                                <div className="text-gray-500 dark:text-gray-400">{t('to')}</div>
                                <div className="text-gray-900 dark:text-white font-medium truncate">
                                    {destinationAirport}
                                </div>
                            </div>
                        </div>
                        
                        {/* Aircraft */}
                        {segment.AircraftInfo && (
                            <div className="flex items-start gap-2 text-xs">
                                <Plane className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5 " />
                                <div className="min-w-0 flex flex-col sm:flex-row gap-2">
                                    <div className="text-gray-500 dark:text-gray-400">{t('aircraft')}</div>
                                    <div className="text-gray-900 dark:text-white font-medium truncate">
                                        {segment.AircraftInfo}
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Baggage */}
                        <div className="flex items-start gap-2 text-xs">
                            <Luggage className="w-3.5 h-3.5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                            <div className="min-w-0 flex flex-col sm:flex-row gap-2">
                                <div className="text-gray-500 dark:text-gray-400">{t('baggage')}</div>
                                <div className="text-gray-900 dark:text-white font-semibold truncate">
                                    {formattedBaggage}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
