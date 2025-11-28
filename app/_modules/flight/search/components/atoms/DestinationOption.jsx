// import { cn } from "@/lib/utils";

// /**
//  * DestinationOption - Atomic Component
//  * A single destination option in the search results
//  * 
//  * @param {Object} destination - Destination data
//  * @param {string} destination.city - City name
//  * @param {string} destination.country - Country name
//  * @param {string} destination.airport - Airport name
//  * @param {string} destination.label_code - Airport code (IATA)
//  * @param {function} onClick - Click handler
//  * @param {boolean} isRTL - Right-to-left layout
//  */
// export default function DestinationOption({ destination, onClick, isRTL = false }) {
//     const { city, country, airport, label_code } = destination;
//     const countryName = country?.split("-")[0];
//     const countryCode = country?.split("-")[1];

//     return (
//         <button
//             onClick={onClick}
//             className="w-full p-3 text-left hover:bg-muted rounded-md border-b last:border-0 cursor-pointer transition-colors"
//             role="option"
//             aria-label={`${city}, ${countryName} (${label_code})`}
//         >
//             <div className="flex items-center justify-between gap-2">
//                 <div className="flex flex-col items-start">
//                     <div
//                         className={cn(
//                             "font-medium",
//                             isRTL && "text-right"
//                         )}
//                     >
//                         {city}, {countryName}
//                     </div>
//                     <div className="text-sm text-muted-foreground">
//                         {airport || countryCode}
//                     </div>
//                 </div>
//                 <div className="font-medium text-muted-foreground">
//                     {label_code}
//                 </div>
//             </div>
//         </button>
//     );
// }
