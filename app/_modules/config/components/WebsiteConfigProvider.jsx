"use client";

import { WebsiteConfigContext } from "../context/WebsiteConfigContext";

export default function WebsiteConfigProvider({ children, config }) {
    return (
        <WebsiteConfigContext.Provider value={config}>
            {children}
        </WebsiteConfigContext.Provider>
    );
}
