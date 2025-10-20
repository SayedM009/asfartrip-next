// app/flights/booking/page.js
import BookingPage from "@/app/_components/bookingPage/BookingPage";
import Navbar from "@/app/_components/Navbar";
import { auth } from "@/app/_libs/auth";
import { getCart } from "@/app/_libs/flightService";
import { sendError } from "next/dist/server/api-utils";

export default async function Page({ searchParams }) {
    const { session_id: sessionId } = await searchParams;
    const session = await auth();

    let cart = null;
    let error = null;

    if (!sessionId) {
        error = "No session ID provided";
    } else {
        try {
            cart = await getCart(sessionId);
        } catch (err) {
            error = err.message + "test tes testset";
        }
    }

    console.log(session?.user);

    return (
        <>
            <div className="hidden sm:block">
                <Navbar />
            </div>
            {error ? (
                <div className="p-4 text-red-600">Error: {error}</div>
            ) : (
                <BookingPage
                    isLogged={!!session?.user}
                    cart={cart}
                    sessionId={sessionId}
                    userId={session?.user.id}
                />
            )}
        </>
    );
}

// {
//     "ticket": {
//         "TotalPrice": 702,
//         "BasePrice": 250,
//         "Taxes": 452,
//         "SITECurrencyType": "AED",
//         "API_Currency": "AED",
//         "PlatingCarrier": "KU",
//         "FareType": "Refundable",
//         "Refundable": "true",
//         "Info": "S1",
//         "HoldBooking": "YES",
//         "RoutingId": "1760944916H1TBU8J6456",
//         "OutwardId": "5126865BB1760944916",
//         "BookingSeats": "9",
//         "International": "NA",
//         "SegmentReferences": "",
//         "ResponseID": 0,
//         "OfferID": 0,
//         "OfferItemID": "0KU",
//         "AirPricingSolution_Key": "hWfdgnUqWDKAez8GGAAAAA==",
//         "AirSegment_Key": "hWfdgnUqWDKAhz8GGAAAAA==",
//         "Signature": "",
//         "TransactionIdentifier": 1760944916,
//         "EchoToken": 1760944916,
//         "PCC_Id": "1",
//         "MultiLeg": "true",
//         "segments": [
//             {
//                 "Carrier": "KU",
//                 "FlightNumber": "678",
//                 "Origin": "DXB",
//                 "Destination": "KWI",
//                 "OriginAirport": "Dubai international Airport",
//                 "DestinationAirport": "Kuwait international Airport",
//                 "DepartureTime": "2025-10-22T04:30:00+04:00",
//                 "ArrivalTime": "2025-10-22T05:15:00+03:00",
//                 "Duration": "01:45",
//                 "FlightTime": "105",
//                 "OriginTerminal": "1",
//                 "DestinationTerminal": "4",
//                 "CabinClass": "Economy",
//                 "SupplierClass": "",
//                 "OperatingCarrier": "",
//                 "BookingCode": "V",
//                 "Equipment": "32N",
//                 "ChangeOfPlane": "false",
//                 "ParticipantLevel": "Secure Sell",
//                 "AvailabilityDisplayType": "Fare Shop/Optimal Shop",
//                 "LinkAvailability": "true",
//                 "PolledAvailabilityOption": "Cached status used. Polled avail exists",
//                 "OptionalServicesIndicator": "false",
//                 "AvailabilitySource": "P",
//                 "FareBasis": "VLOWAE1",
//                 "BookingCounts": "9",
//                 "ProviderCode": "1G",
//                 "Group": "0",
//                 "ETicketability": "Yes",
//                 "AirSegment_Key": "hWfdgnUqWDKAfz8GGAAAAA==",
//                 "FlightDetail_Key": "hWfdgnUqWDKAgz8GGAAAAA==",
//                 "FareInfoRef": "hWfdgnUqWDKAxz8GGAAAAA==",
//                 "Farerulesref_content": "gws-eJxVTssOgzAM+xjkexxUuDYrRZuGymVs47L//4ylhR0WKbEjO48Yo4oGikr8iw6f7r6hbAkoUM9kNwwDA+jNDhEansv6skycO6qtNPVANl9iCg6YZeYh1cDe6vS+uCZtsSNRD6NSn8CP5KvTYtPDslD6Xukj4ynKCP/0C7h+K5s=",
//                 "JourneySellKey": "NA",
//                 "FareRuleNumber": "",
//                 "FareBasisCode": "",
//                 "FareSequence": "",
//                 "FareSellKey": "",
//                 "OriginalClassOfService": "",
//                 "ClassOfService_refs": "",
//                 "FlightSegmentReference_ref": "",
//                 "SegmentKey": "",
//                 "LFID": "KU678DXB",
//                 "PFID": "KU678DXB",
//                 "RPH": "87654567$20180425193500$20180425230500",
//                 "Signature": "NA",
//                 "BundleCode": "NA",
//                 "BundleExplanation": "NA",
//                 "BundleId": "NA",
//                 "Ticket": "Yes",
//                 "ResBookDesigQuantity": "NA",
//                 "FareReference": "NA",
//                 "FareReferenceID": "NA",
//                 "AirEquipType": "NA"
//             },
//             {
//                 "Carrier": "KU",
//                 "FlightNumber": "545",
//                 "Origin": "KWI",
//                 "Destination": "CAI",
//                 "OriginAirport": "Kuwait international Airport",
//                 "DestinationAirport": "Cairo international Airport",
//                 "DepartureTime": "2025-10-22T09:00:00+03:00",
//                 "ArrivalTime": "2025-10-22T12:00:00+03:00",
//                 "Duration": "03:00",
//                 "FlightTime": "180",
//                 "OriginTerminal": "4",
//                 "DestinationTerminal": "2",
//                 "CabinClass": "Economy",
//                 "SupplierClass": "",
//                 "OperatingCarrier": "",
//                 "BookingCode": "V",
//                 "Equipment": "338",
//                 "ChangeOfPlane": "false",
//                 "ParticipantLevel": "Secure Sell",
//                 "AvailabilityDisplayType": "Fare Shop/Optimal Shop",
//                 "LinkAvailability": "true",
//                 "PolledAvailabilityOption": "Cached status used. Polled avail exists",
//                 "OptionalServicesIndicator": "false",
//                 "AvailabilitySource": "P",
//                 "FareBasis": "VLOWAE1",
//                 "BookingCounts": "9",
//                 "ProviderCode": "1G",
//                 "Group": "0",
//                 "ETicketability": "Yes",
//                 "AirSegment_Key": "hWfdgnUqWDKAhz8GGAAAAA==",
//                 "FlightDetail_Key": "hWfdgnUqWDKAiz8GGAAAAA==",
//                 "FareInfoRef": "hWfdgnUqWDKAxz8GGAAAAA==",
//                 "Farerulesref_content": "gws-eJxVTssOgzAM+xjkexxUuDYrRZuGymVs47L//4ylhR0WKbEjO48Yo4oGikr8iw6f7r6hbAkoUM9kNwwDA+jNDhEansv6skycO6qtNPVANl9iCg6YZeYh1cDe6vS+uCZtsSNRD6NSn8CP5KvTYtPDslD6Xukj4ynKCP/0C7h+K5s=",
//                 "JourneySellKey": "NA",
//                 "FareRuleNumber": "",
//                 "FareBasisCode": "",
//                 "FareSequence": "",
//                 "FareSellKey": "",
//                 "OriginalClassOfService": "",
//                 "ClassOfService_refs": "",
//                 "FlightSegmentReference_ref": "",
//                 "SegmentKey": "",
//                 "LFID": "KU545KWI",
//                 "PFID": "KU545KWI",
//                 "RPH": "87654567$20180425193500$20180425230500",
//                 "Signature": "NA",
//                 "BundleCode": "NA",
//                 "BundleExplanation": "NA",
//                 "BundleId": "NA",
//                 "Ticket": "Yes",
//                 "ResBookDesigQuantity": "NA",
//                 "FareReference": "NA",
//                 "FareReferenceID": "NA",
//                 "AirEquipType": "NA"
//             }
//         ],
//         "CabinLuggage": "7 Kilograms",
//         "BaggageAllowance_Code": "",
//         "BaggageAllowance": [
//             "NumberOfPieces 1"
//         ],
//         "FareTypeID": "",
//         "FareTypeName": "",
//         "LFID": "",
//         "Fares": "",
//         "MAFareID": 0,
//         "Index": null,
//         "FB_FareType": null,
//         "FareSourceCode": null,
//         "rawRequestBase64": "eyJtZXRob2QiOiJTeW5jaCIsImRheXMiOiIiLCJvcmlnaW4iOiJEWEIiLCJkZXN0aW5hdGlvbiI6IkNBSSIsImRlcGFydF9kYXRlIjoiMjAyNS0xMC0yMiIsIkFEVCI6IjEiLCJDSEQiOiIwIiwiSU5GIjoiMCIsImNsYXNzIjoiRWNvbm9teSIsInR5cGUiOiJPIn0=",
//         "rawResponseBase64": "eyJUb3RhbFByaWNlIjo3MDIsIkJhc2VQcmljZSI6MjUwLCJUYXhlcyI6NDUyLCJTSVRFQ3VycmVuY3lUeXBlIjoiQUVEIiwiQVBJX0N1cnJlbmN5IjoiQUVEIiwiUGxhdGluZ0NhcnJpZXIiOiJLVSIsIkZhcmVUeXBlIjoiUmVmdW5kYWJsZSIsIlJlZnVuZGFibGUiOiJ0cnVlIiwiSW5mbyI6IlMxIiwiSG9sZEJvb2tpbmciOiJZRVMiLCJSb3V0aW5nSWQiOiIxNzYwOTQ0OTE2SDFUQlU4SjY0NTYiLCJPdXR3YXJkSWQiOiI1MTI2ODY1QkIxNzYwOTQ0OTE2IiwiQm9va2luZ1NlYXRzIjoiOSIsIkludGVybmF0aW9uYWwiOiJOQSIsIlNlZ21lbnRSZWZlcmVuY2VzIjoiIiwiUmVzcG9uc2VJRCI6MCwiT2ZmZXJJRCI6MCwiT2ZmZXJJdGVtSUQiOiIwS1UiLCJBaXJQcmljaW5nU29sdXRpb25fS2V5IjoiaFdmZGduVXFXREtBZXo4R0dBQUFBQT09IiwiQWlyU2VnbWVudF9LZXkiOiJoV2ZkZ25VcVdES0FoejhHR0FBQUFBPT0iLCJTaWduYXR1cmUiOiIiLCJUcmFuc2FjdGlvbklkZW50aWZpZXIiOjE3NjA5NDQ5MTYsIkVjaG9Ub2tlbiI6MTc2MDk0NDkxNiwiUENDX0lkIjoiMSIsIk11bHRpTGVnIjoidHJ1ZSIsInNlZ21lbnRzIjpbeyJDYXJyaWVyIjoiS1UiLCJGbGlnaHROdW1iZXIiOiI2NzgiLCJPcmlnaW4iOiJEWEIiLCJEZXN0aW5hdGlvbiI6IktXSSIsIk9yaWdpbkFpcnBvcnQiOiJEdWJhaSBpbnRlcm5hdGlvbmFsIEFpcnBvcnQiLCJEZXN0aW5hdGlvbkFpcnBvcnQiOiJLdXdhaXQgaW50ZXJuYXRpb25hbCBBaXJwb3J0IiwiRGVwYXJ0dXJlVGltZSI6IjIwMjUtMTAtMjJUMDQ6MzA6MDArMDQ6MDAiLCJBcnJpdmFsVGltZSI6IjIwMjUtMTAtMjJUMDU6MTU6MDArMDM6MDAiLCJEdXJhdGlvbiI6IjAxOjQ1IiwiRmxpZ2h0VGltZSI6IjEwNSIsIk9yaWdpblRlcm1pbmFsIjoiMSIsIkRlc3RpbmF0aW9uVGVybWluYWwiOiI0IiwiQ2FiaW5DbGFzcyI6IkVjb25vbXkiLCJTdXBwbGllckNsYXNzIjoiIiwiT3BlcmF0aW5nQ2FycmllciI6IiIsIkJvb2tpbmdDb2RlIjoiViIsIkVxdWlwbWVudCI6IjMyTiIsIkNoYW5nZU9mUGxhbmUiOiJmYWxzZSIsIlBhcnRpY2lwYW50TGV2ZWwiOiJTZWN1cmUgU2VsbCIsIkF2YWlsYWJpbGl0eURpc3BsYXlUeXBlIjoiRmFyZSBTaG9wXC9PcHRpbWFsIFNob3AiLCJMaW5rQXZhaWxhYmlsaXR5IjoidHJ1ZSIsIlBvbGxlZEF2YWlsYWJpbGl0eU9wdGlvbiI6IkNhY2hlZCBzdGF0dXMgdXNlZC4gUG9sbGVkIGF2YWlsIGV4aXN0cyIsIk9wdGlvbmFsU2VydmljZXNJbmRpY2F0b3IiOiJmYWxzZSIsIkF2YWlsYWJpbGl0eVNvdXJjZSI6IlAiLCJGYXJlQmFzaXMiOiJWTE9XQUUxIiwiQm9va2luZ0NvdW50cyI6IjkiLCJQcm92aWRlckNvZGUiOiIxRyIsIkdyb3VwIjoiMCIsIkVUaWNrZXRhYmlsaXR5IjoiWWVzIiwiQWlyU2VnbWVudF9LZXkiOiJoV2ZkZ25VcVdES0FmejhHR0FBQUFBPT0iLCJGbGlnaHREZXRhaWxfS2V5IjoiaFdmZGduVXFXREtBZ3o4R0dBQUFBQT09IiwiRmFyZUluZm9SZWYiOiJoV2ZkZ25VcVdES0F4ejhHR0FBQUFBPT0iLCJGYXJlcnVsZXNyZWZfY29udGVudCI6Imd3cy1lSnhWVHNzT2d6QU0reGprZXh4VXVEWXJSWnVHeW1WczQ3TFwvXC80eWxoUjBXS2JFak80OFlvNG9HaWtyOGl3NmY3cjZoYkFrb1VNOWtOd3dEQStqTkRoRWFuc3Y2c2t5Y082cXROUFZBTmw5aUNnNllaZVloMWNEZTZ2Uyt1Q1p0c1NOUkQ2TlNuOENQNUt2VFl0UERzbEQ2WHVrajR5bktDUFwvMEM3aCtLNXM9IiwiSm91cm5leVNlbGxLZXkiOiJOQSIsIkZhcmVSdWxlTnVtYmVyIjoiIiwiRmFyZUJhc2lzQ29kZSI6IiIsIkZhcmVTZXF1ZW5jZSI6IiIsIkZhcmVTZWxsS2V5IjoiIiwiT3JpZ2luYWxDbGFzc09mU2VydmljZSI6IiIsIkNsYXNzT2ZTZXJ2aWNlX3JlZnMiOiIiLCJGbGlnaHRTZWdtZW50UmVmZXJlbmNlX3JlZiI6IiIsIlNlZ21lbnRLZXkiOiIiLCJMRklEIjoiS1U2NzhEWEIiLCJQRklEIjoiS1U2NzhEWEIiLCJSUEgiOiI4NzY1NDU2NyQyMDE4MDQyNTE5MzUwMCQyMDE4MDQyNTIzMDUwMCIsIlNpZ25hdHVyZSI6Ik5BIiwiQnVuZGxlQ29kZSI6Ik5BIiwiQnVuZGxlRXhwbGFuYXRpb24iOiJOQSIsIkJ1bmRsZUlkIjoiTkEiLCJUaWNrZXQiOiJZZXMiLCJSZXNCb29rRGVzaWdRdWFudGl0eSI6Ik5BIiwiRmFyZVJlZmVyZW5jZSI6Ik5BIiwiRmFyZVJlZmVyZW5jZUlEIjoiTkEiLCJBaXJFcXVpcFR5cGUiOiJOQSJ9LHsiQ2FycmllciI6IktVIiwiRmxpZ2h0TnVtYmVyIjoiNTQ1IiwiT3JpZ2luIjoiS1dJIiwiRGVzdGluYXRpb24iOiJDQUkiLCJPcmlnaW5BaXJwb3J0IjoiS3V3YWl0IGludGVybmF0aW9uYWwgQWlycG9ydCIsIkRlc3RpbmF0aW9uQWlycG9ydCI6IkNhaXJvIGludGVybmF0aW9uYWwgQWlycG9ydCIsIkRlcGFydHVyZVRpbWUiOiIyMDI1LTEwLTIyVDA5OjAwOjAwKzAzOjAwIiwiQXJyaXZhbFRpbWUiOiIyMDI1LTEwLTIyVDEyOjAwOjAwKzAzOjAwIiwiRHVyYXRpb24iOiIwMzowMCIsIkZsaWdodFRpbWUiOiIxODAiLCJPcmlnaW5UZXJtaW5hbCI6IjQiLCJEZXN0aW5hdGlvblRlcm1pbmFsIjoiMiIsIkNhYmluQ2xhc3MiOiJFY29ub215IiwiU3VwcGxpZXJDbGFzcyI6IiIsIk9wZXJhdGluZ0NhcnJpZXIiOiIiLCJCb29raW5nQ29kZSI6IlYiLCJFcXVpcG1lbnQiOiIzMzgiLCJDaGFuZ2VPZlBsYW5lIjoiZmFsc2UiLCJQYXJ0aWNpcGFudExldmVsIjoiU2VjdXJlIFNlbGwiLCJBdmFpbGFiaWxpdHlEaXNwbGF5VHlwZSI6IkZhcmUgU2hvcFwvT3B0aW1hbCBTaG9wIiwiTGlua0F2YWlsYWJpbGl0eSI6InRydWUiLCJQb2xsZWRBdmFpbGFiaWxpdHlPcHRpb24iOiJDYWNoZWQgc3RhdHVzIHVzZWQuIFBvbGxlZCBhdmFpbCBleGlzdHMiLCJPcHRpb25hbFNlcnZpY2VzSW5kaWNhdG9yIjoiZmFsc2UiLCJBdmFpbGFiaWxpdHlTb3VyY2UiOiJQIiwiRmFyZUJhc2lzIjoiVkxPV0FFMSIsIkJvb2tpbmdDb3VudHMiOiI5IiwiUHJvdmlkZXJDb2RlIjoiMUciLCJHcm91cCI6IjAiLCJFVGlja2V0YWJpbGl0eSI6IlllcyIsIkFpclNlZ21lbnRfS2V5IjoiaFdmZGduVXFXREtBaHo4R0dBQUFBQT09IiwiRmxpZ2h0RGV0YWlsX0tleSI6ImhXZmRnblVxV0RLQWl6OEdHQUFBQUE9PSIsIkZhcmVJbmZvUmVmIjoiaFdmZGduVXFXREtBeHo4R0dBQUFBQT09IiwiRmFyZXJ1bGVzcmVmX2NvbnRlbnQiOiJnd3MtZUp4VlRzc09nekFNK3hqa2V4eFV1RFlyUlp1R3ltVnM0N0xcL1wvNHlsaFIwV0tiRWpPNDhZbzRvR2lrcjhpdzZmN3I2aGJBa29VTTlrTnd3REErak5EaEVhbnN2NnNreWNPNnF0TlBWQU5sOWlDZzZZWmVZaDFjRGU2dlMrdUNadHNTTlJENk5TbjhDUDVLdlRZdFBEc2xENlh1a2o0eW5LQ1BcLzBDN2grSzVzPSIsIkpvdXJuZXlTZWxsS2V5IjoiTkEiLCJGYXJlUnVsZU51bWJlciI6IiIsIkZhcmVCYXNpc0NvZGUiOiIiLCJGYXJlU2VxdWVuY2UiOiIiLCJGYXJlU2VsbEtleSI6IiIsIk9yaWdpbmFsQ2xhc3NPZlNlcnZpY2UiOiIiLCJDbGFzc09mU2VydmljZV9yZWZzIjoiIiwiRmxpZ2h0U2VnbWVudFJlZmVyZW5jZV9yZWYiOiIiLCJTZWdtZW50S2V5IjoiIiwiTEZJRCI6IktVNTQ1S1dJIiwiUEZJRCI6IktVNTQ1S1dJIiwiUlBIIjoiODc2NTQ1NjckMjAxODA0MjUxOTM1MDAkMjAxODA0MjUyMzA1MDAiLCJTaWduYXR1cmUiOiJOQSIsIkJ1bmRsZUNvZGUiOiJOQSIsIkJ1bmRsZUV4cGxhbmF0aW9uIjoiTkEiLCJCdW5kbGVJZCI6Ik5BIiwiVGlja2V0IjoiWWVzIiwiUmVzQm9va0Rlc2lnUXVhbnRpdHkiOiJOQSIsIkZhcmVSZWZlcmVuY2UiOiJOQSIsIkZhcmVSZWZlcmVuY2VJRCI6Ik5BIiwiQWlyRXF1aXBUeXBlIjoiTkEifV0sIkNhYmluTHVnZ2FnZSI6IjcgS2lsb2dyYW1zIiwiQmFnZ2FnZUFsbG93YW5jZV9Db2RlIjoiIiwiQmFnZ2FnZUFsbG93YW5jZSI6WyJOdW1iZXJPZlBpZWNlcyAxIl0sIkZhcmVUeXBlSUQiOiIiLCJGYXJlVHlwZU5hbWUiOiIiLCJMRklEIjoiIiwiRmFyZXMiOiIiLCJNQUZhcmVJRCI6MCwiSW5kZXgiOm51bGwsIkZCX0ZhcmVUeXBlIjpudWxsLCJGYXJlU291cmNlQ29kZSI6bnVsbCwicmF3UmVxdWVzdEJhc2U2NCI6ImV5SnRaWFJvYjJRaU9pSlRlVzVqYUNJc0ltUmhlWE1pT2lJaUxDSnZjbWxuYVc0aU9pSkVXRUlpTENKa1pYTjBhVzVoZEdsdmJpSTZJa05CU1NJc0ltUmxjR0Z5ZEY5a1lYUmxJam9pTWpBeU5TMHhNQzB5TWlJc0lrRkVWQ0k2SWpFaUxDSkRTRVFpT2lJd0lpd2lTVTVHSWpvaU1DSXNJbU5zWVhOeklqb2lSV052Ym05dGVTSXNJblI1Y0dVaU9pSlBJbjA9In0="
//     },
//     "searchInfo": {
//         "origin": "DXB",
//         "destination": "CAI",
//         "depart_date": "22-10-2025",
//         "ADT": 1,
//         "CHD": 0,
//         "INF": 0,
//         "class": "Economy",
//         "type": "O"
//     },
//     "travelers": [
//         {
//             "travelerNumber": 1,
//             "travelerType": "Adult",
//             "title": "mr",
//             "firstName": "SAYED",
//             "lastName": "MOHARAM",
//             "dateOfBirth": "2023-03-04T20:00:00.000Z",
//             "passportNumber": "A1234567",
//             "passportExpiry": "2039-04-03T20:00:00.000Z",
//             "nationality": "AR",
//             "isCompleted": true
//         }
//     ],
//     "contactInfo": {
//         "bookingForSomeoneElse": false,
//         "countryCode": "+971",
//         "bookerName": "",
//         "email": "elsayed@asfartri.com",
//         "phone": "5055164947"
//     },
//     "addOns": {
//         "selectedBaggage": null,
//         "baggagePrice": 0,
//         "selectedMeal": "none",
//         "mealPrice": 0
//     },
//     "selectedInsurance": {
//         "quote_id": 0,
//         "scheme_id": 0,
//         "name": "No Insurance",
//         "premium": 0
//     },
//     "insurancePlans": [
//         {
//             "quote_id": 654496,
//             "scheme_id": 133,
//             "name": "Outbound Travel - Standard Traveler",
//             "premium": 36
//         },
//         {
//             "quote_id": 654496,
//             "scheme_id": 134,
//             "name": "Outbound Travel - Premier Traveler",
//             "premium": 59
//         },
//         {
//             "quote_id": 654496,
//             "scheme_id": 135,
//             "name": "Outbound Travel - Elite Traveler",
//             "premium": 67
//         }
//     ],
//     "userId": "a508b4eb-1b1e-43c9-a8b1-27b5d86a8bb8",
//     "bookingReference": "AFT10F2011Z135857",
//     "gateway": {
//         "pg": "ZIINA",
//         "ifrurl": "https://pay.ziina.com/payment_intent/cc41b6bf-11b8-4fea-aed3-fe444a782f4b",
//         "success": 1
//     },
//     "isDataModified": false
// }
