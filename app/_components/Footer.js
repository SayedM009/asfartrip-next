import React from "react";
import { Separator } from "./ui/separator";
import {
    Plane,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Mail,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useIsDevice from "../_hooks/useIsDevice";

export function Footer() {
    const { mobile } = useIsDevice();
    if (mobile) return null;
    return (
        <footer className="bg-muted text-muted-foreground hidden md:block">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                                <Plane className="h-5 w-5" />
                            </div>
                            <span className="text-lg text-foreground">
                                SkyWings
                            </span>
                        </div>
                        <p className="text-sm mb-4">
                            Your trusted partner for affordable flights
                            worldwide. Discover amazing destinations and create
                            unforgettable memories.
                        </p>
                        <div className="flex space-x-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <Facebook className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <Twitter className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <Instagram className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <Youtube className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-foreground mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-foreground transition-colors"
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Contact
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Press
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Blog
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-foreground mb-4">Services</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Flight Booking
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Hotel Reservations
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Car Rentals
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Travel Insurance
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Group Travel
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-foreground mb-4">Stay Updated</h3>
                        <p className="text-sm mb-4">
                            Subscribe to our newsletter for exclusive deals and
                            travel tips.
                        </p>
                        <div className="flex space-x-2">
                            <div className="relative flex-1">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                                <Input
                                    placeholder="Enter your email"
                                    className="pl-10 bg-background"
                                />
                            </div>
                            <Button size="sm">Subscribe</Button>
                        </div>
                    </div>
                </div>

                <Separator className="mb-8" />

                {/* Bottom Footer */}
                <div className="flex flex-col md:flex-row justify-between items-center text-sm">
                    <div className="mb-4 md:mb-0">
                        <p>&copy; 2025 SkyWings. All rights reserved.</p>
                    </div>
                    <div className="flex space-x-6">
                        <a
                            href="#"
                            className="hover:text-foreground transition-colors"
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="#"
                            className="hover:text-foreground transition-colors"
                        >
                            Terms of Service
                        </a>
                        <a
                            href="#"
                            className="hover:text-foreground transition-colors"
                        >
                            Cookie Policy
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
