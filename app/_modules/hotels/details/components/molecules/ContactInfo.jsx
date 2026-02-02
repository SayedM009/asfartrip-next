import { Mail, Phone, Globe, Printer } from "lucide-react";

export default function ContactInfo({ email, phone, fax, website }) {
    console.log(email, phone, fax, website);
    // لو مفيش أي بيانات اتصال، مش نعرض حاجة
    if (!email && !phone && !fax && !website) return null;

    const contactItems = [
        {
            icon: Phone,
            label: "Phone",
            value: phone,
            href: phone ? `tel:${phone}` : null,
        },
        {
            icon: Mail,
            label: "Email",
            value: email,
            href: email ? `mailto:${email.toLowerCase()}` : null,
        },
        {
            icon: Printer,
            label: "Fax",
            value: fax,
            href: null,
        },
        {
            icon: Globe,
            label: "Website",
            value: website,
            href: website?.startsWith("http") ? website : `https://${website}`,
            isExternal: true,
        },
    ].filter((item) => item.value);

    return (
        <section className="mb-6">
            <h2 className="text-xl font-bold mb-4">Contact Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {contactItems.map((item, index) => {
                    const Icon = item.icon;
                    const content = (
                        <div
                            key={index}
                            className="flex items-center gap-3 text-sm"
                        >
                            <Icon className="size-5 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">
                                    {item.label}
                                </p>
                                <p className="truncate">{item.value}</p>
                            </div>
                        </div>
                    );

                    if (item.href) {
                        return (
                            <a
                                key={index}
                                href={item.href}
                                target={item.isExternal ? "_blank" : undefined}
                                rel={
                                    item.isExternal
                                        ? "noopener noreferrer"
                                        : undefined
                                }
                                className="flex items-center gap-3 text-sm hover:text-blue-500 transition-colors"
                            >
                                <Icon className="size-5 text-muted-foreground flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                        {item.label}
                                    </p>
                                    <p className="truncate text-blue-500 hover:underline">
                                        {item.value}
                                    </p>
                                </div>
                            </a>
                        );
                    }

                    return content;
                })}
            </div>
        </section>
    );
}
