import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

const countryCodes = [
    { code: "+971", country: "AE", name: "UAE", flag: "🇦🇪" },
    { code: "+93", country: "AF", name: "Afghanistan", flag: "🇦🇫" },
    { code: "+355", country: "AL", name: "Albania", flag: "🇦🇱" },
    { code: "+213", country: "DZ", name: "Algeria", flag: "🇩🇿" },
    { code: "+54", country: "AR", name: "Argentina", flag: "🇦🇷" },
    { code: "+374", country: "AM", name: "Armenia", flag: "🇦🇲" },
    { code: "+61", country: "AU", name: "Australia", flag: "🇦🇺" },
    { code: "+43", country: "AT", name: "Austria", flag: "🇦🇹" },
    { code: "+994", country: "AZ", name: "Azerbaijan", flag: "🇦🇿" },
    { code: "+973", country: "BH", name: "Bahrain", flag: "🇧🇭" },
    { code: "+880", country: "BD", name: "Bangladesh", flag: "🇧🇩" },
    { code: "+375", country: "BY", name: "Belarus", flag: "🇧🇾" },
    { code: "+32", country: "BE", name: "Belgium", flag: "🇧🇪" },
    { code: "+55", country: "BR", name: "Brazil", flag: "🇧🇷" },
    { code: "+359", country: "BG", name: "Bulgaria", flag: "🇧🇬" },
    { code: "+855", country: "KH", name: "Cambodia", flag: "🇰🇭" },
    { code: "+237", country: "CM", name: "Cameroon", flag: "🇨🇲" },
    { code: "+1", country: "CA", name: "Canada", flag: "🇨🇦" },
    { code: "+56", country: "CL", name: "Chile", flag: "🇨🇱" },
    { code: "+86", country: "CN", name: "China", flag: "🇨🇳" },
    { code: "+57", country: "CO", name: "Colombia", flag: "🇨🇴" },
    { code: "+506", country: "CR", name: "Costa Rica", flag: "🇨🇷" },
    { code: "+385", country: "HR", name: "Croatia", flag: "🇭🇷" },
    { code: "+53", country: "CU", name: "Cuba", flag: "🇨🇺" },
    { code: "+357", country: "CY", name: "Cyprus", flag: "🇨🇾" },
    { code: "+420", country: "CZ", name: "Czech Republic", flag: "🇨🇿" },
    { code: "+45", country: "DK", name: "Denmark", flag: "🇩🇰" },
    { code: "+20", country: "EG", name: "Egypt", flag: "🇪🇬" },
    { code: "+372", country: "EE", name: "Estonia", flag: "🇪🇪" },
    { code: "+251", country: "ET", name: "Ethiopia", flag: "🇪🇹" },
    { code: "+358", country: "FI", name: "Finland", flag: "🇫🇮" },
    { code: "+33", country: "FR", name: "France", flag: "🇫🇷" },
    { code: "+995", country: "GE", name: "Georgia", flag: "🇬🇪" },
    { code: "+49", country: "DE", name: "Germany", flag: "🇩🇪" },
    { code: "+233", country: "GH", name: "Ghana", flag: "🇬🇭" },
    { code: "+30", country: "GR", name: "Greece", flag: "🇬🇷" },
    { code: "+852", country: "HK", name: "Hong Kong", flag: "🇭🇰" },
    { code: "+36", country: "HU", name: "Hungary", flag: "🇭🇺" },
    { code: "+354", country: "IS", name: "Iceland", flag: "🇮🇸" },
    { code: "+91", country: "IN", name: "India", flag: "🇮🇳" },
    { code: "+62", country: "ID", name: "Indonesia", flag: "🇮🇩" },
    { code: "+98", country: "IR", name: "Iran", flag: "🇮🇷" },
    { code: "+964", country: "IQ", name: "Iraq", flag: "🇮🇶" },
    { code: "+353", country: "IE", name: "Ireland", flag: "🇮🇪" },
    { code: "+972", country: "IL", name: "Israel", flag: "🇮🇱" },
    { code: "+39", country: "IT", name: "Italy", flag: "🇮🇹" },
    { code: "+81", country: "JP", name: "Japan", flag: "🇯🇵" },
    { code: "+962", country: "JO", name: "Jordan", flag: "🇯🇴" },
    { code: "+7", country: "KZ", name: "Kazakhstan", flag: "🇰🇿" },
    { code: "+254", country: "KE", name: "Kenya", flag: "🇰🇪" },
    { code: "+965", country: "KW", name: "Kuwait", flag: "🇰🇼" },
    { code: "+996", country: "KG", name: "Kyrgyzstan", flag: "🇰🇬" },
    { code: "+371", country: "LV", name: "Latvia", flag: "🇱🇻" },
    { code: "+961", country: "LB", name: "Lebanon", flag: "🇱🇧" },
    { code: "+218", country: "LY", name: "Libya", flag: "🇱🇾" },
    { code: "+370", country: "LT", name: "Lithuania", flag: "🇱🇹" },
    { code: "+352", country: "LU", name: "Luxembourg", flag: "🇱🇺" },
    { code: "+60", country: "MY", name: "Malaysia", flag: "🇲🇾" },
    { code: "+960", country: "MV", name: "Maldives", flag: "🇲🇻" },
    { code: "+356", country: "MT", name: "Malta", flag: "🇲🇹" },
    { code: "+52", country: "MX", name: "Mexico", flag: "🇲🇽" },
    { code: "+373", country: "MD", name: "Moldova", flag: "🇲🇩" },
    { code: "+377", country: "MC", name: "Monaco", flag: "🇲🇨" },
    { code: "+976", country: "MN", name: "Mongolia", flag: "🇲🇳" },
    { code: "+382", country: "ME", name: "Montenegro", flag: "🇲🇪" },
    { code: "+212", country: "MA", name: "Morocco", flag: "🇲🇦" },
    { code: "+95", country: "MM", name: "Myanmar", flag: "🇲🇲" },
    { code: "+977", country: "NP", name: "Nepal", flag: "🇳🇵" },
    { code: "+31", country: "NL", name: "Netherlands", flag: "🇳🇱" },
    { code: "+64", country: "NZ", name: "New Zealand", flag: "🇳🇿" },
    { code: "+234", country: "NG", name: "Nigeria", flag: "🇳🇬" },
    { code: "+47", country: "NO", name: "Norway", flag: "🇳🇴" },
    { code: "+968", country: "OM", name: "Oman", flag: "🇴🇲" },
    { code: "+92", country: "PK", name: "Pakistan", flag: "🇵🇰" },
    { code: "+970", country: "PS", name: "Palestine", flag: "🇵🇸" },
    { code: "+507", country: "PA", name: "Panama", flag: "🇵🇦" },
    { code: "+51", country: "PE", name: "Peru", flag: "🇵🇪" },
    { code: "+63", country: "PH", name: "Philippines", flag: "🇵🇭" },
    { code: "+48", country: "PL", name: "Poland", flag: "🇵🇱" },
    { code: "+351", country: "PT", name: "Portugal", flag: "🇵🇹" },
    { code: "+974", country: "QA", name: "Qatar", flag: "🇶🇦" },
    { code: "+40", country: "RO", name: "Romania", flag: "🇷🇴" },
    { code: "+7", country: "RU", name: "Russia", flag: "🇷🇺" },
    { code: "+966", country: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
    { code: "+381", country: "RS", name: "Serbia", flag: "🇷🇸" },
    { code: "+65", country: "SG", name: "Singapore", flag: "🇸🇬" },
    { code: "+421", country: "SK", name: "Slovakia", flag: "🇸🇰" },
    { code: "+386", country: "SI", name: "Slovenia", flag: "🇸🇮" },
    { code: "+27", country: "ZA", name: "South Africa", flag: "🇿🇦" },
    { code: "+82", country: "KR", name: "South Korea", flag: "🇰🇷" },
    { code: "+34", country: "ES", name: "Spain", flag: "🇪🇸" },
    { code: "+94", country: "LK", name: "Sri Lanka", flag: "🇱🇰" },
    { code: "+249", country: "SD", name: "Sudan", flag: "🇸🇩" },
    { code: "+46", country: "SE", name: "Sweden", flag: "🇸🇪" },
    { code: "+41", country: "CH", name: "Switzerland", flag: "🇨🇭" },
    { code: "+963", country: "SY", name: "Syria", flag: "🇸🇾" },
    { code: "+886", country: "TW", name: "Taiwan", flag: "🇹🇼" },
    { code: "+992", country: "TJ", name: "Tajikistan", flag: "🇹🇯" },
    { code: "+255", country: "TZ", name: "Tanzania", flag: "🇹🇿" },
    { code: "+66", country: "TH", name: "Thailand", flag: "🇹🇭" },
    { code: "+216", country: "TN", name: "Tunisia", flag: "🇹🇳" },
    { code: "+90", country: "TR", name: "Turkey", flag: "🇹🇷" },
    { code: "+993", country: "TM", name: "Turkmenistan", flag: "🇹🇲" },
    { code: "+256", country: "UG", name: "Uganda", flag: "🇺🇬" },
    { code: "+380", country: "UA", name: "Ukraine", flag: "🇺🇦" },
    { code: "+44", country: "GB", name: "United Kingdom", flag: "🇬🇧" },
    { code: "+1", country: "US", name: "United States", flag: "🇺🇸" },
    { code: "+598", country: "UY", name: "Uruguay", flag: "🇺🇾" },
    { code: "+998", country: "UZ", name: "Uzbekistan", flag: "🇺🇿" },
    { code: "+58", country: "VE", name: "Venezuela", flag: "🇻🇪" },
    { code: "+84", country: "VN", name: "Vietnam", flag: "🇻🇳" },
    { code: "+967", country: "YE", name: "Yemen", flag: "🇾🇪" },
];

export function CountryCodeSelect({ value, onValueChange }) {
    const [open, setOpen] = useState(false);

    const selectedCode = countryCodes.find((item) => item.code === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[110px] justify-between px-2 h-12"
                >
                    {selectedCode ? (
                        <span className="flex items-center gap-1">
                            <span className="text-base">
                                {selectedCode.flag}
                            </span>
                            <span className="text-xs">{selectedCode.code}</span>
                        </span>
                    ) : (
                        <span className="text-xs">+971</span>
                    )}
                    <ChevronsUpDown className="ltr:ml-1 rtl:mr-1 h-3 w-3 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search country..." />
                    <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                            {countryCodes.map((item) => (
                                <CommandItem
                                    key={`${item.country}-${item.code}`}
                                    value={`${item.name} ${item.code}`}
                                    onSelect={() => {
                                        onValueChange?.(item.code);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "ltr:mr-2 rtl:ml-2 h-4 w-4",
                                            value === item.code
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    <span className="text-base ltr:mr-2 rtl:ml-2">
                                        {item.flag}
                                    </span>
                                    <span className="flex-1">{item.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {item.code}
                                    </span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
