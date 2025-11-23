"use client";

import LayoverNotice from "../molecule/LayoverNotice";
import SegmentCard from "../molecule/SegmentCard";

export default function SegmentsList({ segments, title }) {
    return (
        <div className="space-y-4">
            <h5 className="font-medium text-primary">{title}</h5>

            {segments.map((segment, index) => (
                <div key={index}>
                    <SegmentCard segment={segment} />

                    {/* Add Layover if not last segment */}
                    {index < segments.length - 1 && (
                        <LayoverNotice
                            segment={segment}
                            nextSegment={segments[index + 1]}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
